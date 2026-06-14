from .equipamento_routes import equipamento_bp
from .local_routes import local_bp
from .solicitacao_routes import solicitacao_bp
from .usuario_routes import usuario_bp
from .defeitos_routes import defeitos_bp
from .solucoes_routes import solucoes_bp
from .mobiliario_routes import mobiliario_bp
from .componentes_routes import componente_bp
from .auth_routes import auth_bp
from .combobox_routes import combobox_bp

all_blueprints = [
    usuario_bp,
    equipamento_bp,
    local_bp,
    defeitos_bp,
    solucoes_bp,
    mobiliario_bp,
    solicitacao_bp,
    componente_bp,
    auth_bp,
    combobox_bp
]

__all__ = [
    'equipamento_bp',
    'local_bp',
    'solicitacao_bp',
    'usuario_bp',
    'defeitos_bp',
    'solucoes_bp',
    'mobiliario_bp',
    'componente_bp',
    'auth_bp',
    'combobox_bp'
]
