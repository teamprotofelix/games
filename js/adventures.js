/* New arcade games. No dependencies, no network requests, and no global timers after destroy. */
'use strict';
const ARCADE_ASSETS = {
  forest: 'images/adventure/forest.webp', ocean:'images/adventure/ocean.webp',
  garden:'images/adventure/garden.webp', cosmos:'images/adventure/cosmos.webp', candy:'images/adventure/candy.webp',
  fox:'images/adventure/fox-run.webp', sub:'images/adventure/submarine.webp',
  pearl:'images/adventure/pearl.webp', jelly:'images/adventure/jelly.webp', flowers:'images/adventure/flowers.webp'
};
const AR = {
  clamp:(v,min,max)=>Math.max(min,Math.min(max,v)),
  rand:(a,b)=>a+Math.random()*(b-a),
  circle:(ctx,x,y,r,fill)=>{ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=fill;ctx.fill();},
  star(ctx,x,y,r=18,color='#ffe59b') {
    ctx.save();ctx.translate(x,y);ctx.shadowColor=color;ctx.shadowBlur=18;ctx.fillStyle=color;
    ctx.beginPath();for(let i=0;i<10;i++){const a=i*Math.PI/5-Math.PI/2,rr=i%2?r*.46:r;const xx=Math.cos(a)*rr,yy=Math.sin(a)*rr;i===0?ctx.moveTo(xx,yy):ctx.lineTo(xx,yy);}ctx.closePath();ctx.fill();ctx.restore();
  },
  rounded(ctx,x,y,w,h,r,color){ctx.beginPath();if(typeof ctx.roundRect==='function')ctx.roundRect(x,y,w,h,r);else ctx.rect(x,y,w,h);ctx.fillStyle=color;ctx.fill();}
};

