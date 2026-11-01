// ReJoltance mobile port - engine. Rules recovered from the Godot build; unknown details are inferred.
const CD={};CARDS.forEach(c=>CD[c.Id]=c);
let UID=1;const R=n=>Math.floor(Math.random()*n);
const shuf=a=>{for(let i=a.length-1;i>0;i--){const j=R(i+1);[a[i],a[j]]=[a[j],a[i]]}return a};
const L=(G,s)=>{G.log.push(s);if(G.log.length>300)G.log.shift()};
const H=(p)=>({h:1,p});
const SELF=['OnKill','OnDamagedEnemyUnit','OnDamagedEnemyHero'];
const EV=(G,o)=>G.ev.push(o);
const kwp=(u,k,df)=>((u.d.KeywordParams||{})[k])||df||1;
function mk(id,o){const d=CD[id];return{uid:UID++,id,d,o,atk:d.Attack||0,hp:d.Health||0,mx:d.Health||0,kw:new Set(d.Keywords||[]),lane:-1}}
function newGame(a,b){
 const G={turn:0,over:null,log:[],hist:[],ev:[],step:0,act:0,allow:'U',start:0,fp:R(2),p:[a,b].map((dk,i)=>({i,hp:20,mb:0,b:0,hand:[],disc:[],ln:[null,null,null,null],gb:{a:0,h:0},sp:0,sc:0,
  deck:shuf(dk.map(id=>({uid:UID++,id})))}))};
 G.p.forEach(p=>{for(let k=0;k<4;k++)draw(G,p,1)});return G}
// after the mulligan both players say whether they prefer to go first or second ('first'/'second')
function decideStart(G,pa,pb){let f;if(pa!=pb)f=pa=='first'?0:1;else f=R(2);G.fp=f;
 L(G,(f?'Enemy goes':'You go')+' first'+(pa==pb?' (both chose '+pa+' - decided randomly)':''));return f}
function setStep(G){const s=G.start,o=1-s;[G.act,G.allow]=G.step==0?[s,'U']:G.step==1?[o,'B']:[s,'A']}
function nextStep(G){G.step++;if(G.step<3)setStep(G);else{G.act=null;G.allow=''}}
function mulligan(G,p,ids){const out=p.hand.filter(c=>ids.includes(c.uid));p.hand=p.hand.filter(c=>!ids.includes(c.uid));
 for(let i=0;i<out.length&&p.deck.length;i++)p.hand.push(p.deck.shift());p.deck.push(...out);shuf(p.deck)}
function botMullBasic(G,p){mulligan(G,p,p.hand.filter(c=>CD[c.id].Cost>=4).map(c=>c.uid))}
function startRound(G){G.turn++;G.start=(G.turn%2?0:1)^(G.fp|0);G.step=0;setStep(G);G.p.forEach(p=>{p.mb=Math.min(10,G.turn);p.b=p.mb;if(G.turn>1)draw(G,p)});L(G,'— Round '+G.turn+' —')}
function draw(G,p,quiet){
 // empty deck: no reshuffle - fatigue damage instead, growing by 1 each time a draw fails
 if(!p.deck.length){p.fat=(p.fat||0)+1;L(G,(p.i?'Enemy':'You')+' ha'+(p.i?'s':'ve')+' no cards - fatigue '+p.fat);EV(G,{k:'snd',n:'cardDrawn',o:p.i});dmg(G,H(p.i),p.fat,null,2);return}
 const c=p.deck.shift();
 if(p.hand.length>=8){p.disc.push(c);return}
 p.hand.push(c);if(quiet)return;EV(G,{k:'snd',n:'cardDrawn',o:p.i});
 p.ln.forEach(u=>u&&fire(G,'OnFriendlyCardDrawn',u,{}));
 G.p[1-p.i].ln.forEach(u=>u&&fire(G,'OnOpponentCardDrawn',u,{}))}
const has=(p,id)=>p.ln.some(u=>u&&u.id==id&&!u.sil);
const cnt=(p,id)=>p.ln.filter(u=>u&&u.id==id&&!u.sil).length;
function cost(G,p,c){const d=CD[c.id];let x=d.Cost;
 if(d.Type=='Spell'){x-=cnt(p,46);x+=6*cnt(G.p[1-p.i],60)}
 x-=(c.red||0);return Math.max(0,x)}
