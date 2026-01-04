from app.extensions import ma
from app.models import Connection
from app.schemas.user_schema import UserSchema

class ConnectionSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Connection
        load_instance = True
    # Explicitly include initiated_by so the frontend can tell who
    # created the connection request (used for incoming/outgoing logic).
    initiated_by = ma.Integer()

    professional = ma.Nested(UserSchema, only=('id', 'name', 'email'))
    client = ma.Nested(UserSchema, only=('id', 'name', 'email'))

connection_schema = ConnectionSchema()
connections_schema = ConnectionSchema(many=True)
