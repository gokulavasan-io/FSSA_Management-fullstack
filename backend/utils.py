# crypto_utils.py
from cryptography.fernet import Fernet
import os
from dotenv import load_dotenv
load_dotenv()

# Replace this with your actual Fernet key (either from environment or generated securely)
FERNET_KEY = os.getenv('FERNET_KEY', 'fallback_fernet_key')  # Can also be loaded from a secret store


fernet = Fernet(FERNET_KEY)

def encrypt_value(value):
    """Encrypts a value using Fernet encryption."""
    if value is None:
        return None
    return fernet.encrypt(value.encode()).decode()

def decrypt_value(encrypted_value):
    """Decrypts a Fernet-encrypted value."""
    if encrypted_value is None:
        return None
    return fernet.decrypt(encrypted_value.encode()).decode()