function chk(G){G.p.forEach(p=>{if(p.hp<=0&&!G.over){G.over={win:1-p.i}}})}
// ---- effects ----
function cond(c,u,x,G){if(!c)return true;const sub=(c.SubConditions||[]).map(k=>cond(k,u,x,G)),P=c.TargetParam;
 switch(c.Condition){case'And':return sub.every(Boolean);case'Or':return sub.some(Boolean);case'Not':return!sub[0];
 case'IsSelf':return x.u===u;case'IsSubtype':return!!(x.u&&(x.u.d||CD[x.u.id]).Subtypes||[]).includes(P);
 case'IsStatus':return x.st==P;case'IsEnemy':return!!x.u&&x.u.o!=u.o;case'IsFriendly':return!!x.u&&x.u.o==u.o;
 case'HasSubtypeOnBoard':return G.p[u.o].ln.some(w=>w&&w!==u&&w.d.Subtypes&&w.d.Subtypes.includes(P))}
 return true}
function fire(G,trig,u,ctx){if(!u||u.sil||G.over)return;ctx=ctx||{};
 (u.d.Effects||[]).forEach(e=>{if(e.Trigger!=trig||(e.Zone&&e.Zone!='Board'))return;
  if(trig=='OnPlayed'&&(e.Zone=='Board')!=!!ctx.lis)return;
  if(SELF.includes(trig)&&!e.Condition&&ctx.u&&ctx.u!==u)return;
  if(!cond(e.Condition,u,ctx,G))return;
  const s0=!G.sim&&u.uid?gsig(G):null;
  if(e.Targeting=='Choice'&&e.ChoiceLabels&&e.ChoiceLabels.length==e.Actions.length)act(G,e.Actions[ctx.ch||0],u,ctx);
  else e.Actions.forEach(a=>act(G,a,u,ctx));
  if(s0!==null&&gsig(G)!==s0)EV(G,{k:'trig',u:u.uid})})}
// cheap fingerprint of everything an effect can visibly change (used so cards only shake when they actually did something)
function gsig(G){return G.p.map(p=>[p.hp,p.hand.length,p.deck.length,p.disc.length,p.hand.reduce((a,c)=>a+(c.red||0)+(c.ba||0),0),
 p.ln.map(w=>w?w.uid+':'+w.atk+'/'+w.hp+':'+[...w.kw].join(','):'-').join('|')].join(';')).join('#')}
function fireHand(G,trig,p,ctx){p.hand.slice().forEach(c=>{if(c.used||(c.nf&&ctx.u&&c.nf===ctx.u.uid))return;(CD[c.id].Effects||[]).forEach(e=>{
 if(e.Trigger!=trig||e.Zone!='Hand'||!cond(e.Condition,{o:p.i},ctx,G))return;
 e.Actions.forEach(a=>{if(a.Type=='BuffStats'){if(a.Amount!=null)c.red=(c.red||0)-a.Amount;else c.ba=(c.ba||0)+(a.BuffAtk||0);EV(G,{k:'hand',c:c.uid})}
  else if(a.Type=='SummonUnit'&&ctx.lane!=null&&!p.ln[ctx.lane]&&!G.over){c.used=1;p.hand=p.hand.filter(x=>x!==c);
   const u=mk(c.id,p.i);u.atk+=c.ba||0;if(c.unk)u.kw.add('Unkillable');place(G,p,u,ctx.lane);L(G,CD[c.id].Name+' rises');fire(G,'OnPlayed',u,{});}})})})}
function aura(G){G.p.forEach(p=>{units(p).forEach(u=>{const src=p.ln.find(w=>w&&w.id==14&&!w.sil&&w!==u);
 if(src&&!u.sgd&&!u.sil&&!u.kw.has('SoulGuard')){u.kw.add('SoulGuard');u.sga=1;EV(G,{k:'trig',u:src.uid})}
 if(!src&&u.sga){u.kw.delete('SoulGuard');u.sga=0}})})}
const units=(p)=>p.ln.filter(Boolean);
function tg(G,a,s,c){const me=G.p[s.o],op=G.p[1-s.o];
 switch(a.Target){
 case'Self':return[s];case'FriendlyHero':return[H(s.o)];case'EnemyHero':return[H(1-s.o)];
 case'AllEnemyUnits':return units(op);case'AllUnitsOnBoard':return[...units(me),...units(op)];
 case'AllOtherUnitsOnBoard':return[...units(me),...units(op)].filter(u=>u!==s);
 case'OtherFriendlyUnits':return units(me).filter(u=>u!=s);
 case'OppositeEnemyUnit':{const u=op.ln[s.lane];return u?[u]:[]}
 case'TargetEnemyUnit':case'SelectedTarget':case'TargetFriendlyUnit':
  if(c.t)return[c.t];
  if(a.Target=='TargetEnemyUnit'){const u=op.ln[s.lane]||units(op)[R(units(op).length)];return u?[u]:[]}
  return[]}
 return[]}
