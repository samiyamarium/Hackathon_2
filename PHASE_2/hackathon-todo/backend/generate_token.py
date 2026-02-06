
import os
from jose import jwt
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.environ.get("BETTER_AUTH_SECRET")
ALGORITHM = "HS256"

def create_jwt_token(user_id: str):
    to_encode = {"sub": user_id}
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

if __name__ == "__main__":
    user_id = "test_user_id"
    token = create_jwt_token(user_id)
    print(f"Generated JWT for user '{user_id}': {token}")
