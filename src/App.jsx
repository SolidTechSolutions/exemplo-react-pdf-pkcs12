import { useState } from 'react';
import './App.css';

// [PT-BR] Exemplo de front-end React para assinatura de PDF com certificado
// PKCS#12 (arquivo .pfx/.p12 já importado na SolidSign API — este app não faz
// a importação, só a assinatura). Reaproveita a lógica de campos/parâmetros
// da tela "Assinar PDF" do Portal SolidSign (src/pages/Signer/SignerPDF.jsx),
// cortando tudo que não é específico deste método: sem login/AuthContext, sem
// i18n, sem geração de rubrica, sem posicionamento por arraste no PDF (aqui a
// posição do campo de assinatura é preenchida em campos numéricos simples).
//
// [EN] React front-end example for PDF signing with a PKCS#12 certificate
// (a .pfx/.p12 already imported in the SolidSign API — this app only signs,
// it does not import). Reuses the field/parameter logic from the Portal
// SolidSign "Sign PDF" screen (src/pages/Signer/SignerPDF.jsx), trimmed of
// everything not specific to this method: no login/AuthContext, no i18n, no
// rubric generator, no drag-to-position PDF preview (the signature field
// position here is plain numeric inputs instead).
//
// Este front-end fala com o backend de exemplo local (porta padrão 8080),
// nunca diretamente com a SolidSign API — o backend é quem tem CORS liberado
// e repassa `authorization`/`baseUrl` que você preenche abaixo.
// This front-end talks to the local example backend (default port 8080),
// never directly to the SolidSign API — the backend is the one with CORS
// enabled and forwards the `authorization`/`baseUrl` you fill in below.

const BACKEND_URL = 'http://localhost:8088/api/pdf/sign/form';

const PROFILES = ['ADRB', 'ADRT', 'ADRC', 'ADRA', 'PDF_BASIC', 'PDF_TIMESTAMP', 'PDF_COMPLETE', 'PADES_B', 'PADES_T', 'PADES_LT', 'PADES_LTA'];