class ArcadeBase {
  constructor(container,scoreDisplay){
    this.container=container;this.scoreDisplay=scoreDisplay;this.onGameOver=null;
    this.alive=true;this.playing=false;this.score=0;this.time=0;
    this.images={};this.particles=[];this.raf=0;this.last=0;this.abort=new AbortController();
    this.width=720;this.height=680;this.lastIdleDraw=0;this.lastHUDText='';
  }
  init(){
    let best=0;try{best=Number(localStorage.getItem('eon-games-record-'+this.constructor.name))||0;}catch(e){}
    this.container.innerHTML=`<section class="arcade-shell" aria-label="${this.label}">
      <div class="arcade-info"><span class="arcade-timer" id="arcadeTime">⏱ ${this.limit}초</span><span class="arcade-hearts" id="arcadeExtra">${this.extraText||''}</span></div>
      <div class="arcade-viewport"><canvas class="arcade-canvas" width="720" height="680" aria-label="${this.label} 게임 화면"></canvas>
        <div class="arcade-start" id="arcadeStart"><div class="arcade-start-panel"><div class="arcade-start-icon">${this.icon}</div><h2>${this.label}</h2><p>${this.help}</p>${best?`<p class="arcade-best">🏆 나의 최고 기록 ${best}점</p>`:''}<button type="button" class="arcade-play">▶ 게임 시작</button></div></div>
      </div><div class="arcade-controls" aria-label="게임 조작"></div>
      <p class="arcade-tip">${this.tip||'화면을 터치하거나 아래 버튼으로 조작하세요.'}</p>
      </section>`;
    this.canvas=this.container.querySelector('canvas');this.ctx=this.canvas.getContext('2d');
    this.controls=this.container.querySelector('.arcade-controls');
    this.container.querySelector('.arcade-play').addEventListener('click',()=>this.start(),{signal:this.abort.signal});
    this.canvas.addEventListener('pointerdown',e=>{if(this.playing)this.pointer(e);},{signal:this.abort.signal});
    this.canvas.addEventListener('pointermove',e=>{if(this.playing && e.buttons===1)this.pointerMove(e);},{signal:this.abort.signal});
    document.addEventListener('keydown',e=>{if(this.playing && this.keyboard(e.key)){e.preventDefault();}},{signal:this.abort.signal});
    // A hidden page does not continue its game countdown.
    document.addEventListener('visibilitychange',()=>{this.last=0;},{signal:this.abort.signal});
    for(const [key,url] of Object.entries(ARCADE_ASSETS)){
      const img=new Image();img.decoding='async';img.src=url;this.images[key]=img;
    }
    this.setControls();this.updateHUD();
    this.raf=requestAnimationFrame(t=>this.frame(t));
  }
  onStart(){}
  setControls(){}
  addButton(name,fn){const b=document.createElement('button');b.type='button';b.className='arcade-control-btn';b.textContent=name;b.addEventListener('pointerdown',e=>{e.preventDefault();if(this.playing)fn();},{signal:this.abort.signal});this.controls.appendChild(b);return b;}
  keyboard(){return false;}
  pointer(){}
  pointerMove(){}
  xy(e){const r=this.canvas.getBoundingClientRect();return {x:(e.clientX-r.left)*this.width/r.width,y:(e.clientY-r.top)*this.height/r.height};}
  start(){if(!this.alive||this.playing)return;this.playing=true;this.container.querySelector('#arcadeStart').hidden=true;this.time=this.limit;this.onStart();this.updateHUD();}
  frame(ts){if(!this.alive)return;
    const dt=this.last?Math.min((ts-this.last)/1000,0.045):0;this.last=ts;
    // Deliberately pause when backgrounded, including music/audio-free mini games.
    if(this.playing&&!document.hidden){this.time=Math.max(0,this.time-dt);this.update(dt);if(this.playing&&this.time<=0)this.finish('시간 종료! 최고 기록에 다시 도전해 보세요.');}
    this.particles=this.particles.filter(p=>p.life>0);
    for(const p of this.particles){p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;}
    if(this.playing || ts-this.lastIdleDraw>100){this.draw();this.lastIdleDraw=ts;}
    this.updateHUD();this.raf=requestAnimationFrame(t=>this.frame(t));
  }
  updateHUD(){const t=this.container.querySelector('#arcadeTime');if(t)t.textContent=`⏱ ${Math.ceil(this.time||this.limit)}초`;
    const extra=this.container.querySelector('#arcadeExtra');if(extra)extra.textContent=this.hud||this.extraText||'';
    const nextScore=`⭐ ${Math.round(this.score)}점`;if(this.scoreDisplay&&this.scoreDisplay.textContent!==nextScore)this.scoreDisplay.textContent=nextScore;
  }
  image(key,x,y,w,h,frame=-1,frameWidth=0){const img=this.images[key];if(!img||!img.complete||!img.naturalWidth)return false;
    if(frame>=0)this.ctx.drawImage(img,frame*frameWidth,0,frameWidth,img.naturalHeight,x,y,w,h);
    else this.ctx.drawImage(img,x,y,w,h);return true;}
  background(key){const c=this.ctx;c.clearRect(0,0,this.width,this.height);const img=this.images[key];if(img&&img.complete&&img.naturalWidth){const scale=Math.max(this.width/img.width,this.height/img.height);const dw=img.width*scale,dh=img.height*scale;c.drawImage(img,(this.width-dw)/2,(this.height-dh)/2,dw,dh);}else{c.fillStyle='#28315e';c.fillRect(0,0,this.width,this.height);}}
  burst(x,y,col='#fff1a7',count=12){for(let i=0;i<count;i++){const a=Math.random()*Math.PI*2,s=AR.rand(55,205);this.particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:AR.rand(.35,.8),color:col});}if(this.particles.length>120)this.particles.splice(0,this.particles.length-120);}
  drawParticles(){const c=this.ctx;for(const p of this.particles){c.globalAlpha=Math.min(1,p.life*1.7);AR.circle(c,p.x,p.y,AR.clamp(p.life*8,2,7),p.color);}c.globalAlpha=1;}
  finish(message){if(!this.playing||!this.alive)return;this.playing=false;
    try{const key='eon-games-record-'+this.constructor.name;const old=Number(localStorage.getItem(key))||0;if(this.score>old)localStorage.setItem(key,String(Math.round(this.score)));}catch(e){}
    if(this.onGameOver)this.onGameOver(Math.round(this.score),message);
  }
  destroy(){this.alive=false;this.playing=false;this.abort.abort();cancelAnimationFrame(this.raf);this.particles=[];}
}

