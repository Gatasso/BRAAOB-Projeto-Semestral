from flask import Blueprint, jsonify, request
from app import db
from app.models import HistoricoSolicitacao, Solicitacao, Usuario, Equipamento
from datetime import datetime

solicitacao_bp = Blueprint('solicitacao_bp', __name__, url_prefix='/api/solicitacoes')

STATUS_PERMITIDOS = {
    'Registrada',
    'Visualizada',
    'Andamento',
    'Aguardo',
    'Concluída',
    'Concluída sem Intervenção',
    'Contestada',
}

def registrar_historico(solicitacao_id, usuario_id, status_anterior, status_novo):
    """Executa automaticamente o fluxo do UC 0006 (Log de Auditoria)"""
    historico = HistoricoSolicitacao(
        solicitacao_id=solicitacao_id,
        usuario_id=usuario_id,
        status_anterior=status_anterior,
        status_novo=status_novo
    )
    db.session.add(historico)

# UC 0001: Registro de Solicitação & UC 0007: Mídia / URL Foto
@solicitacao_bp.route('', methods=['POST'])
def registrar_solicitacao():
    data = request.get_json() or {}
    
    usuario_id = data.get('usuario_id')
    cod_sala = data.get('cod_sala')
    id_defeito = data.get('id_defeito')
    
    # Alvos de materiais alternados
    cod_patrimonio = data.get('cod_patrimonio')
    mobiliario_id = data.get('mobiliario_id')
    componente_id = data.get('componente_id')
    
    # Dados opcionais
    descricao_defeito = data.get('descricao_defeito')
    url_foto_anexo = data.get('url_foto_anexo') # Alimentado pelo upload mobile (UC 0007)

    # Validação inicial de usuário ativo (RGN01)
    usuario = Usuario.query.get(usuario_id) if usuario_id else None
    if not usuario or not usuario.ativo:
        return jsonify({"erro": "RGN01: Usuário inválido ou inativo"}), 403

    # Validação do preenchimento obrigatório de exatamente um material (Restrição de Integridade)
    materiais = [cod_patrimonio, mobiliario_id, componente_id]
    if sum(1 for m in materiais if m is not None) != 1:
        return jsonify({"erro": "MSG003: Informe exatamente UM material (Equipamento, Mobiliário ou Componente)"}), 400

    if not cod_sala or not id_defeito:
        return jsonify({"erro": "MSG003: Campos obrigatórios não preenchidos"}), 400

    try:
        nova_solicitacao = Solicitacao(
            usuario_id=usuario_id,
            cod_sala=cod_sala,
            cod_patrimonio=cod_patrimonio,
            mobiliario_id=mobiliario_id,
            componente_id=componente_id,
            id_defeito=id_defeito,
            descricao_defeito=descricao_defeito,
            url_foto_anexo=url_foto_anexo,
            status='Registrada' # RGN03
        )
        db.session.add(nova_solicitacao)
        db.session.flush() # Gera o ID UUID da solicitação sem commitar ainda

        # Dispara log de auditoria automática (UC 0006 / RGN03)
        registrar_historico(nova_solicitacao.id, usuario_id, None, 'Registrada')
        
        db.session.commit()
        return jsonify({"mensagem": "MSG001: Operação realizada com sucesso", "id": str(nova_solicitacao.id)}), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"erro": "Erro ao tentar registrar chamado", "detalhes": str(e)}), 400


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

# UC 0001: Edição de Solicitação Existente
@solicitacao_bp.route('/<uuid:id>', methods=['PUT'])
def editar_solicitacao(id):
    solicitacao = Solicitacao.query.get_or_404(id)
    data = request.get_json() or {}
    usuario_id = data.get('usuario_id')

    # Regra RGN04: Apenas o criador edita e somente se estiver em status 'Registrada' ou 'Contestada'
    if str(solicitacao.usuario_id) != str(usuario_id):
        return jsonify({"erro": "MSG002: Edição não permitida para este usuário"}), 403
        
    if solicitacao.status not in ['Registrada', 'Contestada']:
        return jsonify({"erro": f"MSG002: Edição não permitida para o status atual: {solicitacao.status}"}), 403

    # Permite atualizar campos do formulário base
    solicitacao.cod_sala = data.get('cod_sala', solicitacao.cod_sala)
    solicitacao.id_defeito = data.get('id_defeito', solicitacao.id_defeito)
    solicitacao.descricao_defeito = data.get('descricao_defeito', solicitacao.descricao_defeito)
    solicitacao.url_foto_anexo = data.get('url_foto_anexo', solicitacao.url_foto_anexo)
    solicitacao.atualizado_em = datetime.utcnow()

    db.session.commit()
    return jsonify({"mensagem": "MSG001: Operação realizada com sucesso"}), 200

# UC 0002: Consulta de Solicitações (Lista do Usuário Autenticado)
@solicitacao_bp.route('/usuario/<uuid:usuario_id>', methods=['GET'])
def listar_por_usuario(usuario_id):
    solicitacoes = Solicitacao.query.filter_by(usuario_id=usuario_id).order_by(Solicitacao.criado_em.desc()).all()
    
    if not solicitacoes:
        return jsonify({"mensagem": "MSG004: Nenhum registro encontrado"}), 404

    resultado = []
    for s in solicitacoes:
        resultado.append({
            "id": str(s.id),
            "cod_sala": s.cod_sala,
            "material": s.cod_patrimonio or f"Mobiliário ID {s.mobiliario_id}" or f"Componente ID {s.componente_id}",
            "status": s.status,
            "criado_em": s.criado_em.isoformat()
        })
    return jsonify(resultado), 200

