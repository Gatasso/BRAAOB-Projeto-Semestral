#!/usr/bin/env python3
import os
from dotenv import load_dotenv
load_dotenv()

from app import create_app, db
from app.models import Usuario

app = create_app()

with app.app_context():
    client = app.test_client()

    payload = {
        'prontuario': 'TEST12345',
        'nome': 'Usuário de Teste',
        'email': 'test.api+flask@example.com',
        'tipo': 'Aluno'
    }

    print('Enviando POST /api/usuarios/ com payload:', payload)
    resp = client.post('/api/usuarios/', json=payload)
    print('Status:', resp.status_code)
    try:
        print('Resposta JSON:', resp.get_json())
    except Exception:
        print('Resposta raw:', resp.data)

    # Confirma no banco
    usuario = Usuario.query.filter_by(email=payload['email']).first()
    if usuario:
        print('Registro no DB encontrado:')
        print(usuario.to_dict())
    else:
        print('Registro no DB NÃO encontrado.')
