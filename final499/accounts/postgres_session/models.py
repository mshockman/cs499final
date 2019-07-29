from ...models.meta import Base

from sqlalchemy import Column, String, Integer, DateTime, Text, func


class Session(Base):
    """
    Used to store session information in the database.
    """
    __tablename__ = "session"

    id = Column(Integer, primary_key=True, nullable=False, autoincrement=True, unique=True)
    session_id = Column(String(length=64), unique=True)
    data = Column(Text())

    created = Column(DateTime(timezone=True), server_default=func.now())
    last_accessed = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())
    expires = Column(DateTime(timezone=True))
