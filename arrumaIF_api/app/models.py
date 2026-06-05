import uuid
from datetime import datetime
from sqlalchemy.orm import validates
import textwrap
from main import db

# ===========================================================================
# TABELAS DE USUÁRIOS
# ===========================================================================
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

# ===========================================================================
# TABELAS DE MATERIAIS
# ===========================================================================
class Local(db.Model):
    __tablename__ = 'local'

    cod_sala = db.Column(db.String(50), primary_key=True)
    descricao = db.Column(db.String(255), nullable=True)
    tipo_local = db.Column(db.String(20), db.CheckConstraint("tipo_local IN ('Sala', 'Laboratorio')"), nullable=False) 
    criado_em = db.Column(db.DateTime(timezone=True), server_default=db.text("NOW()"), nullable=False)

    equipamentos = db.relationship('Equipamento', back_populates='local', lazy='dynamic')
    solicitacoes = db.relationship('Solicitacao', back_populates='local', lazy='dynamic')

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

class Mobiliario(db.Model):
    __tablename__ = 'mobiliario'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True) 
    nome = db.Column(db.String(100), unique=True, nullable=False) 
    descricao = db.Column(db.Text, nullable=True) 

    solicitacoes = db.relationship('Solicitacao', back_populates='mobiliario', lazy='dynamic')

    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'descricao': self.descricao
        }


class Componente(db.Model):
    __tablename__ = 'componente'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True) 
    nome = db.Column(db.String(100), unique=True, nullable=False) 
    descricao = db.Column(db.Text, nullable=True) 

    solicitacoes = db.relationship('Solicitacao', back_populates='componente', lazy='dynamic')

    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'descricao': self.descricao
        }

    def to_dict(self):
        return {
            'cod_patrimonio': self.cod_patrimonio,
            'nome': self.nome,
            'descricao': self.descricao,
            'cod_sala': self.cod_sala,
            'criado_em': self.criado_em.isoformat() if self.criado_em else None,
        }

# ===========================================================================
# 4. TABELAS DE SOLICITAÇÃO
# ===========================================================================
class Defeitos(db.Model):
    __tablename__ = 'defeitos'

    id_defeito = db.Column(db.Integer, primary_key=True, autoincrement=True) 
    titulo = db.Column(db.String(150), unique=True, nullable=False) 
    descricao = db.Column(db.Text, nullable=True) 

    solicitacoes = db.relationship('Solicitacao', back_populates='defeito', lazy='dynamic')

    def to_dict(self):
        return {
            'id_defeito': self.id_defeito,
            'titulo': self.titulo,
            'descricao': self.descricao
        }


class Solucoes(db.Model):
    __tablename__ = 'solucoes'

    id_solucao = db.Column(db.Integer, primary_key=True, autoincrement=True) 
    titulo = db.Column(db.String(150), unique=True, nullable=False) 
    descricao = db.Column(db.Text, nullable=True)

    solicitacoes = db.relationship('Solicitacao', back_populates='solucao', lazy='dynamic')

    def to_dict(self):
        return {
            'id_solucao': self.id_solucao,
            'titulo': self.titulo,
            'descricao': self.descricao
        }


