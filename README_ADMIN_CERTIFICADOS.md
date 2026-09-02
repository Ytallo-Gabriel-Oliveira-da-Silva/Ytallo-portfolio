# Gestão de Certificados e Currículos

Este documento serve como referência interna para organizar os itens publicados no site.

## Estrutura recomendada

Cada certificado deve seguir a seguinte lógica:

- ID: identificador interno único
- Nome: título visível no site
- Slug: versão em minúsculas e com traço
- Instituição / Ensino: origem do certificado
- Status: disponível, em andamento, etc.
- Arquivo: PDF ou imagem relacionado
- Possui imagem: true/false

Exemplo:

```json
{
  "id": "cert-001",
  "name": "Certificado de UX",
  "slug": "certificado-de-ux",
  "institution": "Alura",
  "status": "Disponível",
  "hasImage": false,
  "url": "/uploads/certificados/arquivo.pdf"
}
```

## Regra para slug

O slug deve ser gerado em minúsculas, sem acento e com espaços substituídos por traço.

Exemplos:

- "Certificado de UX" -> "certificado-de-ux"
- "HTML e CSS Avançado" -> "html-e-css-avancado"
- "Cyber Segurança" -> "cyber-seguranca"

## Lista de itens do site

### Certificados

| ID | Nome | Slug | Observações |
| --- | --- | --- | --- |
| cert-001 | Imersão Front-End | imersao-front-end-alura | Em uso |
| cert-002 | Imersão Front-End 2ª Edição | imersao-front-end-2-edicao-alura | Em uso |
| cert-003 | React DEV | react-dev-alura | Em uso |
| cert-004 | Imersão DEV com Google Gemini | imersao-dev-google-gemini | Em uso |
| cert-005 | HTML e CSS: Ambientes de Desenvolvimento | html-css-ambientes-desenvolvimento | Em uso |
| cert-006 | Dados com Python | dados-com-python | Em uso |
| cert-007 | Solve for Tomorrow | solve-for-tomorrow | Em uso |
| cert-008 | Empreendedorismo | empreendedorismo-ja-pernambuco | Em uso |
| cert-009 | Cyber Segurança | cyber-seguranca-dio-riachuelo | Em uso |
| cert-010 | Letramento Digital | letramento-digital-senai | Em uso |
| cert-011 | 8ª ONDA | onda-8 | Em uso |
| cert-012 | 18ª Mostra Brasileira de Foguetes | mostra-brasileira-foguetes | Em uso |
| cert-013 | Olimpíada Brasileira de Astronomia e Astronáutica | olimpiada-astronomia-astronautica | Em uso |
| cert-014 | Monitoria Voluntária Bolsista - Robótica e Física | monitoria-robotica-fisica | Em uso |
| cert-015 | WEB3 Week 6ª Edição | web3-week-6-edicao | Em uso |

### Currículos

| ID | Nome | Slug | Observações |
| --- | --- | --- | --- |
| cv-pt | Currículo em Português | curriculo-portugues | Em uso |
| cv-en | Currículo em Inglês | curriculo-ingles | Em uso |

## Como usar no admin

1. Pesquise pelo ID, slug ou nome.
2. Verifique se o item existe.
3. Atualize nome, instituição, status ou arquivo.
4. Salve o registro sem mexer no código do site.
5. O slug deve continuar em minúsculas e com traço.

## Observações

- Não usar espaços no slug.
- Não usar letras maiúsculas no slug.
- Não repetir IDs.
- Se um item for atualizado, manter o mesmo ID para evitar conflitos.
- Para novos itens, criar um ID sequencial como: cert-016, cert-017, etc.
