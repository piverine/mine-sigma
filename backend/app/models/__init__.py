from .base import Base, TimestampMixin
from .user import User, UserRole
from .alert import Alert, AlertStatus, AlertSeverity
from .complaint import Complaint, ComplaintStatus

# Import all models to ensure they are registered with SQLAlchemy
# This is necessary for Alembic to detect the models
__all__ = [
    'Base',
    'TimestampMixin',
    'User',
    'UserRole',
    'Alert',
    'AlertStatus',
    'AlertSeverity',
    'Complaint',
    'ComplaintStatus',
]
