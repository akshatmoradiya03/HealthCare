from app.extensions import ma
from app.models import GroupActivity, ActivityInvite
from app.schemas.user_schema import UserSchema

class GroupActivitySchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = GroupActivity
        load_instance = True
    
    creator = ma.Nested(UserSchema, only=('id', 'name', 'email'))

class ActivityInviteSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = ActivityInvite
        load_instance = True
        
    activity = ma.Nested(GroupActivitySchema)
    client = ma.Nested(UserSchema, only=('id', 'name', 'email'))

activity_schema = GroupActivitySchema()
activities_schema = GroupActivitySchema(many=True)
invite_schema = ActivityInviteSchema()
invites_schema = ActivityInviteSchema(many=True)
