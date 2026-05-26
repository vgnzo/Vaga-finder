import { useState, useRef, useEffect } from "react";
import "./styles.css";

const WEBHOOK_URL = "https://igcjr.app.n8n.cloud/webhook/e92117d7-05f2-4402-8808-7e261c25aca4";

const STACKS = [
  "Java", "Spring Boot", "Spring MVC", "Hibernate", "Maven",
  "JavaScript", "TypeScript", "Node.js", "Express", "NestJS",
  "React", "Next.js", "Vue.js", "Nuxt.js", "Angular",
  "Python", "Django", "Flask", "FastAPI",
  "Go", "Rust", "C", "C++", "C#", ".NET",
  "PHP", "Laravel", "Symfony",
  "Ruby", "Ruby on Rails",
  "Kotlin", "Swift", "Flutter", "React Native", "Dart",
  "PostgreSQL", "MySQL", "MongoDB", "Redis", "SQLite", "Oracle",
  "Docker", "Kubernetes", "AWS", "Azure", "GCP", "Terraform",
  "Git", "GitHub", "GitLab", "CI/CD", "Jenkins",
  "GraphQL", "REST API", "gRPC", "WebSockets",
  "Linux", "Bash", "Shell Script",
  "HTML", "CSS", "Tailwind", "Bootstrap", "SASS",
  "Elasticsearch", "RabbitMQ", "Kafka",
  "Figma", "UI/UX", "Scrum", "Agile"
];

export default function App() {
  const [form, setForm] = useState({ nome: "", email: "", nivel: "", localizacao: "" });
  const [selectedStacks, setSelectedStacks] = useState([]);
  const [stackSearch, setStackSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const dropdownRef = useRef(null);

  const filteredStacks = STACKS.filter(
    (s) => s.toLowerCase().includes(stackSearch.toLowerCase()) && !selectedStacks.includes(s)
  );

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
    setError(false);
  };

  const addStack = (stack) => {
    setSelectedStacks([...selectedStacks, stack]);
    setStackSearch("");
    setShowDropdown(false);
  };

  const removeStack = (stack) => {
    setSelectedStacks(selectedStacks.filter((s) => s !== stack));
  };

  const handleSubmit = async () => {
    const { nome, email, nivel, localizacao } = form;
    if (!nome || !email || !nivel || !localizacao || selectedStacks.length === 0) {
      setError(true);
      return;
    }
    setLoading(true);
    try {
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, stack: selectedStacks.join(", ") }),
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
                <label>Stack Principal</label>
                <div className="stack-wrapper" ref={dropdownRef}>
                  {selectedStacks.length > 0 && (
                    <div className="stack-tags">
                      {selectedStacks.map((s) => (
                        <span key={s} className="stack-tag">
                          {s}
                          <button onClick={() => removeStack(s)}>×</button>
                        </span>
                      ))}
                    </div>
                  )}
                  <input
                    type="text"
                    className="stack-input"
                    placeholder={selectedStacks.length === 0 ? "Busque e selecione suas tecnologias..." : "Adicionar mais..."}
                    value={stackSearch}
                    onChange={(e) => { setStackSearch(e.target.value); setShowDropdown(true); }}
                    onFocus={() => setShowDropdown(true)}
                  />
                  {showDropdown && filteredStacks.length > 0 && (
                    <div className="stack-dropdown">
                      {filteredStacks.slice(0, 8).map((s) => (
                        <div key={s} className="stack-option" onClick={() => addStack(s)}>
                          {s}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <button className="btn" onClick={handleSubmit} disabled={loading}>
              {loading ? "Analisando..." : "Buscar vagas relevantes →"}
            </button>
            {error && <p className="err">Preencha todos os campos e selecione ao menos uma tecnologia.</p>}
            <p className="footer">Powered by n8n + OpenAI · Vagas atualizadas diariamente</p>
          </div>
        ) : (
          <div className="success">
            <div className="success-icon">✓</div>
            <h3>Vagas a caminho!</h3>
            <p>Enviamos as mais relevantes para <strong>{form.email}</strong>.</p>
            <button className="btn" style={{marginTop: "1.5rem"}} onClick={() => { setSuccess(false); setSelectedStacks([]); setForm({ nome: "", email: "", nivel: "", localizacao: "" }); }}>
              Buscar novamente →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
