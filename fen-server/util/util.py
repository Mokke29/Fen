import string
import random
from pathlib import Path

def id_generator(size=6, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))

def file_exists(file):
    if Path(file).is_file():
        return True
    else:
        return False