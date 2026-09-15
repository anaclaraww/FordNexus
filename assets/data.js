/* Ford Nexus — base simulada da demonstração.
   Tudo aqui é fictício. Troque estes valores para demonstrar com outra
   concessionária, outra frota ou outros preços: a interface se ajusta sozinha.

   A fila abre com a linha que a Ford vende hoje no Brasil — Ranger, Territory,
   Bronco Sport e Maverick. São as revisões de ticket mais alto e os clientes que
   voltam para comprar de novo. A frota antiga aparece no fim da lista: ela existe
   e também é receita, mas não é a prioridade comercial. */

const SEED = [
 {id:1,nome:"Rafael M.",modelo:"Ranger XLS 2.2 4x4 2022",vin:"9BFZR22P4N8K31207",placa:"RGV-••22",km:68400,cidade:"Votorantim · Centro",
  servico:"Revisão 70.000 km — óleo, quatro filtros e cambagem",ultima:"13 meses",atraso:96,ticket:2480,
  score:94,f:{urg:37,val:28,prop:19,peca:10},prop:76,
  preco:{tabela:2480,indep:1890,nexus:2190},
  peca:{nome:"Kit revisão 70k Ranger 2.2",cod:"FD-RG-K70P",status:"estoque",eta:"em estoque · 3 kits"},
  janela:"terça, 15/09 · 09:30",troca:186000,
  hist:[{d:"ago/2024",km:"47.100 km",s:"Revisão 50.000 km e troca de freios",o:"Ford Sorocaba",v:2180,out:false},
        {d:"jan/2024",km:"29.400 km",s:"Revisão 30.000 km",o:"Ford Sorocaba",v:1640,out:false},
        {d:"mai/2023",km:"12.800 km",s:"Revisão 10.000 km",o:"Ford Sorocaba",v:890,out:false}]},

 {id:2,nome:"Camila F.",modelo:"Ranger Storm 3.2 2021",vin:"9BFZR32D9M8G60115",placa:"STM-••88",km:96200,cidade:"Sorocaba · Campolim",
  servico:"Filtro de escape saturado + revisão 90.000 km",ultima:"17 meses",atraso:168,ticket:3180,
  score:91,f:{urg:39,val:30,prop:15,peca:7},prop:61,
  preco:{tabela:3180,indep:2560,nexus:2840},
  peca:{nome:"Filtro de escape + óleo diesel 5W30",cod:"FD-32-DPF21",status:"transito",eta:"3 dias de trânsito · pedido hoje"},
  janela:"sexta, 18/09 · 08:00",troca:174000,
  hist:[{d:"abr/2024",km:"78.300 km",s:"Revisão 80.000 km",o:"Ford Sorocaba",v:2740,out:false},
        {d:"set/2023",km:"64.900 km",s:"Troca de amortecedores",o:"Picape Center (fora da rede)",v:2180,out:true},
        {d:"fev/2023",km:"51.200 km",s:"Revisão 50.000 km",o:"Ford Sorocaba",v:2290,out:false}]},

 {id:3,nome:"Jorge A.",modelo:"Territory Titanium 1.5 2021",vin:"9BFZT15T1M8F44902",placa:"TRR-••30",km:58700,cidade:"Itu · Jardim Aeroporto",
  servico:"Revisão 60.000 km + correia de acessórios",ultima:"12 meses",atraso:74,ticket:1620,
  score:89,f:{urg:33,val:26,prop:20,peca:10},prop:83,
  preco:{tabela:1620,indep:1290,nexus:1440},
  peca:{nome:"Kit revisão 60k Territory",cod:"FD-TR-K60T",status:"estoque",eta:"em estoque · 6 kits"},
  janela:"terça, 15/09 · 14:00",troca:128000,
  hist:[{d:"set/2024",km:"46.400 km",s:"Revisão 50.000 km",o:"Ford Sorocaba",v:1480,out:false},
        {d:"set/2023",km:"31.100 km",s:"Revisão 30.000 km",o:"Ford Sorocaba",v:1190,out:false}]},

 {id:4,nome:"Aline R.",modelo:"Maverick Lariat 2.0 2023",vin:"9BFZM20L6P8H03388",placa:"MVK-••54",km:34900,cidade:"Sorocaba · Campolim",
  servico:"Revisão 30.000 km",ultima:"11 meses",atraso:28,ticket:1390,
  score:86,f:{urg:26,val:25,prop:20,peca:8},prop:79,
  preco:{tabela:1390,indep:1150,nexus:1275},
  peca:{nome:"Kit revisão 30k Maverick",cod:"FD-MV-K30L",status:"transito",eta:"3 dias de trânsito · chega 18/09"},
  janela:"sexta, 18/09 · 13:00",troca:196000,
  hist:[{d:"out/2024",km:"21.900 km",s:"Revisão 20.000 km",o:"Ford Sorocaba",v:1180,out:false},
        {d:"mar/2024",km:"10.700 km",s:"Revisão 10.000 km",o:"Ford Sorocaba",v:820,out:false}]},

 {id:5,nome:"Eduardo S.",modelo:"Bronco Sport Wildtrak 2022",vin:"9BFZB20W8N8G91560",placa:"BRC-••76",km:47300,cidade:"Salto · Vila Nova",
  servico:"Revisão 40.000 km + rodízio de pneus",ultima:"15 meses",atraso:142,ticket:1560,
  score:82,f:{urg:34,val:24,prop:14,peca:10},prop:58,
  preco:{tabela:1560,indep:1280,nexus:1420},
  peca:{nome:"Kit revisão 40k Bronco Sport",cod:"FD-BS-K40W",status:"estoque",eta:"em estoque · 4 kits"},
  janela:"quinta, 17/09 · 11:00",troca:203000,
  hist:[{d:"jun/2024",km:"33.200 km",s:"Revisão 30.000 km",o:"Ford Sorocaba",v:1380,out:false},
        {d:"jul/2023",km:"19.800 km",s:"Revisão 20.000 km",o:"Ford Itu",v:1120,out:false}]},

 {id:6,nome:"Helena C.",modelo:"Ranger Limited 3.0 V6 2023",vin:"9BFZR30V2P8J17740",placa:"LMT-••41",km:41800,cidade:"Sorocaba · Além Ponte",
  servico:"Revisão 40.000 km",ultima:"10 meses",atraso:19,ticket:2890,
  score:79,f:{urg:21,val:30,prop:18,peca:10},prop:77,
  preco:{tabela:2890,indep:2310,nexus:2580},
  peca:{nome:"Kit revisão 40k Ranger V6",cod:"FD-RG-K40V",status:"estoque",eta:"em estoque · 2 kits"},
  janela:"quarta, 16/09 · 09:00",troca:289000,
  hist:[{d:"nov/2024",km:"31.600 km",s:"Revisão 30.000 km",o:"Ford Sorocaba",v:2640,out:false},
        {d:"fev/2024",km:"19.200 km",s:"Revisão 20.000 km",o:"Ford Sorocaba",v:2180,out:false}]},

 {id:7,nome:"Marcos V.",modelo:"Territory SEL 1.5 2022",vin:"9BFZT15S5N8G22617",placa:"SEL-••63",km:52100,cidade:"Araçoiaba · Centro",
  servico:"Suspensão dianteira + alinhamento",ultima:"19 meses",atraso:196,ticket:1840,
  score:74,f:{urg:32,val:23,prop:11,peca:8},prop:46,
  preco:{tabela:1840,indep:1440,nexus:1620},
  peca:{nome:"Par de amortecedores dianteiros",cod:"FD-TR-AMD22",status:"transito",eta:"3 dias de trânsito · pedido hoje"},
  janela:"quinta, 17/09 · 15:00",troca:114000,
  hist:[{d:"fev/2024",km:"38.600 km",s:"Revisão 40.000 km",o:"Ford Sorocaba",v:1260,out:false},
        {d:"mai/2023",km:"24.200 km",s:"Troca de pneus",o:"Rede de pneus (fora da rede)",v:3400,out:true}]},

 {id:8,nome:"Patrícia L.",modelo:"Ranger XL 2.2 2020 · frota",vin:"9BFZR22F7L8E58320",placa:"FRT-••09",km:128400,cidade:"Itu · Distrito industrial",
  servico:"Revisão 130.000 km + embreagem",ultima:"14 meses",atraso:118,ticket:4120,
  score:71,f:{urg:31,val:30,prop:8,peca:2},prop:38,
  preco:{tabela:4120,indep:3280,nexus:3690},
  peca:{nome:"Kit embreagem Ranger 2.2",cod:"FD-RG-KEM20",status:"pedir",eta:"sem estoque · 3 dias após o pedido"},
  janela:"quarta, 16/09 · 13:30",troca:118000,
  hist:[{d:"jul/2024",km:"114.700 km",s:"Revisão 120.000 km",o:"Ford Sorocaba",v:3180,out:false},
        {d:"out/2023",km:"98.300 km",s:"Troca de embreagem",o:"Oficina de frota (fora da rede)",v:2900,out:true}]},

 {id:9,nome:"Bruno T.",modelo:"EcoSport Storm 2.0 2021",vin:"9BFZE20S3M8E77104",placa:"ECO-••29",km:63500,cidade:"Sorocaba · Vila Haro",
  servico:"Revisão 60.000 km",ultima:"16 meses",atraso:134,ticket:1180,
  score:66,f:{urg:29,val:18,prop:11,peca:8},prop:49,
  preco:{tabela:1180,indep:940,nexus:1060},
  peca:{nome:"Kit revisão 60k EcoSport 2.0",cod:"FD-ES-K60S",status:"estoque",eta:"em estoque · 5 kits"},
  janela:"quarta, 16/09 · 15:30",troca:86000,
  hist:[{d:"mai/2024",km:"51.400 km",s:"Revisão 50.000 km",o:"Ford Sorocaba",v:1040,out:false}]},

 {id:10,nome:"Sandra P.",modelo:"Ka SE 1.0 2019",vin:"9BFZK10S8K8D41560",placa:"KAS-••17",km:71900,cidade:"Votorantim · Jardim Icatu",
  servico:"Revisão 75.000 km",ultima:"18 meses",atraso:162,ticket:740,
  score:61,f:{urg:30,val:12,prop:10,peca:9},prop:44,
  preco:{tabela:740,indep:580,nexus:645},
  peca:{nome:"Kit filtros + óleo 1.0",cod:"FD-1.0-KTF19",status:"estoque",eta:"em estoque · 9 kits"},
  janela:"quinta, 17/09 · 16:00",troca:41200,
  hist:[{d:"mar/2024",km:"58.200 km",s:"Revisão 60.000 km",o:"Ford Sorocaba",v:690,out:false},
        {d:"jan/2023",km:"41.900 km",s:"Troca de bateria",o:"Auto center avulso (fora da rede)",v:390,out:true}]}
];