const later=(G,f)=>G.q?G.q.push(f):f();
function dmg(G,t,n,s,melee){
 if(t.h){G.p[t.p].hp-=n;EV(G,G.bk?{k:'dmg',h:t.p,n,bk:1,bo:s.o,bl:s.lane}:{k:'dmg',h:t.p,n});L(G,(t.p?'Enemy':'You')+' hero takes '+n);
  if(s&&s.uid&&!s.sp&&melee!==2&&n>0)later(G,()=>G.p[s.o].ln.slice().forEach(w=>w&&fire(G,'OnDamagedEnemyHero',w,{u:s,t:s})));chk(G);return}
 const ar=t.kw.has('Armored')?kwp(t,'Armored'):t.kw.has('Armor2')?2:0;
 if(n>0&&ar)n=Math.max(0,n-ar);
 if(n>0&&t.kw.has('Marked'))n*=2;
 t.hp-=n;EV(G,{k:'dmg',u:t.uid,n});
 if(s&&s.uid&&!s.sp&&n>0){if(s.kw.has('BurnSource')&&!s.sil)t.kw.add('Burning');if(melee===1)later(G,()=>fire(G,'OnDamagedEnemyUnit',s,{u:s,t}))}
 if(t.hp<=0&&s&&s.uid&&!s.sp&&!t.k&&melee===1&&!t.kw.has('Unkillable')&&!t.kw.has('SoulGuard')){t.k=1;later(G,()=>fire(G,'OnKill',s,{u:s,t}))}}
// Breakthrough: the excess hit on the enemy hero is tagged so the UI can make it stand out
function thru(G,x,n){G.bk=1;try{dmg(G,H(1-x.o),n,x,1)}finally{G.bk=0}}
function status(G,t,k,s){if(t.h)return;t.kw.add(k);EV(G,{k:'trig',u:t.uid});if(!G.sim)EV(G,{k:'fx',t:'st',s:k,u:t.uid});EV(G,{k:'snd',n:k=='Marked'?'mark':k=='Stunned'?'stun':k=='Burning'?'burn':'buff'});
 G.p.forEach(p=>p.ln.slice().forEach(u=>u&&u!==t&&fire(G,'OnStatusApplied',u,{t,u:t,st:k})))}
