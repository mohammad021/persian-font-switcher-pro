// ==UserScript==
// @name         Persian Font Switcher Pro v12
// @namespace    http://tampermonkey.net/
// @version      12.0
// @description  Trusted-Types-safe Persian font switcher with element picker, per-site memory & more
// @author       Mohammad Yamini - wpnaji.ir
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @noframes
// @updateURL    https://raw.githubusercontent.com/mohammad021/persian-font-switcher-pro/main/Persian-Font-Switcher-Pro.user.js
// @downloadURL  https://raw.githubusercontent.com/mohammad021/persian-font-switcher-pro/main/Persian-Font-Switcher-Pro.user.js
// ==/UserScript==


(function(){
'use strict';

// ═══ FONTS ═══
const BUILTIN={
vazirmatn:{l:'وزیرمتن',c:'google',f:'Vazirmatn',u:'https://fonts.googleapis.com/css2?family=Vazirmatn:wght@100;200;300;400;500;600;700;800;900&display=swap'},
parastoo:{l:'پرستو',c:'rastikerdar',f:'Parastoo',u:'https://cdn.jsdelivr.net/gh/rastikerdar/parastoo-font/dist/font-face.css'},
tanha:{l:'تنها',c:'rastikerdar',f:'Tanha',u:'https://cdn.jsdelivr.net/gh/rastikerdar/tanha-font/dist/font-face.css'},
nahid:{l:'ناهید',c:'rastikerdar',f:'Nahid',u:'https://cdn.jsdelivr.net/gh/rastikerdar/nahid-font/dist/font-face.css'},
gandom:{l:'گندم',c:'rastikerdar',f:'Gandom',u:'https://cdn.jsdelivr.net/gh/rastikerdar/gandom-font/dist/font-face.css'},
samim:{l:'صمیم',c:'rastikerdar',f:'Samim',u:'https://cdn.jsdelivr.net/gh/rastikerdar/samim-font/dist/font-face.css'},
shabnam:{l:'شبنم',c:'rastikerdar',f:'Shabnam',u:'https://cdn.jsdelivr.net/gh/rastikerdar/shabnam-font/dist/font-face.css'},
sahel:{l:'ساحل',c:'rastikerdar',f:'Sahel',u:'https://cdn.jsdelivr.net/gh/rastikerdar/sahel-font/dist/font-face.css'},
BBadr:{l:'بدر',c:'bseries',f:'BBadr'},BBaran:{l:'باران',c:'bseries',f:'BBaran'},BBardiya:{l:'بردیا',c:'bseries',f:'BBardiya'},
BCompset:{l:'کامپست',c:'bseries',f:'BCompset'},BDavat:{l:'دعوت',c:'bseries',f:'BDavat'},BElham:{l:'الهام',c:'bseries',f:'BElham'},
BEsfehanBold:{l:'اصفهان بولد',c:'bseries',f:'BEsfehanBold'},BFantezy:{l:'فانتزی',c:'bseries',f:'BFantezy'},
BFarnaz:{l:'فرناز',c:'bseries',f:'BFarnaz'},BFerdosi:{l:'فردوسی',c:'bseries',f:'BFerdosi'},
BHamid:{l:'حمید',c:'bseries',f:'BHamid'},BHelal:{l:'هلال',c:'bseries',f:'BHelal'},
BHoma:{l:'هما',c:'bseries',f:'BHoma'},BJadidBold:{l:'جدید بولد',c:'bseries',f:'BJadidBold'},
BJalal:{l:'جلال',c:'bseries',f:'BJalal'},BKoodakBold:{l:'کودک بولد',c:'bseries',f:'BKoodakBold'},
BKourosh:{l:'کوروش',c:'bseries',f:'BKourosh'},BLotus:{l:'لوتوس',c:'bseries',f:'BLotus'},
BMahsa:{l:'مهسا',c:'bseries',f:'BMahsa'},BMehrBold:{l:'مهر بولد',c:'bseries',f:'BMehrBold'},
BMitra:{l:'میترا',c:'bseries',f:'BMitra'},BMorvarid:{l:'مروارید',c:'bseries',f:'BMorvarid'},
BNarm:{l:'نرم',c:'bseries',f:'BNarm'},BNasimBold:{l:'نسیم بولد',c:'bseries',f:'BNasimBold'},
BNazanin:{l:'نازنین',c:'bseries',f:'BNazanin'},BRoya:{l:'رویا',c:'bseries',f:'BRoya'},
BSetarehBold:{l:'ستاره بولد',c:'bseries',f:'BSetarehBold'},BShiraz:{l:'شیراز',c:'bseries',f:'BShiraz'},
BSinaBold:{l:'سینا بولد',c:'bseries',f:'BSinaBold'},BTabassom:{l:'تبسم',c:'bseries',f:'BTabassom'},
BTehran:{l:'تهران',c:'bseries',f:'BTehran'},BTitrBold:{l:'تیتر بولد',c:'bseries',f:'BTitrBold'},
BTitrTGEBold:{l:'تیتر TGE',c:'bseries',f:'BTitrTGEBold'},BTraffic:{l:'ترافیک',c:'bseries',f:'BTraffic'},
BVahidBold:{l:'وحید بولد',c:'bseries',f:'BVahidBold'},BYagut:{l:'یاقوت',c:'bseries',f:'BYagut'},
BYas:{l:'یاس',c:'bseries',f:'BYas'},BYekan:{l:'یکان',c:'bseries',f:'BYekan'},
BZar:{l:'زر',c:'bseries',f:'BZar'},BZiba:{l:'زیبا',c:'bseries',f:'BZiba'},
IranianSans:{l:'ایرانیان سنز',c:'bseries',f:'IranianSans'}
};
const BB='https://cdn.jsdelivr.net/gh/intuxicated/css-persian@master/fonts/';
const PF='Tahoma,Arial,sans-serif';

// ═══ HELPERS ═══
const sk=()=>{try{return location.hostname.replace(/^www\./,'').toLowerCase();}catch(e){return'unknown';}};
const gS=()=>GM_getValue('sites',{});
const gSD=(s)=>(gS()[s||sk()]||{});
const sSD=(k,v)=>{const a=gS();if(!a[sk()])a[sk()]={};a[sk()][k]=v;GM_setValue('sites',a);};
const sSF=(s,f)=>{const a=gS();if(!a[s])a[s]={};a[s].font=f;GM_setValue('sites',a);};
const dS=s=>{const a=gS();delete a[s];GM_setValue('sites',a);};
const gCF=()=>GM_getValue('cfonts',{});
const sCF=v=>GM_setValue('cfonts',v);
const aF=()=>({...BUILTIN,...gCF()});
const isCSSUrl=u=>/\.css|googleapis\.com|font-face/i.test(u);
const fFm=u=>{const l=u.toLowerCase();return l.includes('.woff2')?'woff2':l.includes('.woff')?'woff':l.includes('.ttf')?'truetype':'woff2';};
const gFC=()=>GM_getValue('fCache',{});
const sFC=v=>GM_setValue('fCache',v);

// ═══ DOM BUILDER (no innerHTML) ═══
function E(tag,attrs,children){
const el=document.createElement(tag);
if(attrs){
    if(attrs.cls)el.className=attrs.cls;
    if(attrs.text)el.textContent=attrs.text;
    if(attrs.css)el.style.cssText=attrs.css;
    if(attrs.id)el.id=attrs.id;
    if(attrs.type)el.type=attrs.type;
    if(attrs.name)el.name=attrs.name;
    if(attrs.value)el.value=attrs.value;
    if(attrs.placeholder)el.placeholder=attrs.placeholder;
    if(attrs.checked)el.checked=true;
    if(attrs.title)el.title=attrs.title;
    if(attrs.href){el.href=attrs.href;el.target='_blank';}
    if(attrs.accept)el.accept=attrs.accept;
    if(attrs.data)Object.entries(attrs.data).forEach(([k,v])=>el.dataset[k]=v);
    if(attrs.on)Object.entries(attrs.on).forEach(([ev,fn])=>el.addEventListener(ev,fn));
}
if(children){
    (Array.isArray(children)?children:[children]).forEach(c=>{
        if(!c)return;
        if(typeof c==='string')el.appendChild(document.createTextNode(c));
        else el.appendChild(c);
    });
}
return el;
}

// ═══ STATE ═══
const sd=gSD();
let cF=sd.font||'__default__';
let en=sd.fontEnabled!==undefined?sd.fontEnabled:true;
let rtl=sd.rtl||false;
let mini=GM_getValue('mini',false);
let vis=GM_getValue('vis',true);
let thm=GM_getValue('thm','dark');
let mM=GM_getValue('mM','pinned');
let vC=GM_getValue('vC',{google:true,rastikerdar:true,bseries:true,custom:true});
let aS=GM_getValue('aS',{google:false,rastikerdar:false,bseries:false,custom:false,tools:false});
let aD=GM_getValue('aD','closed');
let vw='main';
let pP=GM_getValue('pP',null);
let mP=GM_getValue('mP',null);
let fSE=null,rSE=null,exSE=null;
let lF={};
let hE=null,sh=null;
let eSite=null;
let pickMode='exclude'; // 'exclude' | 'fontassign'
let pickFont=null; // font key for assignment
let picking=false;

// ═══ FONT LOAD ═══
function cFCa(k,u){const c=gFC();if(c[k]){iCSS(k,c[k]);return;}
try{GM_xmlhttpRequest({method:'GET',url:u,onload:r=>{if(r.status===200){c[k]=r.responseText;sFC(c);iCSS(k,r.responseText);}else iLnk(k,u);},onerror:()=>iLnk(k,u)});}catch(e){iLnk(k,u);}}
function iCSS(k,css){if(document.getElementById('pfs-'+k))return;const s=document.createElement('style');s.id='pfs-'+k;s.textContent=css;document.head.appendChild(s);}
function iLnk(k,u){if(document.getElementById('pfs-'+k))return;const l=document.createElement('link');l.rel='stylesheet';l.href=u;l.id='pfs-'+k;document.head.appendChild(l);}
function ldF(k){if(lF[k])return;lF[k]=true;const c=aF()[k];if(!c)return;
if(c.u)cFCa(k,c.u);else if(c.cssUrl)cFCa(k,c.cssUrl);
else if(c.c==='bseries')iCSS(k,`@font-face{font-family:'${c.f}';src:url('${BB}${c.f}.woff') format('woff'),url('${BB}${c.f}.ttf') format('truetype');font-display:swap;}`);
else if(c.fontUrl)iCSS(k,`@font-face{font-family:'${c.f}';src:url('${c.fontUrl}') format('${fFm(c.fontUrl)}');font-display:swap;}`);
else if(c.dataUrl)iCSS(k,`@font-face{font-family:'${c.f}';src:url('${c.dataUrl}');font-display:swap;}`);}

// ═══ APPLY FONT ═══
function apF(k){
    rmF();
    rmEx();

    if(!en || k === '__default__') return;

    const c = aF()[k];
    if(!c) return;

    ldF(k);

    const siteData = gSD();
    const rawUserExcl = siteData.excludeSelectors || [];

    // فقط سلکتورهای معتبر را نگه می‌داریم تا CSS خراب نشود
    const userExcl = rawUserExcl
        .map(s => String(s || '').trim())
        .filter(Boolean)
        .filter(s => {
            try {
                document.querySelector(s);
                return true;
            } catch(e) {
                return false;
            }
        });

    /*
      نکته مهم:
      دیگر برای آیکن‌ها font-family: inherit نمی‌گذاریم.
      چون inherit باعث می‌شود آیکن فونت فارسی والد را بگیرد.
    */

    const builtinExcl = [
        '#pfs-h',
        '#pfs-h *',

        'svg',
        'svg *',
        'code',
        'pre',
        'kbd',
        'samp',
        'var',

        '[class*="fa-"]',
        '[class^="fa "]',
        '.fa',
        '.fas',
        '.far',
        '.fab',
        '.fal',
        '.fad',
        '.fat',
        '.fass',
        '.fasr',
        '.fasl',

        '.material-icons',
        '.material-icons-extended',
        '.material-symbols-outlined',
        '.material-symbols-rounded',
        '.material-symbols-sharp',
        '[class*="material-icons"]',
        '[class*="material-symbols"]',

        '.google-symbols',
        '[class*="google-symbol"]',
        '[class*="GoogleSymbols"]',

        '[class*="glyphicon"]',
        '[class*="icon"]',
        '[class*="Icon"]',
        '[class*="symbol"]',
        '[class*="Symbol"]',

        '[class*="ion-"]',
        '[class*="ti-"]',
        '[class*="bi-"]',
        '[class*="bx-"]',
        '[class*="ri-"]',
        '[class*="icofont"]',
        '[class*="flaticon"]',
        '[class*="feather"]',
        '[class*="lni-"]',
        '[class*="pi-"]',
        '[class*="la-"]',

        '.las',
        '.lab',
        '.lar',

        '[data-icon]',
        '[data-glyph]',

        '[class*="goog-"]',
        '[class*="google_"]',

        '[class*="emoji"]',
        '[class*="Emoji"]',
        '[class*="decor"]',
        '[class*="Decor"]',
        '[class*="decoration"]',
        '[class*="ornament"]',
        '[class*="logo"]',
        '[class*="Logo"]',
        '[class*="rating"]',
        '[class*="star"]',
        '[class*="flag-icon"]',
        '[class*="country-flag"]',
        '[class*="avatar"]',

        '[role="img"]',
        '[aria-hidden="true"]'
    ];

    const notParts = [];

    // استثناهای داخلی
    builtinExcl.forEach(s => {
        notParts.push(`:not(${s})`);
    });

    // استثناهای دستی کاربر:
    // هم خود سلکتور، هم فرزندانش از اعمال فونت خارج می‌شوند
    userExcl.forEach(s => {
        notParts.push(`:not(${s})`);
        notParts.push(`:not(${s} *)`);
    });

    const notPart = notParts.join('');

    /*
      این بخش برای فونت‌های آیکنی معروف است.
      اینجا دیگر inherit نمی‌دهیم؛ فونت واقعی خود آیکن را برمی‌گردانیم.
    */
    const iconFixCSS = `
.material-icons,
.material-icons-extended,
[class*="material-icons"] {
    font-family: "Material Icons Extended","Material Icons" !important;
    font-weight: normal !important;
    font-style: normal !important;
    line-height: 1 !important;
    letter-spacing: normal !important;
    text-transform: none !important;
    white-space: nowrap !important;
    word-wrap: normal !important;
    direction: ltr !important;
    -webkit-font-feature-settings: "liga" !important;
    -webkit-font-smoothing: antialiased !important;
}

.material-symbols-outlined,
[class*="material-symbols-outlined"] {
    font-family: "Material Symbols Outlined" !important;
    font-weight: normal !important;
    font-style: normal !important;
    line-height: 1 !important;
    letter-spacing: normal !important;
    text-transform: none !important;
    white-space: nowrap !important;
    word-wrap: normal !important;
    direction: ltr !important;
    -webkit-font-feature-settings: "liga" !important;
    -webkit-font-smoothing: antialiased !important;
}

.material-symbols-rounded,
[class*="material-symbols-rounded"] {
    font-family: "Material Symbols Rounded" !important;
    font-weight: normal !important;
    font-style: normal !important;
    line-height: 1 !important;
    letter-spacing: normal !important;
    text-transform: none !important;
    white-space: nowrap !important;
    word-wrap: normal !important;
    direction: ltr !important;
    -webkit-font-feature-settings: "liga" !important;
    -webkit-font-smoothing: antialiased !important;
}

.material-symbols-sharp,
[class*="material-symbols-sharp"] {
    font-family: "Material Symbols Sharp" !important;
    font-weight: normal !important;
    font-style: normal !important;
    line-height: 1 !important;
    letter-spacing: normal !important;
    text-transform: none !important;
    white-space: nowrap !important;
    word-wrap: normal !important;
    direction: ltr !important;
    -webkit-font-feature-settings: "liga" !important;
    -webkit-font-smoothing: antialiased !important;
}

.google-symbols,
[class*="google-symbol"],
[class*="GoogleSymbols"] {
    font-family: "Google Symbols" !important;
    font-weight: normal !important;
    font-style: normal !important;
    line-height: 1 !important;
    letter-spacing: normal !important;
    text-transform: none !important;
    white-space: nowrap !important;
    word-wrap: normal !important;
    direction: ltr !important;
    -webkit-font-feature-settings: "liga" !important;
    -webkit-font-smoothing: antialiased !important;
}

.fa,
.fas,
.far,
.fab,
.fal,
.fad,
.fat,
[class*="fa-"],
[class^="fa "] {
    font-family: "Font Awesome 6 Free","Font Awesome 6 Brands","Font Awesome 5 Free","Font Awesome 5 Brands","FontAwesome" !important;
}

[class*="glyphicon"] {
    font-family: "Glyphicons Halflings" !important;
}

[class*="ion-"] {
    font-family: "Ionicons" !important;
}

[class*="bi-"] {
    font-family: "bootstrap-icons" !important;
}

[class*="bx-"] {
    font-family: "boxicons" !important;
}

[class*="ri-"] {
    font-family: "remixicon" !important;
}
`;

    fSE = document.createElement('style');
    fSE.id = 'pfs-act';

    fSE.textContent = `
*${notPart} {
    font-family: "${c.f}", Tahoma, Arial, sans-serif !important;
}

input${notPart},
textarea${notPart},
select${notPart},
button${notPart} {
    font-family: "${c.f}", Tahoma, Arial, sans-serif !important;
}

${iconFixCSS}
`;

    document.head.appendChild(fSE);

    /*
      استایل جداگانه برای استثناهای دستی:
      اینجا هم inherit نمی‌دهیم.
      فقط چند فونت آیکنی گوگل را تقویت می‌کنیم.
      خودِ حذف از اعمال فونت در notPart انجام شده.
    */
    if(userExcl.length > 0){
        exSE = document.createElement('style');
        exSE.id = 'pfs-excl';

        exSE.textContent = userExcl.map(s => `
${s}.material-icons,
${s}.material-icons-extended,
${s} .material-icons,
${s} .material-icons-extended {
    font-family: "Material Icons Extended","Material Icons" !important;
}

${s}.material-symbols-outlined,
${s} .material-symbols-outlined {
    font-family: "Material Symbols Outlined" !important;
}

${s}.material-symbols-rounded,
${s} .material-symbols-rounded {
    font-family: "Material Symbols Rounded" !important;
}

${s}.material-symbols-sharp,
${s} .material-symbols-sharp {
    font-family: "Material Symbols Sharp" !important;
}

${s}.google-symbols,
${s} .google-symbols {
    font-family: "Google Symbols" !important;
}
`).join('\n');

        document.head.appendChild(exSE);
    }
        // Apply per-selector fonts
    const selFonts = siteData.selectorFonts || {};
    const selFontEntries = Object.entries(selFonts);
    if(selFontEntries.length > 0){
        const sfStyle = document.createElement('style');
        sfStyle.id = 'pfs-selfont';
        sfStyle.textContent = selFontEntries.map(([sel, fontKey]) => {
            const fc = aF()[fontKey];
            if(!fc) return '';
            ldF(fontKey);
            return `${sel}, ${sel} * { font-family: "${fc.f}", Tahoma, Arial, sans-serif !important; }`;
        }).join('\n');
        document.head.appendChild(sfStyle);
    }
}
function rmF(){
    if(fSE){fSE.remove();fSE=null;}
    const sf=document.getElementById('pfs-selfont');if(sf)sf.remove();
}

function rmEx(){if(exSE){exSE.remove();exSE=null;}}

// ═══ RTL ═══
function apR(on){if(rSE){rSE.remove();rSE=null;}
if(!on){document.documentElement.removeAttribute('data-pfs-rtl');return;}
document.documentElement.setAttribute('data-pfs-rtl','1');document.documentElement.dir='rtl';
rSE=document.createElement('style');rSE.id='pfs-rtl';
rSE.textContent=`html[data-pfs-rtl="1"],html[data-pfs-rtl="1"] body{direction:rtl!important;text-align:right!important}
html[data-pfs-rtl="1"] *:not(#pfs-h):not(#pfs-h *):not(code):not(pre):not(svg):not(svg *){direction:rtl!important;text-align:right!important}`;
document.head.appendChild(rSE);}

const tC=()=>thm==='light'
?{bg:'#fff',hb:'linear-gradient(135deg,#f8f9fa,#e9ecef)',tx:'#333',bd:'#e0e0e0',sh:'rgba(0,0,0,.12)'}
:{bg:'#1a1a2e',hb:'linear-gradient(135deg,#0f3460,#16213e)',tx:'#e0e0e0',bd:'#1e1e3a',sh:'rgba(0,0,0,.5)'};

// ═══ ELEMENT PICKER ═══
let pickOv=null,pickLb=null,pickTgt=null;
function genSel(el){
    if(!el||el===document.body||el===document.documentElement)return null;
    if(el.id&&!/^pfs/.test(el.id))return '#'+el.id;
    const cls=Array.from(el.classList||[]).filter(c=>c&&!/^pfs/.test(c));
    if(cls.length){
        const s='.'+cls.join('.');
        try{document.querySelector(s);return s;}catch(e){}
    }
    const tag=el.tagName.toLowerCase();
    if(cls.length)return tag+'.'+cls[0];
    const parent=el.parentElement;
    if(parent){
        const pSel=genSel(parent);
        const siblings=Array.from(parent.children).filter(c=>c.tagName===el.tagName);
        if(siblings.length>1){
            const idx=siblings.indexOf(el)+1;
            return (pSel||parent.tagName.toLowerCase())+' > '+tag+':nth-of-type('+idx+')';
        }
        return (pSel||parent.tagName.toLowerCase())+' > '+tag;
    }
    return tag;
}

function startPicker(mode,fontKey){
    pickMode=mode||'exclude';
    pickFont=fontKey||null;
    picking=true;

    pickOv=E('div',{id:'pfs-pick-ov',css:'position:fixed;pointer-events:none;border:3px solid '+(pickMode==='exclude'?'#e94560':'#4caf50')+';background:rgba('+(pickMode==='exclude'?'233,69,96':'76,175,80')+',.15);z-index:2147483646;display:none;border-radius:4px;'});
    document.body.appendChild(pickOv);

    pickLb=E('div',{id:'pfs-pick-lb',css:'position:fixed;pointer-events:none;background:'+(pickMode==='exclude'?'#e94560':'#4caf50')+';color:#fff;font-size:11px;padding:4px 10px;border-radius:6px;z-index:2147483646;font-family:monospace;direction:ltr;white-space:nowrap;display:none;box-shadow:0 2px 10px rgba(0,0,0,.3);'});
    document.body.appendChild(pickLb);

    const bannerColor=pickMode==='exclude'?'linear-gradient(135deg,#e94560,#c23152)':'linear-gradient(135deg,#4caf50,#388e3c)';
    const bannerText=pickMode==='exclude'?'🎯 انتخاب المان برای استثنا از فونت':'🎨 انتخاب المان برای اختصاص فونت: '+(aF()[pickFont]?.l||pickFont);
    const cancelBtn=E('button',{text:'لغو (Esc)',css:'background:#fff;color:#333;border:none;padding:4px 14px;border-radius:6px;cursor:pointer;font-weight:700;font-size:12px;margin-right:8px;',on:{click:()=>stopPicker()}});
    const banner=E('div',{id:'pfs-pick-banner',css:'position:fixed;top:0;left:0;right:0;background:'+bannerColor+';color:#fff;text-align:center;padding:10px;font-size:13px;font-family:Tahoma,sans-serif;z-index:2147483647;direction:rtl;pointer-events:auto;'},[
    E('b',{text:bannerText}),' | ',cancelBtn]);
    document.body.appendChild(banner);

    document.addEventListener('mousemove',pickMv,true);
    document.addEventListener('click',pickCk,true);
    document.addEventListener('keydown',pickKy,true);
    document.body.style.cursor='crosshair';
}

function pickCk(e){
    if(!picking)return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
    if(!pickTgt)return;const sel=genSel(pickTgt);if(!sel){stopPicker();return;}
    const all=gS();const s=sk();if(!all[s])all[s]={};

    if(pickMode==='exclude'){
        if(!all[s].excludeSelectors)all[s].excludeSelectors=[];
        if(!all[s].excludeSelectors.includes(sel)){
            all[s].excludeSelectors.push(sel);
        }
    } else if(pickMode==='fontassign'&&pickFont){
        if(!all[s].selectorFonts)all[s].selectorFonts={};
        all[s].selectorFonts[sel]=pickFont;
    }

    GM_setValue('sites',all);
    apF(cF);
    stopPicker();
    render();
}

function stopPicker(){picking=false;
document.removeEventListener('mousemove',pickMv,true);
document.removeEventListener('click',pickCk,true);
document.removeEventListener('keydown',pickKy,true);
document.body.style.cursor='';
['pfs-pick-ov','pfs-pick-lb','pfs-pick-banner'].forEach(id=>{const e=document.getElementById(id);if(e)e.remove();});
pickOv=null;pickLb=null;pickTgt=null;}

function pickMv(e){if(!picking)return;
const el=document.elementFromPoint(e.clientX,e.clientY);
if(!el||el.id?.startsWith('pfs-pick')||el.closest('#pfs-h')||el.closest('#pfs-pick-banner'))return;
pickTgt=el;const r=el.getBoundingClientRect();
if(pickOv){pickOv.style.display='block';pickOv.style.left=r.left+'px';pickOv.style.top=r.top+'px';pickOv.style.width=r.width+'px';pickOv.style.height=r.height+'px';}
const sel=genSel(el);
if(pickLb&&sel){pickLb.style.display='block';pickLb.textContent=sel;
let lx=e.clientX+12,ly=e.clientY-30;if(lx+200>window.innerWidth)lx=e.clientX-200;if(ly<0)ly=e.clientY+20;
pickLb.style.left=lx+'px';pickLb.style.top=ly+'px';}}

function pickCk(e){if(!picking)return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
if(!pickTgt)return;const sel=genSel(pickTgt);if(!sel){stopPicker();return;}
const all=gS();const s=sk();if(!all[s])all[s]={};if(!all[s].excludeSelectors)all[s].excludeSelectors=[];
if(!all[s].excludeSelectors.includes(sel)){all[s].excludeSelectors.push(sel);GM_setValue('sites',all);apF(cF);}
stopPicker();render();}

function pickKy(e){if(e.key==='Escape'){e.preventDefault();stopPicker();}}

// ═══ SHADOW ═══
function eSh(){if(hE&&document.body.contains(hE))return sh;
hE=document.createElement('div');hE.id='pfs-h';
hE.style.cssText='position:fixed!important;top:0!important;left:0!important;width:100vw!important;height:100vh!important;z-index:2147483647!important;pointer-events:none!important;overflow:visible!important;padding:0!important;margin:0!important;border:none!important;background:none!important;';
document.body.appendChild(hE);sh=hE.attachShadow({mode:'open'});
const s=document.createElement('style');s.textContent=CSS();sh.appendChild(s);return sh;}

function render(){const sr=eSh();sr.querySelectorAll('.pp,.mb').forEach(e=>e.remove());
if(mini){renderMin(sr);return;}if(!vis)return;renderP(sr);}
function restore(){mini=false;vis=true;GM_setValue('mini',false);GM_setValue('vis',true);render();}
function doMini(){mini=true;vis=false;GM_setValue('mini',true);GM_setValue('vis',false);render();}

// ═══ PANEL BUILDER ═══
function renderP(sr){
const c=tC(),af=aF();
const fl=cF==='__default__'?'پیش‌فرض':(af[cF]?.l||cF);
const titles={main:'انتخابگر فونت',settings:'⚙️ تنظیمات',about:'ℹ️ درباره',siteEdit:'✏️ ویرایش سایت'};

// Header buttons
const hBtns=[];
if(vw!=='main')hBtns.push(hBtn('↩️','back','بازگشت'));
if(vw==='main'){
hBtns.push(hBtn(en?'✅':'⬜','toggle',en?'غیرفعال':'فعال'));
hBtns.push(hBtn(rtl?'⬅️':'↔️','togglertl',rtl?'LTR':'RTL'));
hBtns.push(hBtn('🎯','picker','انتخاب المان'));
hBtns.push(hBtn('🎨','fontpicker','اختصاص فونت به بخش'));
hBtns.push(hBtn('⚙️','settings','تنظیمات'));
}
hBtns.push(hBtn('➖','minimize','مینیمایز'));
hBtns.push(hBtn('✕','close','بستن','hbx'));

const header=E('div',{cls:'hdr',css:'background:'+c.hb},[
E('div',{cls:'hr'},[E('span',{cls:'logo',text:'فا'}),E('div',{cls:'hi'},[E('span',{cls:'ht',text:titles[vw]||''}),E('span',{cls:'hs',text:(en?fl:'غیرفعال')+' • '+sk()})])]),
E('div',{cls:'hl'},hBtns)]);

let bodyContent;
if(vw==='main')bodyContent=buildMain();
else if(vw==='settings')bodyContent=buildSettings();
else if(vw==='about')bodyContent=buildAbout();
else if(vw==='siteEdit')bodyContent=buildSiteEdit();

const footerBtns=[];
if(vw==='main'){footerBtns.push(E('button',{cls:'fb',text:'🔄 بازنشانی',data:{a:'reset'},on:{click:doAction}}));
footerBtns.push(E('button',{cls:'fb',text:'ℹ️ درباره',data:{a:'about'},on:{click:doAction}}));}

const p=E('div',{cls:'pp',css:`position:fixed;${pP?'left:'+pP.x+'px;top:'+pP.y+'px;':'right:20px;top:20px;'}width:320px;max-height:85vh;border-radius:16px;overflow:hidden;font-family:${PF};direction:rtl;font-size:13px;line-height:1.5;background:${c.bg};border:1px solid ${c.bd};color:${c.tx};box-shadow:0 20px 60px ${c.sh};z-index:2147483647;animation:pfi .3s ease;pointer-events:auto!important;`},
[header,E('div',{cls:'bd'},[bodyContent,E('div',{cls:'ft'},footerBtns)])]);

sr.appendChild(p);
mkDrag(p,header,(x,y)=>{pP={x,y};GM_setValue('pP',pP);});
}

function hBtn(text,action,title,extraCls){
return E('button',{cls:'hb'+(extraCls?' '+extraCls:''),text:text,title:title,data:{a:action},on:{click:doAction}});
}

function doAction(e){
e.stopPropagation();const a=e.currentTarget.dataset.a;
if(a==='close'||a==='minimize'){doMini();return;}
if(a==='back'){if(vw==='siteEdit'){vw='settings';eSite=null;}else vw='main';render();return;}
if(a==='toggle'){en=!en;sSD('fontEnabled',en);en?apF(cF):rmF();render();return;}
if(a==='togglertl'){rtl=!rtl;sSD('rtl',rtl);apR(rtl);render();return;}
if(a==='picker'){doMini();setTimeout(()=>startPicker(),300);return;}
if(a==='fontpicker'){
    // Show font picker dialog
    showFontPickerDialog();
    return;
}
    function showFontPickerDialog(){
    const sr=eSh();
    // Remove existing dialog
    const old=sr.querySelector('.fpd');if(old)old.remove();

    const af=aF();
    const fontEntries=Object.entries(af);

    const searchInp=E('input',{cls:'sinp',type:'text',placeholder:'🔍 جستجو فونت...',on:{input:e=>{
        const v=e.target.value.trim().toLowerCase();
        dialog.querySelectorAll('.fpd-item').forEach(i=>{
            const cfg=af[i.dataset.fk];if(!cfg){i.style.display='none';return;}
            i.style.display=(!v||cfg.l.includes(v)||cfg.f.toLowerCase().includes(v))?'':'none';
        });
    }}});

    const fontList=E('div',{css:'max-height:50vh;overflow-y:auto;scrollbar-width:thin'},
        fontEntries.map(([k,v])=>{
            return E('div',{cls:'fpd-item fi',data:{fk:k},on:{click:()=>{
                dialog.remove();
                doMini();
                setTimeout(()=>startPicker('fontassign',k),300);
            }}},[E('span',{cls:'fl',text:v.l}),E('span',{cls:'fn',text:v.f})]);
        })
    );

    const cancelBtn=E('button',{cls:'fb',text:'لغو',css:'margin-top:8px;width:100%',on:{click:()=>dialog.remove()}});

    const dialog=E('div',{cls:'fpd pp',css:'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:300px;max-height:70vh;border-radius:16px;overflow:hidden;font-family:'+PF+';direction:rtl;font-size:13px;line-height:1.5;background:'+tC().bg+';border:1px solid '+tC().bd+';color:'+tC().tx+';box-shadow:0 20px 60px '+tC().sh+';z-index:2147483647;pointer-events:auto!important;padding:12px;'},[
        E('div',{css:'font-size:14px;font-weight:700;margin-bottom:8px;text-align:center',text:'🎨 انتخاب فونت برای بخش'}),
        E('div',{css:'font-size:11px;opacity:.5;margin-bottom:10px;text-align:center',text:'فونت را انتخاب کنید، سپس روی بخش مورد نظر کلیک کنید'}),
        searchInp,
        fontList,
        cancelBtn
    ]);

    sr.appendChild(dialog);
}
if(a==='settings'){vw='settings';render();return;}
if(a==='about'){vw='about';render();return;}
if(a==='reset'){cF='__default__';en=true;rtl=false;dS(sk());rmF();rmEx();apR(false);render();return;}
if(a==='rtl'){rtl=true;sSD('rtl',true);apR(true);render();return;}
if(a==='ltr'){rtl=false;sSD('rtl',false);apR(false);render();return;}
if(a==='clearcache'){GM_setValue('fCache',{});lF={};document.querySelectorAll('[id^="pfs-"]').forEach(el=>{if(el.id!=='pfs-h'&&el.id!=='pfs-act'&&el.id!=='pfs-rtl'&&el.id!=='pfs-excl')el.remove();});if(cF!=='__default__')apF(cF);render();return;}
}

// ═══ MAIN VIEW ═══
function buildMain(){
const af=aF();const siteData=gSD();
const excl=siteData.excludeSelectors||[];
const selFonts=siteData.selectorFonts||{};
const cats=[
{k:'google',t:'🔤 گوگل',fs:Object.entries(af).filter(([,v])=>v.c==='google')},
{k:'rastikerdar',t:'✨ راستکردار',fs:Object.entries(af).filter(([,v])=>v.c==='rastikerdar')},
{k:'bseries',t:'🅱️ سری B',fs:Object.entries(af).filter(([,v])=>v.c==='bseries')},
{k:'custom',t:'🎨 سفارشی',fs:Object.entries(af).filter(([,v])=>v.c==='custom')}];

const searchInp=E('input',{cls:'sinp',type:'text',placeholder:'🔍 جستجو...',on:{input:e=>{
const v=e.target.value.trim().toLowerCase();
const root=e.target.getRootNode();
const items=root.querySelectorAll('.fi[data-f]');
items.forEach(i=>{if(i.dataset.f==='__default__'){i.style.display=!v||'پیش‌فرض'.includes(v)?'':'none';return;}
const cfg=af[i.dataset.f];if(!cfg){i.style.display='none';return;}
i.style.display=(!v||cfg.l.includes(v)||cfg.f.toLowerCase().includes(v))?'':'none';});
root.querySelectorAll('.ag:not(.tg):not(.exc-sec):not(.sf-sec)').forEach(g=>{
const vs2=g.querySelectorAll('.fi:not([style*="display: none"])'),bd=g.querySelector('[data-ab]');
if(v){g.style.display=vs2.length?'':'none';if(vs2.length&&bd)bd.style.display='block';}else g.style.display='';});
}}});

const defaultItem=fontItem('__default__','🌐 فونت پیش‌فرض','',cF==='__default__','pf');
const catGroups=[];
cats.forEach(cat=>{if(!vC[cat.k]||(!cat.fs.length&&cat.k!=='custom'))return;
const op=aD==='open'?(aS[cat.k]!==false):(aS[cat.k]===true);
const items=cat.fs.map(([k,v])=>fontItem(k,v.l,v.f,cF===k,'pf',v.c==='custom'));
if(!items.length)items.push(E('div',{cls:'emp',text:'فونتی اضافه نشده'}));
catGroups.push(accordion(cat.k,cat.t,cat.fs.length,op,items));});

const extraSections=[];

// Exclusions section
if(excl.length){
const exItems=excl.map((s,i)=>{
const del=E('button',{cls:'exc-del',text:'✕',data:{di:String(i)},on:{click:e=>{e.stopPropagation();
const all=gS();if(all[sk()]?.excludeSelectors){all[sk()].excludeSelectors.splice(i,1);GM_setValue('sites',all);apF(cF);render();}}}});
return E('div',{cls:'exc-item'},[E('span',{cls:'exc-val',text:s}),del]);});
const exAcc=accordion('excls','🛡️ استثناها ('+excl.length+')',0,false,exItems);
exAcc.classList.add('exc-sec');
extraSections.push(exAcc);
}

// Selector fonts section
const sfEntries=Object.entries(selFonts);
if(sfEntries.length){
const sfItems=sfEntries.map(([sel,fk])=>{
const fc=af[fk];
const del=E('button',{cls:'exc-del',text:'✕',on:{click:e=>{e.stopPropagation();
const all=gS();if(all[sk()]?.selectorFonts){delete all[sk()].selectorFonts[sel];GM_setValue('sites',all);apF(cF);render();}}}});
return E('div',{cls:'exc-item'},[
E('span',{cls:'exc-val',text:sel}),
E('span',{css:'font-size:10px;opacity:.6;margin:0 6px;color:#4caf50',text:'→ '+(fc?.l||fk)}),del]);
});
const sfAcc=accordion('selfont','🎨 فونت بخش‌ها ('+sfEntries.length+')',0,false,sfItems);
sfAcc.classList.add('sf-sec');
extraSections.push(sfAcc);
}

// Tools
const tO=aD==='open'?(aS.tools!==false):(aS.tools===true);
const toolContent=E('div',{css:'padding:10px 12px'},[
E('div',{cls:'tw'},[E('span',{cls:'tl',text:'جهت صفحه:'}),
E('div',{cls:'tbs'},[
E('button',{cls:'tb'+(rtl?' act':''),text:'⬅️ RTL',data:{a:'rtl'},on:{click:doAction}}),
E('button',{cls:'tb'+(!rtl?' act':''),text:'➡️ LTR',data:{a:'ltr'},on:{click:doAction}})])]),
E('div',{cls:'thn',text:'🎯 = استثنا المان از فونت | 🎨 = اختصاص فونت به بخش'})]);
const toolsAcc=accordion('tools','🛠️ ابزارها',0,tO,[toolContent]);
toolsAcc.classList.add('tg');

return E('div',{},[
E('div',{cls:'srch'},[searchInp]),
E('div',{cls:'fls'},[defaultItem,...catGroups,...extraSections]),
toolsAcc]);
}

function fontItem(key,label,family,checked,radioName,deletable){
const radio=E('input',{type:'radio',name:radioName,value:key,checked:checked,on:{change:e=>{
if(radioName==='pf'){cF=e.target.value;sSD('font',cF);apF(cF);render();}
else if(radioName==='sf'&&eSite){sSF(eSite,e.target.value);if(eSite===sk()){cF=e.target.value;apF(cF);}render();}
}}});
const items=[radio,E('span',{cls:'rc'}),E('span',{cls:'fl',text:label})];
if(family)items.push(E('span',{cls:'fn',text:family}));
if(deletable)items.push(E('button',{cls:'db',text:'🗑️',data:{dk:key},on:{click:e=>{e.preventDefault();e.stopPropagation();
if(confirm('حذف؟')){const cf=gCF();delete cf[key];sCF(cf);if(cF===key){cF='__default__';sSD('font','__default__');rmF();}render();}}}}));
const item=E('label',{cls:'fi'+(checked?' act':''),data:{f:key,sf:key}},items);
return item;
}

function accordion(key,title,count,open,children){
const arrow=E('span',{cls:'aa',text:open?'▼':'▶'});
const badge=count?E('span',{cls:'bdg',text:String(count)}):null;
const body=E('div',{cls:'abx',data:{ab:key},css:'display:'+(open?'block':'none')},children);
const head=E('div',{cls:'ah',data:{ac:key},on:{click:()=>{
const isOpen=body.style.display!=='none';body.style.display=isOpen?'none':'block';arrow.textContent=isOpen?'▶':'▼';
if(key!=='excls'){aS[key]=!isOpen;GM_setValue('aS',aS);}
}}},badge?[arrow,E('span',{text:title}),badge]:[arrow,E('span',{text:title})]);
return E('div',{cls:'ag',data:{g:key}},[head,body]);
}

// ═══ SITE EDIT ═══
function buildSiteEdit(){
const af=aF();const sd2=gSD(eSite);const sf=sd2.font||'__default__';const excl=sd2.excludeSelectors||[];

// Exclusions section
const exItems=excl.map((s,i)=>{
const del=E('button',{cls:'se-exc-del',text:'✕',data:{di:String(i)},on:{click:e=>{e.stopPropagation();
const all=gS();if(all[eSite]?.excludeSelectors){all[eSite].excludeSelectors.splice(i,1);GM_setValue('sites',all);if(eSite===sk())apF(cF);render();}}}});
return E('div',{cls:'exc-item'},[E('span',{cls:'exc-val',text:s}),del]);});
if(!exItems.length)exItems.push(E('div',{cls:'emp',text:'استثنایی نیست'}));

const exclInput=E('input',{cls:'sinp',type:'text',placeholder:'.class-name',css:'direction:ltr;text-align:left;margin:0;flex:1'});
const addExclBtn=E('button',{cls:'asb',text:'➕',on:{click:()=>{
const val=exclInput.value.trim();if(!val)return;
const all=gS();if(!all[eSite])all[eSite]={};if(!all[eSite].excludeSelectors)all[eSite].excludeSelectors=[];
if(!all[eSite].excludeSelectors.includes(val)){all[eSite].excludeSelectors.push(val);GM_setValue('sites',all);if(eSite===sk())apF(cF);}
exclInput.value='';render();}}});

const exclSec=E('div',{cls:'se-exc'},[
E('div',{cls:'se-exc-t',text:'🛡️ استثناها ('+excl.length+')'}),
E('div',{cls:'se-exc-d',text:'سلکتورهایی که فونت اعمال نشود:'}),...exItems,
E('div',{cls:'se-exc-add'},[exclInput,addExclBtn]),
E('div',{cls:'se-exc-help',text:'یا از 🎯 استفاده کنید'})]);

// Font search
const searchInp=E('input',{cls:'sinp',type:'text',placeholder:'🔍 جستجو فونت...',on:{input:e=>{
const v=e.target.value.trim().toLowerCase();const root=e.target.getRootNode();
root.querySelectorAll('.fi[data-sf]').forEach(i=>{if(i.dataset.sf==='__default__'){i.style.display=!v||'پیش‌فرض'.includes(v)?'':'none';return;}
const cfg=af[i.dataset.sf];if(!cfg){i.style.display='none';return;}
i.style.display=(!v||cfg.l.includes(v)||cfg.f.toLowerCase().includes(v))?'':'none';});
}}});

const defaultItem=fontItem('__default__','🌐 پیش‌فرض','',sf==='__default__','sf');
const fontItems=[defaultItem];
Object.entries(af).forEach(([k,v])=>{fontItems.push(fontItem(k,v.l,v.f,sf===k,'sf'));});

return E('div',{cls:'sev'},[
E('div',{cls:'se-t',text:'🌐 '+eSite}),
E('div',{cls:'se-s',text:'فونت: '+(sf==='__default__'?'پیش‌فرض':(af[sf]?.l||sf))}),
exclSec,
E('div',{cls:'se-sr'},[searchInp]),
E('div',{cls:'se-l'},fontItems)]);
}

// ═══ SETTINGS ═══
function buildSettings(){
const sites=gS();const af=aF();

const themeRow=radioRow('thm',[{v:'dark',t:'🌙 تیره'},{v:'light',t:'☀️ روشن'}],thm,(v)=>{thm=v;GM_setValue('thm',thm);render();});
const minRow=radioRow('mm',[{v:'pinned',t:'📌 چسبیده'},{v:'floating',t:'🔘 شناور'}],mM,(v)=>{mM=v;GM_setValue('mM',mM);mP=null;GM_setValue('mP',null);});
const accRow=radioRow('acd',[{v:'closed',t:'📕 بسته'},{v:'open',t:'📖 باز'}],aD,(v)=>{aD=v;GM_setValue('aD',aD);});

const catChecks=['google','rastikerdar','bseries','custom'].map(k=>{
const labels={google:'🔤 گوگل',rastikerdar:'✨ راستکردار',bseries:'🅱️ سری B',custom:'🎨 سفارشی'};
const cb=E('input',{type:'checkbox',checked:vC[k],on:{change:e=>{vC[k]=e.target.checked;GM_setValue('vC',vC);}}});
return E('label',{cls:'cl'},[cb,' '+labels[k]]);});

// Custom font
const cfn=E('input',{cls:'inp',type:'text',placeholder:'نام نمایشی'});
const cff=E('input',{cls:'inp',type:'text',placeholder:'Font Family',css:'direction:ltr;text-align:left'});
const cfu=E('input',{cls:'inp',type:'text',placeholder:'لینک فونت/CSS',css:'direction:ltr;text-align:left'});
const cfile=E('input',{cls:'inpf',type:'file',accept:'.woff,.woff2,.ttf,.otf'});
const cfmsg=E('div',{cls:'cfm'});
const addCfBtn=E('button',{cls:'abtn',text:'➕ افزودن',on:{click:()=>{
if(!cfn.value.trim()||!cff.value.trim()){msg(cfmsg,'❌ نام و Family لازم',0);return;}
const hu=cfu.value.trim(),hf=cfile.files?.length>0;
if(!hu&&!hf){msg(cfmsg,'❌ لینک یا فایل',0);return;}
const key='cf_'+cff.value.trim().replace(/[^a-zA-Z0-9]/g,'_')+'_'+Date.now();
const def={l:cfn.value.trim(),c:'custom',f:cff.value.trim()};
if(hf){const rd=new FileReader();rd.onload=ev=>{def.dataUrl=ev.target.result;const cf=gCF();cf[key]=def;sCF(cf);ldF(key);msg(cfmsg,'✅ اضافه شد',1);cfn.value='';cff.value='';cfu.value='';cfile.value='';};rd.readAsDataURL(cfile.files[0]);}
else{try{new URL(hu);}catch(e){msg(cfmsg,'❌ لینک نامعتبر',0);return;}
if(isCSSUrl(hu))def.cssUrl=hu;else def.fontUrl=hu;const cf=gCF();cf[key]=def;sCF(cf);ldF(key);msg(cfmsg,'✅ اضافه شد',1);cfn.value='';cff.value='';cfu.value='';
}}}});

// Add site
const nsInp=E('input',{cls:'inp',type:'text',placeholder:'example.com',css:'direction:ltr;text-align:left;margin:0;flex:1'});
const nsMsg=E('div',{cls:'asm'});
const nsBtn=E('button',{cls:'asb',text:'➕',on:{click:()=>{
let val=nsInp.value.trim().toLowerCase().replace(/^(https?:\/\/)?(www\.)?/,'').replace(/\/.*$/,'');
if(!val){msg(nsMsg,'❌ دامنه',0);return;}const all=gS();
if(all[val]){msg(nsMsg,'⚠️ موجود',0);eSite=val;vw='siteEdit';setTimeout(()=>render(),500);return;}
all[val]={font:'__default__'};GM_setValue('sites',all);msg(nsMsg,'✅ اضافه شد',1);nsInp.value='';
setTimeout(()=>{eSite=val;vw='siteEdit';render();},500);}}});

// Site list
const siteSearch=E('input',{cls:'sinp',type:'text',placeholder:'🔍 جستجو...',css:'direction:ltr;text-align:left',on:{input:e=>{
const v=e.target.value.trim().toLowerCase();const root=e.target.getRootNode();
root.querySelectorAll('.six').forEach(item=>{const nm=item.querySelector('.sn');item.style.display=(!v||nm?.textContent.toLowerCase().includes(v))?'':'none';});}}});

const siteItems=Object.entries(sites).map(([s,d])=>{
const fl=d.font==='__default__'?'پیش‌فرض':(af[d.font]?.l||d.font||'-');
const ec=d.excludeSelectors?.length||0;
return E('div',{cls:'six'},[
E('span',{cls:'sn',text:s}),E('span',{cls:'sf',text:fl+(d.rtl?' •RTL':'')+(ec?' •'+ec+'⛔':'')}),
E('button',{cls:'sed',text:'✏️',data:{es:s},on:{click:e=>{e.stopPropagation();eSite=s;vw='siteEdit';render();}}}),
E('button',{cls:'sd',text:'✕',data:{ds:s},on:{click:e=>{e.stopPropagation();if(confirm('حذف "'+s+'"?')){dS(s);render();}}}})]);});
if(!siteItems.length)siteItems.push(E('div',{cls:'emp',text:'خالی'}));

const ccBtn=E('button',{cls:'clb',text:'🗑️ پاکسازی ('+Object.keys(gFC()).length+')',data:{a:'clearcache'},on:{click:doAction}});

return E('div',{cls:'sv'},[
settSec('🎨 تم',[themeRow]),settSec('📌 مینیمایز',[minRow]),settSec('📂 آکاردئون',[accRow]),
settSec('📂 دسته‌بندی',catChecks),
settSec('➕ فونت سفارشی',[cfn,cff,cfu,E('div',{cls:'cfl',text:'یا فایل:'}),cfile,addCfBtn,cfmsg]),
settSec('🌐 افزودن سایت',[E('div',{cls:'asr'},[nsInp,nsBtn]),nsMsg]),
settSec('💾 سایت‌ها ('+Object.keys(sites).length+')',[E('div',{cls:'site-srch'},[siteSearch]),E('div',{cls:'sls'},siteItems),E('div',{cls:'sinf',text:'فعلی: '+sk()})]),
settSec('🗑️ کش',[ccBtn])]);
}

function settSec(title,children){return E('div',{cls:'ss'},[E('div',{cls:'st',text:title}),...children]);}

function radioRow(name,options,current,onChange){
return E('div',{cls:'sro'},options.map(o=>{
const inp=E('input',{type:'radio',name:name,value:o.v,checked:current===o.v,on:{change:e=>onChange(e.target.value)}});
const lbl=E('label',{cls:'to'+(current===o.v?' sel':'')},[inp,E('span',{text:o.t})]);
return lbl;}));
}

// ═══ ABOUT ═══
function buildAbout(){
return E('div',{cls:'abv'},[
E('div',{cls:'alg',text:'فا'}),E('div',{cls:'abtt',text:'انتخابگر فونت فارسی'}),E('div',{cls:'abvr',text:'v12.0 Pro'}),
E('div',{cls:'abd',text:'ابزار حرفه‌ای تغییر فونت فارسی'}),
E('div',{cls:'abss'},[E('div',{cls:'abst',text:'📦 منابع'}),
E('a',{cls:'abll',text:'راستکردار',href:'https://github.com/rastikerdar'}),
E('a',{cls:'abll',text:'سری B',href:'https://github.com/intuxicated/css-persian'}),
E('a',{cls:'abll',text:'Vazirmatn',href:'https://fonts.google.com/specimen/Vazirmatn'})]),
E('div',{cls:'abss'},[E('div',{cls:'abst',text:'⌨️ میانبر'}),E('div',{cls:'abk',text:'Ctrl+Shift+F'})]),
E('div',{cls:'abss'},[E('div',{cls:'abst',text:'✨ قابلیت‌ها'}),
...'فونت مجزا هر سایت|🎯 Element Picker|RTL/LTR|فونت سفارشی|کش فونت|تم تیره/روشن'.split('|').map(t=>E('div',{cls:'abf',text:'✅ '+t}))]),
E('div',{cls:'abss'},[E('div',{cls:'abst',text:'👨‍💻 سازنده'}),E('div',{cls:'abc',text:'محمد'}),
E('a',{cls:'abll',text:'wpnaji.ir',href:'https://wpnaji.ir'}),E('div',{cls:'abc',text:'© 2024',css:'margin-top:8px;opacity:.4'})])]);
}

function msg(el,t,ok){if(!el)return;el.textContent=t;el.style.color=ok?'#4caf50':'#e94560';setTimeout(()=>{if(el)el.textContent='';},3000);}

// ═══ DRAG ═══
function mkDrag(el,handle,onEnd){if(!handle)return;let dr=false,mv=false,sx,sy,il,it;
handle.addEventListener('mousedown',e=>{if(e.target.closest('button')||e.target.closest('input'))return;
dr=true;mv=false;const r=el.getBoundingClientRect();sx=e.clientX;sy=e.clientY;il=r.left;it=r.top;handle.style.cursor='grabbing';e.preventDefault();});
document.addEventListener('mousemove',e=>{if(!dr)return;const dx=e.clientX-sx,dy=e.clientY-sy;if(Math.abs(dx)>3||Math.abs(dy)>3)mv=true;
let x=il+dx,y=it+dy;x=Math.max(0,Math.min(window.innerWidth-el.offsetWidth,x));y=Math.max(0,Math.min(window.innerHeight-50,y));
el.style.left=x+'px';el.style.top=y+'px';el.style.right='auto';el.style.bottom='auto';});
document.addEventListener('mouseup',()=>{if(dr){dr=false;handle.style.cursor='grab';if(mv){const r=el.getBoundingClientRect();if(onEnd)onEnd(r.left,r.top);}}});}

// ═══ MIN BTNS ═══
function renderMin(sr){
const b=E('div',{cls:'mb',css:'pointer-events:auto'});
if(mM==='pinned'){b.classList.add('pin');b.appendChild(E('span',{text:'فا'}));
if(mP){const onR=mP.x>window.innerWidth/2;b.style.cssText+=`position:fixed;top:${mP.y}px;${onR?'right:0;left:auto;border-radius:10px 0 0 10px':'left:0;right:auto;border-radius:0 10px 10px 0'};pointer-events:auto;transform:none;`;}}
else{b.classList.add('fab');b.textContent='فا';
if(mP)b.style.cssText+=`position:fixed;left:${mP.x}px;top:${mP.y}px;right:auto;bottom:auto;pointer-events:auto;`;
else b.style.cssText+='position:fixed;bottom:24px;right:24px;pointer-events:auto;';}
let dr=false,mv=false,sx,sy,il,it;
b.addEventListener('mousedown',e=>{dr=true;mv=false;const r=b.getBoundingClientRect();sx=e.clientX;sy=e.clientY;il=r.left;it=r.top;e.preventDefault();});
document.addEventListener('mousemove',e=>{if(!dr)return;const dx=e.clientX-sx,dy=e.clientY-sy;if(Math.abs(dx)>4||Math.abs(dy)>4)mv=true;if(!mv)return;
let x=il+dx,y=it+dy;x=Math.max(0,Math.min(window.innerWidth-b.offsetWidth,x));y=Math.max(0,Math.min(window.innerHeight-b.offsetHeight,y));
b.style.left=x+'px';b.style.top=y+'px';b.style.right='auto';b.style.bottom='auto';b.style.position='fixed';b.style.transform='none';});
document.addEventListener('mouseup',()=>{if(!dr)return;dr=false;
if(mv){const r=b.getBoundingClientRect();mP={x:r.left,y:r.top};GM_setValue('mP',mP);
if(mM==='pinned'){if(r.left<window.innerWidth/2){b.style.left='0';b.style.right='auto';b.style.borderRadius='0 10px 10px 0';mP.x=0;}
else{b.style.left='auto';b.style.right='0';b.style.borderRadius='10px 0 0 10px';mP.x=window.innerWidth;}GM_setValue('mP',mP);}}
else restore();});
sr.appendChild(b);}

// ═══ CSS ═══
function CSS(){return `
@keyframes pfi{from{opacity:0;transform:translateY(-12px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes pfsr{from{transform:translateY(-50%) translateX(100%)}to{transform:translateY(-50%) translateX(0)}}
@keyframes pfp{from{opacity:0;transform:scale(.8)}to{opacity:1;transform:scale(1)}}
*{box-sizing:border-box;font-family:${PF};margin:0;padding:0}
.pp,.mb{pointer-events:auto!important}
.hdr{display:flex;align-items:center;justify-content:space-between;padding:10px 14px;cursor:grab;user-select:none;border-bottom:1px solid rgba(128,128,128,.2);min-height:50px}
.hr{display:flex;align-items:center;gap:10px;overflow:hidden;min-width:0}.hl{display:flex;align-items:center;gap:2px;flex-shrink:0}
.hi{display:flex;flex-direction:column;overflow:hidden;min-width:0}
.logo{background:linear-gradient(135deg,#e94560,#c23152);color:#fff;width:32px;height:32px;min-width:32px;display:flex;align-items:center;justify-content:center;border-radius:10px;font-weight:900;font-size:14px}
.ht{font-size:12px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.hs{font-size:9px;opacity:.5;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.hb{background:none;border:none;cursor:pointer;padding:4px 6px;border-radius:8px;font-size:14px;transition:all .15s;opacity:.6;line-height:1;color:inherit}
.hb:hover{opacity:1;background:rgba(128,128,128,.15)}.hbx:hover{background:rgba(233,69,96,.2);color:#e94560;opacity:1}
.bd{overflow-y:auto;max-height:calc(85vh - 52px);scrollbar-width:thin}
.bd::-webkit-scrollbar{width:5px}.bd::-webkit-scrollbar-track{background:transparent}.bd::-webkit-scrollbar-thumb{background:rgba(128,128,128,.3);border-radius:3px}
.srch{padding:10px 12px 6px}
.sinp{width:100%;padding:9px 12px;border:1px solid rgba(128,128,128,.3);border-radius:10px;font-size:12px;outline:none;direction:rtl;font-family:${PF};color:inherit;background:rgba(128,128,128,.08)}
.sinp:focus{border-color:#e94560;box-shadow:0 0 0 3px rgba(233,69,96,.12)}.sinp::placeholder{opacity:.4}
.fls{padding:4px 8px 0}.ag{margin-bottom:5px;border-radius:10px;overflow:hidden;border:1px solid rgba(128,128,128,.12)}
.ah{display:flex;align-items:center;gap:8px;padding:9px 12px;background:rgba(128,128,128,.05);cursor:pointer;user-select:none;font-size:12px;font-weight:700;transition:background .15s}
.ah:hover{background:rgba(128,128,128,.1)}.aa{font-size:9px;color:#e94560;width:12px;text-align:center}
.bdg{margin-right:auto;background:rgba(233,69,96,.15);color:#e94560;padding:1px 7px;border-radius:10px;font-size:10px;font-weight:600}
.abx{max-height:220px;overflow-y:auto;scrollbar-width:thin}.abx::-webkit-scrollbar{width:3px}.abx::-webkit-scrollbar-thumb{background:rgba(128,128,128,.3);border-radius:2px}
.emp{padding:14px;text-align:center;opacity:.4;font-size:11px}
.fi{display:flex;align-items:center;gap:9px;padding:7px 12px;cursor:pointer;transition:background .1s;border-bottom:1px solid rgba(128,128,128,.05)}
.fi:hover{background:rgba(233,69,96,.06)}.fi.act{background:rgba(233,69,96,.12);border-right:3px solid #e94560}
.fi input[type="radio"]{display:none}
.rc{width:16px;height:16px;min-width:16px;border:2px solid rgba(128,128,128,.4);border-radius:50%;display:flex;align-items:center;justify-content:center;transition:all .15s;position:relative}
.fi.act .rc{border-color:#e94560;background:#e94560}.fi.act .rc::after{content:'';width:5px;height:5px;background:#fff;border-radius:50%;position:absolute}
.fl{font-size:12px;flex:1}.fn{font-size:9px;opacity:.3;direction:ltr;font-family:'Courier New',monospace}
.db{background:none;border:none;cursor:pointer;font-size:11px;opacity:.4;padding:2px 4px;border-radius:4px}.db:hover{opacity:1}
.tg{margin:5px 8px}.tw{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px}
.tl{font-size:12px;font-weight:600}.tbs{display:flex;gap:6px}
.tb{padding:6px 14px;border:1px solid rgba(128,128,128,.25);border-radius:8px;background:none;cursor:pointer;font-size:11px;font-weight:600;transition:all .15s;color:inherit;font-family:${PF}}
.tb:hover{background:rgba(233,69,96,.08)}.tb.act{background:rgba(233,69,96,.15);border-color:#e94560;color:#e94560}
.thn{font-size:10px;opacity:.4;margin-top:6px;line-height:1.6}
.ft{display:flex;gap:6px;padding:8px 12px;border-top:1px solid rgba(128,128,128,.12)}
.fb{flex:1;padding:7px 10px;background:rgba(128,128,128,.06);color:inherit;border:1px solid rgba(128,128,128,.15);border-radius:8px;cursor:pointer;font-size:11px;font-weight:600;transition:all .15s;font-family:${PF};text-align:center}
.fb:hover{background:rgba(233,69,96,.1);border-color:rgba(233,69,96,.3)}
.exc-item{display:flex;align-items:center;justify-content:space-between;padding:5px 8px;border-bottom:1px solid rgba(128,128,128,.08);font-size:11px}
.exc-val{direction:ltr;text-align:left;font-family:'Courier New',monospace;font-size:11px;flex:1;color:#e94560}
.exc-del,.se-exc-del{background:none;border:none;cursor:pointer;opacity:.4;font-size:12px;padding:2px 6px;color:inherit}.exc-del:hover,.se-exc-del:hover{opacity:1;color:#e94560}
.sev{padding:12px}.se-t{font-size:15px;font-weight:800;margin-bottom:4px;direction:ltr;text-align:left;font-family:monospace}
.se-s{font-size:11px;opacity:.6;margin-bottom:8px}.se-sr{margin-bottom:8px}
.se-l{max-height:45vh;overflow-y:auto;scrollbar-width:thin;border:1px solid rgba(128,128,128,.12);border-radius:10px}
.se-exc{margin:8px 0;padding:10px;border:1px solid rgba(128,128,128,.15);border-radius:10px;background:rgba(128,128,128,.03)}
.se-exc-t{font-size:12px;font-weight:700;margin-bottom:4px}.se-exc-d{font-size:10px;opacity:.5;margin-bottom:6px}
.se-exc-add{display:flex;gap:6px;align-items:center;margin-top:8px}.se-exc-help{font-size:9px;opacity:.35;margin-top:4px}
.sv{padding:12px}.ss{margin-bottom:16px;padding-bottom:14px;border-bottom:1px solid rgba(128,128,128,.12)}.ss:last-child{border-bottom:none}
.st{font-size:13px;font-weight:700;margin-bottom:10px}.sro{display:flex;gap:8px;flex-wrap:wrap}
.to{display:flex;align-items:center;gap:6px;padding:7px 12px;border:1px solid rgba(128,128,128,.2);border-radius:8px;cursor:pointer;font-size:12px;flex:1;transition:all .15s;justify-content:center}
.to:has(input:checked){border-color:#e94560;background:rgba(233,69,96,.1)}.to input{display:none}
.cl{display:flex;align-items:center;gap:8px;padding:5px 0;cursor:pointer;font-size:12px}
.cl input[type="checkbox"]{width:16px;height:16px;accent-color:#e94560;cursor:pointer}
.inp{width:100%;padding:9px 12px;border:1px solid rgba(128,128,128,.25);border-radius:8px;background:rgba(128,128,128,.06);color:inherit;font-size:12px;margin-bottom:8px;outline:none;font-family:${PF}}.inp:focus{border-color:#e94560}
.inpf{width:100%;padding:8px;margin-bottom:8px;font-size:11px;border:1px dashed rgba(128,128,128,.3);border-radius:8px;background:rgba(128,128,128,.04);color:inherit;cursor:pointer}
.cfl{font-size:11px;margin-bottom:6px;font-weight:600;opacity:.7}
.abtn{width:100%;padding:9px;background:linear-gradient(135deg,#e94560,#c23152);color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:12px;font-weight:700;font-family:${PF}}.abtn:hover{opacity:.9}
.cfm,.asm{margin-top:8px;font-size:11px;font-weight:600;text-align:center;min-height:16px}
.asr{display:flex;gap:6px;align-items:center;margin-bottom:8px}
.asb{padding:8px 14px;background:linear-gradient(135deg,#e94560,#c23152);color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:14px;font-weight:700}.asb:hover{opacity:.9}
.site-srch{margin-bottom:8px}.sinf{font-size:10px;opacity:.5;margin-top:8px;text-align:center}
.sls{max-height:150px;overflow-y:auto;scrollbar-width:thin}
.six{display:flex;align-items:center;gap:6px;padding:6px 8px;border-bottom:1px solid rgba(128,128,128,.08);font-size:11px}
.sn{flex:1;direction:ltr;text-align:left;font-family:monospace;font-size:10px}.sf{opacity:.6;font-size:10px}
.sed,.sd{background:none;border:none;cursor:pointer;opacity:.4;font-size:12px;padding:2px 4px;color:inherit}.sed:hover,.sd:hover{opacity:1;color:#e94560}
.clb{width:100%;padding:8px;background:rgba(128,128,128,.08);color:inherit;border:1px solid rgba(128,128,128,.2);border-radius:8px;cursor:pointer;font-size:11px;font-family:${PF}}.clb:hover{border-color:#e94560;background:rgba(233,69,96,.08)}
.abv{padding:24px 16px;text-align:center}
.alg{width:60px;height:60px;margin:0 auto 12px;background:linear-gradient(135deg,#e94560,#c23152);color:#fff;border-radius:18px;display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:900}
.abtt{font-size:16px;font-weight:800;margin-bottom:4px}.abvr{font-size:11px;opacity:.5;margin-bottom:14px}
.abd{font-size:12px;opacity:.7;line-height:1.7;margin-bottom:18px}
.abss{text-align:right;margin-bottom:10px;padding:10px 12px;background:rgba(128,128,128,.05);border-radius:10px}
.abst{font-size:12px;font-weight:700;margin-bottom:6px}
.abll{display:block;color:#e94560;text-decoration:none;font-size:11px;padding:2px 0}.abll:hover{text-decoration:underline}
.abk{font-size:12px}.abf{font-size:11px;padding:2px 0;opacity:.8}.abc{font-size:12px;opacity:.6;margin-top:3px}
.pin{position:fixed;top:50%;right:0;transform:translateY(-50%);width:28px;height:70px;background:linear-gradient(180deg,#e94560,#c23152);color:#fff;border-radius:10px 0 0 10px;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:-3px 0 15px rgba(233,69,96,.3);transition:width .2s;user-select:none;font-family:${PF};writing-mode:vertical-rl;font-size:14px;font-weight:900;letter-spacing:2px;animation:pfsr .3s ease;z-index:2147483647}
.pin:hover{width:36px;box-shadow:-5px 0 25px rgba(233,69,96,.5)}
.fab{position:fixed;bottom:24px;right:24px;width:50px;height:50px;background:linear-gradient(135deg,#e94560,#c23152);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:900;cursor:pointer;box-shadow:0 4px 20px rgba(233,69,96,.4);transition:transform .2s;user-select:none;font-family:${PF};animation:pfp .3s ease;z-index:2147483647}
.fab:hover{transform:scale(1.1);box-shadow:0 6px 30px rgba(233,69,96,.6)}
`;}

// ═══ GLOBAL ═══
function injectG(){GM_addStyle(`#pfs-h{position:fixed!important;top:0!important;left:0!important;width:100vw!important;height:100vh!important;z-index:2147483647!important;pointer-events:none!important;overflow:visible!important;padding:0!important;margin:0!important;border:none!important;background:none!important;display:block!important;opacity:1!important;visibility:visible!important;transform:none!important}`);}

function watchInp(){const PR=/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
document.addEventListener('input',e=>{const el=e.target;if(el.closest('#pfs-h'))return;
if(el.tagName==='INPUT'||el.tagName==='TEXTAREA'||el.isContentEditable){const v=el.value||el.textContent||'';if(PR.test(v)&&el.dir!=='rtl')el.dir='rtl';}},true);}

function shortcuts(){document.addEventListener('keydown',e=>{if(e.ctrlKey&&e.shiftKey&&e.code==='KeyF'){e.preventDefault();
if(mini)restore();else{vis=!vis;GM_setValue('vis',vis);if(!vis){mini=true;GM_setValue('mini',true);}render();}}});
try{GM_registerMenuCommand('🔤 نمایش پنل فونت',()=>restore());}catch(e){}}

function init(){['https://fonts.googleapis.com','https://fonts.gstatic.com','https://cdn.jsdelivr.net'].forEach(h=>{
const l=document.createElement('link');l.rel='preconnect';l.href=h;l.crossOrigin='anonymous';document.head.appendChild(l);});
injectG();if(en&&cF!=='__default__')apF(cF);if(rtl)apR(true);render();watchInp();shortcuts();}

if(document.body)init();
else{const obs=new MutationObserver(()=>{if(document.body){obs.disconnect();init();}});
obs.observe(document.documentElement,{childList:true});setTimeout(()=>{if(document.body&&!hE)init();},3000);}
})();
