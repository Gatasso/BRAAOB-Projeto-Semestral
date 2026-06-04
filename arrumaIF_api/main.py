from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from config import Config
from app import models
from app.routes import usuario_bp, local_bp, equipamento_bp, solicitacao_bp

app = Flask(__name__)
app.config.from_object(Config)

db = SQLAlchemy(app)
migrate = Migrate(app, db)

app.register_blueprint(usuario_bp)
app.register_blueprint(local_bp)
app.register_blueprint(equipamento_bp)
app.register_blueprint(solicitacao_bp)

if __name__ == '__main__':
    app.run(debug=True)