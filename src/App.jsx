import React, { useState } from 'react';

// ============================================================
//  ERETec Portal — App.jsx
//  Paleta: Azul escuro #1a1a6e + Verde neon #c8f500
//
//  BUGS PRESERVADOS (Tipos de Teste e Questionário):
//  [BUG-01] Teste de Integração tem Lorem Ipsum como descrição
//  [BUG-02] "Ver Descrição" de Unidade redireciona p/ Questionário
//  [BUG-03] "Ver Descrição" de Aceitação mostra texto de Regressão
//  [BUG-04] Login com senha fora do limite (8-16) ainda entra
//  [BUG-05] Cadastro retorna erro/sucesso aleatório (Math.random)
//  [BUG-06] Score do Formulário é aleatório, ignora respostas reais
//  [BUG-07] Contador de erros é global (Relacionar + Questionário somam)
//  [BUG-08] "Sistema bloqueado" não bloqueia de verdade
//
//  BUGS NOVOS (Cronograma):
//  [BUG-C1] Horário da keynote de abertura está errado (09:00 mas aparece 00:00)
//  [BUG-C2] Vagas da palestra "Acessibilidade Web" exibe número negativo (-3)
//  [BUG-C3] Filtro "Oficinas" nunca retorna resultados (usa 'workshop' ≠ 'oficina')
//  [BUG-C4] Busca é case-sensitive — "react" não encontra "React"
//  [BUG-C5] Card de "Microsserviços" mostra sala errada (Lab 01 em vez de Sala 02)
// ============================================================

const NAVY   = '#12126e';
const NEON   = '#c8f500';
const DARK   = '#0d0d3a';
const DARKER = '#08082a';
const CARD   = '#16165a';
const BORDER = '#2a2a7a';
const MUTED  = '#8888bb';
const WHITE  = '#e8e8f0';

// ── Logo SVG fiel à marca ERETec ──────────────────────────────
const EretecLogo = ({ size = 48 }) => (
  /*
   * Recriação fiel da logo ERETec:
   *  - Forma esquerda: chevron > com vértice em losango (recuo oco na ponta)
   *    Linha superior: parte do topo-esquerdo, desce até o losango, sobe até o vértice direito
   *    Linha inferior: espelho da superior
   *    O losango é o espaço vazio entre as duas linhas na ponta
   *  - Forma direita: chevron > simples, menor, deslocado para direita e levemente para baixo
   *  - Traços grossos arredondados, verde neon #c8f500
   */
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Forma esquerda — chevron com vértice em losango
        A ponta tem um recuo: as linhas se afastam, formam o losango e voltam ao centro */}
    <path
      d="M18,20 L42,46 L36,52 L42,58 L18,84"
      stroke={NEON} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" fill="none"
    />
    {/* Linha superior esquerda fecha o losango pelo vértice direito */}
    <path
      d="M42,46 L52,52 L42,58"
      stroke={NEON} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" fill="none"
    />
    {/* Forma direita — chevron simples, deslocado ~16px para direita e 4px para baixo */}
    <path
      d="M58,24 L82,52 L58,80"
      stroke={NEON} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" fill="none"
    />
  </svg>
);

