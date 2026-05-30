import { useState, useRef, useEffect } from "react";
import "./styles.css";
import Recrutador from "./Recrutador";
import Landing from "./Landing";


const WEBHOOK_URL = "https://igcjr.app.n8n.cloud/webhook/e92117d7-05f2-4402-8808-7e261c25aca4";
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
  const [pagina, setPagina] = useState("landing");
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

  if (pagina === "landing") {
  return <Landing irPara={(p) => setPagina(p)} />;
}

  if (pagina === "recrutador") {
  return <Recrutador voltar={() => setPagina("candidato")} />;
} 

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
