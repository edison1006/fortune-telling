from datetime import datetime

from sqlalchemy import Column, DateTime, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship

from .db import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=True)
    name = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    readings = relationship("Reading", back_populates="user")


class Reading(Base):
    __tablename__ = "readings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    type = Column(String(64), index=True)  # e.g. 'tarot', 'bazi', 'iching', 'palmistry'
    input_data = Column(Text)  # JSON string of input details
    result = Column(Text)  # JSON or text of the reading result
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="readings")