// ── Dados das palestras (Cronograma) ─────────────────────────
const palestras = [
  {
    id: 1, tipo: 'keynote',
    titulo: 'IA Generativa: O Fim da Programação?',
    palestrante: 'Dra. Fernanda Quirino', bio: 'Pesquisadora em IA · UERN',
    // [BUG-C1] horário deveria ser '09:00 - 10:00' mas está '00:00 - 10:00'
    horario: '00:00 - 10:00',
    sala: 'Auditório Principal', dia: 1, vagas: 200, inscritos: 187,
    desc: 'Vivemos uma revolução silenciosa. A IA generativa já escreve código, gera testes e refatora sistemas. Mas o programador será substituído?'
  },
  {
    id: 2, tipo: 'palestra',
    titulo: 'Arquitetura de Microsserviços na Prática',
    palestrante: 'Rafael Amorim', bio: 'Engenheiro de Software · Totvs',
    horario: '10:30 - 11:30',
    // [BUG-C5] sala deveria ser 'Sala 02', mas está 'Lab 01'
    sala: 'Lab 01',
    dia: 1, vagas: 60, inscritos: 60,
    desc: 'Quando usar microsserviços e quando evitar? Casos reais de arquitetura com aprendizados de quem já implementou sistemas críticos.'
  },
  {
    id: 3, tipo: 'oficina',
    titulo: 'React do Zero ao Deploy',
    palestrante: 'Camila Torres', bio: 'Desenvolvedora Front-end · Freelancer',
    horario: '13:00 - 17:00', sala: 'Lab 01', dia: 1, vagas: 30, inscritos: 28,
    desc: 'Workshop intensivo de React: componentização, hooks, Zustand e deploy na Vercel com GitHub Actions.'
  },
  {
    id: 4, tipo: 'palestra',
    titulo: 'Segurança Ofensiva: Pentest para Iniciantes',
    palestrante: 'Marcos Vinicius Leite', bio: 'Pentester · BugBounty Hall of Fame',
    horario: '14:00 - 15:00', sala: 'Sala 03', dia: 1, vagas: 80, inscritos: 74,
    desc: 'Como os hackers pensam? SQLi, XSS, IDOR e como se defender. Demo ao vivo em ambiente isolado.'
  },
  {
    id: 5, tipo: 'oficina',
    titulo: 'Python para Análise de Dados',
    palestrante: 'Profa. Ana Beatriz Costa', bio: 'Docente · IFRN Mossoró',
    horario: '08:00 - 12:00', sala: 'Lab 02', dia: 2, vagas: 25, inscritos: 25,
    desc: 'Pandas, Matplotlib, Seaborn e Scikit-learn para machine learning básico. Traga seu laptop com Anaconda.'
  },
  {
    id: 6, tipo: 'palestra',
    titulo: 'DevOps & CI/CD: Do Commit ao Prod',
    palestrante: 'Lucas Fernandes', bio: 'SRE · Stone Pagamentos',
    horario: '09:30 - 10:30', sala: 'Auditório Principal', dia: 2, vagas: 200, inscritos: 130,
    desc: 'Pipeline de CI/CD, Docker, Kubernetes, blue-green e canary deploy. O que é SRE na prática.'
  },
  {
    id: 7, tipo: 'palestra',
    titulo: 'Acessibilidade Web não é opcional',
    palestrante: 'Juliana Meireles', bio: 'UX Engineer · Governo Federal',
    horario: '11:00 - 12:00', sala: 'Sala 01', dia: 2,
    vagas: 50,
    // [BUG-C2] inscritos > vagas → vagas disponíveis aparecem como número negativo
    inscritos: 53,
    desc: 'WCAG 2.1, ferramentas de auditoria e como retrofitar acessibilidade em sistemas legados.'
  },
  {
    id: 8, tipo: 'keynote',
    titulo: 'Closing: Comunidade, Código & Conexão',
    palestrante: 'Comitê ERETec 2024', bio: 'Organização do Evento',
    horario: '17:00 - 18:00', sala: 'Auditório Principal', dia: 2, vagas: 300, inscritos: 220,
    desc: 'Encerramento oficial. Premiações da maratona de programação e revelação da data do ERETec 2025!'
  },
];