# UC 0002: Detalhamento da Solicitação com Histórico Completo de Auditoria
@solicitacao_bp.route('/<uuid:id>', methods=['GET'])
def obter_detalhes_solicitacao(id):
    solicitacao = Solicitacao.query.get_or_404(id)
    historicos = HistoricoSolicitacao.query.filter_by(solicitacao_id=id).order_by(HistoricoSolicitacao.data_alteracao.asc()).all()

    historico_lista = [{
        "usuario_id": str(h.usuario_id),
        "status_anterior": h.status_anterior,
        "status_novo": h.status_novo,
        "data_alteracao": h.data_alteracao.isoformat()
    } for h in historicos]

    return jsonify({
        "id": str(solicitacao.id),
        "usuario_id": str(solicitacao.usuario_id),
        "cod_sala": solicitacao.cod_sala,
        "cod_patrimonio": solicitacao.cod_patrimonio,
        "mobiliario_id": solicitacao.mobiliario_id,
        "componente_id": solicitacao.componente_id,
        "id_defeito": solicitacao.id_defeito,
        "descricao_defeito": solicitacao.descricao_defeito,
        "id_solucao": solicitacao.id_solucao,
        "status": solicitacao.status,
        "url_foto_anexo": solicitacao.url_foto_anexo,
        "criado_em": solicitacao.criado_em.isoformat(),
        "historico": historico_lista # Mapeia todo o ciclo de vida (RGN05)
    }), 200


# UC 0003 & UC 0004: Gestão e Alteração de Status (Uso da Equipe Técnica / TI)
@solicitacao_bp.route('/<uuid:id>/status', methods=['PATCH'])
def alterar_status(id):
    solicitacao = Solicitacao.query.get_or_404(id)
    data = request.get_json() or {}
    
    novo_status = data.get('status')
    tecnico_id = data.get('usuario_id') # ID do membro de TI/Técnico efetuando a mudança
    id_solucao = data.get('id_solucao') # Requisitado obrigatòriamente se for fechar

    # Validações do conjunto estrito definido na RGN02
    status_permitidos = ['Visualizada', 'Andamento', 'Aguardo', 'Concluída', 'Concluída sem Intervenção', 'Contestada']
    if novo_status not in status_permitidos:
        return jsonify({"erro": "Status inválido para o fluxo de negócio"}), 400

    status_anterior = solicitacao.status

    # UC 0004 / RF04: Tratamento de Encerramento Obrigatório com Diagnóstico
    if novo_status in ['Concluída', 'Concluída sem Intervenção']:
        if not id_solucao:
            return jsonify({"erro": "MSG006: Obrigatório informar o catálogo de Solução (Diagnóstico) para encerramentos"}), 400
        solicitacao.id_solucao = id_solucao

    # Atualiza a entidade principal
    solicitacao.status = novo_status
    solicitacao.atualizado_em = datetime.utcnow()

    # Grava no log estruturado imutável (UC 0006)
    registrar_historico(solicitacao.id, tecnico_id, status_anterior, novo_status)
    
    db.session.commit()
    
    mensagem_retorno = "MSG005: Solicitação encerrada com sucesso" if novo_status in ['Concluída', 'Concluída sem Intervenção'] else "MSG001: Status alterado com sucesso"
    return jsonify({"mensagem": mensagem_retorno}), 200


# UC 0005: Contestação de Resolução (Atores do tipo Usuário Aluno/Servidor)
@solicitacao_bp.route('/<uuid:id>/contestar', methods=['POST'])
def contestar_resolucao(id):
    solicitacao = Solicitacao.query.get_or_404(id)
    data = request.get_json() or {}
    usuario_id = data.get('usuario_id')
    justificativa = data.get('justificativa') # Texto explicitando a falha do reparo

    if str(solicitacao.usuario_id) != str(usuario_id):
        return jsonify({"erro": "Apenas o autor original pode contestar este chamado."}), 403

    # Pré-condição técnica: Chamado precisa estar em variações de concluído
    if solicitacao.status not in ['Concluída', 'Concluída sem Intervenção']:
        return jsonify({"erro": "A01: Status inválido para contestação. O chamado precisa estar encerrado."}), 400

    if not justificativa:
        return jsonify({"erro": "É obrigatório inserir uma justificativa explicando o motivo do chamado não ter sido resolvido."}), 400

    status_anterior = solicitacao.status
    solicitacao.status = 'Contestada'
    solicitacao.descricao_defeito = f"{solicitacao.descricao_defeito or ''} [Contestação]: {justificativa}"
    solicitacao.atualizado_em = datetime.utcnow()

    # Log de auditoria obrigatório
    registrar_historico(solicitacao.id, usuario_id, status_anterior, 'Contestada')

    db.session.commit()
    return jsonify({"mensagem": "MSG007: Contestação registrada"}), 200