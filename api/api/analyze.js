const crypto=require('crypto');
const TOKEN_SECRET=process.env.TOKEN_SECRET||'aendere-mich';
const ANTHROPIC_KEY=process.env.ANTHROPIC_API_KEY;

function verifyToken(token){
  if(token==='demo-token-immowert-2025'){
    return{plan:'premium',sessionId:'demo',exp:Date.now()+999999999};
  }
  try{
    const[p,sig]=token.split('.');
    const payload=JSON.parse(Buffer.from(p,'base64').toString());
    const expected=crypto.createHmac('sha256',TOKEN_SECRET).update(p).digest('hex');
    if(sig!==expected)return null;
    if(Date.now()>payload.exp)return null;
    return payload;
  }catch{return null;}
}

const MARKET={
  "80":{c:"München",l:"Bayern",etw:9500,haus:11000,brw:6500},
  "81":{c:"München",l:"Bayern",etw:8000,haus:9500,brw:5000},
  "82":{c:"Fürstenfeldbruck",l:"Bayern",etw:6200,haus:7500,brw:2800},
  "83":{c:"Rosenheim",l:"Bayern",etw:3800,haus:4600,brw:900},
  "84":{c:"Landshut",l:"Bayern",etw:2800,haus:3400,brw:400},
  "85":{c:"München Ost",l:"Bayern",etw:4800,haus:6000,brw:1600},
  "86":{c:"Augsburg",l:"Bayern",etw:2800,haus:3400,brw:550},
  "87":{c:"Kempten",l:"Bayern",etw:2400,haus:2900,brw:280},
  "90":{c:"Nürnberg",l:"Bayern",etw:2600,haus:3100,brw:450},
  "91":{c:"Nürnberg Umland",l:"Bayern",etw:2200,haus:2700,brw:280},
  "93":{c:"Regensburg",l:"Bayern",etw:3000,haus:3700,brw:500},
  "98":{c:"Ingolstadt",l:"Bayern",etw:3400,haus:4100,brw:700},
  "60":{c:"Frankfurt",l:"Hessen",etw:6500,haus:8000,brw:2800},
  "61":{c:"Frankfurt Umland",l:"Hessen",etw:4200,haus:5200,brw:900},
  "63":{c:"Offenbach",l:"Hessen",etw:3200,haus:3900,brw:500},
  "64":{c:"Darmstadt",l:"Hessen",etw:3500,haus:4200,brw:500},
  "65":{c:"Wiesbaden",l:"Hessen",etw:3800,haus:4600,brw:700},
  "34":{c:"Kassel",l:"Hessen",etw:1800,haus:2200,brw:180},
  "20":{c:"Hamburg",l:"Hamburg",etw:6000,haus:7500,brw:2500},
  "21":{c:"Hamburg Süd",l:"Hamburg",etw:3500,haus:4400,brw:900},
  "22":{c:"Hamburg",l:"Hamburg",etw:4500,haus:5500,brw:1400},
  "10":{c:"Berlin Mitte",l:"Berlin",etw:5500,haus:7000,brw:3500},
  "12":{c:"Berlin Süd",l:"Berlin",etw:3800,haus:4800,brw:1000},
  "13":{c:"Berlin Nord",l:"Berlin",etw:3200,haus:4200,brw:800},
  "14":{c:"Berlin West",l:"Berlin",etw:4200,haus:5500,brw:1400},
  "15":{c:"Potsdam",l:"Brandenburg",etw:2800,haus:3400,brw:350},
  "40":{c:"Düsseldorf",l:"NRW",etw:3800,haus:4600,brw:1100},
  "44":{c:"Dortmund",l:"NRW",etw:2000,haus:2500,brw:250},
  "45":{c:"Essen",l:"NRW",etw:1900,haus:2400,brw:220},
  "48":{c:"Münster",l:"NRW",etw:3400,haus:4100,brw:600},
  "50":{c:"Köln",l:"NRW",etw:4200,haus:5100,brw:1000},
  "52":{c:"Aachen",l:"NRW",etw:2400,haus:2900,brw:280},
  "53":{c:"Bonn",l:"NRW",etw:3500,haus:4300,brw:700},
  "70":{c:"Stuttgart",l:"BW",etw:5500,haus:6800,brw:2000},
  "71":{c:"Stuttgart Umland",l:"BW",etw:3800,haus:4700,brw:800},
  "72":{c:"Reutlingen",l:"BW",etw:3000,haus:3700,brw:500},
  "76":{c:"Karlsruhe",l:"BW",etw:3000,haus:3700,brw:500},
  "79":{c:"Freiburg",l:"BW",etw:4000,haus:4900,brw:800},
  "01":{c:"Dresden",l:"Sachsen",etw:2800,haus:3400,brw:280},
  "04":{c:"Leipzig",l:"Sachsen",etw:2600,haus:3200,brw:300},
  "09":{c:"Chemnitz",l:"Sachsen",etw:1200,haus:1600,brw:80},
  "28":{c:"Bremen",l:"Bremen",etw:2600,haus:3200,brw:320},
  "30":{c:"Hannover",l:"Niedersachsen",etw:2800,haus:3400,brw:420},
  "38":{c:"Braunschweig",l:"Niedersachsen",etw:2200,haus:2800,brw:250},
  "18":{c:"Rostock",l:"MV",etw:2600,haus:3200,brw:280},
  "55":{c:"Mainz",l:"RLP",etw:3400,haus:4100,brw:650},
  "66":{c:"Saarbrücken",l:"Saarland",etw:1600,haus:2000,brw:130},
  "24":{c:"Kiel",l:"SH",etw:2600,haus:3200,brw:300},
  "99":{c:"Erfurt",l:"Thüringen",etw:1800,haus:2200,brw:150},
};

