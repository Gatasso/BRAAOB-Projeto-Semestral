from flask import Blueprint, jsonify, request
from app import db
from app.models import Local

local_bp = Blueprint('local_bp', __name__, url_prefix='/api/locais')

TIPOS_VALIDOS = {'Sala', 'Laboratorio'}


@local_bp.post('/')
def criar_local():
    payload = request.get_json(force=True, silent=True)
    if not payload:
        return jsonify({'erro': 'JSON inválido ou ausente.'}), 400

    cod_sala = payload.get('cod_sala')
    descricao = payload.get('descricao')
    tipo_local = payload.get('tipo_local')

    if not cod_sala or not descricao or not tipo_local:
        return jsonify({'erro': 'Os campos cod_sala, descricao e tipo_local são obrigatórios.'}), 400

    if tipo_local not in TIPOS_VALIDOS:
        return jsonify({'erro': f"tipo_local inválido. Valores válidos: {sorted(TIPOS_VALIDOS)}."}), 400

    if Local.query.get(cod_sala):
        return jsonify({'erro': 'Local já cadastrado com este cod_sala.'}), 400

    try:
        local = Local(cod_sala=cod_sala, descricao=descricao, tipo_local=tipo_local)
        db.session.add(local)
        db.session.commit()
        return jsonify(local.to_dict()), 201
    except Exception as exc:
        db.session.rollback()
        return jsonify({'erro': f'Falha ao criar local: {str(exc)}'}), 500


@local_bp.get('/')
def listar_locais():
    tipo_local = request.args.get('tipo_local')
    query = Local.query
    if tipo_local:
        query = query.filter_by(tipo_local=tipo_local)
    locais = query.all()
    return jsonify([local.to_dict() for local in locais]), 200


@local_bp.get('/<string:cod_sala>')
def obter_local(cod_sala):
    local = Local.query.get(cod_sala)
    if not local:
        return jsonify({'erro': 'Local não encontrado.'}), 404
    return jsonify(local.to_dict()), 200


@local_bp.put('/<string:cod_sala>')
def atualizar_local(cod_sala):
    local = Local.query.get(cod_sala)
    if not local:
        return jsonify({'erro': 'Local não encontrado.'}), 404

    payload = request.get_json(force=True, silent=True)
    if not payload:
        return jsonify({'erro': 'JSON inválido ou ausente.'}), 400

    descricao = payload.get('descricao')
    tipo_local = payload.get('tipo_local')

    if descricao is None and tipo_local is None:
        return jsonify({'erro': 'Pelo menos um dos campos descricao ou tipo_local deve ser fornecido.'}), 400

    if tipo_local is not None and tipo_local not in TIPOS_VALIDOS:
        return jsonify({'erro': f"tipo_local inválido. Valores válidos: {sorted(TIPOS_VALIDOS)}."}), 400

    try:
        if descricao is not None:
            local.descricao = descricao
        if tipo_local is not None:
            local.tipo_local = tipo_local
        db.session.commit()
        return jsonify(local.to_dict()), 200
    except Exception as exc:
        db.session.rollback()
        return jsonify({'erro': f'Falha ao atualizar local: {str(exc)}'}), 500


@local_bp.delete('/<string:cod_sala>')
def excluir_local(cod_sala):
    local = Local.query.get(cod_sala)
    if not local:
        return jsonify({'erro': 'Local não encontrado.'}), 404

    try:
        db.session.delete(local)
        db.session.commit()
        return jsonify({'mensagem': 'Local removido com sucesso.'}), 200
    except Exception as exc:
        db.session.rollback()
        return jsonify({'erro': f'Falha ao remover local: {str(exc)}'}), 500
