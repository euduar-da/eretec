# ERETec 2024 — Portal do Participante

Aplicação React (Vite + Tailwind) para dinâmica de QA no ERETec 2024.
Paleta oficial: Azul escuro `#12126e` + Verde neon `#c8f500`.

## Como rodar

```bash
npm install
npm run dev
```

Acesse em: http://localhost:5173

Login: qualquer e-mail com `@gmail` + qualquer senha. Ex: `aluno@gmail.com` / `12345678`

---

## Estrutura

```
src/
└── App.jsx   → toda a lógica e UI (login, cronograma, tipos de teste, questionário)
```

---

## 🐛 Catálogo de Bugs (para a dinâmica de QA)

### Bugs originais — Tipos de Teste e Questionário

| ID       | Onde               | Descrição                                                                 |
|----------|--------------------|---------------------------------------------------------------------------|
| BUG-01   | Tipos de Teste     | Teste de Integração tem "Lorem ipsum" como descrição                      |
| BUG-02   | Tipos de Teste     | "Ver Descrição" de Unidade redireciona para o Questionário                |
| BUG-03   | Tipos de Teste     | "Ver Descrição" de Aceitação exibe o texto de Regressão                   |
| BUG-04   | Login              | Senha fora do limite (8-16) exibe aviso mas deixa entrar mesmo assim      |
| BUG-05   | Cadastro           | Resultado de sucesso/erro é decidido por Math.random(), não por dados     |
| BUG-06   | Questionário       | Score do formulário é aleatório — ignora as respostas reais               |
| BUG-07   | Questionário       | Contador de erros é global (somam erros do Questionário)                  |
| BUG-08   | Questionário       | Após 3 erros exibe "SISTEMA BLOQUEADO" mas o usuário ainda interage       |

### Bugs novos — Cronograma

| ID       | Onde               | Descrição                                                                 |
|----------|--------------------|---------------------------------------------------------------------------|
| BUG-C1   | Card Keynote       | Horário da abertura exibe "00:00 - 10:00" em vez de "09:00 - 10:00"      |
| BUG-C2   | Card Acessibilidade| Vagas disponíveis exibem número negativo (-3) pois inscritos > vagas      |
| BUG-C3   | Filtro Oficinas    | Filtro usa valor 'workshop' mas os dados usam tipo 'oficina' → sem resultado |
| BUG-C4   | Busca              | Busca é case-sensitive — "react" não encontra "React"                     |
| BUG-C5   | Card Microsserviços| Sala exibe "Lab 01" em vez de "Sala 02"                                   |

---