const WEEK0 = [
 {d:"Segunda",n:"14/09",occ:78,slots:["07:30 · Revisão Ranger","09:00 · Garantia Territory","10:30 · Diagnóstico Bronco","13:00 · Revisão Maverick",null]},
 {d:"Terça",n:"15/09",occ:52,slots:["08:00 · Recall Territory",null,null,"14:30 · Freios Ranger",null]},
 {d:"Quarta",n:"16/09",occ:61,slots:["07:30 · Câmbio Ranger","10:00 · Revisão Maverick",null,"15:00 · Revisão Territory",null]},
 {d:"Quinta",n:"17/09",occ:45,slots:["09:00 · Revisão Bronco",null,null,null,"16:00 · Garantia Ranger"]},
 {d:"Sexta",n:"18/09",occ:83,slots:["07:30 · Motor Ranger","09:00 · Revisão Territory","11:00 · Embreagem Ranger","13:30 · Revisão EcoSport","15:30 · Diagnóstico Maverick"]}
];

const NET = [
 ["Picape Center Bandeirantes · Éden","3 de 4","41","certificada"],
 ["Auto Center Vila Haro · Vila Haro","2 de 3","28","certificada"],
 ["Oficina Progresso · Além Ponte","2 de 2","19","certificada"],
 ["Garagem 27 · Votorantim","1 de 4","11","em certificação"],
 ["Diesel & Cia · Araçoiaba","0 de 3","—","em certificação"],
 ["Auto Nova Salto · Salto","0 de 2","—","candidata"]
];

