from flask import Blueprint, request, jsonify
from app.models import User
from app.schemas.user_schema import users_schema

# Accept both '/api/users' and '/api/users/' without Flask issuing a redirect
# which can trigger CORS/preflight failures in the browser.
user_bp = Blueprint('users', __name__)


@user_bp.route('', methods=['GET'])
@user_bp.route('/', methods=['GET'])
def list_users():
    role = request.args.get('role')
    # Debug: log origin to help diagnose CORS/network issues during local dev
    origin = request.headers.get('Origin')
    print(f"[users.list_users] origin={origin} remote_addr={request.remote_addr} role={role}")
    query = User.query
    if role:
        query = query.filter_by(role=role)
    users = query.all()
    return jsonify(users_schema.dump(users)), 200
