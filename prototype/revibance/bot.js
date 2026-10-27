// RE:Joltance - smarter bot.
// Idea: for every legal play (card, lane, targets) clone the game, play it, project this round's combat on the clone and
// score the resulting position. A small beam search chains several plays (e.g. Polar Bear + sacrifice, Goblet combos).
// The bot never reads the opponent's hand or deck - only the board and the hand SIZE, like a human would see.

// ---------- cloning ----------
function cloneUnit(u){return u&&Object.assign({},u,{kw:new Set(u.kw)})}
function cloneG(G){
 const cp=p=>Object.assign({},p,{hand:p.hand.map(c=>Object.assign({},c)),deck:p.deck.map(c=>Object.assign({},c)),disc:p.disc.map(c=>Object.assign({},c)),
  ln:p.ln.map(cloneUnit),gb:Object.assign({},p.gb)});
 return Object.assign({},G,{sim:1,p:G.p.map(cp),log:[],hist:[],ev:[],q:null,over:G.over?Object.assign({},G.over):null})}
// the bot must not "know" the order of any deck: shuffle the clone's decks
function blindClone(G){const c=cloneG(G);c.p.forEach(p=>shuf(p.deck));return c}

// ---------- evaluation ----------
function unitVal(u){
 let v=1.2*u.atk+0.9*Math.max(u.hp,0)+1;
 const k=u.kw;
 if(k.has('Flying')&&u.atk>0)v+=1.5;
 if(k.has('Armored')||k.has('Armor2'))v+=0.8*(k.has('Armor2')?2:kwp(u,'Armored'));
 if(k.has('Unkillable'))v+=3;
 if(k.has('SoulGuard'))v+=1.5;
 if(k.has('SplashDamage'))v+=0.7*kwp(u,'SplashDamage');
 if(k.has('BurnSource'))v+=1;
 if(k.has('Breakthrough'))v+=0.5*u.atk;
 if(k.has('Burning'))v-=1.5;
 if(k.has('Marked'))v-=2;
 if(k.has('Stunned'))v-=1.5;
 if(!u.sil&&u.d.Effects&&u.d.Effects.length)v+=1.5;
 return v}
const heroVal=h=>h+Math.max(0,8-h)*0.7;
const handVal=c=>{const d=CD[c.id];return(d.Type=='Spell'?3+0.45*d.Cost:2+0.45*d.Cost)+(c.unk?3:0)};
function evalG(G,me){
 if(G.over)return G.over.win==me?10000:-10000;
 const a=G.p[me],b=G.p[1-me];let s=1.1*(heroVal(a.hp)-heroVal(b.hp));
 for(let i=0;i<4;i++){const x=a.ln[i],y=b.ln[i];
  if(x){s+=unitVal(x);if(!y)s+=0.5*x.atk}
  if(y){s-=unitVal(y);if(!x)s-=0.5*y.atk}}
 a.hand.forEach(c=>s+=handVal(c));s-=2.6*b.hand.length;
 return s}
// what would the position look like after this round's combat if nobody played anything else?
function project(G,me){const c=blindClone(G);
 for(let i=0;i<4&&!c.over;i++)lane(c,i,{});
 if(!c.over)endRound(c);
 return evalG(c,me)}

// ---------- move generation ----------
function pickOptions(G,p,d,k){
 if(k=='M'){const us=req(G,p,'M').sort((a,b)=>unitVal(a)-unitVal(b)),o=[{m:[]}];for(let n=1;n<=us.length;n++)o.push({m:us.slice(0,n).map(u=>u.uid)});return o} // sacrifice nothing, or the weakest 1..n
 if(k=='C')return[0,1].filter(i=>choiceOK(G,p,d,i)).map(i=>({n:i}));
 if(k=='D'){const lim=Math.min(10,G.turn+2);return[{c:p.deck.slice().sort((x,y)=>{const f=z=>{const c=CD[z.id].Cost;return c>lim?-c:c};return f(y)-f(x)})[0].uid}]}
 return req(G,p,k).map(t=>t.h?{h:t.p}:{u:t.uid})}