// ── Componente principal ──────────────────────────────────────
export default function App() {
  const [isLoggedIn, setIsLoggedIn]   = useState(false);
  const [isLoginTab, setIsLoginTab]   = useState(true);
  // activeTab: 'cronograma' | 'dashboard' | 'forms'
  const [activeTab, setActiveTab]     = useState('cronograma');
  const [selectedContent, setSelectedContent] = useState(null);
  const [errorCount, setErrorCount]   = useState(0);
  const [formData, setFormData]       = useState({ email: '', pass: '' });
  const [modal, setModal]             = useState({ show: false, msg: '', type: '' });
  const [scoreForms, setScoreForms]   = useState(null);

  // Cronograma state
  const [searchQ, setSearchQ]         = useState('');
  const [filterTipo, setFilterTipo]   = useState('todos');
  const [selectedCard, setSelectedCard] = useState(null);

  // ── Dados tipos de teste (bugs originais preservados) ──────
  const tiposDeTeste = [
    { id: 'unidade',    nome: 'Teste de Unidade',    desc: 'Verifica a menor unidade de código isoladamente.' },
    // [BUG-01] descrição Lorem Ipsum proposital
    { id: 'integracao', nome: 'Teste de Integração', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { id: 'regressao',  nome: 'Teste de Regressão',  desc: 'Garante que novas alterações não quebraram o que já funcionava.' },
    { id: 'aceitacao',  nome: 'Teste de Aceitação',  desc: 'Validação final pelo usuário para entrega do produto.' },
    { id: 'validacao',  nome: 'Teste de Validação',  desc: 'Verifica se o sistema atende aos requisitos de negócio (Aceitação).' }
  ];

  // ── Auth ───────────────────────────────────────────────────
  const showFeedback = (msg, type) => {
    setModal({ show: true, msg, type });
    setTimeout(() => setModal({ show: false, msg: '', type: '' }), 2500);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveTab('cronograma');
    setSelectedContent(null);
    setErrorCount(0);
    setScoreForms(null);
    setFormData({ email: '', pass: '' });
    setSelectedCard(null);
    setSearchQ('');
    setFilterTipo('todos');
  };

  const handleAuth = () => {
    const emailValid = formData.email.includes('@gmail');
    const passLen    = formData.pass.length;
    if (!emailValid) { showFeedback('Erro: O sistema exige um e-mail válido.', 'error'); return; }
    if (isLoginTab) {
      // [BUG-04] avisa mas não bloqueia
      if (passLen < 8 || passLen > 16) showFeedback('Aviso: Senha fora do limite (8-16).', 'error');
      setIsLoggedIn(true);
    } else {
      // [BUG-05] resultado aleatório
      if (Math.random() > 0.5) showFeedback('Erro: Esta senha já existe no sistema!', 'error');
      else { showFeedback('Cadastro realizado com sucesso!', 'success'); setIsLoginTab(true); }
    }
  };

  // [BUG-02] + [BUG-03]
  const handleReadMore = (id) => {
    if (id === 'unidade') { setActiveTab('forms'); return; } // [BUG-02]
    if (id === 'aceitacao') { // [BUG-03]
      setSelectedContent({ nome: 'Teste de Aceitação', texto: 'O Teste de Regressão garante que novas versões não introduziram falhas em funcionalidades que já estavam operacionais.' });
      return;
    }
    const item = tiposDeTeste.find(t => t.id === id);
    setSelectedContent({ nome: item.nome, texto: item.desc });
  };

  // ── Cronograma helpers ─────────────────────────────────────
  const filteredPalestras = palestras.filter(p => {
    // [BUG-C3] filtro usa 'workshop' mas tipo é 'oficina' → nunca bate
    const tipoOk = filterTipo === 'todos' || p.tipo === filterTipo;
    // [BUG-C4] sem .toLowerCase() — busca case-sensitive
    const searchOk = searchQ === '' || p.titulo.includes(searchQ) || p.palestrante.includes(searchQ);
    return tipoOk && searchOk;
  });

  const badgeColor = (tipo) => {
    if (tipo === 'keynote') return { bg: 'rgba(255,101,132,0.18)', color: '#ff6584', label: 'KEYNOTE' };
    if (tipo === 'oficina') return { bg: 'rgba(200,245,0,0.15)',   color: NEON,      label: 'OFICINA'  };
    return                         { bg: 'rgba(108,99,255,0.2)',   color: '#a89aff', label: 'PALESTRA' };
  };

  // ── LOGIN SCREEN ────────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <div style={{minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
        background:`linear-gradient(135deg, ${DARKER} 0%, ${NAVY} 100%)`, padding:'1rem', fontFamily:'sans-serif', position:'relative', overflow:'hidden'}}>

        {/* blobs decorativos */}
        <div style={{position:'absolute',top:'10%',left:'5%',width:300,height:300,borderRadius:'50%',
          background:`radial-gradient(circle, ${NEON}18, transparent)`, pointerEvents:'none'}}/>
        <div style={{position:'absolute',bottom:'10%',right:'5%',width:400,height:400,borderRadius:'50%',
          background:`radial-gradient(circle, #6c63ff18, transparent)`, pointerEvents:'none'}}/>

        {modal.show && (
          <div style={{position:'fixed',top:32,left:0,right:0,display:'flex',justifyContent:'center',zIndex:99}}>
            <div style={{padding:'12px 24px',borderRadius:12,fontWeight:700,fontSize:14,
              background: modal.type==='success'?'#1a3a1a':'#3a1a1a',
              border:`2px solid ${modal.type==='success'?'#43e97b':'#ff6584'}`,
              color: modal.type==='success'?'#43e97b':'#ff6584'}}>
              {modal.msg}
            </div>
          </div>
        )}

        <div style={{width:'100%',maxWidth:440,background:'rgba(255,255,255,0.04)',
          border:`1px solid ${BORDER}`, borderRadius:24, padding:'2.5rem',
          backdropFilter:'blur(16px)'}}>

          {/* Logo */}
          <div style={{textAlign:'center',marginBottom:'1.5rem'}}>
            <div style={{display:'inline-flex',alignItems:'center',justifyContent:'center',
              background:NAVY, borderRadius:20, padding:16,
              border:`2px solid ${NEON}30`, marginBottom:12}}>
              <EretecLogo size={56} />
            </div>
            <div style={{fontSize:28,fontWeight:900,letterSpacing:'-0.03em',lineHeight:1}}>
              <span style={{color:WHITE}}>eretec</span>
            </div>
            <div style={{fontSize:11,fontWeight:700,letterSpacing:'0.14em',color:MUTED,
              textTransform:'uppercase',marginTop:4}}>
              Encontro Regional de Tecnologia
            </div>
            <div style={{height:2,width:48,background:`linear-gradient(90deg,${NAVY},${NEON},${NAVY})`,
              margin:'10px auto 0', borderRadius:2}}/>
          </div>

          <h2 style={{fontSize:20,fontWeight:800,color:WHITE,textAlign:'center',marginBottom:'1.5rem'}}>
            {isLoginTab ? 'Portal do Participante' : 'Criar Conta'}
          </h2>

          <div style={{marginBottom:14}}>
            <input type="email" placeholder="E-mail (@gmail)"
              style={{width:'100%',padding:'14px 16px',borderRadius:12,outline:'none',fontWeight:600,
                background:'rgba(255,255,255,0.06)',border:`1.5px solid ${BORDER}`,color:WHITE,
                fontSize:15,boxSizing:'border-box'}}
              onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>

          <div style={{marginBottom:20,position:'relative'}}>
            <input type="password" placeholder="Senha"
              style={{width:'100%',padding:'14px 72px 14px 16px',borderRadius:12,outline:'none',fontWeight:600,
                background:'rgba(255,255,255,0.06)',border:`1.5px solid ${BORDER}`,color:WHITE,
                fontSize:15,boxSizing:'border-box'}}
              onChange={e => setFormData({...formData, pass: e.target.value})} />
            <span style={{position:'absolute',right:14,top:16,fontSize:10,fontWeight:800,
              color: formData.pass.length > 8 ? '#ff6584' : MUTED}}>
              {formData.pass.length}/8-16
            </span>
          </div>

          <button onClick={handleAuth}
            style={{width:'100%',padding:'14px',borderRadius:12,border:'none',fontWeight:900,
              fontSize:15,cursor:'pointer',letterSpacing:'0.1em',textTransform:'uppercase',
              background:`linear-gradient(135deg, ${NEON}, #a0c000)`, color:DARK,
              transition:'opacity .2s'}}>
            {isLoginTab ? 'Acessar' : 'Cadastrar'}
          </button>

          <div style={{marginTop:20,paddingTop:16,borderTop:`1px solid ${BORDER}`,textAlign:'center'}}>
            <span style={{fontSize:13,color:MUTED}}>
              {isLoginTab ? 'Não tem conta? ' : 'Já tem conta? '}
            </span>
            <button onClick={() => setIsLoginTab(!isLoginTab)}
              style={{background:'none',border:'none',fontWeight:700,fontSize:13,cursor:'pointer',color:NEON}}>
              {isLoginTab ? 'Cadastre-se' : 'Faça Login'}
            </button>
          </div>

          <p style={{marginTop:16,textAlign:'center',fontSize:11,color:'#3a3a6a'}}>
            ERETec 2024 · 14 e 15/11 · UERN, Mossoró-RN
          </p>
        </div>
      </div>
    );
  }

  // ── TELA PRINCIPAL (pós-login) ─────────────────────────────
  return (
    <div style={{minHeight:'100vh',background:DARKER,fontFamily:'sans-serif',color:WHITE,display:'flex',flexDirection:'column'}}>

      {/* Modal feedback */}
      {modal.show && (
        <div style={{position:'fixed',inset:0,display:'flex',alignItems:'center',justifyContent:'center',zIndex:99,backdropFilter:'blur(2px)'}}>
          <div style={{padding:'20px 32px',borderRadius:16,fontWeight:800,fontSize:18,textAlign:'center',
            background: modal.type==='success'?'#0d2a0d':'#2a0d0d',
            border:`2px solid ${modal.type==='success'?'#43e97b':'#ff6584'}`,
            color: modal.type==='success'?'#43e97b':'#ff6584'}}>
            {modal.msg}
          </div>
        </div>
      )}

      {/* ── NAVBAR HORIZONTAL ─────────────────────────────── */}
      <nav style={{background:DARK, borderBottom:`1px solid ${BORDER}`,
        position:'sticky',top:0,zIndex:100,padding:'0 2rem',
        display:'flex',alignItems:'center',justifyContent:'space-between',height:56}}>

        {/* Logo no nav */}
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={{background:NAVY,borderRadius:10,padding:'4px 6px',border:`1px solid ${NEON}40`}}>
            <EretecLogo size={26}/>
          </div>
          <span style={{fontWeight:900,fontSize:18,letterSpacing:'-0.02em',color:WHITE}}>
            eretec
          </span>
        </div>

        {/* Links de navegação */}
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          {[
            { key:'cronograma', label:'Cronograma' },
            { key:'dashboard',  label:'Tipos de Teste' },
            { key:'forms',      label:'Questionário' },
          ].map(({key, label}) => (
            <button key={key} onClick={() => { setActiveTab(key); setSelectedContent(null); setSelectedCard(null); }}
              style={{padding:'6px 16px',borderRadius:8,border:'none',fontWeight:700,fontSize:13,cursor:'pointer',
                background: activeTab===key ? `${NEON}22` : 'transparent',
                color: activeTab===key ? NEON : MUTED,
                borderBottom: activeTab===key ? `2px solid ${NEON}` : '2px solid transparent',
                transition:'all .2s'}}>
              {label}
            </button>
          ))}
        </div>

        {/* Usuário + logout */}
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <div style={{display:'flex',alignItems:'center',gap:8,
            background:`${NAVY}88`,border:`1px solid ${BORDER}`,borderRadius:999,padding:'4px 14px 4px 4px'}}>
            <div style={{width:30,height:30,borderRadius:'50%',background:`linear-gradient(135deg,${NEON},#6c63ff)`,
              display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:11,color:DARK}}>
              AP
            </div>
            <span style={{fontSize:13,fontWeight:700,color:WHITE}}>Aluno</span>
          </div>
          <button onClick={handleLogout}
            style={{background:'none',border:`1px solid #ff658455`,color:'#ff6584',
              padding:'6px 14px',borderRadius:8,fontWeight:700,fontSize:12,cursor:'pointer'}}>
            Sair
          </button>
        </div>
      </nav>

      {/* ── CONTEÚDO PRINCIPAL ─────────────────────────────── */}
      <main style={{flex:1,padding:'2rem',maxWidth:1200,width:'100%',margin:'0 auto',boxSizing:'border-box'}}>

        {/* ══ CRONOGRAMA ══════════════════════════════════════ */}
        {activeTab === 'cronograma' && !selectedCard && (
          <div>
            <div style={{marginBottom:'1.5rem'}}>
              <p style={{fontSize:11,fontWeight:700,letterSpacing:'0.15em',color:NEON,
                textTransform:'uppercase',display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
                <span style={{width:24,height:2,background:NEON,display:'inline-block'}}/>
                Programação Oficial
              </p>
              <h1 style={{fontSize:36,fontWeight:900,letterSpacing:'-0.03em',margin:0}}>
                Palestras &amp; Oficinas
              </h1>
              <p style={{fontSize:13,color:MUTED,fontFamily:'monospace',marginTop:4}}>
                14 e 15 de novembro · UERN, Mossoró-RN
              </p>
            </div>

            {/* Busca — [BUG-C4] sem toLowerCase */}
            <input
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              placeholder="Buscar palestras, oficinas, palestrantes..."
              style={{width:'100%',padding:'14px 16px',borderRadius:12,border:`1px solid ${BORDER}`,
                background:CARD,color:WHITE,fontSize:15,outline:'none',marginBottom:16,
                boxSizing:'border-box',fontFamily:'sans-serif'}}
            />

            {/* Filtros — [BUG-C3] 'workshop' ≠ 'oficina' */}
            <div style={{display:'flex',gap:10,marginBottom:24,flexWrap:'wrap'}}>
              {[
                {val:'todos',   label:'Todos'},
                {val:'palestra',label:'Palestras'},
                {val:'workshop',label:'Oficinas'},   // [BUG-C3]
                {val:'keynote', label:'Keynotes'},
              ].map(f => (
                <button key={f.val} onClick={() => setFilterTipo(f.val)}
                  style={{padding:'5px 16px',borderRadius:999,fontWeight:700,fontSize:12,cursor:'pointer',
                    fontFamily:'monospace',border:`1px solid ${filterTipo===f.val ? NEON : BORDER}`,
                    background: filterTipo===f.val ? `${NEON}18` : 'transparent',
                    color: filterTipo===f.val ? NEON : MUTED}}>
                  {f.label}
                </button>
              ))}
            </div>

            {/* Cards grid */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:20}}>
              {filteredPalestras.length === 0 && (
                <div style={{gridColumn:'1/-1',textAlign:'center',padding:'3rem',color:MUTED,fontFamily:'monospace'}}>
                  🔍 Nenhum resultado encontrado
                </div>
              )}
              {filteredPalestras.map(p => {
                const badge   = badgeColor(p.tipo);
                // [BUG-C2] pode ser negativo
                const vagasDisp = p.vagas - p.inscritos;
                return (
                  <div key={p.id} onClick={() => setSelectedCard(p)}
                    style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:16,
                      padding:'1.5rem',cursor:'pointer',transition:'border-color .2s, transform .2s',
                      display:'flex',flexDirection:'column',justifyContent:'space-between',position:'relative',overflow:'hidden'}}
                    onMouseEnter={e => { e.currentTarget.style.borderColor=NEON; e.currentTarget.style.transform='translateY(-2px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor=BORDER; e.currentTarget.style.transform='translateY(0)'; }}>

                    {/* acento de fundo */}
                    <div style={{position:'absolute',top:-20,right:-20,width:80,height:80,borderRadius:'50%',
                      background:badge.color,opacity:0.06,pointerEvents:'none'}}/>

                    <div>
                      <span style={{display:'inline-block',padding:'2px 10px',borderRadius:999,fontSize:10,
                        fontWeight:800,letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:10,
                        background:badge.bg, color:badge.color}}>
                        {badge.label}
                      </span>
                      <div style={{fontWeight:800,fontSize:16,lineHeight:1.3,marginBottom:8}}>{p.titulo}</div>
                      <div style={{fontSize:12,color:MUTED,fontFamily:'monospace'}}>↳ {p.palestrante}</div>
                      {/* [BUG-C2] número negativo */}
                      <div style={{fontSize:12,marginTop:8,
                        color: vagasDisp <= 0 ? '#ff6584' : MUTED}}>
                        {vagasDisp <= 0 ? `Esgotado (${vagasDisp} vagas)` : `${vagasDisp} vagas disponíveis`}
                      </div>
                    </div>

                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',
                      marginTop:16,paddingTop:12,borderTop:`1px solid ${BORDER}`}}>
                      <span style={{fontSize:11,color:MUTED,fontFamily:'monospace'}}>
                        {p.horario} · Dia {p.dia}
                      </span>
                      <span style={{fontSize:11,color:NEON,background:`${NEON}15`,
                        padding:'2px 8px',borderRadius:4,fontFamily:'monospace'}}>
                        {p.sala}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Detalhe de palestra selecionada ──────────────── */}
        {activeTab === 'cronograma' && selectedCard && (() => {
          const p = selectedCard;
          const badge = badgeColor(p.tipo);
          const vagasDisp = p.vagas - p.inscritos;
          return (
            <div style={{maxWidth:720,margin:'0 auto'}}>
              <button onClick={() => setSelectedCard(null)}
                style={{background:'none',border:'none',color:MUTED,fontFamily:'monospace',
                  fontSize:13,cursor:'pointer',marginBottom:24,display:'flex',alignItems:'center',gap:6}}>
                ← Voltar à programação
              </button>
              <span style={{display:'inline-block',padding:'3px 12px',borderRadius:999,fontSize:11,
                fontWeight:800,letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:12,
                background:badge.bg,color:badge.color}}>
                {badge.label}
              </span>
              <h1 style={{fontSize:32,fontWeight:900,lineHeight:1.1,marginBottom:16}}>{p.titulo}</h1>
              <div style={{display:'flex',alignItems:'center',gap:12,background:CARD,
                border:`1px solid ${BORDER}`,borderRadius:12,padding:'12px 16px',marginBottom:20}}>
                <div style={{width:44,height:44,borderRadius:'50%',background:`${NEON}22`,
                  display:'flex',alignItems:'center',justifyContent:'center',
                  fontWeight:800,color:NEON,fontSize:14,flexShrink:0}}>
                  {p.palestrante.split(' ').map(w=>w[0]).slice(0,2).join('')}
                </div>
                <div>
                  <div style={{fontWeight:700}}>{p.palestrante}</div>
                  <div style={{fontSize:12,color:MUTED,fontFamily:'monospace'}}>{p.bio}</div>
                </div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:20}}>
                {[
                  {label:'Horário', val:p.horario},
                  {label:'Local',   val:p.sala},
                  {label:'Dia',     val: p.dia===1?'14/11 — Dia 1':'15/11 — Dia 2'},
                  {label:'Vagas',   val: vagasDisp<=0?`Esgotado (${vagasDisp})`:`${vagasDisp} de ${p.vagas}`, danger: vagasDisp<=0},
                ].map(m => (
                  <div key={m.label} style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:10,padding:'12px 16px'}}>
                    <div style={{fontSize:10,fontFamily:'monospace',textTransform:'uppercase',
                      letterSpacing:'0.1em',color:MUTED,marginBottom:4}}>{m.label}</div>
                    <div style={{fontWeight:800,color:m.danger?'#ff6584':WHITE}}>{m.val}</div>
                  </div>
                ))}
              </div>
              <p style={{lineHeight:1.7,color:'#c0c0d0',fontSize:15,marginBottom:24}}>{p.desc}</p>
              <button style={{padding:'12px 28px',borderRadius:10,border:'none',fontWeight:800,
                background:`linear-gradient(135deg,${NEON},#a0c000)`,color:DARK,cursor:'pointer',fontSize:15}}>
                + Inscrever-se
              </button>
            </div>
          );
        })()}

        {/* ══ TIPOS DE TESTE ══════════════════════════════════ */}
        {activeTab === 'dashboard' && (
          <div>
            <div style={{marginBottom:'1.5rem'}}>
              <p style={{fontSize:11,fontWeight:700,letterSpacing:'0.15em',color:NEON,
                textTransform:'uppercase',display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
                <span style={{width:24,height:2,background:NEON,display:'inline-block'}}/>
                Conteúdo do Minicurso
              </p>
              <h1 style={{fontSize:36,fontWeight:900,letterSpacing:'-0.03em',margin:0}}>Definições Técnicas</h1>
              <p style={{fontSize:13,color:MUTED,marginTop:4}}>Clique em "Ver Descrição" para explorar cada tipo de teste</p>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:20}}>
              {tiposDeTeste.map(t => (
                <div key={t.id}
                  style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:16,padding:'1.5rem',
                    transition:'border-color .2s'}}
                  onMouseEnter={e => e.currentTarget.style.borderColor=NEON}
                  onMouseLeave={e => e.currentTarget.style.borderColor=BORDER}>
                  <div style={{height:3,width:32,borderRadius:2,marginBottom:14,
                    background:`linear-gradient(90deg,${NEON},#6c63ff)`}}/>
                  <h3 style={{fontWeight:800,fontSize:17,marginBottom:12}}>{t.nome}</h3>
                  <button onClick={() => handleReadMore(t.id)}
                    style={{background:'none',border:'none',fontWeight:800,fontSize:11,
                      letterSpacing:'0.12em',textTransform:'uppercase',cursor:'pointer',color:NEON}}>
                    Ver Descrição →
                  </button>
                </div>
              ))}
            </div>

            {selectedContent && (
              <div style={{marginTop:32,padding:'2rem',borderRadius:16,
                background:CARD,borderLeft:`6px solid ${NEON}`}}>
                <div style={{height:3,width:48,borderRadius:2,marginBottom:12,
                  background:`linear-gradient(90deg,${NEON},#6c63ff)`}}/>
                <h2 style={{fontSize:22,fontWeight:900,letterSpacing:'-0.02em',
                  textTransform:'uppercase',color:NEON,marginBottom:10}}>
                  {selectedContent.nome}
                </h2>
                <p style={{fontSize:17,lineHeight:1.7,fontStyle:'italic',color:'#b0b0c0'}}>
                  "{selectedContent.texto}"
                </p>
              </div>
            )}
          </div>
        )}

        {/* ══ QUESTIONÁRIO ════════════════════════════════════ */}
        {activeTab === 'forms' && (
          <div style={{maxWidth:720,margin:'0 auto',background:CARD,
            border:`1px solid ${BORDER}`,borderRadius:20,padding:'2rem'}}>
            <div style={{height:3,width:48,borderRadius:2,margin:'0 auto 12px',
              background:`linear-gradient(90deg,${NEON},#6c63ff)`}}/>
            <h2 style={{fontSize:26,fontWeight:900,textAlign:'center',letterSpacing:'-0.02em',
              paddingBottom:16,borderBottom:`1px solid ${BORDER}`,marginBottom:28}}>
              AVALIAÇÃO TÉCNICA
            </h2>

            <div style={{display:'flex',flexDirection:'column',gap:28}}>
              {[
                { q:'1. Qual teste foca na experiência do usuário final?', r:['Aceitação','Unidade'],    c:0 },
                { q:'2. Mudar o código e testar se algo quebrou é:',       r:['Regressão','Validação'],  c:0 },
                { q:'3. O teste de Caixa Branca foca em estruturas:',      r:['Internas','Externas'],    c:0 },
                { q:'4. Qual teste valida a comunicação entre módulos?',   r:['Integração','Performance'],c:0 },
              ].map((item, idx) => (
                <div key={idx}>
                  <p style={{fontWeight:700,fontSize:16,marginBottom:12}}>{item.q}</p>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                    {item.r.map((opt, i) => (
                      <button key={i}
                        onClick={() => {
                          if (i === item.c) showFeedback('Acertou!', 'success');
                          else { setErrorCount(prev => prev+1); showFeedback('Errou!', 'error'); } // [BUG-07]
                        }}
                        style={{padding:'14px',borderRadius:10,textAlign:'left',fontWeight:600,
                          fontSize:14,cursor:'pointer',transition:'all .2s',
                          background:'#1a1a4a',border:`2px solid ${BORDER}`,color:'#c0c0d0'}}
                        onMouseEnter={e => { e.currentTarget.style.borderColor=NEON; e.currentTarget.style.background='#1e1e50'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor=BORDER; e.currentTarget.style.background='#1a1a4a'; }}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <div style={{textAlign:'center',paddingTop:16,borderTop:`1px solid ${BORDER}`}}>
                {/* [BUG-08] "bloqueado" mas não bloqueia */}
                <p style={{fontWeight:800,fontSize:13,color:'#ff6584',
                  animation: errorCount>=3 ? 'pulse 1s infinite' : 'none'}}>
                  {errorCount >= 3 ? '⛔ SISTEMA BLOQUEADO' : `ERROS REGISTRADOS: ${errorCount}`}
                </p>
              </div>

              {/* [BUG-06] score aleatório */}
              <button
                onClick={() => { setScoreForms(Math.floor(Math.random()*4)+1); showFeedback('Formulário Enviado!','success'); }}
                style={{padding:'14px',borderRadius:12,border:'none',fontWeight:900,fontSize:15,
                  cursor:'pointer',color:DARK,
                  background:`linear-gradient(135deg,${NEON},#a0c000)`}}>
                ENVIAR FORMULÁRIO
              </button>

              {scoreForms !== null && (
                <p style={{textAlign:'center',fontWeight:800,fontSize:22,color:NEON}}>
                  Acertos: {scoreForms} / 4
                </p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