class MoonRunner extends ArcadeBase {
  constructor(c,s){super(c,s);this.label='달빛 숲 점프';this.icon='🦊';this.limit=50;this.help='여우와 달빛 숲을 달려요!<br>가시덤불은 점프로 피하고 별은 모으세요.';this.tip='화면 터치 · 스페이스 · 점프 버튼';this.extraText='❤️❤️❤️';this.playerY=506;this.vy=0;this.ground=506;this.items=[];this.spawn=0;this.distance=0;this.lives=3;this.invincible=0;}
  onStart(){this.playerY=this.ground;this.vy=0;this.items=[];this.spawn=.75;this.lives=3;this.invincible=0;this.distance=0;this.score=0;}
  setControls(){this.addButton('⬆ 점프!',()=>this.jump());}
  keyboard(key){if([' ','ArrowUp','w','W'].includes(key)){this.jump();return true;}return false;}
  pointer(){this.jump();}
  jump(){if(this.playerY>=this.ground-.5){this.vy=-850;this.burst(165,510,'#a6fff2',9);}}
  update(dt){this.distance+=dt;const speed=AR.clamp(275+this.distance*5,275,480);
    this.vy+=1900*dt;this.playerY=Math.min(this.ground,this.playerY+this.vy*dt);if(this.playerY>=this.ground)this.vy=0;
    this.invincible=Math.max(0,this.invincible-dt);this.spawn-=dt;
    if(this.spawn<=0){this.items.push({x:780,y:this.ground-31,type:'thorn',done:false});if(Math.random()>.25)this.items.push({x:790+AR.rand(90,190),y:this.ground-150-AR.rand(0,85),type:'star',done:false});this.spawn=AR.rand(1.25,1.85)*Math.max(.74,1-this.distance/135);}
    for(const a of this.items){a.x-=speed*dt;if(!a.done && Math.abs(a.x-169)<51){if(a.type==='star'&&Math.abs(a.y-(this.playerY-65))<94){a.done=true;this.score+=15;this.burst(a.x,a.y);}if(a.type==='thorn'&&Math.abs(this.playerY-this.ground)<75&&this.invincible<=0){a.done=true;this.lives--;this.invincible=1.25;this.burst(160,this.playerY-44,'#ffb5bd',22);if(this.lives<=0){this.finish('숲속 모험 종료! 별을 더 모아보세요.');break;}}}}
    this.items=this.items.filter(a=>a.x>-70&&!a.done);this.hud='❤️'.repeat(this.lives)+'♡'.repeat(3-this.lives);this.score+=dt*1.3;
  }
  draw(){this.background('forest');const c=this.ctx;c.fillStyle='rgba(15,46,44,.56)';c.fillRect(0,510,720,170);c.fillStyle='rgba(166,251,216,.33)';c.fillRect(0,510,720,6);
    for(let i=0;i<14;i++){const x=((i*90-this.distance*190)%810+810)%810-50;AR.circle(c,x,572,3,'#86cfa6');}
    for(const a of this.items){if(a.type==='star')AR.star(c,a.x,a.y,24);else{c.save();c.translate(a.x,a.y);c.shadowColor='#ff668d';c.shadowBlur=14;c.fillStyle='#b4528e';c.beginPath();c.moveTo(-29,30);c.lineTo(-26,-10);c.lineTo(-9,9);c.lineTo(0,-28);c.lineTo(13,5);c.lineTo(30,-12);c.lineTo(34,30);c.closePath();c.fill();c.restore();}}
    c.save();if(this.invincible>0&&Math.floor(this.invincible*12)%2)c.globalAlpha=.4;
    const frame=Math.floor(this.distance*11)%4;
    if(!this.image('fox',96,this.playerY-147,146,147,frame,224))AR.circle(c,161,this.playerY-70,63,'#f89c68');c.restore();
    this.drawParticles();}
}

