from sqlalchemy import Column, String, Integer, DateTime, func, ForeignKey
from sqlalchemy.orm import relationship
import sqlalchemy
from .meta import Base


class Category(Base):
    """
    A nested set model table that stores category information.

    See
    https://en.wikipedia.org/wiki/Nested_set_model
    """
    __tablename__ = "category"

    id = Column(Integer(), primary_key=True, nullable=False, autoincrement=True, unique=True)
    created = Column(DateTime(), server_default=func.now())
    last_modified = Column(DateTime(), onupdate=func.now(), server_default=func.now())

    name = Column(String(100), nullable=False)
    parent_category_id = Column(Integer(), ForeignKey("category.id"), nullable=True)

    left = Column(Integer(), nullable=False)
    right = Column(Integer(), nullable=False)

    stocks = relationship('CategoryStock')

    def append_child_category(self, dbsession, child):
        """
        Appends a child category to the current category.
        :param dbsession:
        :param child:
        :return:
        """
        if not child.id:
            right = self.right

            Category.allocate_space(dbsession, self, 1)

            child.left = right
            child.right = child.left + 1
            child.parent_category_id = self.id
            dbsession.add(child)
            dbsession.flush()

            return child
        else:
            # Moving node
            right = self.right
            child.parent_category_id = self.id
            dbsession.flush()

            # Allocate space
            Category.allocate_space(dbsession, self, child.node_count)

            # Left and right may have changed, fetch new instance.
            dbsession.expire(child)

            # Move nodes
            start = child.left
            child.move_to(dbsession, right)

            # Deallocate old space
            Category.deallocate_space(dbsession, start, child.node_count)

            dbsession.expire(child)

    def remove(self, dbsession):
        """
        Delete the current category.
        :param dbsession:
        :return:
        """
        size = self.node_count
        start = self.left
        end = self.right

        query = sqlalchemy.delete(Category).where(
            sqlalchemy.and_(
                Category.left >= start,
                Category.right <= end
            )
        )

        count = dbsession.execute(query)
        dbsession.flush()
        Category.deallocate_space(dbsession, start, size)
        dbsession.expire_all()
        return count

    def move_to(self, dbsession, position):
        """
        Moves the current category the given position.
        :param dbsession:
        :param position:
        :return:
        """
        delta = self.left - position

        query = sqlalchemy.update(Category).values(
            {
                Category.left: Category.left - delta,
                Category.right: Category.right - delta
            }
        ).where(
            sqlalchemy.and_(
                Category.left >= self.left,
                Category.right <= self.right
            )
        )

        dbsession.execute(query)

    @classmethod
    def get_last_category(cls, dbsession):
        """
        Get the category to the furthest right.
        :param dbsession:
        :return:
        """
        return dbsession.query(Category).order_by(Category.right.desc()).first()

    @classmethod
    def create_root_category(cls, dbsession, name):
        """
        Creates a new root category node.

        :param dbsession:
        :param name:
        :return:
        """
        category = Category()
        category.name = name

        last_category = cls.get_last_category(dbsession)

        if last_category is None:
            category.left = 1
            category.right = 2
        else:
            category.left = last_category.right + 1
            category.right = last_category.right + 2

        dbsession.add(category)
        dbsession.flush()
        return category

    @classmethod
    def allocate_space(cls, dbsession, node, count):
        """
        Allocates space for a category of size count inside the given node.
        :param dbsession:
        :param node:
        :param count: The total number of nodes in the branch
        :return:
        """
        size = count*2

        shift_right_query = sqlalchemy.update(Category).values(
            {
                Category.right: Category.right + size,
            }
        ).where(
            Category.right > node.left
        )

        shift_left_query = sqlalchemy.update(Category).values(
            {
                Category.left: Category.left + size,
            }
        ).where(
            Category.left > node.left
        )

        dbsession.execute(shift_left_query)
        dbsession.execute(shift_right_query)
        dbsession.expire_all()

    @classmethod
    def deallocate_space(cls, dbsession, index, nodes):
        """
        Deallocates space at the given index.  Nodes is the total size of the branch that is being deallocated.
        :param dbsession:
        :param index:
        :param nodes:
        :return:
        """
        size = 2*nodes

        shift_left_query = sqlalchemy.update(Category).values({
            Category.left: Category.left - size
        }).where(
            Category.left >= index
        )

        shift_right_query = sqlalchemy.update(Category).values({
            Category.right: Category.right - size
        }).where(
            Category.right >= index
        )

        dbsession.execute(shift_left_query)
        dbsession.execute(shift_right_query)

        dbsession.expire_all()

    @classmethod
    def get_full_category_tree(cls, dbsession):
        """
        Returns a list of root category nodes annotated with a children property that contains a list of all children.

        :param dbsession:
        :return:
        """
        categories = {}

        # Get all categories and map them by id.
        for category in dbsession.query(Category).all():
            category.children = []
            categories[category.id] = category

        # Append child categories to parent categories.
        for category in categories.values():
            if category.parent_category_id:
                categories[category.parent_category_id].children.append(category)

        # Return a list of only root categories
        return [
            category for category in categories.values() if category.parent_category_id is None
        ]

    @property
    def child_count(self):
        """
        Returns the total number of children for the node.
        :return:
        """
        if self.id:
            return (self.right - self.left - 1) / 2
        else:
            return 0

    @property
    def node_count(self):
        """
        Returns the total number of nodes in the branch.  AKA children + 1 for root node.
        :return:
        """
        return self.child_count + 1

    @property
    def size(self):
        """
        Returns the amount of space that nodes need to be shifted to insert the given node.
        :return:
        """
        return (self.child_count*2) + 2

    def as_dict(self):
        """
        Returns the category as a json serializable dict.
        :return:
        """
        r = {
            'id': self.id,
            'name': self.name,
            'stocks': []
        }

        for stock in self.stocks:
            r['stocks'].append({
                'id': stock.id,
                'stock_id': stock.stock_id,
                'category_id': stock.category_id,
                'ticker': stock.stock.ticker
            })

        return r