function act(G,a,s,c){
 if((a.OnlyIfSacrificed&&!c.sacd)||(a.OnlyIfNoSacrifice&&c.sacd))return;
 const T=a.Type,me=G.p[s.o],ts=tg(G,a,s,c);
 const unitsOnly=ts.filter(x=>!x.h);
 const area=['AllEnemyUnits','AllUnitsOnBoard','AllOtherUnitsOnBoard','OtherFriendlyUnits'].includes(a.Target);
 if(!G.sim&&unitsOnly.length&&area&&['DealDamage','DestroyUnit','Heal','HealToFull','BuffStats','Silence'].includes(T))
  EV(G,{k:'aoe',T,st:'',pos:T=='BuffStats'?((a.BuffAtk||0)<0||(a.BuffHp||0)<0?0:1):1,o:s.o,us:unitsOnly.map(x=>({u:x.uid,o:x.o,l:x.lane}))});
 if(!G.sim&&!area)ts.forEach(t=>{const b=t.h?{h:t.p}:{u:t.uid};
  if(T=='Heal')EV(G,Object.assign({k:'fx',t:'heal',n:a.Amount},b));
  else if(!t.h&&T=='HealToFull')EV(G,Object.assign({k:'fx',t:'heal',n:0},b));
  else if(!t.h&&T=='BuffStats'&&a.Amount==null)EV(G,Object.assign({k:'fx',t:'buff',a:a.BuffAtk||0,hp:a.BuffHp||0},b));
  else if(!t.h&&T=='Silence')EV(G,Object.assign({k:'fx',t:'sil'},b))});
 switch(T){
 case'DealDamage':{let n=a.Amount;if(a.AmountFrom=='SacrificedAttack'){n=Math.min(a.Max||99,Math.max(a.Min||0,c.last?c.last.atk:0))} // damage = ATK of the unit just sacrificed, clamped
  ts.forEach(t=>dmg(G,t,n,s,2));break}
 case'Heal':if(ts.length)EV(G,{k:'snd',n:'heal'});ts.forEach(t=>{if(t.h)G.p[t.p].hp=Math.min(20,G.p[t.p].hp+a.Amount);else t.hp=Math.min(t.mx,t.hp+a.Amount)});break;
 case'HealToFull':if(unitsOnly.length)EV(G,{k:'snd',n:'heal'});unitsOnly.forEach(t=>t.hp=t.mx);break;
 case'DrawCard':if((a.OnlyIfNoSacrifice&&c.sacd)||(a.OnlyIfSacrificed&&!c.sacd))break;ts.forEach(t=>{for(let i=0;i<(a.Amount||1);i++)draw(G,G.p[t.p!=null?t.p:s.o])});if(!ts.length)draw(G,me);break;
 case'BuffStats':if(a.Amount!=null)break;if(unitsOnly.length)EV(G,{k:'snd',n:(a.BuffAtk||0)<0||(a.BuffHp||0)<0?'debuff':'buff'});unitsOnly.forEach(t=>{t.atk+=a.BuffAtk||0;t.hp+=a.BuffHp||0;t.mx+=a.BuffHp||0;if(t.atk<0)t.atk=0});break;
 case'ApplyStatus':unitsOnly.forEach(t=>status(G,t,a.StatusKeyword,s));break;
 case'DestroyUnit':unitsOnly.forEach(t=>{t.hp=0});break;
 case'Silence':if(unitsOnly.length)EV(G,{k:'snd',n:'silence'});unitsOnly.forEach(t=>{t.sil=1;t.sga=0;t.kw=new Set();t.atk=t.d.Attack||0;t.mx=t.d.Health||0;t.hp=Math.min(t.hp,t.mx||1)});break;
 case'SacrificeUnit':{const cand=units(me).filter(u=>u!=s);const v=c.sac||(a.Target=='SelectedTarget'&&c.t&&!c.t.h&&c.t)||cand.sort((x,y)=>(x.atk+x.hp+CD[x.id].Cost)-(y.atk+y.hp+CD[y.id].Cost))[0];
  if(v&&!v.gone){c.last=v;c.sacd=1;sacrifice(G,v)}break}
 case'AbsorbStats':{const v=c.sac||c.last;if(v){s.atk+=v.atk;s.hp+=v.hp;s.mx+=v.hp}break}
 case'GiveToOpponent':s.give=1;break;
 case'MakeAUnit':case'SummonUnit':{if(T=='SummonUnit')break;
  let ls=[0,1,2,3].filter(i=>!me.ln[i]);
  if(a.StringParam=='AdjacentLanes')ls=ls.filter(i=>Math.abs(i-s.lane)==1);else{const pref=ls.filter(i=>!G.p[1-s.o].ln[i]);if(pref.length)ls=pref;ls=ls.slice(0,1)}
  ls.forEach(i=>place(G,me,mk(a.ValueParam,s.o),i));break}
 case'AddCardToHand':if(me.hand.length<8)me.hand.push({uid:UID++,id:a.ValueParam,tok:1});break;
 case'ReturnToHand':unitsOnly.filter(t=>!t.gone&&(!a.IfAlive||t.hp>0)).forEach(t=>{const o=G.p[t.o];if(o.ln[t.lane]!==t)return;EV(G,{k:'bnc',id:t.id,atk:t.atk,hp:Math.max(t.hp,0),o:t.o,lane:t.lane});L(G,t.d.Name+' returned to hand');o.ln[t.lane]=null;if(o.hand.length<8&&t.id<900)o.hand.push({uid:UID++,id:t.id,unk:t.kw.has('Unkillable')?1:0});t.gone=1});break
 case'SacrificeUnits':{ // Angel: sacrifice any number of the picked friendly units, +1/+1 for each
  const list=(c.sacs||[]).filter(u=>u&&!u.gone&&u!==s&&u.o==s.o&&me.ln[u.lane]===u);let n=0;
  list.forEach(v=>{if(v.gone)return;c.last=v;c.sacd=1;sacrifice(G,v);n++});
  if(n&&!s.gone){s.atk+=n;s.hp+=n;s.mx+=n;if(!G.sim){EV(G,{k:'snd',n:'buff'});EV(G,{k:'fx',t:'buff',a:n,hp:n,u:s.uid})}}break}
 case'LoseHealth':ts.forEach(t=>{if(t.h)dmg(G,t,a.Amount||1,null,2);else{t.hp-=a.Amount||1;EV(G,{k:'dmg',u:t.uid,n:a.Amount||1})}});break;
 case'ModifyGlobalBuff':EV(G,{k:'snd',n:'buff'});if(!G.sim&&units(me).length)EV(G,{k:'aoe',T:'BuffStats',st:'',pos:1,o:me.i,us:units(me).map(x=>({u:x.uid,o:x.o,l:x.lane}))});me.gb.a+=a.BuffAtk||0;me.gb.h+=a.BuffHp||0;units(me).forEach(u=>{u.atk+=a.BuffAtk||0;u.hp+=a.BuffHp||0;u.mx+=a.BuffHp||0});break;
 case'BonusAttack':unitsOnly.forEach(t=>strike(G,t));break;
 case'TutorCard':{let i=c.tut?me.deck.findIndex(x=>x.uid==c.tut.uid):-1;if(i<0)i=me.deck.reduce((b,c2,k)=>CD[c2.id].Cost>CD[me.deck[b].id].Cost?k:b,0);if(me.deck.length&&me.hand.length<8)me.hand.push(me.deck.splice(i,1)[0]);shuf(me.deck);break}
 case'ShuffleDeck':shuf(me.deck);break;
 case'DrawFromDiscard':for(let i=0;i<(a.Amount||1)&&me.disc.length&&me.hand.length<8;i++)me.hand.push(me.disc.pop());break;
 case'MoveRight':{const i=s.lane+1;if(i<4&&!me.ln[i]&&me.ln[s.lane]==s){me.ln[s.lane]=null;place(G,me,s,i)}break}
 case'AddResource':me.b=Math.min(me.b+(a.Amount||1),10);break
 case'Transform':{ // card becomes another card (new stats/effects, same lane). With Partner: only if that card is on the same side - both transform together
  if(a.Partner!=null){const pt=units(me).find(u=>u!==s&&u.id==a.Partner&&u.hp>0&&!u.gone);if(!pt||s.hp<=0||s.gone)break;
   const n1=CD[s.id].Name,n2=CD[pt.id].Name;transformUnit(G,s,a.Into);transformUnit(G,pt,a.PartnerInto);L(G,n1+' and '+n2+' found each other')}
  else unitsOnly.forEach(t=>transformUnit(G,t,a.Into));break}}
 resolve(G)}
