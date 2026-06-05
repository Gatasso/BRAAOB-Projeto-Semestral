from flask import Blueprint, request, jsonify
from app.models import Usuario
from main import db

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    prontuario = data.get('prontuario')
    
    if not prontuario:
        return jsonify({"erro": "Prontuário é obrigatório"}), 400
        
    usuario = Usuario.query.filter_by(prontuario=prontuario).first()
    
    if not usuario:
        return jsonify({"erro": "Usuário não encontrado institucionalmente"}), 404
        
    if not usuario.ativo:
        return jsonify({"erro": "RGN01: Apenas alunos e servidores ativos podem acessar o sistema"}), 403
        
    return jsonify({
        "mensagem": "Autenticado com sucesso",
        "usuario": {
            "id": str(usuario.id),
            "prontuario": usuario.prontuario,
            "nome": usuario.nome,
            "tipo": usuario.tipo
        }
    }), 200