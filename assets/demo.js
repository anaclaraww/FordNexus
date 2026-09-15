/* Ford Nexus — demonstração guiada em 8 passos. */
(function(){
"use strict";
const $ = s => document.querySelector(s);
const TOTAL = 8;
let cur = 1, chatTimers = [];
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- semana ---------- */
const WEEK = [
  {d:"Seg", n:"14/09", occ:78},
  {d:"Ter", n:"15/09", occ:52, hole:true},
  {d:"Qua", n:"16/09", occ:61},
  {d:"Qui", n:"17/09", occ:45, hole:true},
  {d:"Sex", n:"18/09", occ:83}
];
$("#week").innerHTML = WEEK.map(d=>`
  <div class="dy${d.hole?" hole":""}">
    <div class="dn">${d.d}</div>
    <div class="dv">${d.occ}%</div>
    <div class="dl">ocupado</div>
    <div class="trk"><i style="width:${d.occ}%"></i></div>
  </div>`).join("");

/* ---------- conversa ---------- */
const SCRIPT = [
 {w:"bot",  t:"Oi, Rafael! Aqui é a Ford Sorocaba. A revisão de 70 mil da sua Ranger está vencida há uns 3 meses."},
 {w:"bot",  t:"Separei R$ 2.190 fechado: óleo, os quatro filtros e a cambagem, com peça original e 12 meses de garantia. É o valor final, sem surpresa na hora de pagar."},
 {w:"user", t:"e numa oficina de picape aqui do bairro, quanto sai?"},
 {w:"bot",  t:"Por volta de R$ 1.890 com peça de linha. A diferença de R$ 300 é a peça original, a garantia da marca e a revisão ficar registrada no chassi — é isso que segura o valor da Ranger na hora de trocar."},
 {w:"user", t:"faz sentido. tem horário essa semana?"},
 {w:"bot",  t:"Tenho terça, 15/09 às 09:30. Escolhi esse horário porque o kit da sua Ranger já está aqui — você entra e sai no mesmo dia, sem esperar peça chegar."},
 {w:"user", t:"pode ser 👍"},
 {w:"bot",  t:"Agendado, Rafael. Terça, 09:30, Ford Sorocaba. Mando um lembrete na véspera e o orçamento por escrito agora."}
];

function playChat(){
  chatTimers.forEach(clearTimeout); chatTimers = [];
  const box = $("#chat"); box.innerHTML = "";
  let delay = reduce ? 0 : 260;
  SCRIPT.forEach(m=>{
    if(m.w === "bot" && !reduce){
      chatTimers.push(setTimeout(()=>{
        const t = document.createElement("div");
        t.className = "typing"; t.id = "typing";
        t.innerHTML = "<i></i><i></i><i></i>";
        box.appendChild(t); box.scrollTop = box.scrollHeight;
      }, delay));
      delay += 560;
    }
    chatTimers.push(setTimeout(()=>{
      const old = box.querySelector("#typing"); if(old) old.remove();
      const d = document.createElement("div");
      d.className = "msg " + m.w; d.textContent = m.t;
      box.appendChild(d); box.scrollTop = box.scrollHeight;
    }, delay));
    delay += reduce ? 0 : (m.w === "user" ? 780 : 700);
  });
}

/* ---------- passo 7: a terça enche ---------- */
function fillTuesday(){
  const ter = document.querySelectorAll("#week .dy")[1];
  if(!ter) return;
  ter.querySelector(".dv").textContent = "61%";
  ter.querySelector(".trk i").style.width = "61%";
}
function resetTuesday(){
  const ter = document.querySelectorAll("#week .dy")[1];
  if(!ter) return;
  ter.querySelector(".dv").textContent = "52%";
  ter.querySelector(".trk i").style.width = "52%";
}

/* ---------- gráfico ---------- */
const MES = ["out","nov","dez","jan","fev","mar","abr","mai","jun","jul","ago","set"];
const MES_F = ["Outubro","Novembro","Dezembro","Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro"];
const A = [31.2,32.0,33.4,34.9,36.1,37.0,38.2,39.1,39.9,40.8,41.6,42.3];
const B = [31.1,31.4,30.9,31.6,31.2,30.8,31.5,31.9,31.3,30.9,31.7,31.4];

function drawChart(){
  const W=880,H=224,L=44,R=112,T=16,Bm=34, iw=W-L-R, ih=H-T-Bm, lo=28, hi=45;
  const x = i => L + (i/(MES.length-1))*iw;
  const y = v => T + ih - ((v-lo)/(hi-lo))*ih;
  const line = a => a.map((v,i)=>(i?"L":"M")+x(i).toFixed(1)+" "+y(v).toFixed(1)).join(" ");
  const area = line(A) + ` L ${x(11).toFixed(1)} ${(T+ih).toFixed(1)} L ${x(0).toFixed(1)} ${(T+ih).toFixed(1)} Z`;
  const grid = [30,35,40,45].map(v=>
    `<line x1="${L}" x2="${L+iw}" y1="${y(v).toFixed(1)}" y2="${y(v).toFixed(1)}" stroke="#18244E" stroke-width="1"/>
     <text x="${L-10}" y="${(y(v)+4.5).toFixed(1)}" fill="#7286AD" font-size="13" font-family="IBM Plex Sans, sans-serif" text-anchor="end">${v}%</text>`).join("");
  const xl = MES.map((m,i)=> i%2===0
    ? `<text x="${x(i).toFixed(1)}" y="${H-14}" fill="#7286AD" font-size="13" font-family="IBM Plex Sans, sans-serif" text-anchor="middle">${m}</text>` : "").join("");

  $("#chart").innerHTML =
  `<svg viewBox="0 0 ${W} ${H}" width="100%" id="svg" role="img" aria-label="Em doze meses, o grupo que recebeu as ofertas sobe de 31,2% para 42,3% da manutenção feita dentro da Ford; o grupo sem contato fica em torno de 31%.">
    <defs><linearGradient id="ga" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#3486E6" stop-opacity=".3"/><stop offset="100%" stop-color="#3486E6" stop-opacity="0"/>
    </linearGradient></defs>
    ${grid}${xl}
    <path d="${area}" fill="url(#ga)"/>
    <path d="${line(B)}" fill="none" stroke="#BC7A28" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/>
    <path d="${line(A)}" fill="none" stroke="#3486E6" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
    <circle cx="${x(11).toFixed(1)}" cy="${y(A[11]).toFixed(1)}" r="5.5" fill="#3486E6" stroke="#0B1533" stroke-width="2.5"/>
    <circle cx="${x(11).toFixed(1)}" cy="${y(B[11]).toFixed(1)}" r="5.5" fill="#BC7A28" stroke="#0B1533" stroke-width="2.5"/>
    <text x="${(x(11)+12).toFixed(1)}" y="${(y(A[11])+1).toFixed(1)}" fill="#3486E6" font-size="16" font-weight="700" font-family="Archivo, sans-serif">42,3%</text>
    <text x="${(x(11)+12).toFixed(1)}" y="${(y(B[11])+5).toFixed(1)}" fill="#BC7A28" font-size="16" font-weight="700" font-family="Archivo, sans-serif">31,4%</text>
    <line id="cross" x1="0" x2="0" y1="${T}" y2="${T+ih}" stroke="#7286AD" stroke-width="1" stroke-dasharray="3 3" opacity="0"/>
    <rect id="hit" x="${L}" y="${T}" width="${iw}" height="${ih}" fill="transparent" style="cursor:crosshair"/>
  </svg>`;

  const svg = $("#svg"), tip = $("#tip"), cross = svg.querySelector("#cross"), hit = svg.querySelector("#hit");
  function move(ev){
    const r = svg.getBoundingClientRect();
    const px = ((ev.touches ? ev.touches[0].clientX : ev.clientX) - r.left) / r.width * W;
    let i = Math.round((px - L) / iw * (MES.length - 1));
    i = Math.max(0, Math.min(MES.length - 1, i));
    cross.setAttribute("x1", x(i)); cross.setAttribute("x2", x(i)); cross.setAttribute("opacity", "1");
    tip.innerHTML = `<b>${MES_F[i]}</b>
      <div class="r"><i style="background:#3486E6"></i>Com ofertas<span>${A[i].toFixed(1).replace(".",",")}%</span></div>
      <div class="r"><i style="background:#BC7A28"></i>Sem contato<span>${B[i].toFixed(1).replace(".",",")}%</span></div>`;
    tip.style.opacity = "1";
    const wrap = tip.parentElement.getBoundingClientRect();
    const left = x(i) / W * r.width + (r.left - wrap.left);
    tip.style.left = Math.min(Math.max(4, left - 84), Math.max(4, wrap.width - 172)) + "px";
    tip.style.top = "4px";
  }
  hit.addEventListener("mousemove", move);
  hit.addEventListener("touchmove", e => { move(e); e.preventDefault(); }, {passive:false});
  hit.addEventListener("mouseleave", () => { tip.style.opacity = "0"; cross.setAttribute("opacity", "0"); });
}

/* ---------- navegação ---------- */
const dots = $("#dots");
dots.innerHTML = Array.from({length:TOTAL}, (_,i) =>
  `<button data-go="${i+1}" aria-label="Ir para o passo ${i+1}"></button>`).join("");
dots.querySelectorAll("button").forEach(b => b.onclick = () => show(+b.dataset.go));

function show(n){
  n = Math.max(1, Math.min(TOTAL, n));
  const forward = n > cur;
  cur = n;
  document.querySelectorAll(".step").forEach((s,i) => s.classList.toggle("on", i+1 === n));
  dots.querySelectorAll("button").forEach((b,i) => {
    b.className = i+1 === n ? "now" : (i+1 < n ? "done" : "");
  });
  $("#count").textContent = `Passo ${n} de ${TOTAL}`;
  $("#back").disabled = n === 1;
  $("#next").textContent = n === TOTAL ? "Recomeçar" : "Continuar";
  $("#next").classList.toggle("go-outline", n === TOTAL);
  if(n === 6) playChat();
  if(n >= 7) fillTuesday(); else resetTuesday();
  window.scrollTo({top:0,behavior:"instant"});
}

$("#next").onclick = () => show(cur === TOTAL ? 1 : cur + 1);
$("#back").onclick = () => show(cur - 1);

document.addEventListener("keydown", e => {
  if(e.target.closest("input,textarea")) return;
  if(e.key === "ArrowRight" || e.key === " " || e.key === "Enter"){ e.preventDefault(); show(cur + 1); }
  else if(e.key === "ArrowLeft"){ e.preventDefault(); show(cur - 1); }
  else if(e.key === "Home" || e.key.toLowerCase() === "r"){ show(1); }
});

drawChart();
show(1);
})();
