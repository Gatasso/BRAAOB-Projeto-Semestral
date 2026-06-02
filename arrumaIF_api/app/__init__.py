from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from config import Config

db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app, db)

    # O Flask precisa importar os modelos para que o SQLAlchemy mapeie as tabelas
    from app import models

    # Registra Blueprints por domínio
    from app.routes import usuario_bp, local_bp, equipamento_bp, solicitacao_bp

    app.register_blueprint(usuario_bp)
    app.register_blueprint(local_bp)
    app.register_blueprint(equipamento_bp)
    app.register_blueprint(solicitacao_bp)

    return app