from user import users
from werkzeug.security import safe_str_cmp
from user import get_user_by_id

def identity(payload):
    user_id = payload['identity']
    return get_user_by_id(user_id)


