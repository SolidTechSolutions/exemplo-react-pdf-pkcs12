# 🇧🇷 SolidSign API - Front-end de Exemplo: Assinatura PDF com PKCS#12 (React)

Este projeto é a contrapartida visual do back-end [`exemplo-integracao-pdf-pkcs12`](https://github.com/SolidTechSolutions/exemplo-integracao-pdf-pkcs12). Reaproveita a lógica de campos e parâmetros da tela **Assinar PDF** do Portal SolidSign, simplificada: sem login, sem i18n, sem importação de certificado (o `pfxCode` já deve existir) e sem posicionamento por arraste (a posição da estampa visual é preenchida em campos numéricos).

## Como funciona

Este front-end **não fala diretamente com a SolidSign API** — ele fala com o back-end de exemplo local, que expõe um endpoint de formulário com CORS liberado (`POST /api/pdf/sign/form`) e repassa `authorization`/`baseUrl` que você preenche no formulário. O back-end assina, baixa os PDFs resultantes e devolve um único `.zip` pronto pra download.

## Pré-requisitos

1. Rode o back-end [`exemplo-integracao-pdf-pkcs12`](https://github.com/SolidTechSolutions/exemplo-integracao-pdf-pkcs12) localmente (`mvn spring-boot:run`, porta padrão `8088`).
2. Tenha um token JWT válido (Volume 09 dos manuais / `POST /solidsign/auth/token`) e um certificado PKCS#12 já importado (`POST /solidsign/dsig/certificates/pkcs12/import`) — o `id` retornado é o `pfxCode`.

## Rodando

```bash
npm install
npm run dev
```

Abra `http://localhost:5173`, preencha o formulário e assine.

---

# 🇬🇧 SolidSign API - Example Front-end: PDF Signing with PKCS#12 (React)

This project is the visual counterpart to the [`exemplo-integracao-pdf-pkcs12`](https://github.com/SolidTechSolutions/exemplo-integracao-pdf-pkcs12) backend. It reuses the field/parameter logic from the Portal SolidSign **Sign PDF** screen, simplified: no login, no i18n, no certificate import (the `pfxCode` must already exist) and no drag-to-position (the visual stamp position is filled in as plain numeric fields).

## How it works

This front-end **never talks directly to the SolidSign API** — it talks to the local example backend, which exposes a CORS-enabled form endpoint (`POST /api/pdf/sign/form`) and forwards the `authorization`/`baseUrl` you fill in the form. The backend signs, downloads the resulting PDFs and returns a single ready-to-download `.zip`.

## Prerequisites

1. Run the [`exemplo-integracao-pdf-pkcs12`](https://github.com/SolidTechSolutions/exemplo-integracao-pdf-pkcs12) backend locally (`mvn spring-boot:run`, default port `8088`).
2. Have a valid JWT token (`POST /solidsign/auth/token`) and a PKCS#12 certificate already imported (`POST /solidsign/dsig/certificates/pkcs12/import`) — the returned `id` is the `pfxCode`.

## Running

```bash
npm install
npm run dev
```

Open `http://localhost:5173`, fill in the form and sign.
