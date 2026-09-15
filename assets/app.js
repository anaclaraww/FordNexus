/* Ford Nexus — interface e motores da demonstração. Depende de assets/data.js. */
(function(){
"use strict";
const BRL = n => "R$ " + n.toLocaleString("pt-BR");
const $ = s => document.querySelector(s);

/* ================= estado ================= */
let queue, week, selected, kpi, chatTimers=[];

function reset(){
  queue = SEED.map(v=>({...v}));
  week  = WEEK0.map(d=>({...d,slots:[...d.slots],added:[]}));
  selected = queue[0].id;
  kpi = {share:38.6,delta:7.4,occ:64,os:312,rev:214};
  chatTimers.forEach(clearTimeout); chatTimers=[];
  $("#chat").innerHTML="";
  $("#chatFoot").textContent="Selecione um veículo na fila para gerar a oferta.";
  renderAll();
}

/* ================= render ================= */
function renderAll(){ renderKpis(); renderQueue(); renderDetail(); renderWeek(); renderParts(); renderOcc(); }

function renderKpis(){
  $("#kShare").textContent = kpi.share.toFixed(1).replace(".",",")+"%";
  $("#kShareD").textContent = "+"+kpi.delta.toFixed(1).replace(".",",")+" p.p. vs controle";
  $("#kOcc").textContent = kpi.occ+"%";
  $("#kOs").textContent = kpi.os;
  $("#kRev").textContent = "R$ "+kpi.rev+" mil";
  $("#navQueueCount").textContent = queue.length;
}

function renderQueue(){
  const ul=$("#queue");
  $("#queueMeta").textContent = queue.length+" veículos · atualizada 08:05";
  if(!queue.length){ ul.innerHTML='<li class="q-empty">Fila zerada. Todos os veículos previstos para hoje já foram contatados.</li>'; return; }
  ul.innerHTML = queue.map((v,i)=>{
    const [cls,lbl]=PART_LABEL[v.peca.status];
    return `<li><button class="qrow" data-id="${v.id}" aria-selected="${v.id===selected}">
      <span class="rank">${i+1}</span>
      <span style="min-width:0">
        <span class="qn">${v.nome} · ${v.modelo}</span>
        <span class="qm">${v.km.toLocaleString("pt-BR")} km · ${v.atraso} d em atraso · ${v.cidade}</span>
      </span>
      <span class="qs">
        <span class="chip ${cls}">${lbl}</span>
        <span class="sbar"><i style="width:${v.score}%"></i></span>
        <span class="score">${v.score}</span>
      </span></button></li>`;
  }).join("");
  ul.querySelectorAll(".qrow").forEach(b=>b.onclick=()=>{selected=+b.dataset.id;renderQueue();renderDetail();});
}

function renderDetail(){
  const v = queue.find(x=>x.id===selected);
  const el = $("#detail");
  if(!v){ el.innerHTML='<div class="panel-h"><h3>Ficha do veículo</h3></div><div class="q-empty">Nenhum veículo selecionado.</div>'; return; }
  const [pcls,plbl]=PART_LABEL[v.peca.status];
  const econ = v.preco.tabela - v.preco.nexus;
  const F=[["Urgência técnica",v.f.urg,40],["Valor para a oficina",v.f.val,30],["Propensão a aceitar",v.f.prop,20],["Peça disponível",v.f.peca,10]];

  el.innerHTML = `
  <div class="panel-h"><h3>Ficha do chassi</h3><span class="src">Registro único por VIN</span></div>
  <div class="dbody">
    <div class="dhead">
      <div style="min-width:0">
        <h3>${v.nome} · ${v.modelo}</h3>
        <div class="vin">VIN ${v.vin} · placa ${v.placa} <span style="color:var(--ink-3)">(mascarada — LGPD)</span></div>
      </div>
      <span class="chip ${pcls}" style="margin-left:auto">${plbl}</span>
    </div>

    <div class="facts">
      <div class="fact"><div class="k">Quilometragem</div><div class="v">${v.km.toLocaleString("pt-BR")} km</div></div>
      <div class="fact"><div class="k">Última visita</div><div class="v">há ${v.ultima}</div></div>
      <div class="fact"><div class="k">Atraso na revisão</div><div class="v">${v.atraso} dias</div></div>
      <div class="fact"><div class="k">Valor de troca</div><div class="v">${BRL(v.troca)}</div></div>
    </div>

    <div class="engine">
      <div class="eh"><span class="eno">1</span><b>Por que este carro está nesta posição</b><span class="src">Motor de fila</span></div>
      <div class="bars">${F.map(([l,n,m])=>`
        <div class="bar"><span class="bl">${l}</span><span class="bt"><i style="width:${n/m*100}%"></i></span><span class="bv">${n}/${m}</span></div>`).join("")}
      </div>
      <p class="pnote"><b style="color:var(--ink)">${v.servico}</b> — intervalo do manual cruzado com quilometragem estimada e histórico do modelo. Score final <b class="mono" style="color:var(--accent)">${v.score}</b>.</p>
    </div>

    <div class="engine">
      <div class="eh"><span class="eno">2</span><b>Por quanto oferecer</b><span class="src">Benchmark regional</span></div>
      <div class="price">
        <div class="pcell"><div class="k">Tabela da loja</div><div class="v">${BRL(v.preco.tabela)}</div></div>
        <div class="pcell"><div class="k">Independente na região</div><div class="v">${BRL(v.preco.indep)}</div></div>
        <div class="pcell win"><div class="k">Oferta Nexus</div><div class="v">${BRL(v.preco.nexus)}</div></div>
      </div>
      <p class="pnote">Preço fechado antes da conversa, ${BRL(econ)} abaixo da tabela e ainda ${BRL(v.preco.nexus-v.preco.indep)} acima do independente — a diferença é peça genuína, garantia e registro no chassi. Propensão estimada de aceitação: <b class="mono" style="color:var(--ink)">${v.prop}%</b>.</p>
    </div>

    <div class="engine">
      <div class="eh"><span class="eno">3</span><b>Quando dá para atender</b><span class="src">Estoque · agenda</span></div>
      <div class="part">
        <div class="pi" style="flex:1">
          <div class="pn">${v.peca.nome}</div>
          <div class="pc">${v.peca.cod} · ${v.peca.eta}</div>
        </div>
        <span class="chip ${pcls}">${plbl}</span>
      </div>
      <p class="pnote">Janela sugerida: <b class="mono" style="color:var(--ink)">${v.janela}</b> — escolhida por ser o elevador ocioso mais próximo da data em que a peça está garantida na prateleira.</p>
    </div>

    <div class="engine">
      <div class="eh"><span class="eno">4</span><b>Histórico do chassi</b><span class="src">OS consolidadas</span></div>
      <ul class="tl">${v.hist.map(h=>`
        <li><span class="d">${h.d}</span><span class="m ${h.out?"out":""}"><i></i></span>
        <span><b>${h.s}</b><span class="s">${h.km} · ${h.o}</span></span>
        <span class="val">${BRL(h.v)}</span></li>`).join("")}
      </ul>
      ${v.hist.some(h=>h.out)?'<p class="pnote">Os registros em âmbar aconteceram fora da rede — é exatamente esse pedaço do gasto que o service share mede e que a rede certificada recupera.</p>':""}
    </div>

    <div class="cta">
      <button class="btn" id="offerBtn">Enviar oferta no WhatsApp</button>
      <span class="hint">${v.prop}% de propensão · resposta média em 12 min</span>
    </div>
  </div>`;
  $("#offerBtn").onclick = ()=>startChat(v);
}

function renderWeek(){
  $("#week").innerHTML = week.map(d=>{
    const hole = d.occ < 60;
    const slots = d.slots.map(s=> s
        ? `<span class="slot">${s}</span>`
        : `<span class="slot free">elevador livre</span>`).join("")
      + d.added.map(s=>`<span class="slot new">${s}</span>`).join("");
    return `<div class="day${hole?" hole":""}">
      <h4>${d.d}</h4><div class="occ">${d.n} · ${d.occ}% ocupado</div>
      <div class="track"><i style="width:${d.occ}%"></i></div>
      <div class="slots">${slots}</div></div>`;
  }).join("");
  const avg = Math.round(week.reduce((a,d)=>a+d.occ,0)/week.length);
  $("#occMeta").textContent = `ocupação média ${avg}% · meta 85%`;
}

function renderParts(){
  $("#partsTable").innerHTML = queue.slice(0,6).map(v=>{
    const [cls,lbl]=PART_LABEL[v.peca.status];
    return `<tr><td>${v.peca.nome}</td><td class="mono" style="color:var(--ink-3)">${v.peca.cod}</td>
      <td><span class="chip ${cls}">${lbl}</span></td>
      <td class="mono nw" style="text-align:right;color:var(--ink-2)">${v.janela.split(", ")[1].split(" · ")[0]}</td></tr>`;
  }).join("");
}

/* ================= gráficos ================= */
function renderOcc(){
  const W=470,H=200,L=34,R=58,T=14,B=30, iw=W-L-R, ih=H-T-B;
  const y = p => T + ih - (p/100)*ih;
  const bw = iw/week.length*0.52;
  const bars = week.map((d,i)=>{
    const cx = L + iw/week.length*(i+0.5);
    const h = Math.max(3,(d.occ/100)*ih);
    const col = d.occ<60 ? "var(--warn)" : "var(--accent)";
    return `<rect x="${(cx-bw/2).toFixed(1)}" y="${y(d.occ).toFixed(1)}" width="${bw.toFixed(1)}" height="${h.toFixed(1)}" rx="4" fill="${col}"/>
      <text x="${cx.toFixed(1)}" y="${(y(d.occ)+16).toFixed(1)}" fill="#060C22" font-size="11" font-weight="600" font-family="IBM Plex Mono, monospace" text-anchor="middle">${d.occ}%</text>
      <text x="${cx.toFixed(1)}" y="${H-10}" fill="var(--ink-3)" font-size="10.5" font-family="IBM Plex Sans, sans-serif" text-anchor="middle">${d.d.slice(0,3)}</text>`;
  }).join("");
  const grid=[0,25,50,75,100].map(p=>`<line x1="${L}" x2="${W-R}" y1="${y(p).toFixed(1)}" y2="${y(p).toFixed(1)}" stroke="var(--line-soft)" stroke-width="1"/>
    <text x="${L-7}" y="${(y(p)+3.5).toFixed(1)}" fill="var(--ink-3)" font-size="10" font-family="IBM Plex Mono, monospace" text-anchor="end">${p}</text>`).join("");
  $("#occChart").innerHTML =
   `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Ocupação da oficina por dia da semana, com meta de 85 por cento">
      ${grid}${bars}
      <line x1="${L}" x2="${W-R}" y1="${y(85).toFixed(1)}" y2="${y(85).toFixed(1)}" stroke="var(--ok)" stroke-width="1.5" stroke-dasharray="4 4"/>
      <text x="${W-R+7}" y="${(y(85)+3.5).toFixed(1)}" fill="var(--ok)" font-size="10.5" font-family="IBM Plex Mono, monospace" text-anchor="start">meta 85%</text>
    </svg>`;
}

function renderShare(){
  const W=760,H=290,L=42,R=86,T=18,B=34, iw=W-L-R, ih=H-T-B;
  const lo=28, hi=45;
  const x = i => L + (i/(MESES.length-1))*iw;
  const y = v => T + ih - ((v-lo)/(hi-lo))*ih;
  const path = a => a.map((v,i)=>(i?"L":"M")+x(i).toFixed(1)+" "+y(v).toFixed(1)).join(" ");
  const area = SER_NEXUS.map((v,i)=>(i?"L":"M")+x(i).toFixed(1)+" "+y(v).toFixed(1)).join(" ")
    +` L ${x(11).toFixed(1)} ${(T+ih).toFixed(1)} L ${x(0).toFixed(1)} ${(T+ih).toFixed(1)} Z`;
  const grid=[30,35,40,45].map(v=>`<line x1="${L}" x2="${L+iw}" y1="${y(v).toFixed(1)}" y2="${y(v).toFixed(1)}" stroke="var(--line-soft)" stroke-width="1"/>
    <text x="${L-8}" y="${(y(v)+3.5).toFixed(1)}" fill="var(--ink-3)" font-size="10.5" font-family="IBM Plex Mono, monospace" text-anchor="end">${v}%</text>`).join("");
  const xlab=MESES.map((m,i)=> i%2===0
    ? `<text x="${x(i).toFixed(1)}" y="${H-12}" fill="var(--ink-3)" font-size="10.5" font-family="IBM Plex Sans, sans-serif" text-anchor="middle">${m}</text>` : "").join("");
  const dots = i => `<circle cx="${x(i).toFixed(1)}" cy="${y(SER_NEXUS[i]).toFixed(1)}" r="4.5" fill="var(--s-nexus)" stroke="var(--surface)" stroke-width="2"/>
    <circle cx="${x(i).toFixed(1)}" cy="${y(SER_CTRL[i]).toFixed(1)}" r="4.5" fill="var(--s-control)" stroke="var(--surface)" stroke-width="2"/>`;

  $("#shareChart").innerHTML =
  `<svg viewBox="0 0 ${W} ${H}" width="100%" id="shareSvg" role="img" aria-label="Service share ao longo de 12 meses: grupo Nexus sobe de 31,2% para 42,3%; grupo de controle permanece perto de 31%">
    <defs><linearGradient id="gN" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#3486E6" stop-opacity=".26"/><stop offset="100%" stop-color="#3486E6" stop-opacity="0"/></linearGradient></defs>
    ${grid}${xlab}
    <path d="${area}" fill="url(#gN)"/>
    <path d="${path(SER_CTRL)}" fill="none" stroke="var(--s-control)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
    <path d="${path(SER_NEXUS)}" fill="none" stroke="var(--s-nexus)" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/>
    ${dots(11)}
    <text x="${(x(11)+9).toFixed(1)}" y="${(y(SER_NEXUS[11])+1).toFixed(1)}" fill="var(--s-nexus)" font-size="12" font-weight="600" font-family="IBM Plex Mono, monospace">42,3%</text>
    <text x="${(x(11)+9).toFixed(1)}" y="${(y(SER_CTRL[11])+4).toFixed(1)}" fill="var(--s-control)" font-size="12" font-weight="600" font-family="IBM Plex Mono, monospace">31,4%</text>
    <line id="cross" x1="0" x2="0" y1="${T}" y2="${T+ih}" stroke="var(--ink-3)" stroke-width="1" stroke-dasharray="3 3" opacity="0"/>
    <rect id="hit" x="${L}" y="${T}" width="${iw}" height="${ih}" fill="transparent" style="cursor:crosshair"/>
  </svg>`;

  const svg=$("#shareSvg"), tip=$("#tip"), cross=svg.querySelector("#cross"), hit=svg.querySelector("#hit");
  const MES_FULL=["Outubro","Novembro","Dezembro","Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro"];
  function move(ev){
    const r=svg.getBoundingClientRect();
    const px=((ev.touches?ev.touches[0].clientX:ev.clientX)-r.left)/r.width*W;
    let i=Math.round((px-L)/iw*(MESES.length-1));
    i=Math.max(0,Math.min(MESES.length-1,i));
    cross.setAttribute("x1",x(i)); cross.setAttribute("x2",x(i)); cross.setAttribute("opacity","1");
    const d=(SER_NEXUS[i]-SER_CTRL[i]).toFixed(1).replace(".",",");
    tip.innerHTML=`<b>${MES_FULL[i]}</b>
      <div class="r"><i style="background:var(--s-nexus)"></i>Nexus<span>${SER_NEXUS[i].toFixed(1).replace(".",",")}%</span></div>
      <div class="r"><i style="background:var(--s-control)"></i>Controle<span>${SER_CTRL[i].toFixed(1).replace(".",",")}%</span></div>
      <div class="r" style="margin-top:5px;padding-top:5px;border-top:1px solid var(--line);color:var(--ink-2)">Delta<span>+${d} p.p.</span></div>`;
    tip.style.opacity="1";
    const wrap=tip.parentElement.getBoundingClientRect();
    const px2=x(i)/W*r.width + (r.left-wrap.left);
    tip.style.left=Math.min(Math.max(8,px2-80),wrap.width-166)+"px";
    tip.style.top="14px";
  }
  hit.addEventListener("mousemove",move);
  hit.addEventListener("touchmove",e=>{move(e);e.preventDefault();},{passive:false});
  hit.addEventListener("mouseleave",()=>{tip.style.opacity="0";cross.setAttribute("opacity","0");});
}

/* ================= conversa ================= */
function startChat(v){
  go("conversa");
  chatTimers.forEach(clearTimeout); chatTimers=[];
  const box=$("#chat"); box.innerHTML="";
  $("#chatFoot").textContent = `Oferta gerada para o VIN ${v.vin}`;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const dia = v.janela.split(" · ")[0], hora = v.janela.split(" · ")[1];
  const script=[
   {who:"bot",t:`Oi, ${v.nome.split(" ")[0]}! Aqui é a Ford Sorocaba. Seu ${v.modelo.split(" ").slice(0,2).join(" ")} está com a ${v.servico.split("—")[0].trim().toLowerCase()} vencida há ${Math.round(v.atraso/30)} meses.`,at:"08:14"},
   {who:"bot",t:`Já separei ${BRL(v.preco.nexus)} fechado para o serviço completo, com peça genuína e 12 meses de garantia. Sem surpresa na hora de pagar.`,at:"08:14"},
   {who:"user",t:"quanto seria sem a peça original?",at:"08:26"},
   {who:"bot",t:`A média das oficinas da sua região está em ${BRL(v.preco.indep)} com peça de linha. A diferença de ${BRL(v.preco.nexus-v.preco.indep)} é peça genuína, garantia da marca e o serviço registrado no chassi — o que segura o valor do carro na revenda.`,at:"08:27"},
   {who:"user",t:"faz sentido. tem horário essa semana?",at:"08:31"},
   {who:"bot",t:`Tenho ${dia} às ${hora}. Escolhi esse horário porque é quando a peça está garantida na prateleira — você entra e sai no mesmo dia, sem esperar trânsito.`,at:"08:31"},
   {who:"user",t:"pode ser 👍",at:"08:33"},
   {who:"bot",t:`Agendado, ${v.nome.split(" ")[0]}. ${dia}, ${hora}, Ford Sorocaba Zona Norte. Mando um lembrete na véspera e o orçamento fechado por escrito agora.`,at:"08:33"},
   {who:"sys",t:`Agendamento gravado no DMS · peça ${v.peca.cod} reservada · OS vinculada ao VIN ${v.vin}`,at:""}
  ];

  let delay=reduce?0:300;
  script.forEach((m,idx)=>{
    if(m.who==="bot" && !reduce){
      chatTimers.push(setTimeout(()=>{
        const t=document.createElement("div"); t.className="typing"; t.id="typing";
        t.innerHTML="<i></i><i></i><i></i>"; box.appendChild(t); box.scrollTop=box.scrollHeight;
      },delay));
      delay+=620;
    }
    chatTimers.push(setTimeout(()=>{
      const old=box.querySelector("#typing"); if(old) old.remove();
      const d=document.createElement("div"); d.className="msg "+m.who;
      d.innerHTML = m.who==="sys" ? m.t : m.t+`<span class="t">${m.at}</span>`;
      box.appendChild(d); box.scrollTop=box.scrollHeight;
      if(idx===script.length-1) commit(v);
    },delay));
    delay += reduce?0:(m.who==="user"?900:760);
  });
}

function commit(v){
  queue = queue.filter(x=>x.id!==v.id);
  if(queue.length) selected = queue[0].id;
  const dia = v.janela.split(" · ")[0], hora = v.janela.split(" · ")[1];
  const d = week.find(w=>w.d.toLowerCase()===dia.toLowerCase());
  if(d){ d.added.push(`${hora} · ${v.servico.split("—")[0].trim()}`); d.occ = Math.min(98, d.occ+9); }
  kpi.share = +(kpi.share+0.2).toFixed(1);
  kpi.delta = +(kpi.delta+0.2).toFixed(1);
  kpi.occ   = Math.round(week.reduce((a,x)=>a+x.occ,0)/week.length);
  kpi.os   += 1;
  kpi.rev  += Math.round(v.preco.nexus/1000);
  renderAll();
  toast(`Agendado ${dia} às ${hora} · ${BRL(v.preco.nexus)} · peça ${v.peca.cod} reservada`);
}

function toast(msg){
  const t=$("#toast"); t.textContent=msg; t.classList.add("on");
  setTimeout(()=>t.classList.remove("on"),4200);
}

/* ================= navegação ================= */
function go(view){
  document.querySelectorAll(".view").forEach(s=>s.classList.toggle("on",s.id==="v-"+view));
  document.querySelectorAll(".nav button").forEach(b=>b.setAttribute("aria-current",String(b.dataset.view===view)));
  window.scrollTo({top:0,behavior:"instant"});
}
document.querySelectorAll(".nav button").forEach(b=>b.onclick=()=>go(b.dataset.view));
$("#resetBtn").onclick=()=>{reset();go("fila");toast("Demonstração reiniciada.");};

/* ================= tabelas estáticas ================= */
$("#netTable").innerHTML = NET.map(([o,m,os,st])=>{
  const cls = st==="certificada"?"ok":st==="em certificação"?"warn":"crit";
  return `<tr><td>${o}</td><td class="mono" style="color:var(--ink-2)">${m}</td>
    <td class="mono" style="color:var(--ink-2)">${os}</td><td><span class="chip ${cls}">${st}</span></td></tr>`;
}).join("");

$("#certList").innerHTML = CERT.map(([n,t,s])=>
  `<li><span class="d mono">${n}</span><span class="m"><i></i></span><span><b>${t}</b><span class="s">${s}</span></span><span class="val"></span></li>`).join("");

$("#riskList").innerHTML = RISK.map(([lvl,t,s])=>{
  const cls = lvl==="ALTO"?"crit":"warn";
  return `<li><span class="d"><span class="chip ${cls}">${lvl}</span></span><span class="m ${lvl==="ALTO"?"sev-alto":"sev-med"}"><i></i></span>
    <span><b>${t}</b><span class="s">${s}</span></span><span class="val"></span></li>`;
}).join("");

$("#abTable").innerHTML = AB.map(([k,a,b,d])=>
  `<tr><td>${k}</td><td class="mono" style="text-align:right;color:var(--s-nexus)">${a}</td>
   <td class="mono" style="text-align:right;color:var(--ink-2)">${b}</td>
   <td class="mono" style="text-align:right;font-weight:600">${d}</td></tr>`).join("");

/* ================= boot ================= */
reset();
renderShare();
})();
