from sqlalchemy import Column, String, Integer, DateTime, func
import bcrypt

from ..models.meta import Base


class User(Base):
    """
    A model for storing user account information.
    """
    __tablename__ = "user"

    id = Column(Integer, primary_key=True, nullable=False, autoincrement=True, unique=True)
    created = Column(DateTime(), server_default=func.now())
    last_modified = Column(DateTime(), onupdate=func.now(), server_default=func.now())

    email = Column(String(length=256), nullable=False, default="")
    first_name = Column(String(length=32), nullable=False, default="")
    last_name = Column(String(length=32), nullable=False, default="")
    password_hash = Column(String(length=100), nullable=False)

    def set_password(self, password):
        """
        Set the password after encrypting and salting it.
        :param password:
        :return:
        """
        self.password_hash = "bcrypt|%s" % bcrypt.hashpw(password.encode("UTF8"), bcrypt.gensalt()).decode("UTF8")

    def is_password(self, password):
        """
        Tests to see if the password is correct.
        :param password:
        :return:
        """
        password_hash = self.password_hash.split("|")[1].encode("UTF8")
        return bcrypt.checkpw(password, password_hash)

    @property
    def name(self):
        """
        Returns the users full name.
        :return:
        """
        name = []
        if self.first_name:
            name.append(self.first_name)
        if self.last_name:
            name.append(self.last_name)
        return " ".join(name)
