import { useState, useRef, useEffect } from "react";

const WEBHOOK_URL = "https://igcjr.app.n8n.cloud/webhook/f81f6aa5-edc2-4fde-9fad-034fa8740f2a";

const STACKS = [
  // Linguagens
  "Java", "JavaScript", "TypeScript", "Python", "Go", "Rust", "C", "C++", "C#", "Ruby", "PHP", "Kotlin", "Swift", "Dart", "Scala", "R", "MATLAB", "Perl", "Lua", "Elixir", "Haskell", "Clojure",

  // Backend
  "Spring Boot", "Spring MVC", "Hibernate", "Maven", "Gradle",
  "Node.js", "Express", "NestJS", "Fastify", "Hapi",
  "Django", "Flask", "FastAPI", "Celery",
  "Ruby on Rails", "Sinatra",
  "Laravel", "Symfony", "CodeIgniter",
  ".NET", "ASP.NET", "Entity Framework",
  "Gin", "Echo", "Fiber",
  "Phoenix", "Ecto",

  // Frontend
  "React", "Next.js", "Vue.js", "Nuxt.js", "Angular", "Svelte", "SvelteKit",
  "HTML", "CSS", "SASS", "LESS", "Tailwind", "Bootstrap", "Material UI", "Chakra UI", "Styled Components",
  "Redux", "Zustand", "Recoil", "MobX",
  "Webpack", "Vite", "Parcel", "Babel",

  // Mobile
  "React Native", "Flutter", "Ionic", "Xamarin", "SwiftUI", "Jetpack Compose", "Android", "iOS",

  // Banco de Dados
  "PostgreSQL", "MySQL", "SQLite", "Oracle", "SQL Server", "MariaDB",
  "MongoDB", "Redis", "Cassandra", "DynamoDB", "Firebase", "Firestore", "CouchDB", "Neo4j", "InfluxDB",
  "Elasticsearch", "Prisma", "TypeORM", "Sequelize",

  // DevOps / Infra
  "Docker", "Kubernetes", "Terraform", "Ansible", "Puppet", "Chef", "Vagrant",
  "Jenkins", "GitHub Actions", "GitLab CI", "CircleCI", "Travis CI",
  "Nginx", "Apache", "Caddy",
  "Linux", "Bash", "Shell Script", "PowerShell",

  // Cloud
  "AWS", "Azure", "GCP", "Firebase",
  "EC2", "S3", "Lambda", "RDS", "ECS", "EKS",
  "Azure Functions", "Azure DevOps",
  "Google Cloud Run", "BigQuery",
  "Vercel", "Netlify", "Heroku", "Railway", "Render",

  // APIs / Protocolos
  "REST API", "GraphQL", "gRPC", "WebSockets", "MQTT", "WebRTC",
  "OAuth", "JWT", "OpenAPI", "Swagger",
  "TCP/IP", "HTTP", "HTTPS", "DNS",

  // Mensageria
  "RabbitMQ", "Kafka", "ActiveMQ", "SQS", "PubSub",

  // Testes
  "Jest", "Vitest", "Cypress", "Playwright", "Selenium",
  "JUnit", "Mockito", "PyTest", "RSpec",
  "TDD", "BDD",

  // IA / ML
  "TensorFlow", "PyTorch", "Scikit-learn", "Keras", "OpenCV",
  "LangChain", "LlamaIndex", "Hugging Face", "OpenAI API",
  "Pandas", "NumPy", "Matplotlib", "Seaborn", "Spark", "Hadoop",
  "Power BI", "Tableau", "Looker",

  // Segurança
  "OWASP", "Pentesting", "Burp Suite", "Metasploit", "Wireshark",
  "Firewall", "VPN", "SIEM", "SOC",

  // Versionamento
  "Git", "GitHub", "GitLab", "Bitbucket",

  // Metodologias
  "Scrum", "Kanban", "Agile", "SAFe", "XP",

  // Design / UX
  "Figma", "Adobe XD", "Sketch", "Zeplin", "UI/UX",

  // Outros
  "Microservices", "Clean Architecture", "DDD", "SOLID", "Design Patterns",
  "n8n", "Zapier", "Make", "Power Automate"
];

const CIDADES = [
  "São Paulo, SP", "Campinas, SP", "Santos, SP", "São Bernardo do Campo, SP",
  "Santo André, SP", "Osasco, SP", "Ribeirão Preto, SP", "Sorocaba, SP",
  "Guarulhos, SP", "São José dos Campos, SP",
  "Rio de Janeiro, RJ", "Niterói, RJ", "Nova Iguaçu, RJ",
  "Belo Horizonte, MG", "Uberlândia, MG", "Contagem, MG", "Juiz de Fora, MG",
  "Curitiba, PR", "Londrina, PR", "Maringá, PR",
  "Porto Alegre, RS", "Caxias do Sul, RS", "Pelotas, RS",
  "Brasília, DF", "Salvador, BA", "Fortaleza, CE", "Manaus, AM",
  "Recife, PE", "Belém, PA", "Goiânia, GO", "São Luís, MA",
  "Maceió, AL", "Natal, RN", "Teresina, PI", "João Pessoa, PB",
  "Aracaju, SE", "Macapá, AP", "Porto Velho, RO", "Rio Branco, AC",
  "Boa Vista, RR", "Palmas, TO", "Cuiabá, MT", "Campo Grande, MS",
  "Vitória, ES", "Florianópolis, SC", "Joinville, SC", "Blumenau, SC",
  "Remoto"
];

