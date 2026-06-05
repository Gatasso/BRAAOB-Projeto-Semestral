from flask import Blueprint, request, jsonify
from main import db
from app.models import Solucoes

solucoes_bp = Blueprint('solucoes_bp', __name__, url_prefix='/api/solucoes')

@solucoes_bp.post('/')
def criar_solucao():
    data = request.get_json() or {}
    try:
        nova_solucao = Solucoes(
            titulo=data.get('titulo'),
            descricao=data.get('descricao')
        )
        db.session.add(nova_solucao)
        db.session.commit()
        return jsonify({"mensagem": "Solução cadastrada com sucesso no catálogo!", "solucao": nova_solucao.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"erro": "Erro ao cadastrar solução", "detalhes": str(e)}), 400

@solucoes_bp.get('/')
def listar_solucoes():
    lista = Solucoes.query.all()
    return jsonify([s.to_dict() for s in lista]), 200

@solucoes_bp.get('/<int:id>')
def obter_solucao(id):
    solucao = Solucoes.query.get_or_404(id)
    return jsonify(solucao.to_dict()), 200

@solucoes_bp.put('/<int:id>')
def atualizar_solucao(id):
    solucao = Solucoes.query.get_or_404(id)
    data = request.get_json() or {}
    try:
        solucao.titulo = data.get('titulo', solucao.titulo)
        solucao.descricao = data.get('descricao', solucao.descricao)
        db.session.commit()
        return jsonify({"mensagem": "Solução atualizada com sucesso!", "solucao": solucao.to_dict()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"erro": "Erro ao atualizar solução", "detalhes": str(e)}), 400

@solucoes_bp.delete('/<int:id>')
def deletar_solucao(id):
    solucao = Solucoes.query.get_or_404(id)
    try:
        db.session.delete(solucao)
        db.session.commit()
        return jsonify({"mensagem": "Solução removida com sucesso do catálogo!"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"erro": "Não é possível apagar uma solução aplicada a chamados concluídos.", "detalhes": str(e)}), 400