function enumPicks(G,p,d,got,out){
 // got = picks made so far as descriptors; only choice picks ({n}) matter for working out which picks come next
 const ks=apicks(G,p,d,got.map(o=>o.n));
 if(got.length>=ks.length){out.push(got);return}
 if(out.length>=30)return;
 for(const o of pickOptions(G,p,d,ks[got.length]))enumPicks(G,p,d,got.concat([o]),out)}
function resolvePick(G,p,k,o){
 if(o.m)return o.m.map(id=>units(G.p[p.i]).find(u=>u.uid==id)).filter(Boolean);
 if(o.n!=null)return o.n;
 if(o.h!=null)return H(o.h);
 if(o.u!=null)return units(G.p[0]).concat(units(G.p[1])).find(u=>u.uid==o.u);
 if(o.c!=null)return p.deck.find(c=>c.uid==o.c)}
function legalMoves(G,p){const mv=[];
 p.hand.forEach((c,ci)=>{const d=CD[c.id];
  const lanes=d.Type=='Unit'?[0,1,2,3].filter(l=>canPlay(G,p,ci,l)):(canPlay(G,p,ci,null)?[null]:[]);
  if(!lanes.length)return;
  const out=[];enumPicks(G,p,d,[],out);
  lanes.forEach(ln=>out.forEach(pk=>mv.push({ci,ln,id:c.id,sp:d.Type=='Spell'?1:0,pd:pk})))});
 return mv}
// replay a move descriptor on any state that has the same objects (uids) in it
function applyMove(G,p,m){const pk=m.pd.map(o=>resolvePick(G,p,null,o));return play(G,p,m.ci,m.ln,pk)}
function sig(G,me){const a=G.p[me],b=G.p[1-me];
 return[a.hp,b.hp,a.b,a.hand.map(c=>c.id+':'+(c.red||0)).sort().join(),a.ln.map(u=>u?u.id+'/'+u.atk+'/'+u.hp+[...u.kw].join(''):'-').join('|'),b.ln.map(u=>u?u.id+'/'+u.atk+'/'+u.hp+[...u.kw].join(''):'-').join('|'),b.hand.length].join(';')}

// ---------- planner ----------
function botPlanSmart(G,p){
 const me=p.i,t0=Date.now(),BUDGET=140,BEAM=5,DEPTH=5;
 const stopScore=project(G,me);
 let best={score:stopScore+0.35,first:null};
 let beam=[{G,first:null}];
 for(let depth=0;depth<DEPTH&&beam.length;depth++){
  const next=[],seen=new Set();
  for(const node of beam){
   if(Date.now()-t0>BUDGET&&best.first)break;
   const np=node.G.p[me];
   for(const m of legalMoves(node.G,np)){
    const c=blindClone(node.G),cp=c.p[me];
    if(!applyMove(c,cp,m))continue;
    const sg=sig(c,me);if(seen.has(sg))continue;seen.add(sg);
    const sc=project(c,me),first=node.first||m;
    if(sc>best.score)best={score:sc,first};
    next.push({G:c,first,score:sc})}}
  next.sort((a,b)=>b.score-a.score);beam=next.slice(0,BEAM)}
 const m=best.first;
 if(!m)return null;
 // turn the descriptor back into real picks on the real game
 return{ci:m.ci,ln:m.ln,pk:m.pd.map(o=>resolvePick(G,p,null,o)),sp:m.sp,id:m.id}}

// ---------- mulligan ----------
function botMullSmart(G,p){
 const byCost=p.hand.slice().sort((a,b)=>CD[b.id].Cost-CD[a.id].Cost);let heavy=0;const out=[];
 byCost.forEach(c=>{const k=CD[c.id].Cost;if(k>=6)out.push(c.uid);else if(k>=4){if(++heavy>1)out.push(c.uid)}});
 // never keep a hand with nothing to do on round 1
 if(!p.hand.some(c=>CD[c.id].Cost<=2&&!out.includes(c.uid))&&p.hand.length)out.push(...p.hand.filter(c=>CD[c.id].Cost>=4&&!out.includes(c.uid)).map(c=>c.uid));
 mulligan(G,p,out)}

// ---------- entry points used by the UI ----------
function botPlan(G,p){return BOTMODE=='basic'?botPlanBasic(G,p):botPlanSmart(G,p)}
function botMull(G,p){return BOTMODE=='basic'?botMullBasic(G,p):botMullSmart(G,p)}
