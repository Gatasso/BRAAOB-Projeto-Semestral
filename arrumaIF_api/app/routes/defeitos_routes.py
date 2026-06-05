from flask import Blueprint, request, jsonify
from main import db
from app.models import Defeitos

defeitos_bp = Blueprint('defeitos_bp', __name__, url_prefix='/api/defeitos')

@defeitos_bp.post('/')
def criar_defeito():
    data = request.get_json() or {}
    try:
        novo_defeito = Defeitos(
            titulo=data.get('titulo'),
            descricao=data.get('descricao')
        )
        db.session.add(novo_defeito)
        db.session.commit()
        return jsonify({"mensagem": "Defeito catalogado com sucesso!", "defeito": novo_defeito.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"erro": "Erro ao catalogar defeito", "detalhes": str(e)}), 400

@defeitos_bp.get('/')
def listar_defeitos():
    lista = Defeitos.query.all()
    return jsonify([d.to_dict() for d in lista]), 200

@defeitos_bp.get('/<int:id>')
def obter_defeito(id):
    defeito = Defeitos.query.get_or_404(id)
    return jsonify(defeito.to_dict()), 200

@defeitos_bp.put('/<int:id>')
def atualizar_defeito(id):
    defeito = Defeitos.query.get_or_404(id)
    data = request.get_json() or {}
    try:
        defeito.titulo = data.get('titulo', defeito.titulo)
        defeito.descricao = data.get('descricao', defeito.descricao)
        db.session.commit()
        return jsonify({"mensagem": "Defeito atualizado no catálogo!", "defeito": defeito.to_dict()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"erro": "Erro ao atualizar defeito", "detalhes": str(e)}), 400

@defeitos_bp.delete('/<int:id>')
def deletar_defeito(id):
    defeito = Defeitos.query.get_or_404(id)
    try:
        db.session.delete(defeito)
        db.session.commit()
        return jsonify({"mensagem": "Defeito removido do catálogo com sucesso!"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"erro": "Item não pode ser removido pois está vinculado a uma solicitação histórica.", "detalhes": str(e)}), 400