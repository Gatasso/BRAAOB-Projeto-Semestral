from flask import Blueprint, jsonify, request
from app import db
from app.models import Equipamento, Local

equipamento_bp = Blueprint('equipamento_bp', __name__, url_prefix='/api/equipamentos')


@equipamento_bp.post('/')
def criar_equipamento():
    payload = request.get_json(force=True, silent=True)
    if not payload:
        return jsonify({'erro': 'JSON inválido ou ausente.'}), 400

    cod_patrimonio = payload.get('cod_patrimonio')
    nome = payload.get('nome')
    descricao = payload.get('descricao')
    cod_sala = payload.get('cod_sala')

    if not cod_patrimonio or not nome:
        return jsonify({'erro': 'Os campos cod_patrimonio e nome são obrigatórios.'}), 400

    if Equipamento.query.get(cod_patrimonio):
        return jsonify({'erro': 'Equipamento já cadastrado com este cod_patrimonio.'}), 400

    if cod_sala:
        if not Local.query.get(cod_sala):
            return jsonify({'erro': 'cod_sala informado não existe.'}), 400

    try:
        equipamento = Equipamento(
            cod_patrimonio=cod_patrimonio,
            nome=nome,
            descricao=descricao,
            cod_sala=cod_sala,
        )
        db.session.add(equipamento)
        db.session.commit()
        return jsonify(equipamento.to_dict()), 201
    except Exception as exc:
        db.session.rollback()
        return jsonify({'erro': f'Falha ao criar equipamento: {str(exc)}'}), 500


@equipamento_bp.get('/')
def listar_equipamentos():
    cod_sala = request.args.get('cod_sala')
    query = Equipamento.query
    if cod_sala:
        query = query.filter_by(cod_sala=cod_sala)
    equipamentos = query.all()
    return jsonify([equipamento.to_dict() for equipamento in equipamentos]), 200


@equipamento_bp.get('/<string:cod_patrimonio>')
def obter_equipamento(cod_patrimonio):
    equipamento = Equipamento.query.get(cod_patrimonio)
    if not equipamento:
        return jsonify({'erro': 'Equipamento não encontrado.'}), 404
    return jsonify(equipamento.to_dict()), 200


@equipamento_bp.put('/<string:cod_patrimonio>')
def atualizar_equipamento(cod_patrimonio):
    equipamento = Equipamento.query.get(cod_patrimonio)
    if not equipamento:
        return jsonify({'erro': 'Equipamento não encontrado.'}), 404

    payload = request.get_json(force=True, silent=True)
    if not payload:
        return jsonify({'erro': 'JSON inválido ou ausente.'}), 400

    nome = payload.get('nome')
    descricao = payload.get('descricao')
    cod_sala = payload.get('cod_sala')

    if nome is None and descricao is None and 'cod_sala' not in payload:
        return jsonify({'erro': 'Pelo menos um dos campos nome, descricao ou cod_sala deve ser fornecido.'}), 400

    if 'cod_sala' in payload and cod_sala != '' and cod_sala is not None:
        if not Local.query.get(cod_sala):
            return jsonify({'erro': 'cod_sala informado não existe.'}), 400

    try:
        if nome is not None:
            equipamento.nome = nome
        if descricao is not None:
            equipamento.descricao = descricao
        if 'cod_sala' in payload:
            equipamento.cod_sala = cod_sala
        db.session.commit()
        return jsonify(equipamento.to_dict()), 200
    except Exception as exc:
        db.session.rollback()
        return jsonify({'erro': f'Falha ao atualizar equipamento: {str(exc)}'}), 500


@equipamento_bp.delete('/<string:cod_patrimonio>')
def excluir_equipamento(cod_patrimonio):
    equipamento = Equipamento.query.get(cod_patrimonio)
    if not equipamento:
        return jsonify({'erro': 'Equipamento não encontrado.'}), 404

    try:
        db.session.delete(equipamento)
        db.session.commit()
        return jsonify({'mensagem': 'Equipamento removido com sucesso.'}), 200
    except Exception as exc:
        db.session.rollback()
        return jsonify({'erro': f'Falha ao remover equipamento: {str(exc)}'}), 500
