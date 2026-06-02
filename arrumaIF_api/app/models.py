import uuid
from datetime import datetime
from sqlalchemy.orm import validates

from app import db


class Usuario(db.Model):
    __tablename__ = 'usuario'

    id = db.Column(db.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    prontuario = db.Column(db.String(50), unique=True, nullable=False)
    nome = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    tipo = db.Column(db.String(50), nullable=False)  # 'Aluno', 'Docente', 'TAE', 'TI'
    ativo = db.Column(db.Boolean, default=True, nullable=False)
    criado_em = db.Column(db.DateTime(timezone=True), default=datetime.utcnow, nullable=False)

    solicitacoes = db.relationship(
        'Solicitacao', back_populates='usuario', lazy='dynamic'
    )
    historicos = db.relationship(
        'HistoricoSolicitacao', back_populates='usuario', lazy='dynamic'
    )

    def to_dict(self):
        return {
            'id': str(self.id) if self.id else None,
            'prontuario': self.prontuario,
            'nome': self.nome,
            'email': self.email,
            'tipo': self.tipo,
            'ativo': self.ativo,
            'criado_em': self.criado_em.isoformat() if self.criado_em else None,
        }


class Local(db.Model):
    __tablename__ = 'local'

    cod_sala = db.Column(db.String(50), primary_key=True)
    descricao = db.Column(db.String(255), nullable=False)
    tipo_local = db.Column(db.String(20), nullable=False)  # 'Sala' ou 'Laboratorio'
    criado_em = db.Column(db.DateTime(timezone=True), default=datetime.utcnow, nullable=False)

    equipamentos = db.relationship(
        'Equipamento', back_populates='local', lazy='dynamic'
    )

    def to_dict(self):
        return {
            'cod_sala': self.cod_sala,
            'descricao': self.descricao,
            'tipo_local': self.tipo_local,
            'criado_em': self.criado_em.isoformat() if self.criado_em else None,
        }


class Equipamento(db.Model):
    __tablename__ = 'equipamento'

    cod_patrimonio = db.Column(db.String(100), primary_key=True)
    nome = db.Column(db.String(255), nullable=False)
    descricao = db.Column(db.Text, nullable=True)
    cod_sala = db.Column(
        db.String(50),
        db.ForeignKey('local.cod_sala', ondelete='SET NULL'),
        nullable=True,
    )
    criado_em = db.Column(db.DateTime(timezone=True), default=datetime.utcnow, nullable=False)

    local = db.relationship('Local', back_populates='equipamentos')
    solicitacoes = db.relationship(
        'Solicitacao', back_populates='equipamento', lazy='dynamic'
    )

    def to_dict(self):
        return {
            'cod_patrimonio': self.cod_patrimonio,
            'nome': self.nome,
            'descricao': self.descricao,
            'cod_sala': self.cod_sala,
            'criado_em': self.criado_em.isoformat() if self.criado_em else None,
        }


class Solicitacao(db.Model):
    __tablename__ = 'solicitacao'

    STATUS_PERMITIDOS = {
        'Registrada',
        'Visualizada',
        'Em Andamento',
        'Aguardando',
        'Concluída',
        'Concluída sem Intervenção',
        'Contestada',
    }

    id = db.Column(db.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    usuario_id = db.Column(
        db.UUID(as_uuid=True),
        db.ForeignKey('usuario.id'),
        nullable=False,
    )
    cod_patrimonio = db.Column(
        db.String(100),
        db.ForeignKey('equipamento.cod_patrimonio'),
        nullable=False,
    )
    descricao_defeito = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(50), nullable=False, default='Registrada')
    criado_em = db.Column(db.DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    atualizado_em = db.Column(
        db.DateTime(timezone=True),
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )

    usuario = db.relationship('Usuario', back_populates='solicitacoes')
    equipamento = db.relationship('Equipamento', back_populates='solicitacoes')
    historicos = db.relationship(
        'HistoricoSolicitacao',
        back_populates='solicitacao',
        cascade='all, delete-orphan',
        passive_deletes=True,
        lazy='dynamic',
    )

    def to_dict(self):
        return {
            'id': str(self.id) if self.id else None,
            'usuario_id': str(self.usuario_id) if self.usuario_id else None,
            'cod_patrimonio': self.cod_patrimonio,
            'descricao_defeito': self.descricao_defeito,
            'status': self.status,
            'criado_em': self.criado_em.isoformat() if self.criado_em else None,
            'atualizado_em': self.atualizado_em.isoformat() if self.atualizado_em else None,
        }

    @validates('status')
    def validate_status(self, key, value):
        if value not in self.STATUS_PERMITIDOS:
            raise ValueError(
                f"Status inválido: {value}. Valores permitidos: {sorted(self.STATUS_PERMITIDOS)}"
            )
        return value


class HistoricoSolicitacao(db.Model):
    __tablename__ = 'historico_solicitacao'

    id = db.Column(db.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    solicitacao_id = db.Column(
        db.UUID(as_uuid=True),
        db.ForeignKey('solicitacao.id', ondelete='CASCADE'),
        nullable=False,
    )
    usuario_id = db.Column(
        db.UUID(as_uuid=True),
        db.ForeignKey('usuario.id'),
        nullable=False,
    )
    status_anterior = db.Column(db.String(50), nullable=True)
    status_novo = db.Column(db.String(50), nullable=False)
    causa_diagnostico = db.Column(db.Text, nullable=True)
    solucao_diagnostico = db.Column(db.Text, nullable=True)
    data_alteracao = db.Column(db.DateTime(timezone=True), default=datetime.utcnow, nullable=False)

    solicitacao = db.relationship('Solicitacao', back_populates='historicos')
    usuario = db.relationship('Usuario', back_populates='historicos')

    def to_dict(self):
        return {
            'id': str(self.id) if self.id else None,
            'solicitacao_id': str(self.solicitacao_id) if self.solicitacao_id else None,
            'usuario_id': str(self.usuario_id) if self.usuario_id else None,
            'status_anterior': self.status_anterior,
            'status_novo': self.status_novo,
            'causa_diagnostico': self.causa_diagnostico,
            'solucao_diagnostico': self.solucao_diagnostico,
            'data_alteracao': self.data_alteracao.isoformat() if self.data_alteracao else None,
        }
