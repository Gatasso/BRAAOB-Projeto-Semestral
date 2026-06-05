from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate
from config import Config

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)

db = SQLAlchemy(app)
migrate = Migrate(app, db)

from app.routes import all_blueprints
for blueprint in all_blueprints:
    app.register_blueprint(blueprint)

@app.route('/api/health', methods=['GET'])
def health_check():
    return {"status": "online", "projeto": "arrumaIF_api"}, 200

if __name__ == '__main__':
    app.run(debug=True)