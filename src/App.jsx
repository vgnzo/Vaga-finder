import { useState } from "react";
import "./styles.css";

const WEBHOOK_URL = "https://igcjr.app.n8n.cloud/webhook/e92117d7-05f2-4402-8808-7e261c25aca4";

export default function App() {
  const [form, setForm] = useState({ nome: "", email: "", nivel: "", localizacao: "", stack: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
    setError(false);
  };

  const handleSubmit = async () => {
    const { nome, email, nivel, localizacao, stack } = form;
    if (!nome || !email || !nivel || !localizacao || !stack) { setError(true); return; }
    setLoading(true);
    try {
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } catch (e) {}
    setLoading(false);
    setSuccess(true);
  };

  return (
    <div className="w">
      <div className="grid-bg" />
      <div className="glow" />
      <div className="card">
        <div className="badge"><span className="badge-dot" />Agente de vagas com IA</div>
        <h1>Encontre vagas<br />feitas pra <span>você</span></h1>
        <p className="desc">Preencha seu perfil e nossa IA analisa as vagas e envia só as relevantes pro seu email.</p>
        <div className="divider" />
        {!success ? (
          <div>
            <div className="grid2">
              <div className="field">
                <label htmlFor="nome">Nome</label>
                <input id="nome" type="text" placeholder="Seu nome" value={form.nome} onChange={handleChange} />
              </div>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input id="email" type="email" placeholder="seu@email.com" value={form.email} onChange={handleChange} />
              </div>
              <div className="field">
                <label htmlFor="nivel">Nível</label>
                <select id="nivel" value={form.nivel} onChange={handleChange} className={form.nivel ? "has-value" : ""}>
                  <option value="" disabled>Selecione</option>
                  <option value="Estudante buscando primeiro estágio">Estágio</option>
                  <option value="Desenvolvedor junior com até 2 anos">Junior</option>
                  <option value="Desenvolvedor pleno com 2 a 5 anos">Pleno</option>
                  <option value="Desenvolvedor senior com mais de 5 anos">Sênior</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="localizacao">Localização</label>
                <input id="localizacao" type="text" placeholder="São Paulo, SP" value={form.localizacao} onChange={handleChange} />
              </div>
              <div className="field full">
                <label htmlFor="stack">Stack Principal</label>
                <textarea id="stack" placeholder="Ex: Java, Spring Boot, React, TypeScript, PostgreSQL..." value={form.stack} onChange={handleChange} />
              </div>
            </div>
            <button className="btn" onClick={handleSubmit} disabled={loading}>
              {loading ? "Analisando..." : "Buscar vagas relevantes →"}
            </button>
            {error && <p className="err">Preencha todos os campos antes de continuar.</p>}
            <p className="footer">Powered by n8n + OpenAI · Vagas atualizadas diariamente</p>
          </div>
        ) : (
          <div className="success">
            <div className="success-icon">✓</div>
            <h3>Vagas a caminho!</h3>
            <p>Enviamos as mais relevantes para <strong>{form.email}</strong>.</p>
          </div>
        )}
      </div>
    </div>
  );
}
