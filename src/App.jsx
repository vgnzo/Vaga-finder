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

const CIDADES = [
  "São Paulo, SP", "Campinas, SP", "Santos, SP", "São Bernardo do Campo, SP",
  "Santo André, SP", "Osasco, SP", "Ribeirão Preto, SP", "Sorocaba, SP",
  "Mauá, SP", "São José dos Campos, SP", "Guarulhos, SP", "Mogi das Cruzes, SP",
  "Rio de Janeiro, RJ", "Niterói, RJ", "Petrópolis, RJ", "Nova Iguaçu, RJ",
  "Belo Horizonte, MG", "Uberlândia, MG", "Contagem, MG", "Juiz de Fora, MG",
  "Curitiba, PR", "Londrina, PR", "Maringá, PR", "Ponta Grossa, PR",
  "Porto Alegre, RS", "Caxias do Sul, RS", "Pelotas, RS", "Santa Maria, RS",
  "Brasília, DF",
  "Salvador, BA", "Feira de Santana, BA", "Vitória da Conquista, BA",
  "Fortaleza, CE", "Caucaia, CE", "Juazeiro do Norte, CE",
  "Manaus, AM", "Recife, PE", "Caruaru, PE", "Olinda, PE",
  "Belém, PA", "Ananindeua, PA", "Santarém, PA",
  "Goiânia, GO", "Aparecida de Goiânia, GO", "Anápolis, GO",
  "São Luís, MA", "Imperatriz, MA",
  "Maceió, AL", "Arapiraca, AL",
  "Natal, RN", "Mossoró, RN",
  "Teresina, PI", "Parnaíba, PI",
  "João Pessoa, PB", "Campina Grande, PB",
  "Aracaju, SE", "Feira Nova, SE",
  "Macapá, AP", "Porto Velho, RO", "Rio Branco, AC",
  "Boa Vista, RR", "Palmas, TO", "Cuiabá, MT", "Campo Grande, MS",
  "Vitória, ES", "Vila Velha, ES", "Serra, ES", "Cariacica, ES",
  "Florianópolis, SC", "Joinville, SC", "Blumenau, SC",
  "Remoto"
];


export default function App() {
  const [form, setForm] = useState({ nome: "", email: "", nivel: "" });
  const [selectedStacks, setSelectedStacks] = useState([]);
  const [stackSearch, setStackSearch] = useState("");
  const [showStackDropdown, setShowStackDropdown] = useState(false);

  const [locSearch, setLocSearch] = useState("");
  const [locSelected, setLocSelected] = useState("");
  const [showLocDropdown, setShowLocDropdown] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const stackRef = useRef(null);
  const locRef = useRef(null);

  const filteredStacks = STACKS.filter(
    (s) => s.toLowerCase().includes(stackSearch.toLowerCase()) && !selectedStacks.includes(s)
  );

  useEffect(() => {
    const handleClick = (e) => {
      if (stackRef.current && !stackRef.current.contains(e.target)) setShowStackDropdown(false);
      if (locRef.current && !locRef.current.contains(e.target)) setShowLocDropdown(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filteredCidades = locSearch.length > 0
    ? CIDADES.filter((c) => c.toLowerCase().includes(locSearch.toLowerCase())).slice(0, 8)
    : [];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
    setError(false);
  };

  const addStack = (stack) => {
    setSelectedStacks([...selectedStacks, stack]);
    setStackSearch("");
    setShowStackDropdown(false);
  };

  const removeStack = (stack) => setSelectedStacks(selectedStacks.filter((s) => s !== stack));

  const selectLocation = (loc) => {
    setLocSelected(loc);
    setLocSearch(loc);
    setShowLocDropdown(false);
  };

  const handleSubmit = async () => {
    const { nome, email, nivel } = form;
    if (!nome || !email || !nivel || !locSelected || selectedStacks.length === 0) {
      setError(true);
      return;
    }
    setLoading(true);
    try {
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, nome: nome.toLowerCase().split(" ").map((w,i) => i>0 && ["de","da","do","das","dos","e"].includes(w) ? w : w.charAt(0).toUpperCase()+w.slice(1)).join(" "), localizacao: locSelected, stack: selectedStacks.join(", ") }),
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

              {/* Localização com autocomplete */}
              <div className="field">
                <label>Localização</label>
                <div className="stack-wrapper" ref={locRef}>
                  <input
                    type="text"
                    className="stack-input"
                    placeholder="Digite sua cidade..."
                    value={locSearch}
                    onChange={(e) => { setLocSearch(e.target.value); setLocSelected(""); setShowLocDropdown(true); }}
                    onFocus={() => setShowLocDropdown(true)}
                  />
                  {showLocDropdown && filteredCidades.length > 0 && (
                    <div className="stack-dropdown">
                      {filteredCidades.map((loc) => (
                        <div key={loc} className="stack-option" onClick={() => selectLocation(loc)}>{loc}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Stack com tags */}
              <div className="field full">
                <label>Stack Principal</label>
                <div className="stack-wrapper" ref={stackRef}>
                  {selectedStacks.length > 0 && (
                    <div className="stack-tags">
                      {selectedStacks.map((s) => (
                        <span key={s} className="stack-tag">
                          {s}<button onClick={() => removeStack(s)}>×</button>
                        </span>
                      ))}
                    </div>
                  )}
                  <input
                    type="text"
                    className="stack-input"
                    placeholder={selectedStacks.length === 0 ? "Busque e selecione suas tecnologias..." : "Adicionar mais..."}
                    value={stackSearch}
                    onChange={(e) => { setStackSearch(e.target.value); setShowStackDropdown(true); }}
                    onFocus={() => setShowStackDropdown(true)}
                  />
                  {showStackDropdown && filteredStacks.length > 0 && (
                    <div className="stack-dropdown">
                      {filteredStacks.slice(0, 8).map((s) => (
                        <div key={s} className="stack-option" onClick={() => addStack(s)}>{s}</div>
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
            <button className="btn" style={{marginTop: "1.5rem"}} onClick={() => { setSuccess(false); setSelectedStacks([]); setLocSelected(""); setLocSearch(""); setForm({ nome: "", email: "", nivel: "" }); }}>
              Buscar novamente →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
