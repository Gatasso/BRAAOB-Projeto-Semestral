from flask import Blueprint, jsonify
from models import Local, Defeitos, Solucoes

suporte_bp = Blueprint('suporte', __name__, url_prefix='/api/suporte')

@suporte_bp.route('/locais', methods=['GET'])
def listar_locais():
    locais = Local.query.all()
    return jsonify([{"cod_sala": l.cod_sala, "descricao": l.descricao, "tipo": l.tipo_local} for l in locais]), 200

@suporte_bp.route('/defeitos', methods=['GET'])
def listar_defeitos_catalogo():
    lista = Defeitos.query.all()
    return jsonify([{"id_defeito": d.id_defeito, "titulo": d.titulo, "descricao": d.descricao} for d in lista]), 200

@suporte_bp.route('/solucoes', methods=['GET'])
def listar_solucoes_catalogo():
    lista = Solucoes.query.all()
    return jsonify([{"id_solucao": s.id_solucao, "titulo": s.titulo, "descricao": s.descricao} for s in lista]), 200