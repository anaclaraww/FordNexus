# Ford Nexus — Console de pós-venda

Protótipo navegável de uma camada de dados e IA para o pós-venda automotivo.
Desafio Ford × FIAP — Engenharia de Software.

> **Projeto acadêmico.** Não é um sistema da Ford Motor Company e não tem relação
> oficial com a marca. Todos os dados — clientes, chassis, placas, preços, oficinas
> e resultados — são **simulados** para fins de demonstração.

---

## Duas páginas, dois públicos

A tese é que a Ford não precisa de mais um canal: ela já fala com o cliente por
WhatsApp. O que falta é decidir **quem chamar, por quanto e em que dia a peça está
na prateleira**. O projeto conta isso de duas formas.

### `index.html` — a demonstração guiada

Oito telas, uma por vez, em linguagem do dia a dia e sem sigla. É a versão para
apresentar: avança com **→**, **espaço** ou o botão *Continuar*, volta com **←**,
recomeça com **R**. Os pontinhos no topo permitem pular direto para qualquer passo
se a banca perguntar algo fora de ordem.

| Passo | O que mostra |
|---|---|
| 1 · O cliente | O Ricardo e o Ka 2016 de Sorocaba: 14 meses sem passar numa Ford, revisão vencida há 112 dias, loja mais próxima a 38 km. |
| 2 · O que já se sabe | As três visitas anteriores viradas em linha do tempo, e a revisão que está vencendo agora. |
| 3 · Quem chamar | A lista de cinco carros que a loja recebe de manhã, na ordem de quem mais precisa e mais rende. |
| 4 · Por quanto | Tabela da loja, oficina da esquina e a oferta — os três preços lado a lado. |
| 5 · Em que dia | A semana com terça pela metade e a peça já na prateleira. |
| 6 · A conversa | O WhatsApp se escrevendo sozinho até o cliente confirmar. |
| 7 · O que mudou | A terça sobe de 52% para 61%, o serviço faturado e o custo de ter conseguido. |
| 8 · Em doze meses | O gráfico contra o grupo que não recebeu nada. |

### `painel.html` — o painel completo

O console operacional, com cinco telas navegáveis e todo o detalhe técnico: a fila
com as dez ordens e o score decomposto, a ficha do chassi, a agenda da semana, as
peças pré-posicionadas, a rede certificada e a série de 12 meses com tooltip.
É para onde ir quando alguém perguntar "e por dentro, como funciona?".

As duas páginas se conectam: há um link para o painel no fim da demonstração e um
link de volta no menu do painel. O botão **Reiniciar demonstração**, no rodapé do
menu do painel, devolve tudo ao estado inicial entre um ensaio e outro.

### Os três motores

1. **Quem chamar** — intervalo do manual cruzado com quilometragem estimada, última
   visita e histórico do modelo. A fila sai ordenada por urgência e por valor, não
   por ordem de cadastro.
2. **Por quanto** — benchmark do preço praticado pela oficina independente na mesma
   região. A oferta sai com valor fechado antes da conversa começar.
3. **Quando** — se o agendamento é previsto com antecedência, a peça de 3 dias de
   trânsito é pedida antes da confirmação. O serviço deixa de esperar a peça.

---

## Rodando localmente

É um site estático puro: sem build, sem dependências, sem `npm install`.

```bash
git clone https://github.com/SEU-USUARIO/ford-nexus.git
cd ford-nexus
python3 -m http.server 8080
# abra http://localhost:8080
```

Qualquer servidor estático serve (`npx serve`, extensão Live Server do VS Code).
Abrir o `index.html` direto pelo navegador também funciona.

---

## Publicando

### GitHub Pages

1. Suba o repositório para o GitHub.
2. **Settings → Pages**.
3. Em *Source*, escolha **Deploy from a branch**.
4. Branch `main`, pasta `/ (root)`. Salve.
5. Em um ou dois minutos o site está em
   `https://SEU-USUARIO.github.io/ford-nexus/`.

O arquivo `.nojekyll` já está no repositório para o GitHub servir os arquivos
como estão, sem processar por Jekyll.