// a unit turns into another card in place: fresh stats/keywords from the new card, no death / "when played" effects
function transformUnit(G,u,id){const d=CD[id],p=G.p[u.o],from=u.id,oa=u.atk,oh=u.hp;
 u.id=id;u.d=d;u.atk=(d.Attack||0)+p.gb.a;u.hp=u.mx=(d.Health||0)+p.gb.h;u.kw=new Set(d.Keywords||[]);u.sil=0;u.sga=0;u.sgd=0;u.red=0;
 EV(G,{k:'tf',u:u.uid,o:u.o,l:u.lane,from,to:id,atk:oa,hp:oh})}
function place(G,p,u,i){EV(G,{k:'in',u:u.uid});u.lane=i;u.o=p.i;u.gone=0;p.ln[i]=u;if(!u.placed){u.placed=1;u.atk+=p.gb.a;u.hp+=p.gb.h;u.mx+=p.gb.h}}
// A unit leaves the board by being destroyed. Its death abilities always fire. Normally it goes to the discard pile;
// an Unkillable unit is returned to its owner's hand instead, AFTER its death abilities have resolved
// (discard if the hand is full; tokens just vanish).
function killUnit(G,u,lane){const p=G.p[u.o],unk=u.kw.has('Unkillable')&&!u.sil;
 EV(G,{k:'die',id:u.id,atk:u.atk,hp:Math.max(u.hp,0),o:p.i,lane,uid:u.uid,bt:G.bt?1:0});
 p.ln[lane]=null;u.gone=1;
 if(!unk&&u.id<900)p.disc.push({uid:UID++,id:u.id,unk:u.kw.has('Unkillable')?1:0});
 fire(G,'OnDeath',u,{u});units(p).forEach(o=>fire(G,'OnFriendlyUnitDied',o,{u}));fireHand(G,'OnFriendlyUnitDied',p,{u,lane});
 if(unk){L(G,u.d.Name+' is Unkillable - back to hand');
  if(u.id<900){const card={uid:UID++,id:u.id,nf:u.uid,unk:1};if(p.hand.length<8)p.hand.push(card);else p.disc.push(card)}}}
