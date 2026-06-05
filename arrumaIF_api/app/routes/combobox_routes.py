from flask import Blueprint, jsonify
from app.models import Local, Defeitos, Solucoes

combobox_bp = Blueprint('combobox_bp', __name__, url_prefix='/api/suporte')

@combobox_bp.get('/locais')
def listar_locais():
    locais = Local.query.all()
    return jsonify([{"cod_sala": local.cod_sala, "descricao": local.descricao, "tipo": local.tipo_local} for local in locais]), 200

@combobox_bp.get('/defeitos')
def listar_defeitos_catalogo():
    lista = Defeitos.query.all()
    return jsonify([{"id_defeito": d.id_defeito, "titulo": d.titulo, "descricao": d.descricao} for d in lista]), 200

@combobox_bp.get('/solucoes')
def listar_solucoes_catalogo():
    lista = Solucoes.query.all()
    return jsonify([{"id_solucao": s.id_solucao, "titulo": s.titulo, "descricao": s.descricao} for s in lista]), 200