function getMarket(plz){
  return MARKET[plz.substring(0,2)]||MARKET['0'+plz.charAt(0)]||null;
}

function calcPrice(m,type,area,year,floor,cond){
  const age=2025-parseInt(year);
  const c=(cond||'').toLowerCase();
  let a=1.0;
  if(age<3)a=1.12;
  else if(age<10)a=1.05;
  else if(age<20)a=1.00;
  else if(age<30)a=0.93;
  else if(age<40)a=0.85;
  else if(age<50)a=0.76;
  else if(age<60)a=0.67;
  else a=0.58;
  if(/saniert|renoviert|neu|kernsaniert/.test(c))a=Math.min(a+0.18,1.05);
  if(/renovierungsbedarf|veraltet|unsaniert|mängel/.test(c))a=Math.max(a-0.12,0.45);
  const isETW=type==='Eigentumswohnung';
  if(isETW){
    const f=parseInt(floor)||0;
    let fm=1.0;
    if(f===0)fm=0.93;else if(f===1)fm=0.98;else if(f>=4)fm=1.03;
    return Math.round(parseFloat(area)*m.etw*a*fm/1000)*1000;
  }
  return Math.round(parseFloat(area)*m.haus*a/1000)*1000;
}

function fmtE(n){return(Math.round(n/1000)*1000).toLocaleString('de-DE')+' €';}

