from flask import Blueprint, request, jsonify
from main import db
from app.models import Mobiliario

mobiliario_bp = Blueprint('mobiliario_bp', __name__, url_prefix='/api/mobiliarios')

@mobiliario_bp.post('/')
def criar_mobiliario():
    data = request.get_json() or {}
    try:
        novo_mobiliario = Mobiliario(
            nome=data.get('nome'),
            descricao=data.get('descricao')
        )
        db.session.add(novo_mobiliario)
        db.session.commit()
        return jsonify({
            "mensagem": "Mobiliário cadastrado com sucesso no catálogo!", 
            "mobiliario": novo_mobiliario.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"erro": "Erro ao cadastrar mobiliário", "detalhes": str(e)}), 400

@mobiliario_bp.get('/')
def listar_mobiliarios():
    itens = Mobiliario.query.all()
    return jsonify([m.to_dict() for m in itens]), 200

@mobiliario_bp.get('/<int:id>')
def obter_mobiliario(id):
    item = Mobiliario.query.get_or_404(id)
    return jsonify(item.to_dict()), 200

@mobiliario_bp.put('/<int:id>')
def atualizar_mobiliario(id):
    item = Mobiliario.query.get_or_404(id)
    data = request.get_json() or {}
    try:
        item.nome = data.get('nome', item.nome)
        item.descricao = data.get('descricao', item.descricao)
        db.session.commit()
        return jsonify({
            "mensagem": "Mobiliário atualizado com sucesso!", 
            "mobiliario": item.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"erro": "Erro ao atualizar mobiliário", "detalhes": str(e)}), 400

@mobiliario_bp.delete('/<int:id>')
def deletar_mobiliario(id):
    item = Mobiliario.query.get_or_404(id)
    try:
        db.session.delete(item)
        db.session.commit()
        return jsonify({"mensagem": "Mobiliário removido com sucesso do catálogo!"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "erro": "Não é possível remover este mobiliário pois ele possui chamados históricos vinculados.", 
            "detalhes": str(e)
        }), 400