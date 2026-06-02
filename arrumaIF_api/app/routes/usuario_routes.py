from flask import Blueprint, jsonify, request
from app import db
from app.models import Usuario

usuario_bp = Blueprint('usuario_bp', __name__, url_prefix='/api/usuarios')

TIPOS_VALIDOS = {'Aluno', 'Docente', 'TAE', 'TI'}


@usuario_bp.post('/')
def criar_usuario():
    payload = request.get_json(force=True, silent=True)
    if not payload:
        return jsonify({'erro': 'JSON inválido ou ausente.'}), 400

    prontuario = payload.get('prontuario')
    nome = payload.get('nome')
    email = payload.get('email')
    tipo = payload.get('tipo')

    if not prontuario or not nome or not email or not tipo:
        return jsonify({'erro': 'Os campos prontuario, nome, email e tipo são obrigatórios.'}), 400

    if tipo not in TIPOS_VALIDOS:
        return jsonify({'erro': f"Tipo inválido. Valores válidos: {sorted(TIPOS_VALIDOS)}."}), 400

    if Usuario.query.filter_by(prontuario=prontuario).first():
        return jsonify({'erro': 'Prontuário já cadastrado.'}), 400
    if Usuario.query.filter_by(email=email).first():
        return jsonify({'erro': 'Email já cadastrado.'}), 400

    try:
        usuario = Usuario(
            prontuario=prontuario,
            nome=nome,
            email=email,
            tipo=tipo,
        )
        db.session.add(usuario)
        db.session.commit()
        return jsonify(usuario.to_dict()), 201
    except Exception as exc:
        db.session.rollback()
        return jsonify({'erro': f'Falha ao criar usuário: {str(exc)}'}), 500


@usuario_bp.get('/')
def listar_usuarios():
    usuarios = Usuario.query.all()
    return jsonify([usuario.to_dict() for usuario in usuarios]), 200


@usuario_bp.get('/<uuid:id>')
def obter_usuario(id):
    usuario = Usuario.query.get(id)
    if not usuario:
        return jsonify({'erro': 'Usuário não encontrado.'}), 404
    return jsonify(usuario.to_dict()), 200


@usuario_bp.put('/<uuid:id>')
def atualizar_usuario(id):
    usuario = Usuario.query.get(id)
    if not usuario:
        return jsonify({'erro': 'Usuário não encontrado.'}), 404

    payload = request.get_json(force=True, silent=True)
    if not payload:
        return jsonify({'erro': 'JSON inválido ou ausente.'}), 400

    nome = payload.get('nome')
    email = payload.get('email')
    ativo = payload.get('ativo')

    if nome is None and email is None and ativo is None:
        return jsonify({'erro': 'Pelo menos um dos campos nome, email ou ativo deve ser fornecido.'}), 400

    if email:
        usuario_existente = Usuario.query.filter(Usuario.email == email, Usuario.id != id).first()
        if usuario_existente:
            return jsonify({'erro': 'Email já cadastrado por outro usuário.'}), 400

    try:
        if nome is not None:
            usuario.nome = nome
        if email is not None:
            usuario.email = email
        if ativo is not None:
            usuario.ativo = bool(ativo)

        db.session.commit()
        return jsonify(usuario.to_dict()), 200
    except Exception as exc:
        db.session.rollback()
        return jsonify({'erro': f'Falha ao atualizar usuário: {str(exc)}'}), 500


@usuario_bp.delete('/<uuid:id>')
def excluir_usuario(id):
    usuario = Usuario.query.get(id)
    if not usuario:
        return jsonify({'erro': 'Usuário não encontrado.'}), 404

    try:
        usuario.ativo = False
        db.session.commit()
        return jsonify({'mensagem': 'Usuário desativado com sucesso.'}), 200
    except Exception as exc:
        db.session.rollback()
        return jsonify({'erro': f'Falha ao desativar usuário: {str(exc)}'}), 500
