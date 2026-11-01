// RE:Joltance UI (PC-first, 1920x1080 stage scaled to the window)
const $=id=>document.getElementById(id),sleep=ms=>new Promise(r=>setTimeout(r,ms));
let G,sel=null,pend=null,busy=false,flash=-1,mulSel=new Set(),castMode=false,pendRes=null,stickyZoom=false;
let ALL=[],gid=0,NET=null; // NET: online session (see net.js), null for bot games
// ---------- stage scaling ----------
function fit(){const s=Math.min(innerWidth/1920,innerHeight/1080);$('stage').style.transform=`translate(-50%,-50%) scale(${s})`}
addEventListener('resize',fit);fit();
const show=id=>{['menu','bld','game'].forEach(k=>$(k).style.display=k==id?(k=='menu'?'flex':'block'):'none')};
// ---------- pixel hero rings ----------
document.querySelectorAll('.ring').forEach(c=>{const x=c.getContext('2d');for(let i=0;i<60;i++)for(let j=0;j<60;j++){const r=Math.hypot(i-29.5,j-29.5);
 if(r<=29.6&&r>=25.6){x.fillStyle=r>=27.4?'#2c2c2c':'#222';x.fillRect(i,j,1,1)}}});
// ---------- decks ----------
const loadC=()=>{try{return JSON.parse(localStorage.getItem('rj_decks')||'[]')}catch(e){return[]}};
const saveC=a=>{try{localStorage.setItem('rj_decks',JSON.stringify(a))}catch(e){alert('Could not save (storage blocked)')}};
function refreshDecks(){ALL=DECKS.concat(loadC().map(d=>({...d,custom:1})));
 ['d0','d1'].forEach((s,k)=>{const el=$(s),v=el.selectedIndex<0?(k?Math.min(1,ALL.length-1):0):el.selectedIndex;el.innerHTML='';
  ALL.forEach((d,i)=>el.add(new Option((d.custom?'* ':'')+d.n,i)));el.selectedIndex=Math.min(v,ALL.length-1)})}