class PearlDiver extends ArcadeBase {
  constructor(c,s){super(c,s);this.label='반짝 진주 잠수함';this.icon='🐠';this.limit=45;this.help='잠수함을 좌우로 움직여 진주를 모으세요!<br>보라색 해파리는 피해요.';this.tip='잠수함을 드래그하거나 ◀ ▶ 버튼을 탭하세요.';this.lives=3;this.playerX=360;this.targetX=360;this.spawn=.3;this.items=[];this.direction=0;}
  onStart(){this.score=0;this.lives=3;this.playerX=360;this.targetX=360;this.spawn=.4;this.items=[];}
  setControls(){const left=this.addButton('◀ 왼쪽',()=>{this.targetX=AR.clamp(this.targetX-95,80,640);});const right=this.addButton('오른쪽 ▶',()=>{this.targetX=AR.clamp(this.targetX+95,80,640);});left.setAttribute('aria-label','왼쪽 이동');right.setAttribute('aria-label','오른쪽 이동');}
  keyboard(k){if(k==='ArrowLeft'||k==='a'){this.targetX=AR.clamp(this.targetX-105,80,640);return true;}if(k==='ArrowRight'||k==='d'){this.targetX=AR.clamp(this.targetX+105,80,640);return true;}return false;}
  pointer(e){this.targetX=AR.clamp(this.xy(e).x,70,650);}
  pointerMove(e){this.pointer(e);}
  update(dt){this.playerX+=(this.targetX-this.playerX)*Math.min(1,dt*10);this.spawn-=dt;
    if(this.spawn<=0){this.items.push({x:AR.rand(65,655),y:-65,type:Math.random()<.24?'jelly':'pearl',speed:AR.rand(175,270)+this.score*.1,hit:false});this.spawn=AR.rand(.36,.73);}
    for(const a of this.items){a.y+=a.speed*dt;const dx=a.x-this.playerX,dy=a.y-538;if(!a.hit&&Math.abs(dx)<77&&Math.abs(dy)<53){a.hit=true;if(a.type==='pearl'){this.score+=10;this.burst(a.x,a.y,'#e7ffff');}else{this.lives--;this.burst(a.x,a.y,'#efa9ff',19);if(this.lives===0){this.finish('해파리를 피해 다시 잠수해 보세요!');break;}}}}
    this.items=this.items.filter(a=>!a.hit&&a.y<710);this.hud='❤️'.repeat(this.lives)+'♡'.repeat(3-this.lives);
  }
  draw(){this.background('ocean');const c=this.ctx;
    for(const a of this.items){if(a.type==='pearl')this.image('pearl',a.x-36,a.y-37,72,76);else this.image('jelly',a.x-44,a.y-42,87,85);}
    if(!this.image('sub',this.playerX-99,467,198,145)){AR.circle(c,this.playerX,540,60,'#ffcb76');}
    this.drawParticles();}
}

