# 🇧🇷 SolidSign API - Front-end de Exemplo: Assinatura PDF com PKCS#12 (React)

## ⚠️ Disponibilidade

Este método (importação de certificado PKCS#12 direto no servidor) só está disponível em instâncias do SolidSign API rodando **on-premises** (localmente, na infraestrutura do próprio cliente). **Não está disponível na versão SaaS pública** do SolidSign.

Motivo: a importação PKCS#12 mantém a chave privada decriptada em cache no servidor por até 2 horas — um risco aceitável numa instância on-premises própria, mas não numa instância SaaS compartilhada entre vários clientes. Se você usa o SaaS público, use `sign-hsm-cloud` (seu próprio PSC) ou a custódia KMS SolidSign em vez deste método.

## Como funciona

Este front-end chama `POST /api/pdf/sign/form` (`http://localhost:8088` por padrão) no back-end de exemplo, enviando o `pfxCode` de um certificado PKCS#12 já importado na SolidSign API. O back-end assina o(s) PDF(s), baixa os resultados e devolve um único `.zip` pronto pra download.

## Requisitos

Rode **um** destes back-ends de exemplo localmente (todos implementam o mesmo endpoint de formulário e a mesma porta padrão usada abaixo):

- **Java**: [`exemplo-java-integracao-pdf-pkcs12`](https://github.com/SolidTechSolutions/exemplo-java-integracao-pdf-pkcs12)
- **C#**: [`exemplo-csharp-integracao-pdf-pkcs12`](https://github.com/SolidTechSolutions/exemplo-csharp-integracao-pdf-pkcs12)
- **TypeScript**: [`exemplo-typescript-integracao-pdf-pkcs12`](https://github.com/SolidTechSolutions/exemplo-typescript-integracao-pdf-pkcs12)
- **Python**: [`exemplo-python-integracao-pdf-pkcs12`](https://github.com/SolidTechSolutions/exemplo-python-integracao-pdf-pkcs12)
- **PHP**: [`exemplo-php-integracao-pdf-pkcs12`](https://github.com/SolidTechSolutions/exemplo-php-integracao-pdf-pkcs12)
- **Node.js**: [`exemplo-nodejs-integracao-pdf-pkcs12`](https://github.com/SolidTechSolutions/exemplo-nodejs-integracao-pdf-pkcs12)
- **JavaScript**: [`exemplo-javascript-integracao-pdf-pkcs12`](https://github.com/SolidTechSolutions/exemplo-javascript-integracao-pdf-pkcs12)

- Um token JWT válido (`POST /solidsign/auth/token`)
- Um certificado PKCS#12 já importado (`POST /solidsign/dsig/certificates/pkcs12/import`) — o `id` retornado é o `pfxCode`

## Como rodar

```bash
npm install
npm run dev
```

Abra `http://localhost:5173`, preencha o formulário e envie.

## Variáveis do formulário

| Campo | Significado | Default |
|---|---|---|
| `baseUrl` | URL base da SolidSign API | `https://www.solidsign.com.br` |
| `authorization` | Token JWT (Bearer) | (vazio) |
| `pfxCode` | ID do certificado PKCS#12 importado | (vazio) |
| `documents` | PDF(s) a assinar | (vazio) |
| `signatureImage` | Imagem da estampa visual (opcional) | (nenhuma) |
| `profile` | Perfil de assinatura PBAD/ETSI | `ADRB` |
| `hashAlgorithm` | Algoritmo de hash | `SHA256` |
| `reason / location / contact` | Metadados da assinatura (opcionais) | (vazio) |
| `page` | Página onde posicionar a estampa | `1` |
| `coordinateX / coordinateY` | Posição da estampa (pontos) | `60` / `60` |
| `width / height` | Tamanho da estampa (pontos) | `200` / `80` |

---

# 🇬🇧 SolidSign API - Example Front-end: PDF Signing with PKCS#12 (React)

## ⚠️ Availability

This method (server-side PKCS#12 certificate import) is only available on **on-premises** SolidSign API instances (running locally, on the customer's own infrastructure). **It is not available on the public SaaS** version of SolidSign.

Why: PKCS#12 import keeps the decrypted private key cached on the server for up to 2 hours — an acceptable risk on your own on-premises instance, but not on a shared multi-tenant SaaS instance. If you use the public SaaS, use `sign-hsm-cloud` (your own PSC) or KMS SolidSign custody instead of this method.

## How it works

This front-end calls `POST /api/pdf/sign/form` (`http://localhost:8088` by default) on the example backend, sending the `pfxCode` of a PKCS#12 certificate already imported into the SolidSign API. The backend signs the PDF(s), downloads the results and returns a single ready-to-download `.zip`.

## Requirements

Run **one** of these example backends locally (all implement the same form endpoint and default port used below):

- **Java**: [`exemplo-java-integracao-pdf-pkcs12`](https://github.com/SolidTechSolutions/exemplo-java-integracao-pdf-pkcs12)
- **C#**: [`exemplo-csharp-integracao-pdf-pkcs12`](https://github.com/SolidTechSolutions/exemplo-csharp-integracao-pdf-pkcs12)
- **TypeScript**: [`exemplo-typescript-integracao-pdf-pkcs12`](https://github.com/SolidTechSolutions/exemplo-typescript-integracao-pdf-pkcs12)
- **Python**: [`exemplo-python-integracao-pdf-pkcs12`](https://github.com/SolidTechSolutions/exemplo-python-integracao-pdf-pkcs12)
- **PHP**: [`exemplo-php-integracao-pdf-pkcs12`](https://github.com/SolidTechSolutions/exemplo-php-integracao-pdf-pkcs12)
- **Node.js**: [`exemplo-nodejs-integracao-pdf-pkcs12`](https://github.com/SolidTechSolutions/exemplo-nodejs-integracao-pdf-pkcs12)
- **JavaScript**: [`exemplo-javascript-integracao-pdf-pkcs12`](https://github.com/SolidTechSolutions/exemplo-javascript-integracao-pdf-pkcs12)

- A valid JWT token (`POST /solidsign/auth/token`)
- A PKCS#12 certificate already imported (`POST /solidsign/dsig/certificates/pkcs12/import`) — the returned `id` is the `pfxCode`

## Running

```bash
npm install
npm run dev
```

Open `http://localhost:5173`, fill in the form and submit.

## Form fields

| Field | Meaning | Default |
|---|---|---|
| `baseUrl` | SolidSign API base URL | `https://www.solidsign.com.br` |
| `authorization` | JWT (Bearer) token | (empty) |
| `pfxCode` | ID of the imported PKCS#12 certificate | (empty) |
| `documents` | PDF(s) to sign | (empty) |
| `signatureImage` | Visual stamp image (optional) | (none) |
| `profile` | PBAD/ETSI signature profile | `ADRB` |
| `hashAlgorithm` | Hash algorithm | `SHA256` |
| `reason / location / contact` | Signature metadata (optional) | (empty) |
| `page` | Page to place the stamp on | `1` |
| `coordinateX / coordinateY` | Stamp position (points) | `60` / `60` |
| `width / height` | Stamp size (points) | `200` / `80` |
