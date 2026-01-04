from flask import Blueprint, request, jsonify

health_bp = Blueprint('health', __name__)


@health_bp.route('/', methods=['GET'])
def health_check():
    # Simple health endpoint to help debug network/CORS issues from the frontend
    origin = request.headers.get('Origin')
    print(f"[health_check] origin={origin} remote_addr={request.remote_addr}")
    return jsonify({'status': 'ok', 'origin': origin}), 200