class FlowerBeat extends ArcadeBase {
  constructor(c,s){super(c,s);this.label='꽃잎 비트 정원';this.icon='🌸';this.limit=48;this.help='꽃이 빛나는 선에 닿을 때<br>같은 색 버튼을 탭하세요! 콤보를 쌓아요.';this.tip='3개의 버튼 또는 키보드 A · S · D';this.notes=[];this.spawn=0;this.combo=0;this.maxCombo=0;this.feedback='';this.feedbackTime=0;this.lanes=[142,360,578];}
  onStart(){this.notes=[];this.spawn=.9;this.combo=0;this.score=0;this.maxCombo=0;this.feedbackTime=0;}
  setControls(){['🌸 핑크','🪻 보라','🩵 하늘'].forEach((name,i)=>this.addButton(name,()=>this.hit(i)));}
  keyboard(key){const idx={a:0,A:0,s:1,S:1,d:2,D:2,ArrowLeft:0,ArrowDown:1,ArrowRight:2}[key];if(idx!==undefined){this.hit(idx);return true;}return false;}
  pointer(e){const x=this.xy(e).x;this.hit(x<240?0:x<480?1:2);}
  hit(lane){if(!this.playing)return;
    const possible=this.notes.filter(n=>n.lane===lane&&!n.hit).sort((a,b)=>Math.abs(a.y-486)-Math.abs(b.y-486));const n=possible[0];if(n&&Math.abs(n.y-486)<87){n.hit=true;const diff=Math.abs(n.y-486);const perfect=diff<36;this.combo++;this.maxCombo=Math.max(this.maxCombo,this.combo);this.score+=(perfect?15:8)+Math.floor(this.combo/5)*2;this.feedback=perfect?'✨ PERFECT!':'💗 GOOD!';this.feedbackTime=.55;this.burst(this.lanes[lane],486,perfect?'#fff7ad':'#f4bcff',18);}else{this.combo=0;this.feedback='아쉬워요!';this.feedbackTime=.3;}}
  update(dt){this.spawn-=dt;this.feedbackTime=Math.max(0,this.feedbackTime-dt);
    if(this.spawn<=0){let lane=Math.floor(Math.random()*3);this.notes.push({lane,y:-90,hit:false});this.spawn=AR.rand(.48,.78)*Math.max(.78,1-this.score/2500);}
    for(const n of this.notes){n.y+=(230+Math.min(100,this.score/20))*dt;if(n.y>585&&!n.hit){n.hit=true;this.combo=0;}}
    this.notes=this.notes.filter(n=>n.y<650&&!n.hit);this.hud=`🔥 콤보 ${this.combo} · 최고 ${this.maxCombo}`;
  }
  draw(){this.background('garden');const c=this.ctx;
    c.fillStyle='rgba(38,31,83,.24)';c.fillRect(0,0,720,580);
    for(let i=0;i<3;i++){c.fillStyle=i%2?'rgba(255,255,255,.09)':'rgba(255,255,255,.04)';c.fillRect(i*240+13,0,214,570);c.strokeStyle='rgba(255,255,255,.22)';c.lineWidth=2;c.strokeRect(i*240+13,0,214,570);}
    c.fillStyle='rgba(255,255,255,.17)';c.fillRect(0,464,720,47);c.shadowColor='#fff5c6';c.shadowBlur=16;c.fillStyle='#ffe9c0';c.fillRect(0,480,720,6);c.shadowBlur=0;
    for(const n of this.notes){if(!this.image('flowers',this.lanes[n.lane]-61,n.y-69,122,124,n.lane,176))AR.star(c,this.lanes[n.lane],n.y,35);}
    if(this.feedbackTime>0){c.save();c.font='bold 44px sans-serif';c.textAlign='center';c.shadowColor='#533672';c.shadowBlur=14;c.fillStyle='white';c.fillText(this.feedback,360,245);c.restore();}
    this.drawParticles();}
  finish(msg){super.finish(msg||`최대 콤보 ${this.maxCombo}! 박자 감각이 훌륭해요.`);}
}