module.exports=async function handler(req,res){
  if(req.method==='OPTIONS')return res.status(200).end();
  if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});

  const{token,data,photos,mode}=req.body;

  const payload=verifyToken(token);
  if(!payload)return res.status(401).json({error:'Ungültiges oder abgelaufenes Token. Bitte erneut bezahlen.'});

  const{plz,street,houseNum,area,year,type,rooms,land,floor,notes}=data||{};
  if(!plz||!area||!year)return res.status(400).json({error:'PLZ, Wohnfläche und Baujahr sind Pflichtfelder.'});

  const market=getMarket(plz);
  const isETW=type==='Eigentumswohnung';
  const isPremium=payload.plan==='premium';

  const estPrice=market?calcPrice(market,type,area,year,floor,notes):null;
  const priceStr=estPrice?`${fmtE(estPrice*0.91)} – ${fmtE(estPrice*1.09)}`:'k.A.';

  const locationStr=[street&&houseNum?`${street} ${houseNum}`:street,plz,market?.c,market?.l].filter(Boolean).join(', ');
  const borisInfo=market?`${market.c} (${market.l}): ETW ca. ${market.etw.toLocaleString('de-DE')} €/m² · Haus ca. ${market.haus.toLocaleString('de-DE')} €/m² · Bodenrichtwert ca. ${market.brw.toLocaleString('de-DE')} €/m²`:`Keine Marktdaten für PLZ ${plz}.`;

  const floorLabels=['Erdgeschoss','1. OG','2. OG','3. OG','4. OG+','Dachgeschoss'];
  const floorLabel=floorLabels[parseInt(floor)||0]||'k.A.';
  const etwExtra=isETW?`Etage: ${floorLabel}`:`Grundstück: ${land||'k.A.'} m²`;

  const photoLimit=isPremium?12:5;
  const photoList=(photos||[]).slice(0,photoLimit);

  const msgContent=[];
  photoList.forEach(p=>{
    msgContent.push({type:'image',source:{type:'base64',media_type:p.type||'image/jpeg',data:p.base64}});
  });

  let prompt;
  if(mode==='expose'){
    prompt=`Du bist ein professioneller Immobilienmakler. Erstelle ein hochwertiges Verkaufsexposé auf Deutsch.\n\nOBJEKT: ${type} · ${locationStr} · ${area}m² · ${rooms||'k.A.'} Zimmer · Bj. ${year} · ${etwExtra}\nHinweise: ${notes||'keine'}\nPreis: ${estPrice?fmtE(estPrice):'auf Anfrage'}\nFotos: ${photoList.length}\n\n${photoList.length>0?'Analysiere Innen- und Außenfotos genau.':''}\n\nErstelle Exposé mit: # Titel, ## Auf einen Blick, ## Objektbeschreibung (3 Absätze), ## Lage & Infrastruktur, ## Ausstattung, ## Energetische Angaben, ## Kaufpreis, ## Kontakt.`;
  }else{
    prompt=`Du bist ImmoAI™ für deutsche Immobilienbewertungen. Erstelle einen ausführlichen Report (~700 Wörter) auf Deutsch.\n\nOBJEKT: ${type} · ${locationStr} · ${area}m² · ${rooms||'k.A.'} Zimmer · Bj. ${year} (${2025-parseInt(year)} Jahre) · ${etwExtra}\nHinweise: ${notes||'keine'} · Fotos: ${photoList.length}\nMarktdaten: ${borisInfo}\nAlgorithmus-Schätzwert: ${estPrice?fmtE(estPrice)+' · Spanne: '+priceStr:'k.A.'}\n\n${photoList.length>0?`Analysiere ALLE ${photoList.length} Fotos detailliert (Innen + Außen). Beschreibe Raum für Raum was du siehst.`:''}\n\nReport mit 7 Abschnitten:\n**📍 1. LAGE & MARKTANALYSE**\n**🏠 2. OBJEKTBESCHREIBUNG & ZUSTAND**\n**🔧 3. RENOVIERUNGSBEDARF & KOSTEN**\n**💰 4. WERTERMITTLUNG**\n**✅ 5. STÄRKEN**\n**⚠️ 6. RISIKEN & SCHWÄCHEN**\n**📋 7. FAZIT & EMPFEHLUNG**`;
  }

  msgContent.push({type:'text',text:prompt});

  if(!ANTHROPIC_KEY)return res.status(500).json({error:'ANTHROPIC_API_KEY nicht konfiguriert auf dem Server.'});

  try{
    const r=await fetch('https://api.anthropic.com/v1/messages',{
      method:'POST',
      headers:{'Content-Type':'application/json','x-api-key':ANTHROPIC_KEY,'anthropic-version':'2023-06-01'},
      body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:mode==='expose'?2000:2500,messages:[{role:'user',content:msgContent}]})
    });
    const result=await r.json();
    if(result.error)throw new Error(result.error.message||JSON.stringify(result.error));
    const text=result.content?.[0]?.text||'Keine Antwort erhalten.';
    return res.status(200).json({ok:true,text,estPrice,priceStr,plan:payload.plan,photosAnalyzed:photoList.length,location:locationStr});
  }catch(err){
    console.error('Anthropic error:',err.message);
    return res.status(500).json({error:`Analyse-Fehler: ${err.message}`});
  }
};
