from flask import Flask
from crypto.models import DBManager

app = Flask(__name__)
app.config.from_object('config')

db = DBManager()
db.confirm_db()