class StarPath extends ArcadeBase {
  constructor(c,s){super(c,s);this.label='반짝 별자리 연결';this.icon='🌌';this.limit=60;this.help='숫자 순서대로 별을 터치해<br>아름다운 별자리를 완성하세요!';this.tip='빛나는 별을 1번부터 차례로 눌러요.';this.level=0;this.next=0;this.points=[];this.completed=[];this.misses=0;this.transition=0;this.hintTime=0;}
  onStart(){this.score=0;this.level=1;this.misses=0;this.newLevel();}
  setControls(){this.addButton('✨ 별자리 힌트',()=>{if(!this.playing)return;this.score=Math.max(0,this.score-5);this.hintTime=1.5;});}
  keyboard(){return false;}
  newLevel(){this.next=0;this.completed=[];this.points=[];this.transition=0;let attempts=0;
    for(let i=0;i<Math.min(8,this.level+3);i++){
      let p;do{p={x:AR.rand(90,630),y:AR.rand(135,560),r:36};attempts++;}while(this.points.some(q=>Math.hypot(q.x-p.x,q.y-p.y)<96)&&attempts<800);this.points.push(p);
    }
  }
  pointer(e){const p=this.xy(e);const i=this.points.findIndex(n=>Math.hypot(n.x-p.x,n.y-p.y)<48);
    if(i<0)return;
    if(i===this.next){this.completed.push(i);this.next++;this.score+=15+this.level*2;this.burst(p.x,p.y,'#fff4ab');if(this.next>=this.points.length){this.score+=50;this.level++;this.transition=.85;this.burst(360,280,'#a8dbff',35);}}
    else{this.score=Math.max(0,this.score-8);this.misses++;this.burst(p.x,p.y,'#ff9ab9',6);if(this.misses>=5){this.finish('별자리 실수 5번! 다시 관찰해 보세요.');}}
  }
  update(dt){this.hintTime=Math.max(0,this.hintTime-dt);if(this.transition>0){this.transition-=dt;if(this.transition<=0&&this.next>=this.points.length){if(this.level>7){this.finish('모든 별자리를 완성했어요! 🌟');}else{this.newLevel();}}}
    this.hud=`🌟 ${this.level}단계 · 실수 ${this.misses}/5`;
  }
  draw(){this.background('cosmos');const c=this.ctx;
    c.save();c.strokeStyle='rgba(255,237,166,.86)';c.lineWidth=5;c.shadowColor='#b9e4ff';c.shadowBlur=18;c.beginPath();this.completed.forEach((idx,j)=>{const p=this.points[idx];j?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y);});c.stroke();c.restore();
    if(this.hintTime>0&&this.points[this.next]){const p=this.points[this.next];c.save();c.strokeStyle='#fff';c.lineWidth=7;c.setLineDash([12,8]);c.beginPath();c.arc(p.x,p.y,49,0,Math.PI*2);c.stroke();c.font='bold 30px sans-serif';c.textAlign='center';c.fillStyle='#fff';c.fillText('다음 별: '+(this.next+1),360,85);c.restore();}
    this.points.forEach((p,i)=>{c.save();c.shadowColor=i===this.next?'#fff3a4':'#7dc8ff';c.shadowBlur=i===this.next?35:19;AR.circle(c,p.x,p.y,30,i<this.next?'#fff4c6':i===this.next?'#fff0a1':'#9adaff');AR.circle(c,p.x,p.y,23,'rgba(41,51,117,.7)');AR.star(c,p.x,p.y,14,i<this.next?'#fff6c7':'#fff');c.restore();
      c.font='bold 25px sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillStyle='#ffffff';c.fillText(String(i+1),p.x,p.y+1);});
    if(this.transition>0&&this.next===this.points.length){c.save();c.font='bold 52px sans-serif';c.textAlign='center';c.fillStyle='#fff3cb';c.shadowColor='#ffd3fa';c.shadowBlur=23;c.fillText('별자리 완성! ✨',360,87);c.restore();}
    this.drawParticles();}
}

class CandyStack extends ArcadeBase {
  constructor(c,s){super(c,s);this.label='솜사탕 타워';this.icon='🍬';this.limit=60;this.help='움직이는 솜사탕 블록이<br>아래 블록과 겹칠 때 착! 내려놓으세요.';this.tip='화면 터치 · 스페이스 · 내려놓기 버튼';this.level=0;this.lives=3;this.stacks=[];this.moving=null;this.feedbackTime=0;this.feedback='';}
  onStart(){this.score=0;this.level=0;this.lives=3;this.stacks=[{x:220,w:280,level:-1}];this.newMoving();}
  setControls(){this.addButton('🍡 지금 내려놓기!',()=>this.drop());}
  keyboard(k){if(k===' '||k==='ArrowDown'||k==='Enter'){this.drop();return true;}return false;}
  pointer(){this.drop();}
  newMoving(){const last=this.stacks[this.stacks.length-1];this.moving={x:Math.random()<.5?5:715-last.w,w:last.w,v:Math.random()<.5?1:-1,speed:AR.clamp(175+this.level*28,175,400)};if(this.moving.x<20)this.moving.v=1;else this.moving.v=-1;}
  drop(){if(!this.playing||!this.moving)return;const base=this.stacks[this.stacks.length-1],m=this.moving;const diff=Math.abs(m.x-base.x);const perfect=diff<16;
    let left=perfect?Math.max(8,base.x-5):Math.max(base.x,m.x),right=perfect?Math.min(712,base.x+base.w+5):Math.min(base.x+base.w,m.x+m.w);
    if(right-left<26){this.lives--;this.feedback='앗, 미끄러졌어요!';this.feedbackTime=.8;this.burst(m.x+m.w/2,320,'#ffc7db',24);if(this.lives<=0){this.finish('다음에는 타이밍을 더 잘 맞춰봐요!');return;}this.newMoving();return;}
    this.stacks.push({x:left,w:right-left,level:this.level});this.level++;this.score+=perfect?70:Math.max(15,Math.round((right-left)/3));this.feedback=perfect?'✨ PERFECT!': '🍬 GOOD!';this.feedbackTime=.7;this.burst(left+(right-left)/2,380,'#ffedf5',22);
    if(this.level>=12){this.finish('환상적인 12층 솜사탕 타워 완성! 🎉');return;}this.newMoving();}
  update(dt){if(this.moving){this.moving.x+=this.moving.v*this.moving.speed*dt;if(this.moving.x<8){this.moving.x=8;this.moving.v=1;}if(this.moving.x+this.moving.w>712){this.moving.x=712-this.moving.w;this.moving.v=-1;}}
    this.feedbackTime=Math.max(0,this.feedbackTime-dt);this.hud=`🍰 ${this.level}/12층 · ${'❤️'.repeat(this.lives)}`;
  }
  cake(x,y,w,h,level,moving=false){const c=this.ctx;const palette=['#ffb9d7','#ccb2ff','#a9e8e8','#ffe1ae','#ffaebd','#b7edcc'];
    c.save();c.shadowColor='rgba(64,35,110,.35)';c.shadowBlur=15;c.shadowOffsetY=6;AR.rounded(c,x,y,w,h,13,palette[(level+6)%palette.length]);c.shadowBlur=0;c.shadowOffsetY=0;AR.rounded(c,x+4,y+3,Math.max(4,w-8),11,9,'rgba(255,255,255,.55)');
    c.fillStyle='rgba(255,255,255,.75)';for(let i=15;i<w-10;i+=23)c.fillRect(x+i,y+24,4,3);
    if(w>80){c.font='19px sans-serif';c.textAlign='center';c.fillText(moving?'✨':'♥',x+w/2,y+27);}c.restore();}
  draw(){this.background('candy');const c=this.ctx;c.fillStyle='rgba(62,38,94,.14)';c.fillRect(0,0,720,680);let rise=Math.max(0,(this.level-6)*39);const baseY=580;
    c.fillStyle='rgba(255,255,255,.23)';c.fillRect(80,598,560,13);
    for(let i=0;i<this.stacks.length;i++){const b=this.stacks[i],y=baseY-i*39+rise;this.cake(b.x,y,b.w,39,b.level);}
    if(this.moving){const y=baseY-this.stacks.length*39+rise;this.cake(this.moving.x,y,this.moving.w,39,this.level,true);}
    if(this.feedbackTime>0){c.save();c.textAlign='center';c.font='bold 43px sans-serif';c.shadowColor='#a65a93';c.shadowBlur=15;c.fillStyle='#fff';c.fillText(this.feedback,360,180);c.restore();}
    this.drawParticles();}
}