### Vercel

1. Em [vercel.com/new](https://vercel.com/new), importe o repositório.
2. *Framework Preset*: **Other**.
3. Deixe *Build Command* e *Output Directory* em branco.
4. **Deploy**.

O `vercel.json` só liga URLs limpas. Não há passo de build.

### Netlify

Arraste a pasta do projeto para [app.netlify.com/drop](https://app.netlify.com/drop).
Não precisa de configuração.

---

## Estrutura

```
ford-nexus/
├── index.html          demonstração guiada em 8 passos
├── painel.html         console completo, com as cinco telas
├── assets/
│   ├── demo.css        estilos da demonstração guiada
│   ├── demo.js         passos, conversa e gráfico da demonstração
│   ├── styles.css      estilos do painel
│   ├── data.js         base simulada (frota, agenda, rede, série do piloto)
│   └── app.js          motores, renderização e navegação do painel
├── vercel.json         URLs limpas na Vercel
├── .nojekyll           serve os arquivos crus no GitHub Pages
└── README.md
```

Sem framework e sem dependência de runtime. As fontes vêm do Google Fonts e o
restante é servido pelo próprio repositório.

---

## Trocando os dados

Tudo o que aparece no **painel** vem de `assets/data.js`. A interface se ajusta
sozinha ao que estiver lá.

- **`SEED`** — a frota na fila. Cada veículo traz chassi, quilometragem, serviço
  previsto, os quatro fatores do score (`f`), os três preços (`preco`), a peça
  (`peca`), a janela sugerida e o histórico de ordens de serviço.
  Marque `out: true` numa entrada do histórico para indicar serviço feito fora da
  rede — é o que o service share mede.
- **`WEEK0`** — a agenda da semana. `occ` abaixo de 60 destaca o dia como buraco
  de capacidade.
- **`NET`** e **`CERT`** — a rede certificada e o checklist.
- **`SER_NEXUS`** / **`SER_CTRL`** — as duas séries de 12 meses do gráfico.
- **`AB`** e **`RISK`** — a leitura do piloto e os riscos assumidos.

O score de cada veículo é o campo `score`, e `f` é a decomposição mostrada nas
barras. Se mudar um, ajuste o outro para a tela continuar coerente.

A **demonstração guiada** tem os textos direto no `index.html` e a conversa do
WhatsApp na constante `SCRIPT`, no topo de `assets/demo.js`. Mudar a narrativa é
editar esses dois lugares.

---

## Decisões de projeto que valem explicar na banca

- **O chassi é a chave.** Toda a ficha é montada por VIN, não por visita. É o que
  transforma ordens de serviço dispersas em um histórico por carro — e o que
  permite que um serviço feito na oficina certificada entre no mesmo registro.
- **Placa mascarada.** O campo aparece como `DQK-••17`, com a marcação de LGPD.
  O consentimento é granular e preso ao VIN, revogável na própria conversa.
- **O agente tem limites explícitos.** O passo 6 e a tela *Conversa* do painel
  listam o que ele pode e o que não pode fazer: ele marca, não diagnostica, e não
  contata quem não consentiu.
- **A prova tem grupo de controle.** 10% da base fica sem contato durante todo o
  piloto. Sem holdout, qualquer alta de receita poderia ser sazonalidade.
- **Premissas declaradas.** Ticket de R$ 600 e 1,5 manutenção/ano são premissas
  nossas, marcadas como premissa na interface — não são citação.

---

## Paleta e tipografia

Escala dark com azul Ford `#1273EC` como acento. As duas séries do gráfico
(`#3486E6` e `#BC7A28`) foram escolhidas para passar em separação por deficiência
de visão de cor e em contraste sobre o fundo escuro.

Tipografia: **Archivo** nos títulos e números, **IBM Plex Sans** no corpo,
**IBM Plex Mono** em chassi, códigos de peça, valores e horários.

---

## Equipe

Ana Clara Melo · David Murillo de Oliveira Soares · Lucas Serrano · Yasmim Gonçalves

FIAP — Engenharia de Software
# FordNexus