class Solicitacao(db.Model):
    __tablename__ = 'solicitacao'

    STATUS_PERMITIDOS = {
        'Registrada', 
        'Visualizada', 
        'Andamento', 
        'Aguardo', 
        'Concluída', 
        'Concluída sem Intervenção', 
        'Contestada'
    }

    id = db.Column(db.UUID(as_uuid=True), primary_key=True, server_default=db.text("gen_random_uuid()")) 
    usuario_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey('usuario.id', ondelete='RESTRICT'), nullable=False) 
    cod_sala = db.Column(db.String(50), db.ForeignKey('local.cod_sala', ondelete='RESTRICT'), nullable=False) 
    
    # Alvos alternados da manutenção (Podem ser nulos individualmente no banco)
    cod_patrimonio = db.Column(db.String(100), db.ForeignKey('equipamento.cod_patrimonio', ondelete='RESTRICT'), nullable=True) 
    mobiliario_id = db.Column(db.Integer, db.ForeignKey('mobiliario.id', ondelete='RESTRICT'), nullable=True) 
    componente_id = db.Column(db.Integer, db.ForeignKey('componente.id', ondelete='RESTRICT'), nullable=True) 
    
    # Catálogos de Defeitos e Soluções
    id_defeito = db.Column(db.Integer, db.ForeignKey('defeitos.id_defeito', ondelete='RESTRICT'), nullable=False) 
    descricao_defeito = db.Column(db.Text, nullable=True) # Permitido NULL conforme RF01 e UC 0001 
    id_solucao = db.Column(db.Integer, db.ForeignKey('solucoes.id_solucao', ondelete='RESTRICT'), nullable=True) 
    
    status = db.Column(db.String(50), db.CheckConstraint("status IN ('Registrada', 'Visualizada', 'Andamento', 'Aguardo', 'Concluída', 'Concluída sem Intervenção', 'Contestada')"), server_default='Registrada', nullable=False) 
    url_foto_anexo = db.Column(db.Text, nullable=True) 
    
    criado_em = db.Column(db.DateTime(timezone=True), server_default=db.text("NOW()"), nullable=False) 
    atualizado_em = db.Column(db.DateTime(timezone=True), server_default=db.text("NOW()"), onupdate=datetime.utcnow, nullable=False) 

    # Relacionamentos
    usuario = db.relationship('Usuario', back_populates='solicitacoes')
    local = db.relationship('Local', back_populates='solicitacoes')
    equipamento = db.relationship('Equipamento', back_populates='solicitacoes')
    mobiliario = db.relationship('Mobiliario', back_populates='solicitacoes')
    componente = db.relationship('Componente', back_populates='solicitacoes')
    defeito = db.relationship('Defeitos', back_populates='solicitacoes')
    solucao = db.relationship('solucoes', back_populates='solicitacoes')
    
    historicos = db.relationship(
        'HistoricoSolicitacao',
        back_populates='solicitacao',
        cascade='all, delete-orphan',
        passive_deletes=True,
        lazy='dynamic',
    )

    # RESTRIÇÃO FÍSICA: Garante no banco que APENAS UM material foi referenciado no chamado
    __table_args__ = (
        db.CheckConstraint(
            textwrap.dedent("""
                (cod_patrimonio IS NOT NULL AND mobiliario_id IS NULL AND componente_id IS NULL) OR 
                (cod_patrimonio IS NULL AND mobiliario_id IS NOT NULL AND componente_id IS NULL) OR
                (cod_patrimonio IS NULL AND mobiliario_id IS NULL AND componente_id IS NOT NULL)
            """).strip()
        ),
    )

    def to_dict(self):
        return {
            'id': str(self.id) if self.id else None,
            'usuario_id': str(self.usuario_id) if self.usuario_id else None,
            'cod_sala': self.cod_sala,
            'cod_patrimonio': self.cod_patrimonio,
            'mobiliario_id': self.mobiliario_id,
            'componente_id': self.componente_id,
            'id_defeito': self.id_defeito,
            'descricao_defeito': self.descricao_defeito,
            'id_solucao': self.id_solucao,
            'status': self.status,
            'url_foto_anexo': self.url_foto_anexo,
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

    id = db.Column(db.UUID(as_uuid=True), primary_key=True, server_default=db.text("gen_random_uuid()")) 
    solicitacao_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey('solicitacao.id', ondelete='CASCADE'), nullable=False) 
    usuario_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey('usuario.id', ondelete='RESTRICT'), nullable=False) 
    
    status_anterior = db.Column(db.String(50), db.CheckConstraint("status_anterior IN ('Registrada', 'Visualizada', 'Andamento', 'Aguardo', 'Concluída', 'Concluída sem Intervenção', 'Contestada')"), nullable=True)
    status_novo = db.Column(db.String(50), db.CheckConstraint("status_novo IN ('Registrada', 'Visualizada', 'Andamento', 'Aguardo', 'Concluída', 'Concluída sem Intervenção', 'Contestada')"), nullable=False)
    data_alteracao = db.Column(db.DateTime(timezone=True), server_default=db.text("NOW()"), nullable=False) 

    solicitacao = db.relationship('Solicitacao', back_populates='historicos')
    usuario = db.relationship('Usuario', back_populates='historicos')

    def to_dict(self):
        return {
            'id': str(self.id) if self.id else None,
            'solicitacao_id': str(self.solicitacao_id) if self.solicitacao_id else None,
            'usuario_id': str(self.usuario_id) if self.usuario_id else None,
            'status_anterior': self.status_anterior,
            'status_novo': self.status_novo,
            'data_alteracao': self.data_alteracao.isoformat() if self.data_alteracao else None,
        }
