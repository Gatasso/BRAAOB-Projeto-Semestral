from flask import Blueprint, request, jsonify
from app.models import Usuario
from main import db
import bcrypt

auth_bp = Blueprint('auth_bp', __name__, url_prefix='/api/login')

@auth_bp.post('/')
def login():
    data = request.get_json() or {}
    prontuario = data.get('prontuario')
    senha = data.get('senha')
    
    if not prontuario:
        return jsonify({"erro": "Prontuário é obrigatório"}), 400
        
    usuario = Usuario.query.filter_by(prontuario=prontuario).first()
    
    if not usuario:
        return jsonify({"erro": "Usuário não encontrado institucionalmente"}), 404
        
    if not usuario.ativo:
        return jsonify({"erro": "Apenas alunos e servidores ativos podem acessar o sistema"}), 403

    senha_bytes = senha.encode('utf-8')
    hash_banco_bytes = usuario.senha.encode('utf-8')

    if not bcrypt.checkpw(senha_bytes, hash_banco_bytes):
        return jsonify({"erro": "Credenciais inválidas"}), 401
        
    return jsonify({
        "mensagem": "Autenticado com sucesso",
        "usuario": {
            "id": str(usuario.id),
            "prontuario": usuario.prontuario,
            "nome": usuario.nome,
            "tipo": usuario.tipo
        }
    }), 200

@auth_bp.post('/reset-password')
def reset_password():
    data = request.get_json() or {}
    email = data.get('email')

    if not email:
        return jsonify({"erro": "E-mail não informado"}), 400

    usuario = Usuario.query.filter_by(email=email).first()
    if not usuario:
        return jsonify({"mensagem": "Se o e-mail for válido, as instruções de redefinição foram processadas."}), 200

    try:
        senha_padrao = "senha123"
        
        senha_encryp = senha_padrao.encode('utf-8')
        hash_senha_padrao = bcrypt.hashpw(senha_encryp, bcrypt.gensalt()).decode('utf-8')

        # Atualiza o registro no banco de dados
        usuario.senha = hash_senha_padrao
        db.session.commit()

        # Retorna a mensagem customizada orientando o usuário a falar com a TI/Administradores
        return jsonify({
            "mensagem": "Sua senha foi resetada com sucesso para o padrão provisório do sistema. Por motivos de segurança, entre em contato com os administradores da TI para obter o acesso ou realizar a troca definitiva."
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"erro": "Erro interno ao tentar resetar a senha", "detalhes": str(e)}), 500