function sacrifice(G,u){const p=G.p[u.o];p.sc++;L(G,u.d.Name+' sacrificed');
 fire(G,'OnSacrificed',u,{});
 // a sacrificed unit counts as destroyed too (unless it left the board another way, e.g. Black Cat returning to hand)
 if(!u.gone)killUnit(G,u,u.lane);
 units(p).forEach(o=>{if(!o.gone)fire(G,'OnOtherUnitSacrificed',o,{u})});fireHand(G,'OnOtherUnitSacrificed',p,{u})}
function resolve(G){aura(G);
 for(let n=0;n<30&&!G.over;n++){let ch=0;
  for(const p of G.p)for(let i=0;i<4;i++){const u=p.ln[i];if(!u||u.hp>0)continue;ch=1;
   if(u.kw.has('SoulGuard')){u.kw.delete('SoulGuard');u.sgd=1;u.hp=1;L(G,u.d.Name+' soul guard breaks');continue}
   killUnit(G,u,i);if(!u.kw.has('Unkillable'))L(G,u.d.Name+' destroyed')}
  if(!ch)break}
 chk(G)}
function splash(G,x,i,n){[i-1,i+1].forEach(k=>{const w=G.p[1-x.o].ln[k];if(w)dmg(G,w,n,x,1)})}
function strike(G,u){if(!u||u.gone||G.over)return;
 if(u.kw.has('Stunned')){u.kw.delete('Stunned');return}
 const v=G.p[1-u.o].ln[u.lane];
 EV(G,{k:'atk',u:u.uid,o:u.o,l:u.lane,bonus:1,post:G.pc?1:0,hr:(v&&!!u.kw.has('Flying')===!!v.kw.has('Flying'))?0:1});
 if(v&&!!u.kw.has('Flying')===!!v.kw.has('Flying')){dmg(G,v,u.atk,u,1);if(u.kw.has('Breakthrough')&&!G.over)thru(G,u,u.atk)}else dmg(G,H(1-u.o),u.atk,u,1);
 if(u.kw.has('SplashDamage'))splash(G,u,u.lane,kwp(u,'SplashDamage'))}
function preTargets(G,u){if(!u||u.sil)return null;
 const e=(u.d.Effects||[]).find(x=>x.Trigger=='OnPreCombatLine'&&x.Actions.some(a=>a.Target=='TargetEnemyUnit'));
 const t=units(G.p[1-u.o]);return e&&t.length?t:null}
function lane(G,i,pre){pre=pre||{};
 [0,1].forEach(o=>{const u=G.p[o].ln[i];if(!u)return;let t=pre[o];if(!t&&preTargets(G,u))t=botPick(G,G.p[o],'e');fire(G,'OnPreCombatLine',u,{t})});resolve(G);
 const A=G.p[0].ln[i],B=G.p[1].ln[i];if(!A&&!B)return;
 const sa=A&&A.kw.has('Stunned'),sb=B&&B.kw.has('Stunned'),aa=A?A.atk:0,ba=B?B.atk:0;
 if(sa)A.kw.delete('Stunned');if(sb)B.kw.delete('Stunned');
 const hit=(x,y,n,st)=>{if(!x||st||n<=0)return;EV(G,{k:'atk',u:x.uid,o:x.o,l:i,hr:(y&&!!x.kw.has('Flying')===!!y.kw.has('Flying'))?0:1});
  if(y&&!!x.kw.has('Flying')===!!y.kw.has('Flying')){dmg(G,y,n,x,1);if(x.kw.has('Breakthrough')&&!G.over)thru(G,x,n)}else dmg(G,H(1-x.o),n,x,1);
  if(x.kw.has('SplashDamage'))splash(G,x,i,kwp(x,'SplashDamage'))};
 G.q=[];hit(A,B,aa,sa);hit(B,A,ba,sb);const q=G.q;G.q=null;q.forEach(f=>f());resolve(G);
 // "After Combat" abilities of the units that are still in this lane (e.g. Evo Neighbour's bonus attack)
 G.pc=1;[0,1].forEach(o=>{const u=G.p[o].ln[i];if(u&&!u.gone&&!G.over)fire(G,'OnPostCombatLine',u,{})});G.pc=0;resolve(G)}
