
## 🚀 Funcionalidades

* Login e cadastro de usuários
* Visualização de palestras e oficinas
* Filtro por tipo (palestra, oficina, keynote)
* Busca por título ou palestrante
* Visualização detalhada de cada palestra
* Sistema de vagas disponíveis
* Sorteio de palestras aleatórias

---

## 🐞 Bugs Identificados

### 🔐 Autenticação

#### BUG-04 — Validação de senha inconsistente

* **Descrição:** Mesmo com senha fora do limite (8–16 caracteres), o login é permitido.
* **Trecho:**

```js
if (passLen < 8 || passLen > 16)
  showFeedback('Aviso: Senha fora do limite (8-16).', 'error');

setIsLoggedIn(true);
```

* **Problema:** O sistema apenas mostra aviso, mas não bloqueia o login.
* **Correção sugerida:**

```js
if (passLen < 8 || passLen > 16) {
  showFeedback('Senha inválida.', 'error');
  return;
}
```

---

#### BUG-05 — Cadastro aleatório

* **Descrição:** O sistema decide aleatoriamente se a senha já existe.
* **Trecho:**

```js
if (Math.random() > 0.5)
```

* **Problema:** Comportamento não determinístico e irreal.
* **Correção:** Validar com base em dados reais (backend ou lista).

---

### 📅 Dados das Palestras

#### BUG-C1 — Horário inválido

* **Descrição:** Palestra com horário incorreto.
* **Trecho:**

```js
horario: '00:00 - 10:00'
```

* **Problema:** Evento começa à meia-noite sem justificativa.
* **Correção:** Ajustar horário real.

---

#### BUG-C2 — Inscritos maior que vagas

* **Descrição:** Existem mais inscritos do que vagas disponíveis.
* **Trecho:**

```js
vagas: 50, inscritos: 53
```

* **Problema:** Gera número negativo de vagas.
* **Impacto na UI:**

```js
const vagasDisp = p.vagas - p.inscritos;
```

* **Correção:** Garantir `inscritos <= vagas`.

---

#### BUG-C5 — Inconsistência de local

* **Descrição:** Sala pode estar incorreta ou duplicada.
* **Trecho:**

```js
sala: 'Lab 01'
```

* **Problema:** Possível conflito de alocação.

---

### 🔎 Filtros e Busca

#### BUG-C3 — Filtro não funciona (workshop vs oficina)

* **Descrição:** Filtro usa "workshop", mas dados usam "oficina".
* **Trecho:**

```js
{val:'workshop', label:'Oficinas'}
```

* **Problema:** Nenhuma oficina aparece ao filtrar.
* **Correção:**

```js
{val:'oficina', label:'Oficinas'}
```

---

#### BUG-C4 — Busca case-sensitive

* **Descrição:** Busca falha dependendo de maiúsculas/minúsculas.
* **Trecho:**

```js
p.titulo.includes(searchQ)
```

* **Problema:** "react" ≠ "React"
* **Correção:**

```js
p.titulo.toLowerCase().includes(searchQ.toLowerCase())
```






---

### 🎲 Funcionalidade Aleatória

#### BUG-ALEATORIO-01 — Sorteio não totalmente confiável

* **Descrição:** Uso de `sort(() => Math.random() - 0.5)`
* **Problema:** Embaralhamento não é 100% correto estatisticamente.
* **Correção sugerida:** Usar algoritmo Fisher-Yates.

---


---

## 👩‍💻 Tecnologias

* React
* JavaScript
* CSS inline

---

## 📌 Observação

Este projeto contém bugs intencionais para fins de estudo e prática de testes de software.

---