export default function App() {
  const [baseUrl, setBaseUrl] = useState('https://www.solidsign.com.br');
  const [authorization, setAuthorization] = useState('');
  const [pfxCode, setPfxCode] = useState('');
  const [documents, setDocuments] = useState([]);
  const [signatureImage, setSignatureImage] = useState(null);

  const [profile, setProfile] = useState('ADRB');
  const [hashAlgorithm, setHashAlgorithm] = useState('SHA256');
  const [reason, setReason] = useState('');
  const [location, setLocation] = useState('');
  const [contact, setContact] = useState('');

  // Posição/tamanho do campo de assinatura visual — em pixels, relativo ao
  // canto inferior esquerdo da página escolhida. Ver signatureFieldConfig na
  // documentação da API (Volume 09 dos manuais / Área de Desenvolvedores).
  const [page, setPage] = useState(1);
  const [coordinateX, setCoordinateX] = useState(60);
  const [coordinateY, setCoordinateY] = useState(60);
  const [width, setWidth] = useState(200);
  const [height, setHeight] = useState(80);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    if (documents.length === 0) { setError('Selecione ao menos um documento PDF.'); return; }
    if (!pfxCode.trim()) { setError('Informe o pfxCode do certificado já importado.'); return; }
    if (!authorization.trim()) { setError('Informe o token de autorização (Bearer).'); return; }

    setLoading(true);
    try {
      const fd = new FormData();
      documents.forEach((f) => fd.append('document', f));
      fd.append('authorization', authorization.startsWith('Bearer ') ? authorization : `Bearer ${authorization}`);
      fd.append('baseUrl', baseUrl);
      fd.append('pfxCode', pfxCode);
      if (signatureImage) fd.append('signatureImage', signatureImage);
      fd.append('profile', profile);
      fd.append('hashAlgorithm', hashAlgorithm);
      if (reason) fd.append('reason', reason);
      if (location) fd.append('location', location);
      if (contact) fd.append('contact', contact);
      if (signatureImage) {
        fd.append('signatureFieldConfig', JSON.stringify({ pageNumber: Number(page), coordinateX: Number(coordinateX), coordinateY: Number(coordinateY), width: Number(width), height: Number(height) }));
      }

      // O backend de exemplo assina, baixa os PDFs resultantes da SolidSign API
      // e devolve um único ZIP binário pronto (não um JSON com links) — mais
      // simples de consumir de um front-end do que reimplementar o download.
      const res = await fetch(BACKEND_URL, { method: 'POST', body: fd });

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        let msg = text;
        try { msg = JSON.parse(text)?.message || text; } catch { /* keep raw text */ }
        setError(msg || `Erro HTTP ${res.status}`);
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setResult({ url, count: documents.length });
    } catch (err) {
      setError(`Falha ao chamar o backend de exemplo em ${BACKEND_URL} — ele está rodando? (${err.message})`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h1>Assinar PDF — PKCS#12 (exemplo React)</h1>
      <p className="subtitle">
        Front-end de exemplo para o back-end <code>exemplo-integracao-pdf-pkcs12</code>.
        Certificado deve já estar importado na SolidSign API (endpoint
        <code>POST /solidsign/dsig/certificates/pkcs12/import</code>) — este exemplo
        só demonstra a etapa de assinatura.
      </p>

      <form onSubmit={submit} className="form">
        <fieldset>
          <legend>1. Conexão com a SolidSign API</legend>
          <label>Base URL da API
            <input value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} placeholder="https://www.solidsign.com.br" />
          </label>
          <label>Token de autorização (Bearer)
            <input value={authorization} onChange={(e) => setAuthorization(e.target.value)} placeholder="eyJhbGciOi..." />
          </label>
        </fieldset>

        <fieldset>
          <legend>2. Documento e certificado</legend>
          <label>Documento(s) PDF
            <input type="file" accept="application/pdf" multiple onChange={(e) => setDocuments(Array.from(e.target.files))} />
          </label>
          <label>pfxCode (id do certificado já importado)
            <input value={pfxCode} onChange={(e) => setPfxCode(e.target.value)} placeholder="a1b2c3d4-e5f6-7890-abcd-ef1234567890" />
          </label>
        </fieldset>

        <fieldset>
          <legend>3. Estampa visual (opcional)</legend>
          <label>Imagem da assinatura (PNG/JPG)
            <input type="file" accept="image/png,image/jpeg" onChange={(e) => setSignatureImage(e.target.files[0] || null)} />
          </label>
          {signatureImage && (
            <div className="grid4">
              <label>Página<input type="number" min="1" value={page} onChange={(e) => setPage(e.target.value)} /></label>
              <label>X (px)<input type="number" value={coordinateX} onChange={(e) => setCoordinateX(e.target.value)} /></label>
              <label>Y (px)<input type="number" value={coordinateY} onChange={(e) => setCoordinateY(e.target.value)} /></label>
              <label>Largura<input type="number" value={width} onChange={(e) => setWidth(e.target.value)} /></label>
              <label>Altura<input type="number" value={height} onChange={(e) => setHeight(e.target.value)} /></label>
            </div>
          )}
        </fieldset>

        <fieldset>
          <legend>4. Parâmetros de assinatura</legend>
          <label>Perfil
            <select value={profile} onChange={(e) => setProfile(e.target.value)}>
              {PROFILES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </label>
          <label>Algoritmo de hash
            <select value={hashAlgorithm} onChange={(e) => setHashAlgorithm(e.target.value)}>
              <option value="SHA256">SHA-256</option>
              <option value="SHA512">SHA-512</option>
            </select>
          </label>
          <label>Motivo (opcional)<input value={reason} onChange={(e) => setReason(e.target.value)} /></label>
          <label>Local (opcional)<input value={location} onChange={(e) => setLocation(e.target.value)} /></label>
          <label>Contato (opcional)<input value={contact} onChange={(e) => setContact(e.target.value)} /></label>
        </fieldset>

        <button type="submit" disabled={loading}>{loading ? 'Assinando…' : 'ASSINAR DOCUMENTOS'}</button>
      </form>

      {error && <div className="box error">{error}</div>}

      {result && (
        <div className="box success">
          <h3>Sucesso!</h3>
          <p>{result.count} documento(s) assinado(s).</p>
          <a href={result.url} download="signed_pdf.zip" className="download-btn">Baixar ZIP com o(s) PDF(s) assinado(s)</a>
        </div>
      )}
    </div>
  );
}
