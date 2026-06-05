from flask import Blueprint, request, jsonify
from main import db
from app.models import Componente

componente_bp = Blueprint('componente_route', __name__, url_prefix='/api/componentes')

@componente_bp.route('', methods=['POST'])
def criar_componente():
    data = request.get_json() or {}
    try:
        novo_componente = Componente(
            nome=data.get('nome'),
            descricao=data.get('descricao')
        )
        db.session.add(novo_componente)
        db.session.commit()
        return jsonify({
            "mensagem": "Componente/Acessório cadastrado com sucesso!", 
            "componente": novo_componente.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"erro": "Erro ao cadastrar componente", "detalhes": str(e)}), 400

@componente_bp.route('', methods=['GET'])
def listar_componentes():
    itens = Componente.query.all()
    return jsonify([c.to_dict() for c in itens]), 200

@componente_bp.route('/<int:id>', methods=['GET'])
def obter_componente(id):
    item = Componente.query.get_or_404(id)
    return jsonify(item.to_dict()), 200

@componente_bp.route('/<int:id>', methods=['PUT'])
def atualizar_componente(id):
    item = Componente.query.get_or_404(id)
    data = request.get_json() or {}
    try:
        item.nome = data.get('nome', item.nome)
        item.descricao = data.get('descricao', item.descricao)
        db.session.commit()
        return jsonify({
            "mensagem": "Componente atualizado com sucesso!", 
            "componente": item.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"erro": "Erro ao atualizar componente", "detalhes": str(e)}), 400

@componente_bp.route('/<int:id>', methods=['DELETE'])
def deletar_componente(id):
    item = Componente.query.get_or_404(id)
    try:
        db.session.delete(item)
        db.session.commit()
        return jsonify({"mensagem": "Componente removido com sucesso!"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "erro": "Remoção impedida. Este componente está associado a solicitações abertas ou encerradas.", 
            "detalhes": str(e)
        }), 400