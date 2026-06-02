from flask import Blueprint, jsonify, request
from app import db
from app.models import HistoricoSolicitacao, Solicitacao, Usuario, Equipamento

solicitacao_bp = Blueprint('solicitacao_bp', __name__, url_prefix='/api/solicitacoes')

STATUS_PERMITIDOS = {
    'Registrada',
    'Visualizada',
    'Em Andamento',
    'Aguardando',
    'Concluída',
    'Concluída sem Intervenção',
    'Contestada',
}


@solicitacao_bp.post('/')
def criar_solicitacao():
    payload = request.get_json(force=True, silent=True)
    if not payload:
        return jsonify({'erro': 'JSON inválido ou ausente.'}), 400

    usuario_id = payload.get('usuario_id')
    cod_patrimonio = payload.get('cod_patrimonio')
    descricao_defeito = payload.get('descricao_defeito')

    if not usuario_id or not cod_patrimonio or not descricao_defeito:
        return jsonify({'erro': 'Os campos usuario_id, cod_patrimonio e descricao_defeito são obrigatórios.'}), 400

    usuario = Usuario.query.get(usuario_id)
    if not usuario:
        return jsonify({'erro': 'Usuário informado não existe.'}), 400

    equipamento = Equipamento.query.get(cod_patrimonio)
    if not equipamento:
        return jsonify({'erro': 'Equipamento informado não existe.'}), 400

    try:
        solicitacao = Solicitacao(
            usuario_id=usuario_id,
            cod_patrimonio=cod_patrimonio,
            descricao_defeito=descricao_defeito,
            status='Registrada',
        )
        db.session.add(solicitacao)
        db.session.flush()

        historico = HistoricoSolicitacao(
            solicitacao_id=solicitacao.id,
            usuario_id=usuario_id,
            status_anterior=None,
            status_novo='Registrada',
        )
        db.session.add(historico)
        db.session.commit()

        response = solicitacao.to_dict()
        response['historico'] = [historico.to_dict()]
        return jsonify(response), 201
    except Exception as exc:
        db.session.rollback()
        return jsonify({'erro': f'Falha ao criar solicitação: {str(exc)}'}), 500


@solicitacao_bp.get('/')
def listar_solicitacoes():
    usuario_id = request.args.get('usuario_id')
    status = request.args.get('status')

    query = Solicitacao.query
    if usuario_id:
        query = query.filter_by(usuario_id=usuario_id)
    if status:
        query = query.filter_by(status=status)

    solicitacoes = query.all()
    return jsonify([solicitacao.to_dict() for solicitacao in solicitacoes]), 200


@solicitacao_bp.get('/<uuid:id>')
def obter_solicitacao(id):
    solicitacao = Solicitacao.query.get(id)
    if not solicitacao:
        return jsonify({'erro': 'Solicitação não encontrada.'}), 404

    historicos = HistoricoSolicitacao.query.filter_by(solicitacao_id=id).order_by(
        HistoricoSolicitacao.data_alteracao.desc()
    ).all()

    response = solicitacao.to_dict()
    response['historico'] = [hist.to_dict() for hist in historicos]
    return jsonify(response), 200


@solicitacao_bp.put('/<uuid:id>')
def atualizar_solicitacao(id):
    solicitacao = Solicitacao.query.get(id)
    if not solicitacao:
        return jsonify({'erro': 'Solicitação não encontrada.'}), 404

    payload = request.get_json(force=True, silent=True)
    if not payload:
        return jsonify({'erro': 'JSON inválido ou ausente.'}), 400

    status = payload.get('status')
    usuario_id = payload.get('usuario_id')
    causa_diagnostico = payload.get('causa_diagnostico')
    solucao_diagnostico = payload.get('solucao_diagnostico')

    if not status or not usuario_id:
        return jsonify({'erro': 'Os campos status e usuario_id são obrigatórios.'}), 400

    if status not in STATUS_PERMITIDOS:
        return jsonify({'erro': f"Status inválido. Valores válidos: {sorted(STATUS_PERMITIDOS)}."}), 400

    usuario_alteracao = Usuario.query.get(usuario_id)
    if not usuario_alteracao:
        return jsonify({'erro': 'Usuário que altera não existe.'}), 400

    try:
        status_anterior = solicitacao.status
        if status != status_anterior:
            solicitacao.status = status
            historico = HistoricoSolicitacao(
                solicitacao_id=solicitacao.id,
                usuario_id=usuario_id,
                status_anterior=status_anterior,
                status_novo=status,
                causa_diagnostico=causa_diagnostico if status in {'Concluída', 'Concluída sem Intervenção'} else None,
                solucao_diagnostico=solucao_diagnostico if status in {'Concluída', 'Concluída sem Intervenção'} else None,
            )
            db.session.add(historico)
        db.session.commit()

        response = solicitacao.to_dict()
        if status != status_anterior:
            response['historico'] = [historico.to_dict()]
        else:
            response['historico'] = []
        return jsonify(response), 200
    except Exception as exc:
        db.session.rollback()
        return jsonify({'erro': f'Falha ao atualizar solicitação: {str(exc)}'}), 500