function endRound(G){if(G.p.some(p=>units(p).some(u=>u.kw.has('Burning'))))EV(G,{k:'snd',n:'burn'});G.p.forEach(p=>units(p).forEach(u=>{if(u.kw.has('Burning')){const ar=u.kw.has('Armored')?kwp(u,'Armored'):u.kw.has('Armor2')?2:0,n=Math.max(0,1-ar);u.hp-=n;EV(G,{k:'dmg',u:u.uid,n,bt:1})}}));G.bt=1;resolve(G);G.bt=0}
// ---- play ----
function picks(d,noSac){const out=[];let hasT=0,hasE=0,hasF=0;
 for(const e of d.Effects||[]){if(e.Trigger!='OnPlayed')continue;
  if(e.Targeting=='Choice'&&e.ChoiceLabels&&e.ChoiceLabels.length==e.Actions.length){out.push('C');continue}
  for(const a of e.Actions){const T=a.Type,tt=a.Target;if(T=='AbsorbStats'||(noSac&&a.OnlyIfSacrificed))continue;
   if(T=='TutorCard'){out.push('D');continue}
   if(T=='SacrificeUnits'){out.push('M');continue}
   if(T=='SacrificeUnit'&&tt!='Self'){if(tt=='SelectedTarget'&&hasT)continue;out.push('S');continue}
   if(!['TargetEnemyUnit','SelectedTarget','TargetFriendlyUnit'].includes(tt))continue;
   const k=T=='DealDamage'?(tt=='SelectedTarget'?'eh':'e'):(T=='DestroyUnit'||T=='Silence'||(T=='ApplyStatus'&&['Marked','Burning','Stunned'].includes(a.StatusKeyword)))?'e':T=='ReturnToHand'?'a':'f';
   if(tt=='SelectedTarget'){if(hasT)continue;hasT=1}
   else if(k=='e'){if(hasE)continue;hasE=1}else if(k=='f'){if(hasF)continue;hasF=1}
   out.push(k)}}
 return out}
function req(G,p,k){const me=units(p),op=units(G.p[1-p.i]);
 return k=='e'?op:(k=='f'||k=='S'||k=='M')?me:k=='a'?[...me,...op]:k=='eh'?[...op,H(1-p.i)]:k=='D'?p.deck:k=='C'?[0,1]:[]}
const actKind=a=>{const tt=a.Target,T=a.Type;if(!['TargetEnemyUnit','SelectedTarget','TargetFriendlyUnit'].includes(tt))return null;
 return T=='DealDamage'?(tt=='SelectedTarget'?'eh':'e'):(T=='DestroyUnit'||T=='Silence'||(T=='ApplyStatus'&&['Marked','Burning','Stunned'].includes(a.StatusKeyword)))?'e':T=='ReturnToHand'?'a':'f'};
function apicks(G,p,d,got){got=got||[];const out=[];
 // damage that only happens "if you sacrificed" needs no target when there is nothing to sacrifice
 const noSac=picks(d).includes('S')&&!req(G,p,'S').length;
 for(const k of picks(d,noSac)){if(!req(G,p,k).length)continue;out.push(k);
  if(k=='C'){const v=got[out.length-1];const e=(d.Effects||[]).find(x=>x.ChoiceLabels);
   if(v!=null&&e){const kk=actKind(e.Actions[v]);if(kk&&req(G,p,kk).length)out.push(kk)}}}
 return out}
function choiceOK(G,p,d,i){const e=(d.Effects||[]).find(x=>x.ChoiceLabels);if(!e)return true;const a=e.Actions[i];
 if(a.Type=='DrawFromDiscard')return p.disc.length>0;const k=actKind(a);return!k||req(G,p,k).length>0}
function canPlay(G,p,ci,ln){const c=p.hand[ci];if(!c||G.over)return false;if(G.act!=null&&p.i!=G.act)return false;
 const d=CD[c.id];if((G.allow=='U'&&d.Type!='Unit')||(G.allow=='A'&&d.Type!='Spell'))return false;
 if(cost(G,p,c)>p.b)return false;
 if(d.Type=='Unit'&&(ln==null||p.ln[ln]))return false;
 if(d.Type=='Spell'&&picks(d).some(k=>!req(G,p,k).length))return false;return true}
