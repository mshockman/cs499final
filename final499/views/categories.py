from pyramid.view import view_config
from ..models import Category


@view_config(route_name="category_view", renderer="../templates/browse_category.jinja2")
def browse_categories_view(request):
    request.dbsession.query(Category).delete()

    test = Category.create_root_category(request.dbsession, 'test')
    test2 = Category.create_root_category(request.dbsession, 'test root 2')

    child = Category()
    child.name = 'child 1'

    child = test.append_child_category(request.dbsession, child)

    child2 = Category()
    child2.name = 'child 2'
    child.append_child_category(request.dbsession, child2)

    request.dbsession.refresh(test2)
    test2.append_child_category(request.dbsession, child2)

    return {
        'categories': Category.get_full_category_tree(request.dbsession)
    }