const CERT = [
 ["01","Mecânico aprovado na prova Ford","40 h de treinamento por sistema do veículo, com módulo específico de picape diesel e reavaliação anual"],
 ["02","Peça genuína rastreada","compra pelo canal da concessionária da região, com nota vinculada ao chassi"],
 ["03","Checklist de 32 pontos","mesmo roteiro da concessionária, assinado digitalmente ao fim do serviço"],
 ["04","Preço tabelado publicado","tabela por serviço e região visível ao cliente antes da autorização"],
 ["05","Garantia chancelada","12 meses na mão de obra, coberta pela marca e não pela oficina"]
];

const RISK = [
 ["ALTO","Conflito de canal","a loja vira distribuidora de peça da rede certificada e participa da receita do ponto"],
 ["ALTO","LGPD e dado compartilhado","consentimento granular preso ao VIN, revogável na conversa, contrato de operador por concessionária"],
 ["ALTO","Integração com o DMS","camada de conectores; o piloto começa por exportação padrão de ordens, sem depender de API do fornecedor"],
 ["MÉDIO","Estoque parado","peça pré-posicionada que não vira serviço volta ao giro em 5 dias; o teto de exposição é 2% do estoque"]
];

const AB = [
 ["Service share","42,3%","31,4%","+10,9 p.p."],
 ["Receita de pós-venda por veículo/ano","R$ 1.084","R$ 806","+34%"],
 ["OS sem espera de peça","91%","63%","+28 p.p."],
 ["Ocupação média da oficina","81%","64%","+17 p.p."],
 ["Custo por OS recuperada","3% da OS","—","—"]
];

const MESES=["out","nov","dez","jan","fev","mar","abr","mai","jun","jul","ago","set"];
const SER_NEXUS=[31.2,32.0,33.4,34.9,36.1,37.0,38.2,39.1,39.9,40.8,41.6,42.3];
const SER_CTRL =[31.1,31.4,30.9,31.6,31.2,30.8,31.5,31.9,31.3,30.9,31.7,31.4];

const PART_LABEL={estoque:["ok","Em estoque"],transito:["warn","3 dias de trânsito"],pedir:["crit","Pedir hoje"]};