refreshDecks();
// ---------- card rendering ----------
const ROM=n=>{if(n<=0)return'0';let s='';for(const[v,r]of[[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']])while(n>=v){s+=r;n-=v}return s};
const KWD={Flying:'Skips non-flyers and hits the hero. Only flyers can block it.',Armored:'Takes {n} less damage from each hit.',Unkillable:'Can\'t die. When destroyed, its death effects trigger, then it returns to your hand.',SoulGuard:'Survives lethal damage once, at 1 HP.',SplashDamage:'When it attacks, also hits enemy units in the adjacent lanes for {n}.',Burning:'Takes 1 damage each round.',Marked:'Takes double damage.',Stunned:'Skips its next attack.',Breakthrough:'When it attacks a unit, it also hits the enemy hero in that lane.'};
// extra terms found in card text: [name, regex on the description, short explanation, or keyword it maps to]
const TERMS=[
 ['Sacrifice',/\bSacrifice[ds]?\b/i,'Remove your own unit from the board. Counts as destroyed.'],
 ['Blood',/\bBlood\b/i,'Resource for playing cards. Refills every round (max 10).'],
 ['Bonus Attack',/\bBonus Attack\b/i,'Attacks once, right now.'],
 ['Bounce',/\bBounce\b/i,'Returns the unit to its owner\'s hand.'],
 ['After Combat',/\bAfter Combat\b/i,'Triggers once the fight in this lane is over.'],
 ['Silence',/\bSilence\b/i,'Removes keywords, buffs and abilities.'],
 ['Move Right',/\bMove Right\b/i,'Moves one lane right, if free.'],
 ['Exploding Present',/\bExploding Present\b/i,'A copy goes to the opponent\'s hand.'],
 ['Mark',/\bMark(ed)?\b/i,'Marked'],['Stun',/\bStun(ned)?\b/i,'Stunned'],['Burning',/\bBurning\b/i,'Burning'],
 ['SoulGuard',/Soul ?Guard/i,'SoulGuard'],['Unkillable',/\bUnkillable\b/i,'Unkillable'],['Flying',/\bFlying\b/i,'Flying'],['Armored',/\bArmored\b/i,'Armored']];
const KNAME={SplashDamage:'Splash',BurnSource:'Burn Source'};
const kwNum=(d,k)=>(d.KeywordParams||{})[k]||(k=='Armored'||k=='SplashDamage'?1:'');
const kwLabel=(d,k)=>k=='Armor2'?'Armored 2':(KNAME[k]||k)+(kwNum(d,k)!==''&&(k=='Armored'||k=='SplashDamage')?' '+kwNum(d,k):'');
const BAD=new Set(['Burning','Marked','Stunned']);
const hl=t=>(t||'').replace(/\b(Sacrifice[d]?|Mark(?:ed)?|Stunned?|Burning|SoulGuard|Unkillable|Flying)\b/g,'<span class="k u">$1</span>').replace(/(\d+ )?\bBlood\b/g,'<span class="k">$&</span>');
// Card art that doesn't exist (img/<id>.webp -> 404) is remembered here so the placeholder is used straight away.
// Otherwise every board re-render would re-request the missing file, flash the white .art background and only then swap in missing_texture.webp.
const MISSING=new Set();
const artSrc=id=>MISSING.has(+id)?'img/missing_texture.webp':'img/'+id+'.webp';
const artErr=(el,id)=>{el.onerror=null;MISSING.add(+id);el.src='img/missing_texture.webp'};
function cardHTML(x,live,cls,data){
 const d=x.d||CD[x.id],unit=d.Type=='Unit';
 const co=live||!G?d.Cost:cost(G,G.p[0],x),cc=!live&&co<d.Cost?' cd':!live&&co>d.Cost?' cu':'';
 const atk=live?x.atk:(d.Attack||0)+(x.ba||0),hp=live?x.hp:d.Health;
 const au=atk>(d.Attack||0)?' up':'',hc=live&&hp<x.mx?' dn':(hp>(d.Health||0)?' up':'');
 const ks=live?[...x.kw]:[...(d.Keywords||[]),...(x.unk&&!(d.Keywords||[]).includes('Unkillable')?['Unkillable']:[])];
 const kl=ks.map(k=>`<i class="${BAD.has(k)?'r':''}">${kwLabel(d,k)}</i>`).join(' ');
 const nf=d.Name.length>18?.62:d.Name.length>14?.75:d.Name.length>11?.88:1;
 const sub=unit?(d.Subtypes||[]).join(' '):'Action';
 return`<div class="card ${cls||''}" ${data||''} data-cid="${x.id}" data-ba="${x.ba||0}" style="--nf:${nf}"><img class="art" src="${artSrc(x.id)}" alt="" draggable="false" onerror="artErr(this,${x.id})"><i class="fr"></i><span class="nm">${d.Name}</span><span class="st">- ${sub} -</span><span class="co${cc}">${ROM(co)}</span>`+
 (unit?`<div class="bx a${au}">${atk}</div><div class="bx h${hc}">${hp}</div>`:'')+
 `<div class="tx">${kl?`<span class="kwl">${kl}</span>`:''}${live&&x.sil?'':`<span>${hl(d.Description)}</span>`}</div></div>`}
// ---------- zoom / glossary ----------
function glossary(x,live,d){const out=[],seen=new Set();
 const addKw=k=>{const key=k=='Armor2'?'Armored':k;if(!KWD[key]||seen.has(key))return;seen.add(key);
  const n=k=='Armor2'?2:kwNum(d,key)||1;out.push(`<b>${kwLabel(d,k)}</b>: ${KWD[key].replace('{n}',n)}`)};
 (live?[...x.kw]:[...(d.Keywords||[]),...(x.unk?['Unkillable']:[])]).forEach(addKw); // Burn Source is deliberately not explained here
 TERMS.forEach(([n,re,t])=>{if((live&&x.sil)||!re.test(d.Description||''))return;
  if(KWD[t])addKw(t);else if(!seen.has(n)){seen.add(n);out.push(`<b>${n}</b>: ${t}`)}});
 if(d.Type=='Spell')out.push('<b>Action</b>: cast in the Action phase.');
 return out}
function showZoom(x,live){const d=x.d||CD[x.id];const gl=glossary(x,live,d).join('<br>');
 const z=$('zoom');z.classList.toggle('zr',$('bld').style.display=='block');
 z.innerHTML=cardHTML(x,live,live&&x.o?'e':'')+(gl?`<div id="gl">${gl}</div>`:'');z.style.display='block'}
const hideZoom=()=>{if(!stickyZoom)$('zoom').style.display='none'};
const findLive=uid=>[...G.p[0].ln,...G.p[1].ln].find(v=>v&&v.uid==uid);
const CARDSEL='[data-u],[data-c],[data-cid]';
document.addEventListener('mouseover',e=>{const t=e.target.closest&&e.target.closest(CARDSEL);if(!t||t.closest('#zoom')||t.closest('.fly')||t.classList.contains('dying'))return;
 let x=null,live=false;
 if(t.dataset.u&&G){x=findLive(t.dataset.u);live=!!x}
 if(!x&&t.dataset.c&&G)x=G.p[0].hand.find(v=>v.uid==t.dataset.c);
 if(!x&&t.dataset.cid)x={id:+t.dataset.cid,uid:0,ba:+t.dataset.ba||0};
 if(x)showZoom(x,live)});
document.addEventListener('mouseout',e=>{if(e.target.closest&&e.target.closest(CARDSEL))hideZoom()});
// ---------- rendering ----------
const PH={U:'Units',B:'Unit and Actions',A:'Actions'};
const ASK={M:'Choose units to sacrifice',e:'Choose an enemy unit',f:'Choose a friendly unit',S:'Choose a unit to sacrifice',a:'Choose any unit',D:'Choose a card from your deck',eh:'Choose an enemy unit or the enemy hero'};
const LX=[36,332,624,916],LY=[88,432]; // slot offsets inside #board : [lane] , [enemy,you]
const mine=()=>G.act==0&&!busy&&!G.over;
const ksNow=()=>pend.pre?pend.ks:apicks(G,G.p[0],CD[G.p[0].hand[pend.ci].id],pend.got);
const kind=()=>pend?ksNow()[pend.got.length]:null;
function validTargets(){const k=kind();return k&&k!='C'&&k!='D'?req(G,G.p[0],k):[]}
function dots(p){return Array.from({length:10},(_,i)=>`<i class="${i<p.b?'on':i<p.mb?'sp':''}"></i>`).join('')}
function say(t,cancel){const b=$('msg');if(!t){b.style.display='none';b.innerHTML='';return}b.innerHTML=t+(cancel?' <button data-cancel="1">Cancel</button>':'');b.style.display='block'}
const cleanName=s=>String(s||'').replace(/[<>&"'`\\]/g,'').replace(/\s+/g,' ').trimStart().slice(0,16);
const myName=()=>{try{return cleanName(localStorage.getItem('rj_name')).trim()}catch(e){return''}};
let OPN='';
function render(){
 const me=G.p[0],op=G.p[1],tg=validTargets();let h='';
 $('phase').textContent='Phase : '+(G.step>=3?'Combat':PH[G.allow]);$('round').textContent='Round : '+G.turn;
 $('ehp').textContent=Math.max(0,op.hp);$('php').textContent=Math.max(0,me.hp);
 $('ehp').className='hpn'+(op.hp<=7?' lo':'');$('php').className='hpn'+(me.hp<=7?' lo':'');
 $('enb').textContent=NET?(OPN||'Opponent'):'Botzacy';$('pnb').textContent=myName()||'Playerzacy';
 $('game').classList.toggle('et',G.act==1);$('enb').className='nbar'+(G.act==1?' act':'');$('pnb').className='nbar'+(G.act==0?' act':'');
 $('ecn').textContent=`hand ${op.hand.length} - deck ${op.deck.length}`;$('pcn').textContent=`hand ${me.hand.length} - deck ${me.deck.length}`;$('edots').innerHTML=dots(op);$('pdots').innerHTML=dots(me);
 // discard / deck
 const top=me.disc[me.disc.length-1];$('pile').className=top?'':'empty';$('pile').innerHTML=top?cardHTML(top,0):'';$('pc').textContent=me.disc.length+'x';$('dc').textContent=me.deck.length?me.deck.length+'x':'Fatigue '+((me.fat||0)+1);
 // board
 const placing=mine()&&sel!=null&&!pend&&me.hand[sel]&&CD[me.hand[sel].id].Type=='Unit';
 for(const row of[1,0])for(let i=0;i<4;i++){const u=G.p[row].ln[i];const free=placing&&!u&&row==0&&canPlay(G,me,sel,i);
  h+=`<div class="slot ${free?'hl':''} ${flash==i?'fl':''}" data-r="${row}" data-i="${i}" style="left:${LX[i]}px;top:${LY[row?0:1]}px">${u?cardHTML(u,1,(row?'e ':'')+(tg.includes(u)?'tgt':'')+(pend&&pend.multi&&pend.multi.includes(u)?' msel':''),`data-u="${u.uid}"`):`<span class="num">${ROM(i+1)}</span>`}</div>`}
 if(flash>=0)h='<div class="laneband" style="left:'+(LX[flash]-14)+'px"></div>'+h;
 $('board').innerHTML=h+'<div id="castlbl"></div>';
 $('board').classList.toggle('cast',castMode);if(castMode)$('castlbl').textContent='Click the board to cast '+CD[me.hand[sel].id].Name;
 // hand
 const n=me.hand.length,step=Math.min(235,1150/Math.max(n,1)),mid=(n-1)/2;
 const hc=$('hand'),ex={};[...hc.children].forEach(e=>ex[e.dataset.hid]=e);
 me.hand.forEach((c,i)=>{let el=ex[c.uid],fresh=!el;delete ex[c.uid];if(el)el.style.visibility='';
  const dx=960-95+(i-mid)*step,dy=Math.pow(i-mid,2)*3,rot=(i-mid)*1.7,html=cardHTML(c,0,'',`data-c="${c.uid}"`);
  if(fresh){el=document.createElement('div');el.dataset.hid=c.uid;hc.appendChild(el);el.style.setProperty('--x',dx+'px');el.style.setProperty('--y','340px');el.style.setProperty('--r','0deg')}
  if(el.dataset.html!==html){el.innerHTML=html;el.dataset.html=html}
  el.className='hc'+(sel==i?' sel':'')+(mine()&&playable(G,me,i)?'':' np');el.dataset.h=i;el.style.setProperty('--z',i+2);
  if(fresh)el.getBoundingClientRect();
  el.style.setProperty('--x',dx+'px');el.style.setProperty('--y',dy+'px');el.style.setProperty('--r',rot+'deg')});
 Object.values(ex).forEach(e=>e.remove());
 // strip: cards played this round + latest log line
 const pl=G.hist.filter(x=>x.t==G.turn).slice(-4);let s='';for(let i=0;i<4;i++){const x=pl[i-(4-pl.length)];s+=x&&i>=4-pl.length?`<div class="s"><img src="${artSrc(x.id)}" alt="" onerror="artErr(this,${x.id})"></div>`:'<div class="s"></div>'}
 $('strip').innerHTML=s+`<div class="w">${(G.log[G.log.length-1]||'').replace(/^— |—$/g,'').slice(0,16)}</div>`;
 const act=mine();$('end').disabled=!act;$('end').textContent=G.step>=3?'Combat…':act?'End Turn':'Enemy…';
 musicUpdate();if(G.over)finish()}
function info(x,live){showZoom(x,live)}
// ---------- animations ----------
function anim(){const ev=G.ev;G.ev=[];if(NET&&NET.host)NET.ev.push(...ev);const aoeU=new Set();ev.forEach(e=>e.k=='aoe'&&e.us.forEach(x=>aoeU.add(x.u)));const inU=new Set(ev.filter(x=>x.k=='in').map(x=>x.u));const tfJust=ev.some(x=>x.k=='tf'&&inU.has(x.u));ev.forEach(x=>{if(x.k=='tf')x.just=tfJust});let dl=0;ev.forEach(e=>{
 const q=e.u?document.querySelector(`#board [data-u="${e.u}"]`):null;
 const run=()=>{sfxEv(e);
 if(e.k=='trig'&&q)q.classList.add('shake');
 else if(e.k=='in'){if(q)q.classList.add('pop');fxLand(e.u)}
 else if(e.k=='atk'){if(e.bonus)fxLunge(e,q,inU.has(e.u),e.post);else if(e.hr===0)fxSpark(1-e.o,e.l)}
 else if(e.k=='dmg'){const host=e.h!=null?$(e.h?'ehero':'phero'):q&&q.parentElement;if(!host)return;
  const s=document.createElement('span');s.className='pn'+(e.n<=0?' up':'')+(e.bk?' bk':'');s.textContent=e.n<=0?'BLOCK':'-'+e.n;host.appendChild(s);setTimeout(()=>s.remove(),e.bk?1300:1000);
  if(e.bk){fxPierce(e);host.classList.add('bkhit');setTimeout(()=>host.classList.remove('bkhit'),700)}
  if(e.n>0||e.h!=null){host.classList.add('shake');setTimeout(()=>host.classList.remove('shake'),400)}
  if(e.h!=null){host.classList.add('hhit');setTimeout(()=>host.classList.remove('hhit'),600)}
  if(e.bt&&e.u!=null)fxOne({t:'flame',u:e.u})}
 else if(e.k=='fx')fxOne(e)
 else if(e.k=='tf')fxFlip(e,e.just)
 else if(e.k=='bnc')fxDie(e,'');
 else if(e.k=='die')fxDie(e,e.bt?'burnd':aoeU.has(e.uid)?'aoed':'');
 else if(e.k=='aoe')fxAoe(e)};
 // everything that follows a bonus attack (damage, deaths, bounces...) waits for that attack to actually land
 dl>0?setTimeout(run,dl):run();
 if(e.k=='atk'&&e.bonus)dl=(inU.has(e.u)?360:e.post?520:0)+200})}
// ---------- effects layer: lives OUTSIDE #board so a re-render can't wipe a running animation ----------
const fxSlot=(o,l)=>{const d=document.createElement('div');d.className='fxs';d.style.left=LX[l]+'px';d.style.top=LY[o?0:1]+'px';$('fx').appendChild(d);return d};
const fxRm=(el,ms)=>setTimeout(()=>el.remove(),ms);
// bonus attack: the unit winds up, lunges at the unit / hero in front of it and springs back (same feel as combat)
function fxLunge(e,q,justIn,post){if(!q)return;const dir=e.o?1:-1,d=e.hr===0?62:94,go=()=>{
  q.style.zIndex=7;
  const an=q.animate([{transform:'translateY(0) scale(1)',easing:'ease-out'},{transform:`translateY(${-dir*10}px) scale(1.04)`,offset:.2,easing:'cubic-bezier(.55,0,1,.6)'},{transform:`translateY(${dir*d}px) scale(1.08)`,offset:.36},{transform:`translateY(${dir*d}px) scale(1.08)`,offset:.42,easing:'cubic-bezier(.2,.75,.25,1)'},{transform:'translateY(0) scale(1)'}],{duration:560});
  an.onfinish=()=>{q.style.zIndex=''};
  if(e.hr===0)setTimeout(()=>fxSpark(1-e.o,e.l),200)};
 justIn?setTimeout(go,360):post?setTimeout(go,520):go()}
// Transform: the old card fades away while the new card is "played" on top of it (same pop + landing ring as a normal play).
// The card that was just played first finishes its own play animation as its OLD self.
const HOLD=new Map();   // uid -> time until which the real (already transformed) card stays hidden under the animation
function holdUnits(){const now=performance.now();HOLD.forEach((t,u)=>{const el=document.querySelector(`#board [data-u="${u}"]`);if(t<now){HOLD.delete(u);if(el)el.style.visibility='';return}if(el)el.style.visibility='hidden'})}
function fxFlip(e,justIn){const live=findLive(e.u);if(!live)return;
 const dl=justIn?.55:.2,tot=(dl+.5)*1000,sl=fxSlot(e.o,e.l),f={id:e.from,atk:e.atk,hp:e.hp,mx:e.hp,d:CD[e.from],kw:new Set()},cl=e.o?'e ':'';
 sl.insertAdjacentHTML('beforeend',`<div class="tfw${justIn?' justin':''}" style="--dl:${dl}s"><div class="tfo">${cardHTML(f,1,cl)}</div><div class="tfn">${cardHTML(live,1,cl)}</div></div>`);
 HOLD.set(e.u,performance.now()+tot);holdUnits();
 setTimeout(()=>fxLand(e.u),dl*1000);
 setTimeout(()=>{holdUnits();const el=document.querySelector(`#board [data-u="${e.u}"]`);if(el&&!HOLD.has(e.u))el.style.visibility=''},tot+30);
 fxRm(sl,tot+60)}
function fxDie(e,v){const sl=fxSlot(e.o,e.lane),f={id:e.id,atk:e.atk,hp:e.hp,mx:e.hp,d:CD[e.id],kw:new Set()};
 sl.insertAdjacentHTML('beforeend',cardHTML(f,1,(e.o?'e ':'')+'dying '+v));
 if(v=='burnd'){sl.insertAdjacentHTML('beforeend','<div class=\"char\"></div><div class=\"flm1\"></div><div class=\"emb\">'+[0,1,2,3].map(i=>`<b style=\"left:${22+i*18}%;--dx:${i%2?14:-14}px;animation-delay:${(i*.12).toFixed(2)}s\"></b>`).join('')+'</div>');fxRm(sl,1200)} else if(v=='aoed'){sl.insertAdjacentHTML('beforeend','<div class="fxr" style="--c:#ff5a3c"></div>');fxRm(sl,1000)}
 else fxRm(sl,900)}
const AOEC=e=>{const T=e.T;return T=='DealDamage'?['dmg','#ff2b2b']:T=='DestroyUnit'?['des','#c4161c']:(T=='Heal'||T=='HealToFull')?['heal','#ffffff']:T=='BuffStats'?(e.pos?['buff','#ffffff']:['deb','#c4161c']):['sil','#ffffff']};
const slotOf=uid=>{const x=findLive(uid);return x?{o:x.o,l:x.lane}:null};
function fxLand(uid){const p=slotOf(uid);if(!p)return;const sl=fxSlot(p.o,p.l);sl.insertAdjacentHTML('beforeend','<div class=\"fxr land\" style=\"--c:#fff\"></div>');fxRm(sl,700)}
// Breakthrough: a fiery lance bursts out of the blocked lane and runs on into the hero
function fxPierce(e){if(e.bl==null||e.bl<0)return;const dir=e.bo?1:-1,sl=fxSlot(1-e.bo,e.bl);sl.style.setProperty('--d',(dir*150)+'px');sl.insertAdjacentHTML('beforeend','<div class="fxe bkr"></div><div class="bkl"></div>');fxRm(sl,1100)}
function fxSpark(o,l){if(l==null||l<0)return;const sl=fxSlot(o,l);sl.insertAdjacentHTML('beforeend','<div class=\"fxe hit\"></div><div class=\"sl w\"></div><div class=\"sl r\"></div>');fxRm(sl,600)}
const chevs=(cls,n)=>Array.from({length:n},(_,i)=>`<i class=\"chev ${cls}\" style=\"left:${14+i*30}%;animation-delay:${(i*.11).toFixed(2)}s\"></i>`).join('');
const pluses=(n)=>Array.from({length:n},(_,i)=>`<b class=\"plus\" style=\"left:${12+i*15}%;animation-delay:${(i*.09).toFixed(2)}s\">+</b>`).join('');
// one-target effects: heal / buff / debuff / silence / status applied / burn tick
function fxOne(e){
 if(e.h!=null){const host=$(e.h?'ehero':'phero');if(e.t=='heal'&&host){const s=document.createElement('span');s.className='pn up';s.textContent='+'+e.n;host.appendChild(s);setTimeout(()=>s.remove(),1000);host.classList.add('hglow');setTimeout(()=>host.classList.remove('hglow'),900)}return}
 const p=slotOf(e.u);if(!p)return;const sl=fxSlot(p.o,p.l);let h='',ms=1300;
 if(e.t=='heal'){h='<div class=\"fxe heal\"></div>'+pluses(5)+(e.n?`<span class=\"pn up\">+${e.n}</span>`:'')}
 else if(e.t=='buff'){const dn=e.a<0||e.hp<0;h=`<div class=\"fxe ${dn?'deb':'buff'}\"></div>`+chevs(dn?'dn':'',3)+`<span class=\"pn ${dn?'':'up'}\">${(e.a>=0?'+':'')+e.a}/${(e.hp>=0?'+':'')+e.hp}</span>`}
 else if(e.t=='sil'){h='<div class=\"fxe sil\"></div><div class=\"fxr\" style=\"--c:#fff\"></div>'}
 else if(e.t=='flame'){h='<div class=\"fxe flame\"></div>';ms=1100}
 else if(e.t=='st'){
  if(e.s=='Marked')h='<div class=\"fxm\"></div>';
  else if(e.s=='Stunned')h='<div class=\"fxe stun\"></div><div class=\"fxz\"><i></i><i style=\"animation-delay:-.33s\"></i><i style=\"animation-delay:-.66s\"></i></div>';
  else if(e.s=='Burning')h='<div class=\"fxe flame\"></div>';
  else h='<div class=\"fxe buff\"></div>'+chevs('',3)}
 sl.insertAdjacentHTML('beforeend',h);fxRm(sl,ms)}
function fxAoe(e){const[c,col]=AOEC(e),L=$('fx');
 const fl=document.createElement('div');fl.className='fxflash';fl.style.setProperty('--c',col);L.appendChild(fl);fxRm(fl,600);
 e.us.slice().sort((a,b)=>a.l-b.l).forEach((x,i)=>{const sl=fxSlot(x.o,x.l),d=(i*.07).toFixed(2)+'s';
  sl.insertAdjacentHTML('beforeend',`<div class="fxe ${c}" style="animation-delay:${d}"></div><div class="fxr" style="--c:${col};animation-delay:${d}"></div>`);fxRm(sl,1300)})}
function pickCard(title,cards,cb){$('mt').textContent=title;$('mok').style.display='none';
 $('mh').innerHTML=cards.map((c,i)=>`<div class="slot2" data-m="${i}">${cardHTML(c,0)}</div>`).join('');
 $('mh').onclick=e=>{const m=e.target.closest('[data-m]');if(!m)return;$('mul').style.display='none';$('mok').style.display='';cb(cards[+m.dataset.m])};
 $('mul').style.display='flex'}
const scl=()=>$('stage').getBoundingClientRect().width/1920;
function flyCard(id,from,to,o){o=o||{};if(o.out)sfx('spellCast');return new Promise(res=>{const f=document.createElement('div');f.className='fly';f.innerHTML=cardHTML({id,uid:0},0);
 // lay the card out at a full, readable size and scale it (tiny layout sizes make browsers clamp the text up and clip it)
 const LW=300,LH=LW*from.height/from.width,s0=from.width/LW,s1=to.width/LW;
 Object.assign(f.style,{left:from.left+'px',top:from.top+'px',width:LW+'px',height:LH+'px'});document.body.appendChild(f);
 const dx=to.left-from.left,dy=to.top-from.top,t0=`translate(0,0) scale(${s0})`,t1=`translate(${dx}px,${dy}px) scale(${s1})`;
 const a=f.animate([{transform:t0},{transform:t1}],{duration:o.dur||430,easing:'cubic-bezier(.2,.85,.25,1)',fill:'forwards'});
 a.onfinish=()=>{if(!o.out){f.remove();return res()}
  setTimeout(()=>{f.animate([{transform:t1,opacity:1},{transform:`translate(${dx}px,${dy}px) scale(${s1*1.1})`,opacity:0}],{duration:260,easing:'ease-out',fill:'forwards'}).onfinish=()=>{f.remove();res()}},o.hold||320)}})}
const slotRect=(r,i)=>document.querySelector(`#board .slot[data-r="${r}"][data-i="${i}"]`).getBoundingClientRect();
function centerRect(){const k=scl(),b=$('board').getBoundingClientRect(),w=300*k,h=w*368/260;return{left:b.left+(b.width-w)/2,top:b.top+(b.height-h)/2,width:w,height:h}}
function heroFrom(){const k=scl(),r=$('ehero').getBoundingClientRect();return{left:r.left+r.width/2-45*k,top:r.top+r.height/2-64*k,width:90*k,height:127*k}}
// ---------- playing cards ----------
function cancel(){sel=pend=null;castMode=false;say('');render()}
// multi-select pick (Angel): click friendly units to toggle them, then confirm
function mmsg(){const n=pend.multi.length;say(`<b>${CD[G.p[0].hand[pend.ci].id].Name}</b>: click friendly units to sacrifice (+1/+1 each) <button data-mok="1">${n?'Sacrifice '+n:'Sacrifice none'}</button>`,1)}
function nextPick(){const me=G.p[0],d=CD[me.hand[pend.ci].id],ks=apicks(G,me,d,pend.got);
 if(pend.got.length<ks.length){const k=ks[pend.got.length];
  // Units only: when a "When Played" effect has exactly one legal target (enemy / friendly / any unit), choose it automatically. Spells and sacrifices stay manual.
  if(d.Type=='Unit'&&['e','f','a'].includes(k)){const r=req(G,me,k);if(r.length==1){pend.got.push(r[0]);nextPick();return}}
  render();
  if(k=='C'){const e=d.Effects.find(x=>x.ChoiceLabels);say(`<b>${d.Name}</b>: `+e.ChoiceLabels.map((l,i)=>`<button data-ch="${i}" ${choiceOK(G,me,d,i)?'':'disabled'}>${l}</button>`).join(''),1)}
  else if(k=='D'){say(ASK.D,1);pickCard(d.Name+' - choose a card from your deck',[...me.deck].sort((a,b)=>CD[a.id].Cost-CD[b.id].Cost||CD[a.id].Name.localeCompare(CD[b.id].Name)),c=>{pend.got.push(c);nextPick()})}
  else if(k=='M'){pend.multi=[];mmsg()}
  else say(ASK[k]+' (red outline)',1);return}
 const p=pend;sel=pend=null;castMode=false;doPlay(p)}
async function doPlay(p){const me=G.p[0],c=me.hand[p.ci],d=CD[c.id];say('');busy=true;
 const el=document.querySelector(`#hand [data-hid="${c.uid}"]`),sp=d.Type=='Spell';
 const from=el?el.getBoundingClientRect():{left:innerWidth/2-60,top:innerHeight-200,width:120,height:170};
 if(el)el.style.visibility='hidden';
 await flyCard(c.id,from,sp?centerRect():slotRect(0,p.ln),{out:sp,dur:sp?480:380,hold:sp?300:0});
 if(NET&&!NET.host){netSend({t:'move',ci:p.ci,ln:p.ln,pk:p.got.map(descr)});armSync();return} // guest: the host applies it and sends the new state
 const ok=play(G,me,p.ci,p.ln,p.got);busy=false;render();anim();
 if(NET&&ok)netPush({fly:{id:c.id,sp:sp?1:0,ln:p.ln,by:0}})}
function begin(ci,ln){pend={ci,ln,got:[]};nextPick()}
function selectHand(i){const me=G.p[0];pend=null;castMode=false;sel=sel==i?null:i;say('');render();if(sel==null)return;
 const c=me.hand[i],d=CD[c.id];
 if(!playable(G,me,i)){const why=cost(G,me,c)>me.b?'not enough Blood':G.allow=='U'&&d.Type!='Unit'?'only Units now':G.allow=='A'&&d.Type!='Spell'?'only Actions now':'no valid target';say(`Can't play ${d.Name} now (${why})`);return}
 if(d.Type=='Spell'){const ks=apicks(G,me,d);if(ks.length)begin(i,null);else{castMode=true;render();say(`<b>${d.Name}</b>: click anywhere on the board to cast`,1)}}
 else say(`Choose a free lane for ${d.Name}`,1)}
document.addEventListener('click',e=>{if(!G||G.over||$('game').style.display!='block')return;
 const t=e.target,hd=t.closest('[data-h]'),sl=t.closest('#board .slot'),me=G.p[0];
 if(t.dataset.cancel){if(pend&&pend.pre)return;cancel();return}
 if(!t.closest('[data-u],[data-c]'))stickyZoom=false,hideZoom();
 if(pend&&pend.pre){if(sl){const u2=G.p[+sl.dataset.r].ln[+sl.dataset.i];if(u2&&validTargets().includes(u2)){const r=pendRes;pend=null;say('');r(u2)}}return}
 if(t.dataset.ch!=null&&pend&&!t.disabled){pend.got.push(+t.dataset.ch);nextPick();return}
 if(t.dataset.mok&&pend&&pend.multi){pend.got.push(pend.multi.slice());pend.multi=null;nextPick();return}
 if(!mine()){const u=t.closest('[data-u]');if(u){stickyZoom=true;showZoom(findLive(u.dataset.u),1)}return}
 if(hd){selectHand(+hd.dataset.h);return}
 if(pend&&kind()=='eh'&&t.closest('#ehero')){pend.got.push(H(1));nextPick();return}
 if(castMode&&t.closest('#board')){const ci=sel;castMode=false;sel=null;doPlay({ci,ln:null,got:[]});return}
 if(sl){const r=+sl.dataset.r,i=+sl.dataset.i,u=G.p[r].ln[i];
  if(pend){if(u&&validTargets().includes(u)){if(kind()=='M'){const a=pend.multi,j=a.indexOf(u);j<0?a.push(u):a.splice(j,1);render();mmsg()}else{pend.got.push(u);nextPick()}}return}
  if(sel!=null&&r==0&&!u&&CD[me.hand[sel].id].Type=='Unit'&&canPlay(G,me,sel,i)){begin(sel,i);return}
  if(u){stickyZoom=true;showZoom(u,1)}}});
document.addEventListener('contextmenu',e=>{if(G&&$('game').style.display=='block'&&(sel!=null||pend)){e.preventDefault();if(!(pend&&pend.pre))cancel()}});
document.addEventListener('keydown',e=>{if(!G||$('game').style.display!='block'||e.target.tagName=='INPUT'||$('setmenu').style.display=='flex')return;
 if((e.key=='Enter'||e.key==' ')&&mine()&&pend&&pend.multi){e.preventDefault();pend.got.push(pend.multi.slice());pend.multi=null;nextPick();return}
 if((e.key=='Enter'||e.key==' ')&&mine()){e.preventDefault();if(castMode){const ci=sel;castMode=false;sel=null;doPlay({ci,ln:null,got:[]})}else $('end').click()}
 if(e.key=='l'||e.key=='L')showHist();
 if(e.key=='Escape'&&viewing){closeMul();return}
 if(e.key=='Escape'&&$('modal').style.display=='flex'){$('modal').style.display='none';return}
 if(e.key=='Escape'&&!busy&&!(pend&&pend.pre))cancel();
 if(/^[1-8]$/.test(e.key)&&mine()&&G.p[0].hand[+e.key-1])selectHand(+e.key-1)});
// ---------- drag a card from your hand onto the board ----------
// Units: drop on a free lane of yours. Spells with a target: drop on the target. Spells without one: drop anywhere on the board.
// A drop just triggers the same click the player would have made, so all the normal rules/targeting apply.
let drag=null,dragSupp=false;
document.addEventListener('click',e=>{if(dragSupp){e.stopImmediatePropagation();e.preventDefault()}},true);
// Spells with a Choice (Expectancy, Dagger Throw): the drop spot picks the option.
// draw from deck -> your deck pile, draw from discard -> your discard pile, damage an enemy unit -> that unit, damage the hero -> enemy hero counter.
function choiceSpot(el,d){const me=G.p[0],ef=(d.Effects||[]).find(x=>x.ChoiceLabels);if(!ef||!el)return null;
 for(let j=0;j<ef.Actions.length;j++){const a=ef.Actions[j];let node=null,unit=null;
  if(a.Type=='DrawCard')node=el.closest('#deckb');
  else if(a.Type=='DrawFromDiscard')node=el.closest('#pile');
  else if(a.Target=='EnemyHero')node=el.closest('#ehero');
  else if(a.Target=='TargetEnemyUnit'){const sl=el.closest('#board .slot');
   if(sl&&+sl.dataset.r==1){unit=G.p[1].ln[+sl.dataset.i];const k=apicks(G,me,d,[j])[1];if(!unit||!k||!req(G,me,k).includes(unit))unit=null;else node=sl}}
  if(node)return{node,j,unit,ok:choiceOK(G,me,d,j)}}
 return null}
function dropInfo(el){const me=G.p[0];if(!el||sel==null||!me.hand[sel])return null;
 const d=CD[me.hand[sel].id],sl=el.closest&&el.closest('#board .slot');
 if(d.Type=='Unit'){if(sl&&+sl.dataset.r==0&&!me.ln[+sl.dataset.i]&&canPlay(G,me,sel,+sl.dataset.i))return{node:sl,ok:1,run:()=>sl.click()};return null}
 if(castMode)return el.closest('#board')?{node:null,ok:1,run:()=>el.click()}:null;
 if(pend){const k=kind();
  if(k=='eh'&&el.closest('#ehero'))return{node:el.closest('#ehero'),ok:1,run:()=>el.click()};
  if(sl){const u=G.p[+sl.dataset.r].ln[+sl.dataset.i];if(u&&validTargets().includes(u))return{node:sl,ok:1,run:()=>el.click()}}
  return null}
 const cs=choiceSpot(el,d);
 if(cs)return{node:cs.node,ok:cs.ok,run:()=>{if(!cs.ok){cancel();say("Can't choose that option right now");return}
  pend={ci:sel,ln:null,got:[cs.j]};if(cs.unit)pend.got.push(cs.unit);nextPick()}};
 return null}
// the hero wrapper has no size of its own; the visible health circle is its ring canvas
const ringOf=n=>n.id=='ehero'?n.querySelector('.ring'):n;
function dropOn(el){const i=dropInfo(el);if(i)i.run();else cancel()}
function dragZones(on){document.querySelectorAll('.dz,.dh').forEach(x=>x.classList.remove('dz','dh'));if(!on||sel==null)return;
 const me=G.p[0],d=CD[me.hand[sel].id];if(d.Type!='Spell'||pend||castMode)return;const ef=(d.Effects||[]).find(x=>x.ChoiceLabels);if(!ef)return;
 ef.Actions.forEach((a,j)=>{if(!choiceOK(G,me,d,j))return;
  if(a.Type=='DrawCard')$('deckb').classList.add('dz');else if(a.Type=='DrawFromDiscard')$('pile').classList.add('dz');
  else if(a.Target=='EnemyHero')ringOf($('ehero')).classList.add('dz');
  else if(a.Target=='TargetEnemyUnit'){const k=apicks(G,me,d,[j])[1];if(k)req(G,me,k).forEach(u=>{const sl=document.querySelector(`#board .slot[data-r="${u.o}"][data-i="${u.lane}"]`);if(sl)sl.classList.add('dz')})}})}
document.addEventListener('pointerdown',e=>{if(e.button!==0||!G||$('game').style.display!='block'||!mine()||(pend&&pend.pre))return;
 const hc=e.target.closest('#hand .hc');if(!hc)return;drag={hc,i:+hc.dataset.h,x:e.clientX,y:e.clientY,on:false}});
document.addEventListener('pointermove',e=>{if(!drag)return;
 if(!drag.on){if(Math.hypot(e.clientX-drag.x,e.clientY-drag.y)<10)return;
  const me=G.p[0],i=drag.i,c=me.hand[i];
  if(!c||!playable(G,me,i)){drag=null;return} // a plain click will explain why it can't be played
  const d=CD[c.id],k0=d.Type=='Spell'?apicks(G,me,d)[0]:null;if(k0=='D'||(k0=='C'&&!(d.Effects||[]).some(x=>x.ChoiceLabels))){drag=null;return} // deck-tutor picks use their own prompt
  stickyZoom=false;$('zoom').style.display='none';
  if(k0=='C'){cancel();sel=i;render()}else if(sel!=i)selectHand(i); // choice spells: skip the option prompt, the drop spot decides
  dragZones(true);
  const w=190*scl()*1.1,g=document.createElement('div');g.className='dragghost';g.style.width=w+'px';g.innerHTML=cardHTML(c,0);document.body.appendChild(g);
  drag.g=g;drag.w=w;drag.on=true;drag.hc.classList.add('dragging')}
 drag.g.style.left=e.clientX-drag.w/2+'px';drag.g.style.top=e.clientY-drag.w*0.7+'px';
 document.querySelectorAll('.dh').forEach(x=>x.classList.remove('dh'));
 const inf=dropInfo(document.elementFromPoint(e.clientX,e.clientY));if(inf&&inf.ok&&inf.node)ringOf(inf.node).classList.add('dh')});
function endDrag(e,drop){if(!drag)return;const d=drag;drag=null;if(!d.on)return;
 d.g.remove();dragZones(false);
 const el=drop?document.elementFromPoint(e.clientX,e.clientY):null;
 dragSupp=true;setTimeout(()=>{dragSupp=false;if(G&&!G.over)dropOn(el)},0)}
document.addEventListener('pointerup',e=>endDrag(e,true));
document.addEventListener('pointercancel',e=>endDrag(e,false));
// ---------- combat flow ----------
function choosePre(u){return new Promise(r=>{pendRes=r;pend={ks:['e'],got:[],pre:true};render();say(`<b>${u.d.Name}</b> - before combat: choose an enemy unit (red outline)`)})}
// smooth attack: wind-up -> fast strike -> (state is applied at impact) -> eased return
let LUN=[];
function strikeLane(i){LUN=[];const A=G.p[0].ln[i],B=G.p[1].ln[i],both=!!(A&&B);
 [[0,A],[1,B]].forEach(([r,u])=>{if(!u||u.atk<=0||u.kw.has('Stunned'))return;
  const el=document.querySelector(`#board .slot[data-r="${r}"][data-i="${i}"] .card`);if(!el)return;const dir=r?1:-1,d=both?62:94;el.style.zIndex=7;
  el.animate([{transform:'translateY(0) scale(1)',easing:'ease-out'},{transform:`translateY(${-dir*12}px) scale(1.04)`,offset:.42,easing:'cubic-bezier(.55,0,1,.6)'},{transform:`translateY(${dir*d}px) scale(1.08)`}],{duration:320,fill:'forwards'});
  LUN.push({uid:u.uid,off:dir*d})});
 return sleep(LUN.length?340:140)}
function recoil(){LUN.forEach(x=>{const el=document.querySelector(`#board [data-u="${x.uid}"]`);if(!el)return;el.style.zIndex=6;
  el.animate([{transform:`translateY(${x.off}px) scale(1.08)`},{transform:'translateY(0) scale(1)'}],{duration:480,easing:'cubic-bezier(.2,.75,.25,1)'})});LUN=[]}
async function combat(my){for(let i=0;i<4&&!G.over&&my==gid;i++){flash=i;render();
  const pre={},opts=preTargets(G,G.p[0].ln[i]);
  if(opts)pre[0]=opts.length==1?opts[0]:await choosePre(G.p[0].ln[i]);
  if(NET){const o1=preTargets(G,G.p[1].ln[i]);if(o1)pre[1]=o1.length==1?o1[0]:await askPre(i,o1);if(my!=gid)return}
  say('');render();
  await strikeLane(i);if(my!=gid)return;lane(G,i,pre);flash=-1;const pb=G.ev.some(x=>x.k=='atk'&&x.post);render();anim();recoil();if(NET)netPush({t:'lane',i});await sleep(pb?1150:650)}}
async function flow(){busy=true;const my=gid;
 while(!G.over&&my==gid){
  if(G.step>=3){say('Combat!');netPush();await combat(my);if(G.over||my!=gid)break;endRound(G);startRound(G);say('');render();anim();continue}
  if(G.act==0){busy=false;say('');render();netPush();return}
  if(NET){say('Opponent: '+PH[G.allow]+'…');render();netPush();return} // online: wait for the guest's moves (net.js)
  say('Enemy: '+PH[G.allow]+'…');render();let n=0;
  while(n++<20&&!G.over&&my==gid){await sleep(450);if(my!=gid)return;const m=botPlan(G,G.p[1]);if(!m)break;
   await flyCard(m.id,heroFrom(),m.sp?centerRect():slotRect(1,m.ln),{out:!!m.sp,dur:m.sp?480:380,hold:300});if(my!=gid)return;
   play(G,G.p[1],m.ci,m.ln,m.pk);render();anim()}
  await sleep(300);if(my!=gid)return;nextStep(G)}
 if(my==gid){render();netPush()}}
// ---------- history / piles ----------
function showHist(){const rows=G.hist.slice().reverse().map(h=>`<div class="hr"><img src="${artSrc(h.id)}" alt="" onerror="artErr(this,${h.id})"><span><b>${CD[h.id].Name}</b> ${CD[h.id].Type=='Spell'?'cast':'played'} by ${h.p?'Enemy':'You'}${h.tg?' -> '+h.tg:''}<br><small>Round ${h.t}</small></span></div>`).join('')||'<small>No cards played yet.</small>';
 $('hist').innerHTML=`<div class="hb"><h3>Cards played</h3>${rows}<h3>Events</h3><small>${G.log.slice().reverse().slice(0,120).join('<br>')}</small><p><small>(click anywhere to close)</small></p></div>`;$('hist').style.display='flex'}
$('hs').onclick=()=>{if(G)showHist()};$('strip').onclick=()=>{if(G)showHist()};$('hist').onclick=()=>$('hist').style.display='none';
let viewing=false;
function viewPile(title,cards){if(!G||$('mul').style.display=='flex')return;viewing=true;
 $('mt').textContent=title;$('mok').style.display='';$('mok').textContent='Close';$('mok').onclick=closeMul;
 $('mh').innerHTML=cards.length?cards.map(c=>`<div class="slot2">${cardHTML(c,0)}</div>`).join(''):'<small style="font-size:30px">Empty</small>';
 $('mh').style.setProperty('--cw',fitW(cards.length)+'px');$('mh').onclick=null;$('mul').style.display='flex'}
// biggest card width at which n cards fit the overlay without scrolling
function fitW(n){for(let w=190;w>=60;w-=2){const g=Math.round(w/9),cols=Math.max(1,Math.floor(1700/(w+g))),rows=Math.ceil(Math.max(n,1)/cols);if(rows*(w*368/260+g)<=760)return w}return 60}
$('pile').onclick=()=>{if(G)viewPile('Your discard pile ('+G.p[0].disc.length+') - newest first',G.p[0].disc.slice().reverse())};
$('deckb').onclick=()=>{if(G)viewPile('Your deck ('+G.p[0].deck.length+') - sorted by cost',G.p[0].deck.slice().sort((a,b)=>cmpC(CD[a.id],CD[b.id])))};
$('pile').title='Click to view your discard pile';$('deckb').title='Click to view the cards left in your deck';
function closeMul(){viewing=false;$('mh').style.removeProperty('--cw');$('mul').style.display='none';$('mok').textContent='Confirm';$('mok').onclick=mulOK}
function finish(){if($('ov').style.display=='flex')return;$('ovt').textContent=G.over.left?'OPPONENT LEFT':G.over.sur&&G.over.win==1?'SURRENDERED':G.over.win==0?'VICTORY':'DEFEAT';sfx(G.over.left||G.over.win==0?'victory':'defeat',{pitch:0});$('ov').style.display='flex'}
// ---------- end turn / surrender ----------
$('end').onclick=()=>{if(!mine())return;sfx('endTurn');sel=pend=null;castMode=false;say('');
 if(NET&&!NET.host){busy=true;netSend({t:'end'});armSync();return}
 nextStep(G);flow()};
$('sur').onclick=()=>{if(G&&!G.over)$('modal').style.display='flex'};$('mno').onclick=()=>$('modal').style.display='none';
$('myes').onclick=()=>{$('modal').style.display='none';if(!G||G.over)return;if(NET&&!NET.host){netSend({t:'sur'});return}
 G.over={win:1,sur:1};L(G,'You surrendered');pend=null;sel=null;castMode=false;say('');$('mul').style.display='none';$('hist').style.display='none';render();netPush()};
$('ovr').onclick=()=>NET?rematch():start();
// ---------- mulligan / start ----------
function showMul(){mulSel=new Set();$('mt').textContent='Mulligan - click cards to replace';$('mok').style.display='';$('mh').style.display='';$('mpr').style.display='none';
 const draw=()=>{$('mh').innerHTML=G.p[0].hand.map(c=>`<div class="slot2 ${mulSel.has(c.uid)?'rm':''}" data-m="${c.uid}">${cardHTML(c,0)}</div>`).join('')};draw();
 $('mh').onclick=e=>{const m=e.target.closest('[data-m]');if(!m)return;const k=+m.dataset.m;mulSel.has(k)?mulSel.delete(k):mulSel.add(k);draw()};
 $('mul').style.display='flex'}
// after the mulligan: choose to start first or second (opposite choices are honoured; identical choices -> random)
function askOrder(cb){$('mt').textContent='Your new hand - do you prefer to go first or second?';$('mok').style.display='none';$('mh').onclick=null;
 $('mh').innerHTML=G.p[0].hand.map(c=>`<div class="slot2">${cardHTML(c,0)}</div>`).join('');$('mh').style.display='';$('mpr').style.display='flex';$('mul').style.display='flex';
 const go=v=>{$('mpr').style.display='none';$('mul').style.display='none';cb(v)};$('mfirst').onclick=()=>go('first');$('msecond').onclick=()=>go('second')}
const mulOK=()=>{const ids=[...mulSel];
 if(NET){
  if(NET.host){mulligan(G,G.p[0],ids);NET.mull[0]=1;render();askOrder(v=>{NET.pref[0]=v;say('Waiting for opponent…');tryBegin()})}
  else{netSend({t:'mull',ids});$('mok').style.display='none';$('mt').textContent='Swapping your cards…';NET.ao=v=>{say('Waiting for opponent…');netSend({t:'pref',v})}}   // the host's reply carries the new hand; the choice is asked then
  return}
 mulligan(G,G.p[0],ids);botMull(G,G.p[1]);
 askOrder(v=>{decideStart(G,v,'first');startRound(G);flow()})};
$('mok').onclick=mulOK;
function start(){if(NET)netLeave();$('ovr').style.display='';$('ovr').textContent='Rematch';gid++;BOTMODE=$('bot').value;G=newGame(ALL[$('d0').value].c,ALL[$('d1').value].c);busy=true;sel=pend=null;castMode=false;stickyZoom=false;
 show('game');$('ov').style.display='none';say('');render();showMul()}
function toMenu(){if(NET)netLeave();$('ovr').style.display='';$('ovr').textContent='Rematch';gid++;$('ov').style.display='none';$('mul').style.display='none';$('hist').style.display='none';show('menu');$('zoom').style.display='none';G=null;musicUpdate()}
$('go').onclick=()=>{$('botmenu').style.display='none';start();musicStart()};
$('ovb').onclick=toMenu;
// ---------- deck builder ----------
let bd={},bname='';
const btot=()=>Object.values(bd).reduce((a,b)=>a+b,0);
// order used by the deck builder AND the draw-pile viewer: cost, then type (units first), then name
const cmpC=(a,b)=>(a.Cost-b.Cost)||((a.Type==b.Type)?0:a.Type=='Unit'?-1:1)||a.Name.localeCompare(b.Name);
const bcards=CARDS.filter(c=>c.Id<900).sort(cmpC);
function bRender(){const q=$('bq').value.toLowerCase(),t=$('bt').value,co=$('bco').value;
 $('bgrid').innerHTML=bcards.filter(c=>(!t||c.Type==t)&&(co===''||c.Cost==co)&&(!q||c.Name.toLowerCase().includes(q)||(c.Description||'').toLowerCase().includes(q)))
  .map(c=>`<div class="bc ${bd[c.Id]?'in':''}" data-b="${c.Id}">${cardHTML({id:c.Id,uid:0,ba:0},0)}${bd[c.Id]?`<u>x${bd[c.Id]}</u>`:''}</div>`).join('');
 $('bd').innerHTML=Object.keys(bd).map(Number).sort((a,b)=>cmpC(CD[a],CD[b])).map(id=>`<span data-r="${id}">${CD[id].Cost} ${CD[id].Name} x${bd[id]} -</span>`).join('');
 $('bc').textContent=btot()+'/30';$('bc').style.color=btot()==30?'#8c8':'#e44';$('bn').value=bname}
function bLoad(i){const l=[...DECKS.map(d=>({...d})),...loadC().map(d=>({...d,custom:1}))][i];bd={};l.c.forEach(id=>bd[id]=(bd[id]||0)+1);bname=l.custom?l.n:l.n+' (copy)';bRender()}
function bList(){const all=[...DECKS,...loadC().map(d=>({...d,custom:1}))];$('bl').innerHTML='<option value="">Load deck…</option>'+all.map((d,i)=>`<option value="${i}">${d.custom?'* ':''}${d.n}</option>`).join('')}
const bInfo=t=>$('bi').innerHTML=t;
$('bopen').onclick=()=>{bd={};bname='';bList();bRender();show('bld')};
$('bback').onclick=()=>{show('menu');refreshDecks()};
$('bgrid').onclick=e=>{const c=e.target.closest('[data-b]');if(!c)return;const id=+c.dataset.b,d=CD[id];
 bInfo(`<b>${d.Name}</b> - ${d.Type}${d.Subtypes?' - '+d.Subtypes.join('/'):''} - cost ${d.Cost}${d.Type=='Unit'?' - '+d.Attack+'/'+d.Health:''}<br>${d.Description||(d.Keywords||[]).join(', ')}`);
 if(btot()>=30){bInfo($('bi').innerHTML+'<br><i>Deck is full (30).</i>');return}if((bd[id]||0)>=3){bInfo($('bi').innerHTML+'<br><i>Max 3 copies.</i>');return}bd[id]=(bd[id]||0)+1;bRender()};
$('bd').onclick=e=>{const c=e.target.closest('[data-r]');if(!c)return;const id=+c.dataset.r;if(--bd[id]<=0)delete bd[id];bRender()};
['bq','bt','bco'].forEach(i=>$(i).oninput=bRender);$('bn').oninput=()=>bname=$('bn').value;
$('bl').onchange=()=>{if($('bl').value!=='')bLoad(+$('bl').value);$('bl').value=''};
$('bsave').onclick=()=>{let n=$('bn').value.trim();if(!n)return alert('Give the deck a name.');if(btot()!=30)return alert('A deck needs exactly 30 cards (now '+btot()+').');
 if(DECKS.some(d=>d.n==n))n+=' (copy)';const a=loadC().filter(d=>d.n!=n);
 a.push({n,c:Object.keys(bd).flatMap(id=>Array(bd[id]).fill(+id))});saveC(a);bname=n;bList();bRender();bInfo('Saved "'+n+'".')};
$('bdel').onclick=()=>{const n=$('bn').value.trim(),a=loadC();if(!a.some(d=>d.n==n))return alert('Only your saved (*) decks can be deleted.');
 if(confirm('Delete "'+n+'"?')){saveC(a.filter(d=>d.n!=n));bd={};bname='';bList();bRender()}};
$('bexp').onclick=()=>{const t=JSON.stringify({n:$('bn').value.trim()||'Deck',c:Object.keys(bd).flatMap(id=>Array(bd[id]).fill(+id))});
 (navigator.clipboard?navigator.clipboard.writeText(t).then(()=>alert('Deck copied to clipboard.')).catch(()=>prompt('Copy:',t)):prompt('Copy:',t))};
$('bimp').onclick=()=>{try{const d=JSON.parse(prompt('Paste deck code:')||'');const m={};d.c.forEach(id=>{if(CD[id]&&id<900)m[id]=(m[id]||0)+1});
 Object.keys(m).forEach(k=>m[k]=Math.min(3,m[k]));bd=m;bname=d.n||'Imported';bRender()}catch(e){alert('Invalid deck code.')}};
// ---------- font choice (remembered) ----------
const setFont=f=>{document.body.dataset.font=f;try{localStorage.setItem('rj_font',f)}catch(e){}};
try{const f=localStorage.getItem('rj_font');if(f&&[...$('fnt').options].some(o=>o.value==f))$('fnt').value=f}catch(e){}
setFont($('fnt').value);$('fnt').onchange=()=>setFont($('fnt').value);
// Fit card text: when a unit gains keywords the description block can overflow its box, so shrink that card's text until it fits
function fitTx(el){const sig=el.innerHTML.length+'|'+el.clientWidth;if(el.dataset.f===sig||!el.clientHeight)return;
 const kw=el.querySelector('.kwl');el.style.fontSize='';if(kw)kw.style.fontSize='';
 const b=parseFloat(getComputedStyle(el).fontSize),bk=kw?parseFloat(getComputedStyle(kw).fontSize):0,cs=getComputedStyle(el);
 const pad=parseFloat(cs.paddingTop)+parseFloat(cs.paddingBottom);
 const need=()=>[...el.children].reduce((a,c)=>a+c.offsetHeight,0)+pad;let s=1;
 while(need()>el.clientHeight+1&&s>.4){s-=.04;el.style.fontSize=(b*s)+'px';if(kw)kw.style.fontSize=(bk*s)+'px'}
 el.dataset.f=el.innerHTML.length+'|'+el.clientWidth}
let fitQ=0;const fitAll=()=>{fitQ=0;document.querySelectorAll('.card .tx').forEach(fitTx)};
new MutationObserver(()=>{if(!fitQ)fitQ=requestAnimationFrame(fitAll)}).observe(document.body,{childList:true,subtree:true,characterData:true});
addEventListener('resize',()=>{document.querySelectorAll('.card .tx').forEach(e=>delete e.dataset.f);fitAll()});
document.fonts&&document.fonts.ready.then(()=>{document.querySelectorAll('.card .tx').forEach(e=>delete e.dataset.f);fitAll()});
// Preload every card image + the frame at startup and keep references, so they are decoded and cached before a card is ever drawn (no blank flash)
const PRELOAD=[];['img/CardFront.png','img/back.webp','img/missing_texture.webp',...CARDS.map(c=>'img/'+c.Id+'.webp')].forEach(u=>{const i=new Image();i.decoding='async';
 const m=/^img\/(\d+)\.webp$/.exec(u);if(m)i.onerror=()=>MISSING.add(+m[1]);i.src=u;PRELOAD.push(i);if(i.decode)i.decode().catch(()=>{})});
show('menu');

// keep cards hidden while their Transform flip is still playing, even if the board is re-rendered meanwhile
{const _rd=render;render=function(){_rd.apply(this,arguments);holdUnits()}}