const playable=(G,p,i)=>{const c=p.hand[i];return c&&CD[c.id].Type=='Unit'?[0,1,2,3].some(l=>canPlay(G,p,i,l)):canPlay(G,p,i,null)};
function play(G,p,ci,ln,pk){if(!canPlay(G,p,ci,ln))return false;
 const c=p.hand[ci],d=CD[c.id],ctx={},ks=apicks(G,p,d,pk);
 ks.forEach((k,i)=>{const v=(pk||[])[i];if(v==null)return;if(k=='S')ctx.sac=v;else if(k=='M')ctx.sacs=v;else if(k=='D')ctx.tut=v;else if(k=='C')ctx.ch=v;else if(!ctx.t)ctx.t=v;else ctx.t2=v});
 p.b-=cost(G,p,c);p.hand.splice(ci,1);
 G.hist.push({p:p.i,t:G.turn,id:c.id,tg:ctx.t?(ctx.t.h?'Hero':ctx.t.d.Name):ctx.sac?ctx.sac.d.Name:''});
 if(d.Type=='Unit'){const u=mk(c.id,p.i);u.atk+=c.ba||0;if(c.unk)u.kw.add('Unkillable');place(G,p,u,ln);L(G,(p.i?'Enemy':'You')+' play '+d.Name);
  fire(G,'OnPlayed',u,ctx);p.ln.slice().forEach(w=>w&&w!==u&&fire(G,'OnPlayed',w,{u,lis:1}));resolve(G)}
 else{L(G,(p.i?'Enemy':'You')+' cast '+d.Name);const s={d,o:p.i,sp:1,lane:-1,uid:0};
  if(!G.sim){if(d.Cost-(c.red||0)>0)p.ln.forEach(w=>{if(w&&w.id==46&&!w.sil)EV(G,{k:'trig',u:w.uid})}); // Tea Maid: only the caster's own
   G.p[1-p.i].ln.forEach(w=>{if(w&&w.id==60&&!w.sil)EV(G,{k:'trig',u:w.uid})})} // Wyvern: only the opponent's, who is taxing this spell
  fire(G,'OnPlayed',s,ctx);resolve(G);
  if(s.give&&G.p[1-p.i].hand.length<8)G.p[1-p.i].hand.push({uid:UID++,id:c.id});else p.disc.push({uid:UID++,id:c.id});
  p.ln.forEach(w=>w&&fire(G,'OnFriendlyActionPlayed',w,{}));fireHand(G,'OnFriendlyActionPlayed',p,{})}
 return true}
// ---- bot ----
function botPick(G,p,k){const val=u=>u.atk*2+u.hp,ts=req(G,p,k);
 if(k=='M')return[];
 if(k=='C')return(p.deck.length<2&&p.disc.length>=2)?1:0;
 if(k=='D')return ts.slice().sort((a,b)=>CD[b.id].Cost-CD[a.id].Cost)[0];
 if(k=='S')return ts.slice().sort((a,b)=>val(a)-val(b))[0];
 if(k=='f')return ts.slice().sort((a,b)=>val(b)-val(a))[0];
 const un=ts.filter(x=>!x.h&&x.o!=p.i).sort((a,b)=>val(b)-val(a));
 return un[0]||ts.find(x=>x.h)||ts[0]}
function botPlanBasic(G,p){const op=G.p[1-p.i];
 const order=p.hand.map((c,i)=>({c,i,k:cost(G,p,c)})).sort((a,b)=>b.k-a.k);
 for(const {c,i} of order){const d=CD[c.id];if(!playable(G,p,i))continue;
  const pick=ln=>{const pk=[];for(let n=0;n<4;n++){const ks=apicks(G,p,d,pk);if(ks.length<=pk.length)break;pk.push(botPick(G,p,ks[pk.length]))}return pk};
  if(d.Type=='Spell'){if([900,902,18,39].includes(c.id)&&units(p).length<2)continue;
   if([53,57,16,58].includes(c.id)&&units(op).length<2)continue;
   return{ci:i,ln:null,pk:pick(),sp:1,id:c.id}}
  const free=[0,1,2,3].filter(x=>!p.ln[x]);
  const sc=x=>{const e=op.ln[x];return(e?(d.Attack||0)>=e.hp?3:0:(d.Attack||0)>0?4:0)+R(100)/100};
  return{ci:i,ln:free.sort((a,b)=>sc(b)-sc(a))[0],pk:pick(),id:c.id}}
 return null}
function botStep(G,p){const m=botPlan(G,p);return m?play(G,p,m.ci,m.ln,m.pk):false}
let BOTMODE='smart';
