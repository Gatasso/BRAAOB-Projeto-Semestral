from flask import Blueprint, jsonify, request
from app.models import Local, Defeitos, Solucoes

combobox_bp = Blueprint('combobox_bp', __name__, url_prefix='/api/suporte')

VALID_CATEGORIES = ['Equipamento', 'Mobília']

@combobox_bp.get('/locais')
def listar_locais():
    locais = Local.query.all()
    return jsonify([{"cod_sala": local.cod_sala, "descricao": local.descricao, "tipo": local.tipo_local} for local in locais]), 200

@combobox_bp.get('/defeitos')
def listar_defeitos_catalogo():
    categoria = request.args.get('categoria')
    
    query = Defeitos.query
    
    if categoria:
        if categoria not in VALID_CATEGORIES:
            return jsonify({"error": f"Categoria inválida. Escolha entre: {', '.join(VALID_CATEGORIES)}"}), 400
        query = query.filter_by(categoria=categoria)
        
    lista = query.all()
    return jsonify([{"id_defeito": d.id_defeito, "titulo": d.titulo, "descricao": d.descricao, "categoria": d.categoria} for d in lista]), 200

@combobox_bp.get('/solucoes')
def listar_solucoes_catalogo():
    categoria = request.args.get('categoria')
    
    query = Solucoes.query
    
    if categoria:
        if categoria not in VALID_CATEGORIES:
            return jsonify({"error": f"Categoria inválida. Escolha entre: {', '.join(VALID_CATEGORIES)}"}), 400
        query = query.filter_by(categoria=categoria)
        
    lista = query.all()
    return jsonify([{"id_solucao": s.id_solucao, "titulo": s.titulo, "descricao": s.descricao, "categoria": s.categoria} for s in lista]), 200