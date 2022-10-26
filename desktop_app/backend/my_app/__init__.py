from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import os
template_dir = os.path.dirname(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))
static_dir = os.path.join(template_dir, '../downloads')
template_dir = os.path.join(template_dir, 'backend')
template_dir = os.path.join(template_dir, 'templates')
print(static_dir)
app = Flask(__name__, template_folder=template_dir,static_url_path='/static', static_folder=static_dir)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///../storage/session.db'
db = SQLAlchemy(app)

from my_app.catalog.views import catalog
app.register_blueprint(catalog)
with app.app_context():
    db.create_all()

