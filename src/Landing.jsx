export default function Landing({ irPara }) {
  return (
    <div className="w">
      <div className="grid-bg" />
      <div className="glow" />
      <div className="landing-card">
        <div className="badge"><span className="badge-dot" />Agente de vagas com IA</div>
        <h1>Bem-vindo ao<br /><span>Vaga Finder</span></h1>
        <p className="desc">Plataforma inteligente que conecta candidatos e recrutadores usando IA.</p>
        <div className="divider" />
        <div className="landing-opcoes">
          <div className="landing-opcao" onClick={() => irPara("candidato")}>
            <div className="landing-opcao-icon">👤</div>
            <h3>Sou Candidato</h3>
            <p>Receba vagas relevantes pro seu perfil direto no email</p>
            <span className="landing-opcao-btn">Buscar vagas →</span>
          </div>
          <div className="landing-opcao" onClick={() => irPara("recrutador")}>
            <div className="landing-opcao-icon">🏢</div>
            <h3>Sou Recrutador</h3>
            <p>Encontre candidatos compatíveis com sua vaga em segundos</p>
            <span className="landing-opcao-btn">Buscar candidatos →</span>
          </div>
        </div>
        <p className="footer">Powered by n8n + OpenAI · Vagas atualizadas diariamente</p>
      </div>
    </div>
  );
}