export default function Recrutador({ voltar }) {
  const [form, setForm] = useState({ cargo: "", nivel: "" });
  const [selectedStacks, setSelectedStacks] = useState([]);
  const [stackSearch, setStackSearch] = useState("");
  const [showStackDropdown, setShowStackDropdown] = useState(false);
  const [locSearch, setLocSearch] = useState("");
  const [locSelected, setLocSelected] = useState("");
  const [showLocDropdown, setShowLocDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [candidatos, setCandidatos] = useState(null);
  const [semResultados, setSemResultados] = useState(false);

  const stackRef = useRef(null);
  const locRef = useRef(null);

  const filteredStacks = STACKS.filter(
    (s) => s.toLowerCase().includes(stackSearch.toLowerCase()) && !selectedStacks.includes(s)
  );

  const filteredCidades = locSearch.length > 0
    ? CIDADES.filter((c) => c.toLowerCase().includes(locSearch.toLowerCase())).slice(0, 8)
    : [];

  useEffect(() => {
    const handleClick = (e) => {
      if (stackRef.current && !stackRef.current.contains(e.target)) setShowStackDropdown(false);
      if (locRef.current && !locRef.current.contains(e.target)) setShowLocDropdown(false);
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
    setShowStackDropdown(false);
  };

  const removeStack = (stack) => setSelectedStacks(selectedStacks.filter((s) => s !== stack));

  const selectLocation = (loc) => {
    setLocSelected(loc);
    setLocSearch(loc);
    setShowLocDropdown(false);
  };

  const handleSubmit = async () => {
    const { cargo, nivel } = form;
    if (!cargo || !nivel || !locSelected || selectedStacks.length === 0) {
      setError(true);
      return;
    }
    setLoading(true);
    setCandidatos(null);
    setSemResultados(false);
    try {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cargo, nivel, localizacao: locSelected, stack: selectedStacks.join(", ") }),
      });
      const data = await res.json();
      if (data.mensagem) {
        setSemResultados(true);
      } else {
        setCandidatos(Array.isArray(data) ? data : [data]);
      }
    } catch (e) {
      setSemResultados(true);
    }
    setLoading(false);
  };

  return (
    <div className="w">
      <div className="grid-bg" />
      <div className="glow" />
      <div className="card">
        <div className="badge"><span className="badge-dot" />Busca de candidatos com IA</div>
        <h1>Encontre o candidato<br />ideal pra <span>sua vaga</span></h1>
        <p className="desc">Preencha o perfil da vaga e nossa IA analisa os candidatos cadastrados e retorna os mais compatíveis.</p>
        <div className="divider" />

        {!candidatos && !semResultados ? (
          <div>
            <div className="grid2">
              <div className="field full">
                <label htmlFor="cargo">Cargo</label>
                <input id="cargo" type="text" placeholder="Ex: Desenvolvedor Java Junior" value={form.cargo} onChange={handleChange} />
              </div>
              <div className="field">
                <label htmlFor="nivel">Nível</label>
                <select id="nivel" value={form.nivel} onChange={handleChange} className={form.nivel ? "has-value" : ""}>
                  <option value="" disabled>Selecione</option>
                  <option value="Estágio">Estágio</option>
                  <option value="Junior">Junior</option>
                  <option value="Pleno">Pleno</option>
                  <option value="Sênior">Sênior</option>
                </select>
              </div>
              <div className="field">
                <label>Localização</label>
                <div className="stack-wrapper" ref={locRef}>
                  <input
                    type="text"
                    className="stack-input"
                    placeholder="Digite a cidade..."
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
              <div className="field full">
                <label>Stack Exigida</label>
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
                    placeholder={selectedStacks.length === 0 ? "Busque e selecione tecnologias..." : "Adicionar mais..."}
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
              {loading ? "Analisando candidatos..." : "Buscar candidatos →"}
            </button>
            {error && <p className="err">Preencha todos os campos e selecione ao menos uma tecnologia.</p>}
            <p className="trocar-pagina" onClick={voltar}>← Sou candidato</p>
          </div>
        ) : semResultados ? (
          <div className="success">
            <div className="success-icon">✗</div>
            <h3>Nenhum candidato encontrado.</h3>
            <p>Não há candidatos compatíveis com essa vaga no momento.</p>
            <button className="btn" style={{marginTop: "1.5rem"}} onClick={() => { setSemResultados(false); setSelectedStacks([]); setLocSelected(""); setLocSearch(""); setForm({ cargo: "", nivel: "" }); }}>
              Buscar novamente →
            </button>
          </div>
        ) : (
          <div>
            <p style={{fontSize:"13px", color:"#635bff", marginBottom:"1rem"}}>
              {candidatos.length} candidato{candidatos.length !== 1 ? "s" : ""} encontrado{candidatos.length !== 1 ? "s" : ""}
            </p>
            {candidatos.map((c, i) => (
              <div key={i} className="candidato-card">
                <div className="candidato-header">
                  <div>
                    <p className="candidato-nome">{c.nome}</p>
                    <p className="candidato-email">{c.email}</p>
                  </div>
                  <div className="candidato-score">{c.score}<span>/10</span></div>
                </div>
                <p className="candidato-motivo">{c.motivo}</p>
              </div>
            ))}
            <button className="btn" style={{marginTop:"1.5rem"}} onClick={() => { setCandidatos(null); setSelectedStacks([]); setLocSelected(""); setLocSearch(""); setForm({ cargo: "", nivel: "" }); }}>
              Nova busca →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}