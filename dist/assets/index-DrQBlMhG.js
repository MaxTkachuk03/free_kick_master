import{S as gt,C as ft,P as xt,V as M,W as yt,A as bt,D as ht,a as it,M as S,b as f,c as Q,d as lt,e as pt,R as ut,G as $,B as L,L as mt,f as W,g as D,T as wt,h as at,i as U,j as vt,k as dt,l as kt,m as Mt,n as St,o as Ct,p as Pt,E as zt}from"./three-MrXXPIYI.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function e(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(s){if(s.ep)return;s.ep=!0;const o=e(s);fetch(s.href,o)}})();class Lt{constructor(t){this.container=t,this.scene=null,this.camera=null,this.renderer=null,this.animationId=null}init(){this.scene=new gt,this.scene.background=new ft(8900331);const t=this.container.clientWidth/this.container.clientHeight;this.camera=new xt(60,t,.1,1e3),this.camera.position.set(0,1.7,-3),this.camera.lookAt(0,.5,2),console.log("Camera initialized:",{position:this.camera.position,lookAt:new M(0,0,12.5),aspect:t});const e=this.container.querySelector("#game-canvas");if(!e){console.error("Canvas element not found!");return}this.renderer=new yt({canvas:e,antialias:!0}),this.renderer.setSize(this.container.clientWidth,this.container.clientHeight),this.renderer.setPixelRatio(window.devicePixelRatio),console.log("Renderer initialized:",{width:this.container.clientWidth,height:this.container.clientHeight,canvas:!!e}),this.setupLighting(),window.addEventListener("resize",()=>this.onWindowResize())}setupLighting(){const t=new bt(16777215,.8);this.scene.add(t);const e=new ht(16777215,1);e.position.set(10,20,10),e.castShadow=!0,this.scene.add(e);const i=new ht(16777215,.4);i.position.set(-10,15,-10),this.scene.add(i)}onWindowResize(){const t=this.container.clientWidth,e=this.container.clientHeight,i=t/e;this.camera.aspect=i,this.camera.updateProjectionMatrix(),this.renderer.setSize(t,e)}getScene(){return this.scene}addObject(t){this.scene&&this.scene.add(t)}removeObject(t){this.scene&&this.scene.remove(t)}render(){this.renderer&&this.scene&&this.camera?this.renderer.render(this.scene,this.camera):console.warn("Renderer, scene, or camera not initialized:",{renderer:!!this.renderer,scene:!!this.scene,camera:!!this.camera})}start(){const t=()=>{this.animationId=requestAnimationFrame(t),this.render()};t()}stop(){this.animationId&&(cancelAnimationFrame(this.animationId),this.animationId=null)}dispose(){this.stop(),this.renderer&&this.renderer.dispose()}}class Et{constructor(){this.mesh=null,this.material=null,this.patternMeshes=[],this.position=new M(0,.2,2),this.radius=.11,this.createMesh()}createMesh(){const t=new it(this.radius,32,32),e=new S({color:16777215,roughness:.3,metalness:.1});this.material=e,this.mesh=new f(t,e),this.mesh.position.copy(this.position),this.mesh.castShadow=!0,this.mesh.receiveShadow=!0,this.addPattern()}addPattern(){const t=new Q({color:0,side:lt}),e=12;for(let s=0;s<e;s++){const o=new pt(this.radius*.15,5),a=new f(o,t),r=Math.acos(-1+2*s/e),n=Math.sqrt(e*Math.PI)*r;a.position.set(this.radius*.9*Math.cos(n)*Math.sin(r),this.radius*.9*Math.sin(n)*Math.sin(r),this.radius*.9*Math.cos(r)),a.lookAt(a.position.x*2,a.position.y*2,a.position.z*2),this.mesh.add(a),this.patternMeshes.push(a)}const i=new ut(this.radius*.85,this.radius,32);for(let s=0;s<3;s++){const o=new f(i,t);o.rotation.x=Math.PI/2,o.rotation.z=s*Math.PI*2/3,this.mesh.add(o),this.patternMeshes.push(o)}}getMesh(){return this.mesh}reset(){this.mesh.position.copy(this.position)}setPosition(t,e,i){this.position.set(t,e,i),this.mesh&&this.mesh.position.copy(this.position)}getPosition(){return this.mesh?this.mesh.position:this.position}applyBallStyle(t){if(!t){console.warn("⚠️ applyBallStyle: ballConfig is null or undefined");return}console.log("⚽ Applying ball style:",t),t.color!==void 0&&this.material&&(console.log("⚽ Setting ball color to:",t.color.toString(16)),this.material.color.setHex(t.color)),t.patternColor!==void 0&&(console.log("⚽ Setting pattern color to:",t.patternColor.toString(16)),this.patternMeshes.forEach(e=>{e.material&&e.material.color.setHex(t.patternColor)})),t.hasPattern===!1?(console.log("⚽ Hiding pattern"),this.patternMeshes.forEach(e=>{e.visible=!1})):t.hasPattern===!0&&(console.log("⚽ Showing pattern"),this.patternMeshes.forEach(e=>{e.visible=!0})),console.log("✅ Ball style applied successfully")}}class Rt{constructor(){this.mesh=null,this.position=new M(0,0,25),this.width=7.32,this.height=2.44,this.depth=2,this.createMesh()}createMesh(){const t=new $,e=new S({color:16777215,roughness:.5,metalness:.2}),i=.12,s=new f(new L(i,this.height,i),e);s.position.set(-this.width/2,this.height/2,0),s.castShadow=!0,t.add(s);const o=new f(new L(i,this.height,i),e);o.position.set(this.width/2,this.height/2,0),o.castShadow=!0,t.add(o);const a=new f(new L(this.width,i,i),e);a.position.set(0,this.height,0),a.castShadow=!0,t.add(a),this.createNet(t);const r=new L(this.width+.5,.05,.1),n=new S({color:16777215}),l=new f(r,n);l.rotation.x=-Math.PI/2,l.position.y=.01,t.add(l),this.mesh=t,this.mesh.position.copy(this.position),this.mesh.rotation.y=Math.PI}createNet(t){const e=new mt({color:16777215,opacity:.8,transparent:!0,linewidth:1}),i=.3,s=this.depth;for(let o=-this.width/2;o<=this.width/2;o+=i){const a=[new M(o,0,-s),new M(o,this.height,-s)],r=new W().setFromPoints(a),n=new D(r,e);t.add(n)}for(let o=0;o<=this.height;o+=i){const a=[new M(-this.width/2,o,-s),new M(this.width/2,o,-s)],r=new W().setFromPoints(a),n=new D(r,e);t.add(n)}for(let o=0;o>=-s;o-=i){const a=[new M(-this.width/2,0,o),new M(-this.width/2,this.height,o)],r=new W().setFromPoints(a),n=new D(r,e);t.add(n);const l=[new M(this.width/2,0,o),new M(this.width/2,this.height,o)],h=new W().setFromPoints(l),d=new D(h,e);t.add(d)}for(let o=-this.width/2;o<=this.width/2;o+=i){const a=[new M(o,this.height,0),new M(o,this.height,-s)],r=new W().setFromPoints(a),n=new D(r,e);t.add(n)}for(let o=-this.width/2;o<=this.width/2;o+=i){const a=[new M(o,0,0),new M(o,0,-s)],r=new W().setFromPoints(a),n=new D(r,e);t.add(n)}}getMesh(){return this.mesh}isInsideGoal(t){const e=t.clone().sub(this.position);return e.x>=-this.width/2&&e.x<=this.width/2&&e.y>=0&&e.y<=this.height&&e.z>=-this.depth&&e.z<=.5}getBounds(){return{minX:this.position.x-this.width/2,maxX:this.position.x+this.width/2,minY:this.position.y,maxY:this.position.y+this.height,minZ:this.position.z-this.depth,maxZ:this.position.z+.5}}}class At{constructor(){this.mesh=null,this.position=new M(0,0,0),this.isAnimating=!1,this.animationProgress=0,this.animationDuration=.5,this.animationStartTime=0,this.bodyParts={rightLeg:null,rightFoot:null,rightArm:null,leftLeg:null,leftFoot:null,leftArm:null,body:null},this.materials={jerseyBase:null,jerseyStripe:null,jerseyYellowStripe:null,collar:null,shorts:null,boots:null},this.jerseyStripes=[],this.initialStates={},this.createMesh()}createMesh(){const t=new $,e=new S({color:16711680,roughness:.7,metalness:.1});this.materials.jerseyBase=e;const i=new S({color:255,roughness:.7,metalness:.1});this.materials.jerseyStripe=i;const s=new S({color:16776960,roughness:.7,metalness:.1});this.materials.jerseyYellowStripe=s;const o=new S({color:16776960,roughness:.7,metalness:.1});this.materials.collar=o;const a=new S({color:1718876,roughness:.7,metalness:.1});this.materials.shorts=a;const r=new S({color:16767916,roughness:.8,metalness:0}),n=new S({color:16777215,roughness:.7,metalness:.1}),l=new S({color:16711680,roughness:.6,metalness:.2});this.materials.boots=l;const h=new S({color:16777215,roughness:.6,metalness:.2}),d=new it(.15,16,16),u=new f(d,r);u.position.set(0,.9,0),u.castShadow=!0,t.add(u);const p=new L(.3,.4,.2),x=new f(p,e);x.position.set(0,.5,0),x.castShadow=!0,t.add(x),this.bodyParts.body=x;const y=.03,v=.06;for(let C=-.12;C<=.12;C+=v){const A=new f(new L(y,.4,.21),i);if(A.position.set(C,.5,0),t.add(A),this.jerseyStripes.push(A),C<.12){const T=new f(new L(y*.5,.4,.21),s);T.position.set(C+v/2,.5,0),t.add(T),this.jerseyStripes.push(T)}}const k=new wt(.08,.01,8,16),K=new f(k,o);K.position.set(0,.65,.1),K.rotation.x=Math.PI/2,t.add(K);const P=new Q({color:16777215,side:lt}),R=new f(new at(.02,.12),P);R.position.set(-.04,.5,-.11),t.add(R);const w=new ut(.04,.06,16),B=new f(w,P);B.position.set(.04,.5,-.11),B.rotation.x=-Math.PI/2,t.add(B);const F=new U(.05,.05,.15,8),G=new f(F,e);G.position.set(-.2,.65,0),G.rotation.z=Math.PI/6,G.castShadow=!0,t.add(G);const E=new U(.04,.04,.2,8),V=new f(E,r);V.position.set(-.25,.5,0),V.rotation.z=Math.PI/6,V.castShadow=!0,t.add(V),this.bodyParts.leftArm=G;const N=new f(F,e);N.position.set(.2,.65,.1),N.rotation.z=-Math.PI/4,N.castShadow=!0,t.add(N);const O=new f(E,r);O.position.set(.28,.55,.15),O.rotation.z=-Math.PI/4,O.castShadow=!0,t.add(O),this.bodyParts.rightArm=N;const ot=new L(.32,.25,.22),_=new f(ot,a);_.position.set(0,.2,0),_.castShadow=!0,t.add(_);const nt=new U(.06,.06,.35,8),X=new f(nt,r);X.position.set(-.08,-.05,0),X.castShadow=!0,t.add(X),this.bodyParts.leftLeg=X;const J=new f(new U(.065,.065,.15,8),n);J.position.set(-.08,-.2,0),J.castShadow=!0,t.add(J);const Y=new f(nt,r);Y.position.set(.08,-.05,.15),Y.rotation.x=-Math.PI/3,Y.castShadow=!0,t.add(Y),this.bodyParts.rightLeg=Y;const j=new f(new U(.065,.065,.15,8),n);j.position.set(.08,-.15,.2),j.rotation.x=-Math.PI/3,j.castShadow=!0,t.add(j);const tt=new L(.12,.05,.2),q=new f(tt,l);q.position.set(-.08,-.3,.05),q.castShadow=!0,t.add(q);const et=new f(new L(.13,.02,.03),h);et.position.set(-.08,-.28,.08),t.add(et);const c=new f(new L(.13,.02,.03),h);c.position.set(-.08,-.28,.02),t.add(c),this.bodyParts.leftFoot=q;const m=new f(tt,l);m.position.set(.08,-.2,.25),m.rotation.x=-Math.PI/3,m.castShadow=!0,t.add(m);const g=new f(new L(.13,.02,.03),h);g.position.set(.08,-.18,.28),g.rotation.x=-Math.PI/3,t.add(g);const z=new f(new L(.13,.02,.03),h);z.position.set(.08,-.18,.22),z.rotation.x=-Math.PI/3,t.add(z),this.bodyParts.rightFoot=m,this.mesh=t,this.mesh.position.copy(this.position),this.saveInitialStates()}saveInitialStates(){if(!this.bodyParts.rightLeg||!this.bodyParts.rightFoot||!this.bodyParts.rightArm||!this.bodyParts.leftLeg||!this.bodyParts.leftFoot||!this.bodyParts.leftArm||!this.bodyParts.body){console.warn("Player: Not all body parts initialized before saveInitialStates");return}this.initialStates.rightLeg={position:this.bodyParts.rightLeg.position.clone(),rotation:this.bodyParts.rightLeg.rotation.clone()},this.initialStates.rightFoot={position:this.bodyParts.rightFoot.position.clone(),rotation:this.bodyParts.rightFoot.rotation.clone()},this.initialStates.rightArm={position:this.bodyParts.rightArm.position.clone(),rotation:this.bodyParts.rightArm.rotation.clone()},this.initialStates.leftLeg={position:this.bodyParts.leftLeg.position.clone(),rotation:this.bodyParts.leftLeg.rotation.clone()},this.initialStates.leftFoot={position:this.bodyParts.leftFoot.position.clone(),rotation:this.bodyParts.leftFoot.rotation.clone()},this.initialStates.leftArm={position:this.bodyParts.leftArm.position.clone(),rotation:this.bodyParts.leftArm.rotation.clone()},this.initialStates.body={position:this.bodyParts.body.position.clone(),rotation:this.bodyParts.body.rotation.clone()}}startKickAnimation(){this.isAnimating||(this.isAnimating=!0,this.animationProgress=0,this.animationStartTime=performance.now()/1e3)}updateAnimation(t){if(!this.isAnimating)return;if(!this.initialStates||!this.initialStates.body||!this.bodyParts.body){console.warn("Player: Animation states not initialized"),this.isAnimating=!1;return}this.animationProgress+=t;const e=Math.min(this.animationProgress/this.animationDuration,1);if(e>=1){this.resetToIdle(),this.isAnimating=!1;return}if(e<.3){const i=e/.3,s=Math.sin(i*Math.PI)*.3;this.bodyParts.body&&this.initialStates.body&&(this.bodyParts.body.position.z=this.initialStates.body.position.z-s),this.bodyParts.rightLeg&&this.initialStates.rightLeg&&(this.bodyParts.rightLeg.position.z=this.initialStates.rightLeg.position.z-s*.5,this.bodyParts.rightLeg.rotation.x=-Math.PI/6),this.bodyParts.rightArm&&this.initialStates.rightArm&&(this.bodyParts.rightArm.rotation.z=-Math.PI/2)}else{const i=(e-.3)/.7,s=1-Math.pow(1-i,3);if(this.bodyParts.body&&this.initialStates.body){const o=Math.sin(i*Math.PI)*.2;this.bodyParts.body.position.z=this.initialStates.body.position.z-.3+o}this.bodyParts.rightLeg&&this.initialStates.rightLeg&&(this.bodyParts.rightLeg.rotation.x=-Math.PI/6+-Math.PI/2*s,this.bodyParts.rightLeg.position.z=this.initialStates.rightLeg.position.z-.15+.3*s,this.bodyParts.rightLeg.position.y=this.initialStates.rightLeg.position.y+.1*s),this.bodyParts.rightFoot&&this.initialStates.rightFoot&&(this.bodyParts.rightFoot.rotation.x=-Math.PI/6+-Math.PI/2*s,this.bodyParts.rightFoot.position.z=this.initialStates.rightFoot.position.z-.1+.35*s,this.bodyParts.rightFoot.position.y=this.initialStates.rightFoot.position.y+.15*s),this.bodyParts.rightArm&&this.initialStates.rightArm&&(this.bodyParts.rightArm.rotation.z=-Math.PI/2+Math.PI/4*s),this.bodyParts.leftLeg&&this.initialStates.leftLeg&&(this.bodyParts.leftLeg.rotation.x=-.1*s)}}resetToIdle(){this.bodyParts.rightLeg&&(this.bodyParts.rightLeg.position.copy(this.initialStates.rightLeg.position),this.bodyParts.rightLeg.rotation.copy(this.initialStates.rightLeg.rotation)),this.bodyParts.rightFoot&&(this.bodyParts.rightFoot.position.copy(this.initialStates.rightFoot.position),this.bodyParts.rightFoot.rotation.copy(this.initialStates.rightFoot.rotation)),this.bodyParts.rightArm&&(this.bodyParts.rightArm.position.copy(this.initialStates.rightArm.position),this.bodyParts.rightArm.rotation.copy(this.initialStates.rightArm.rotation)),this.bodyParts.leftLeg&&(this.bodyParts.leftLeg.position.copy(this.initialStates.leftLeg.position),this.bodyParts.leftLeg.rotation.copy(this.initialStates.leftLeg.rotation)),this.bodyParts.leftFoot&&(this.bodyParts.leftFoot.position.copy(this.initialStates.leftFoot.position),this.bodyParts.leftFoot.rotation.copy(this.initialStates.leftFoot.rotation)),this.bodyParts.leftArm&&(this.bodyParts.leftArm.position.copy(this.initialStates.leftArm.position),this.bodyParts.leftArm.rotation.copy(this.initialStates.leftArm.rotation)),this.bodyParts.body&&(this.bodyParts.body.position.copy(this.initialStates.body.position),this.bodyParts.body.rotation.copy(this.initialStates.body.rotation))}getMesh(){return this.mesh}setPosition(t,e,i){this.position.set(t,e,i),this.mesh&&this.mesh.position.copy(this.position)}getPosition(){return this.position.clone()}updatePosition(t){this.setPosition(t.x+1.5,t.y+0,t.z+-.3)}applyUniform(t){if(!t){console.warn("⚠️ applyUniform: uniformConfig is null or undefined");return}console.log("🎨 Applying uniform to player:",t),t.jerseyColor!==void 0&&(this.materials.jerseyBase?(console.log("🎨 Setting jersey color to:",t.jerseyColor.toString(16)),this.materials.jerseyBase.color.setHex(t.jerseyColor)):console.warn("⚠️ jerseyBase material not found")),t.shortsColor!==void 0&&(this.materials.shorts?(console.log("🎨 Setting shorts color to:",t.shortsColor.toString(16)),this.materials.shorts.color.setHex(t.shortsColor)):console.warn("⚠️ shorts material not found")),t.bootsColor!==void 0&&(this.materials.boots?(console.log("🎨 Setting boots color to:",t.bootsColor.toString(16)),this.materials.boots.color.setHex(t.bootsColor)):console.warn("⚠️ boots material not found")),t.stripeColor!==void 0&&(console.log("🎨 Setting stripe color to:",t.stripeColor.toString(16)),this.jerseyStripes.forEach(e=>{e.material&&e.material.color.setHex(t.stripeColor)})),t.hasStripes===!1?(console.log("🎨 Hiding stripes"),this.jerseyStripes.forEach(e=>{e.visible=!1})):t.hasStripes===!0&&(console.log("🎨 Showing stripes"),this.jerseyStripes.forEach(e=>{e.visible=!0})),console.log("✅ Uniform applied successfully")}faceGoal(){this.mesh&&(this.mesh.rotation.y=Math.PI)}}class Kt{constructor(t){this.renderer=t,this.field=null,this.fieldLines=null,this.stadium=null,this.ball=null,this.goal=null,this.player=null}createField(){const i=document.createElement("canvas"),s=2048;i.width=s,i.height=s;const o=i.getContext("2d");o.fillStyle="#4a7c59",o.fillRect(0,0,s,s);const a=s/40,r=s/60,n=w=>(w+40/2)*a,l=w=>(w+60/2)*r;o.strokeStyle="#ffffff",o.fillStyle="#ffffff",o.lineWidth=3,o.beginPath(),o.moveTo(n(-20),l(-30)),o.lineTo(n(-20),l(30)),o.stroke(),o.beginPath(),o.moveTo(n(20),l(-30)),o.lineTo(n(20),l(30)),o.stroke(),o.beginPath(),o.moveTo(n(-20),l(-30)),o.lineTo(n(20),l(-30)),o.stroke(),o.beginPath(),o.moveTo(n(-20),l(30)),o.lineTo(n(20),l(30)),o.stroke(),o.beginPath(),o.moveTo(n(-20),l(0)),o.lineTo(n(20),l(0)),o.stroke(),o.beginPath(),o.arc(n(0),l(0),9.15*a,0,Math.PI*2),o.stroke(),o.beginPath(),o.arc(n(0),l(0),.3*a,0,Math.PI*2),o.fill();const h=16.5,d=20,u=25;o.strokeRect(n(-d/2),l(u-h),d*a,h*r);const p=5.5,x=10;o.strokeRect(n(-x/2),l(u-p),x*a,p*r),o.beginPath(),o.arc(n(0),l(u-11),.3*a,0,Math.PI*2),o.fill(),o.beginPath(),o.arc(n(0),l(u-11),9.15*a,0,Math.PI),o.stroke();const y=1,v=Math.PI/2;o.beginPath(),o.arc(n(-20),l(-30),y*a,0,v),o.stroke(),o.beginPath(),o.arc(n(20),l(-30),y*a,Math.PI/2,Math.PI),o.stroke(),o.beginPath(),o.arc(n(-20),l(30),y*a,-Math.PI/2,0),o.stroke(),o.beginPath(),o.arc(n(20),l(30),y*a,Math.PI,Math.PI*1.5),o.stroke();const k=-25;o.strokeRect(n(-d/2),l(k),d*a,h*r),o.strokeRect(n(-x/2),l(k),x*a,p*r),o.beginPath(),o.arc(n(0),l(k+11),.3*a,0,Math.PI*2),o.fill(),o.beginPath(),o.arc(n(0),l(k+11),9.15*a,Math.PI,0),o.stroke();const K=new vt(i);K.wrapS=dt,K.wrapT=dt,K.needsUpdate=!0;const P=new at(40,60),R=new S({map:K,roughness:.9,metalness:0});return this.field=new f(P,R),this.field.rotation.x=-Math.PI/2,this.field.position.y=0,this.field.receiveShadow=!0,this.renderer.addObject(this.field),this.field}createFieldLines(){const t=new $;return this.fieldLines=t,this.renderer.addObject(t),t}createStadium(){const t=new $,e=this.createStands(60,10,1,-25,5,0);t.add(e);const i=this.createStands(60,10,1,25,5,0);t.add(i);const s=this.createStands(1,10,50,0,5,-40);s.rotation.y=Math.PI/2,t.add(s);const o=this.createStands(1,10,50,0,5,40);return o.rotation.y=Math.PI/2,t.add(o),this.addSpectators(t),this.stadium=t,this.renderer.addObject(t),t}createStands(t,e,i,s,o,a){const r=new $,n=new L(t,e,i),l=new S({color:3355443,roughness:.7}),h=new f(n,l);h.position.set(0,0,0),h.castShadow=!0,h.receiveShadow=!0,r.add(h);const d=5,u=1710618;for(let p=0;p<d;p++){const x=new L(t*.9,.1,i*.15),y=new S({color:u}),v=new f(x,y);v.position.set(0,-e/2+(p+1)*(e/(d+1)),0),r.add(v)}return r.position.set(s,o,a),r}addSpectators(t){const e=[16711680,255,16776960,65280,16711935,16777215];[{x:-25,y:6,z:-20,rows:5,cols:10,dir:"z"},{x:-25,y:6,z:0,rows:5,cols:10,dir:"z"},{x:-25,y:6,z:20,rows:5,cols:10,dir:"z"},{x:25,y:6,z:-20,rows:5,cols:10,dir:"z"},{x:25,y:6,z:0,rows:5,cols:10,dir:"z"},{x:25,y:6,z:20,rows:5,cols:10,dir:"z"},{x:-15,y:6,z:-40,rows:5,cols:8,dir:"x"},{x:0,y:6,z:-40,rows:5,cols:8,dir:"x"},{x:15,y:6,z:-40,rows:5,cols:8,dir:"x"},{x:-15,y:6,z:40,rows:5,cols:8,dir:"x"},{x:0,y:6,z:40,rows:5,cols:8,dir:"x"},{x:15,y:6,z:40,rows:5,cols:8,dir:"x"}].forEach(s=>{for(let o=0;o<s.rows;o++)for(let a=0;a<s.cols;a++){const r=e[Math.floor(Math.random()*e.length)],n=new L(.4,.7,.2),l=new S({color:r}),h=new f(n,l),d=1.3,u=(o-s.rows/2)*d*.8,p=(a-s.cols/2)*d;s.dir==="z"?h.position.set(s.x,s.y+u,s.z+p):h.position.set(s.x+p,s.y+u,s.z),t.add(h)}})}createGameObjects(){this.ball=new Et,this.renderer.addObject(this.ball.getMesh()),this.goal=new Rt,this.renderer.addObject(this.goal.getMesh()),this.player=new At,this.renderer.addObject(this.player.getMesh());const t=this.ball.getPosition();this.player.updatePosition(t),this.player.faceGoal()}createBackground(){const t=new $,e=new at(50,20),i=new S({color:8900331,roughness:.8,metalness:.1}),s=new f(e,i);s.position.set(0,10,35),t.add(s);const o=[16739179,5164484,16770669,9822675,15958401];for(let a=0;a<15;a++){const r=new pt(1.5+Math.random()*1,32),n=new Q({color:o[Math.floor(Math.random()*o.length)],transparent:!0,opacity:.3+Math.random()*.3}),l=new f(r,n);l.position.set((Math.random()-.5)*40,(Math.random()-.5)*15+10,35.01),t.add(l)}return this.renderer.addObject(t),t}createPalmTrees(){const t=new $,e=new S({color:9127187,roughness:.8}),i=new S({color:2263842,roughness:.7});return[{x:-22,z:-25},{x:-22,z:0},{x:-22,z:25},{x:22,z:-25},{x:22,z:0},{x:22,z:25}].forEach(o=>{const a=new $,r=new U(.3,.4,6,8),n=new f(r,e);n.position.y=3,n.castShadow=!0,a.add(n);for(let l=0;l<6;l++){const h=new kt(1,3,8),d=new f(h,i),u=l/6*Math.PI*2;d.position.set(Math.cos(u)*1.5,5.5,Math.sin(u)*1.5),d.rotation.z=u,d.castShadow=!0,a.add(d)}a.position.set(o.x,0,o.z),t.add(a)}),this.renderer.addObject(t),t}createStadiumStands(){const t=new $,e=new L(60,8,5),i=new S({color:4473924,roughness:.8}),s=new f(e,i);s.position.set(0,4,40),t.add(s);for(let o=0;o<50;o++){const a=new it(.1,8,8),r=new Q({color:Math.random()>.5?16711680:255}),n=new f(a,r);n.position.set((Math.random()-.5)*55,5+Math.random()*3,40.1),t.add(n)}return this.renderer.addObject(t),t}init(){this.createField(),this.createFieldLines(),this.createBackground(),this.createPalmTrees(),this.createStadiumStands(),this.createGameObjects()}getBall(){return this.ball}getGoal(){return this.goal}getPlayer(){return this.player}updatePlayerPosition(){this.player&&this.ball&&this.player.updatePosition(this.ball.getPosition())}}class Gt{constructor(t,e,i,s,o=null){this.renderer=t,this.camera=e,this.scene=i,this.ball=s,this.player=o,this.canvas=null,this.raycaster=new Mt,this.mouse=new St,this.isAiming=!1,this.kickStartPosition=null,this.kickEndPosition=null,this.kickStartTime=null,this.trajectoryPreview=null,this.pendingKickParams=null,this.onKickCallback=null,this.onAimStartCallback=null,this.onAimUpdateCallback=null}init(){this.canvas=this.renderer.renderer.domElement,this.canvas.addEventListener("mousemove",t=>this.onMouseMove(t)),this.canvas.addEventListener("mousedown",t=>this.onMouseDown(t)),this.canvas.addEventListener("mouseup",t=>this.onMouseUp(t)),this.canvas.addEventListener("contextmenu",t=>t.preventDefault())}getMouseWorldPosition(t,e){const i=this.canvas.getBoundingClientRect();this.mouse.x=(t.clientX-i.left)/i.width*2-1,this.mouse.y=-((t.clientY-i.top)/i.height)*2+1,this.raycaster.setFromCamera(this.mouse,this.camera);const s=new Ct(new M(0,1,0),0),o=new M;return this.raycaster.ray.intersectPlane(s,o),o}calculateKickParameters(t,e,i=0){const s=new M().subVectors(t,e),o=s.length(),r=Math.min(o/20,1),l=Math.max(r,.3),h=s.x,d=s.y,u=s.z;if(s.length(),s.normalize(),s.z<0){const p=Math.sqrt(h*h+d*d),x=Math.abs(u);if(p>.001){s.x=h/p,s.y=d/p;const y=Math.sqrt(p*p+x*x);s.z=x/y;const v=Math.sqrt(1-s.z*s.z)/Math.sqrt(s.x*s.x+s.y*s.y);s.x*=v,s.y*=v}else s.z=Math.abs(s.z),s.normalize()}if(s.z<.1){const p=Math.sqrt(s.x*s.x+s.y*s.y);if(p>.001){const x=Math.sqrt(.99)/p;s.x*=x,s.y*=x,s.z=.1}else s.z=.1,s.normalize()}return{direction:s,power:l,distance:o,swipeSpeed:i}}onMouseMove(t){if(!this.isAiming)return;const e=this.ball?this.ball.getPosition():this.kickStartPosition;if(!e)return;const i=this.getMouseWorldPosition(t,e);this.kickEndPosition=i;const s=this.calculateKickParameters(i,e,0);this.onAimUpdateCallback&&this.onAimUpdateCallback(s)}onMouseDown(t){if(t.button!==0)return;const e=this.ball?this.ball.getPosition():new M(0,.2,5);this.kickStartPosition=e.clone(),this.kickStartTime=performance.now(),this.isAiming=!0,this.onAimStartCallback&&this.onAimStartCallback()}onMouseUp(t){if(!(t.button!==0||!this.isAiming)){if(this.isAiming=!1,this.kickStartPosition&&this.kickEndPosition&&this.kickStartTime){const e=(performance.now()-this.kickStartTime)/1e3,i=this.kickEndPosition.distanceTo(this.kickStartPosition),s=e>0?i/e:0,o=Math.min(s/500,2),a=this.calculateKickParameters(this.kickEndPosition,this.kickStartPosition,o);this.onKickCallback&&this.onKickCallback(a)}this.kickStartPosition=null,this.kickEndPosition=null,this.kickStartTime=null}}checkAndExecuteKick(){}updateTrajectoryPreview(t,e){this.removeTrajectoryPreview();const i=this.calculateTrajectoryPoints(t,e),s=new W().setFromPoints(i),o=new mt({color:16776960,linewidth:2,opacity:.7,transparent:!0});this.trajectoryPreview=new D(s,o),this.scene.add(this.trajectoryPreview)}calculateTrajectoryPoints(t,e){const i=[],o=e.power*20,a=.1,r=3,n=e.direction.clone().multiplyScalar(o);n.y=Math.abs(n.y)*.3+.5;let l=t.clone(),h=0;for(;h<r&&l.y>=0;)i.push(l.clone()),l.add(n.clone().multiplyScalar(a)),n.y+=-9.81*a,h+=a;return i}removeTrajectoryPreview(){this.trajectoryPreview&&(this.scene.remove(this.trajectoryPreview),this.trajectoryPreview.geometry.dispose(),this.trajectoryPreview.material.dispose(),this.trajectoryPreview=null)}onKick(t){this.onKickCallback=t}onAimStart(t){this.onAimStartCallback=t}onAimUpdate(t){this.onAimUpdateCallback=t}dispose(){this.removeTrajectoryPreview()}}class Tt{constructor(){this.gravity=-9.81,this.airResistance=.995}calculateTrajectory(t,e,i){e.y+=this.gravity*i,e.multiplyScalar(this.airResistance);const s=t.clone();return s.add(e.clone().multiplyScalar(i)),{position:s,velocity:e}}checkGroundCollision(t,e){return t.y<=e}checkGoalCollision(t,e,i=.11){const s=t.x>=e.minX&&t.x<=e.maxX&&t.y>=e.minY&&t.y<=e.maxY&&t.z>=e.minZ&&t.z<=e.maxZ,o=t.z>=e.minZ&&t.z<=e.maxZ&&t.x>=e.minX-i&&t.x<=e.maxX+i&&t.y>=e.minY-i&&t.y<=e.maxY+i,a=s||o;return t.z>e.minZ-1&&t.z<e.maxZ+1&&console.log("Goal collision check:",{ballPosition:t.clone(),goalBounds:e,ballRadius:i,isInBounds:s,isCrossingGoalLine:o,result:a,xCheck:`${t.x} >= ${e.minX} && ${t.x} <= ${e.maxX}`,yCheck:`${t.y} >= ${e.minY} && ${t.y} <= ${e.maxY}`,zCheck:`${t.z} >= ${e.minZ} && ${t.z} <= ${e.maxZ}`}),a}handleGroundCollision(t,e=.3){t.y=Math.abs(t.y)*e,t.x*=.8,t.z*=.8}}class Bt{constructor(t,e,i,s=null,o=null){this.ball=t,this.goal=e,this.sceneManager=i,this.stateManager=s,this.targetManager=o,this.physics=new Tt,this.isBallMoving=!1,this.ballVelocity=new M(0,0,0),this.lastTime=0,this.goalScored=!1,this.missRegistered=!1,this.isCompletingKick=!1,this.currentKick=0,this.totalKicks=5,this.kicksRemaining=5,this.initialCoins=0,this.score={goals:0,misses:0,coins:0},this.onKickStartCallback=null,this.onKickCompleteCallback=null,this.onGoalCallback=null,this.onMissCallback=null,this.onLevelCompleteCallback=null,this.onTargetHitCallback=null}processKick(t,e,i=0){if(this.isBallMoving){console.log("Cannot kick: ball is already moving");return}if(this.kicksRemaining<=0||this.currentKick>=this.totalKicks){console.log("No kicks remaining or max kicks reached, level already complete!",{currentKick:this.currentKick,totalKicks:this.totalKicks,kicksRemaining:this.kicksRemaining});return}this.goalScored=!1,this.missRegistered=!1,this.currentKick++,this.kicksRemaining--,console.log(`Kick ${this.currentKick}/${this.totalKicks} started, ${this.kicksRemaining} attempts remaining`,{currentScore:{...this.score}});const s=70,a=s+(120-s)*e,r=t.clone(),n=6,l=i*4,h=Math.max(t.y,0)*3,d=n+l+h;this.ballVelocity=new M(r.x*a,d,r.z*a),this.ballVelocity.z<70&&(this.ballVelocity.z=70),this.isBallMoving=!0,this.lastTime=performance.now()/1e3;const u=this.ball.getPosition();console.log("Kick executed:",{direction:t.clone(),power:e,swipeSpeed:i,speed:a,velocity:this.ballVelocity.clone(),ballPos:u.clone(),kicksRemaining:this.kicksRemaining,currentKick:this.currentKick}),this.onKickStartCallback&&this.onKickStartCallback({kick:this.currentKick,total:this.totalKicks,remaining:this.kicksRemaining,score:this.score}),(this.currentKick>=this.totalKicks||this.kicksRemaining===0)&&console.log("Last kick executed, will complete level after ball stops")}update(t){if(!this.isBallMoving)return;const e=this.ball.getPosition(),i=.11,s=this.physics.calculateTrajectory(e,this.ballVelocity,t);if(this.ball.setPosition(s.position.x,s.position.y,s.position.z),this.checkCollisions(s.position),this.goalScored||this.missRegistered)return;if(this.targetManager){const a=this.targetManager.checkTargetHits(s.position);if(a.length>0){const r=this.targetManager.getRewardFromHits(a);this.score.coins+=r,console.log(`Target hit! Coins: +${r}`),this.onTargetHitCallback&&this.onTargetHitCallback(a,r)}}this.ballVelocity=s.velocity;const o=Math.sqrt(this.ballVelocity.x*this.ballVelocity.x+this.ballVelocity.y*this.ballVelocity.y+this.ballVelocity.z*this.ballVelocity.z);s.position.y<=i,o<.8&&!this.goalScored&&!this.missRegistered&&(console.log("Ball stopped (very slow speed)",{totalSpeed:o,position:s.position.clone(),kicksRemaining:this.kicksRemaining,goalScored:this.goalScored,missRegistered:this.missRegistered}),this.stopBall(),s.position.y<i&&this.ball.setPosition(s.position.x,i,s.position.z),this.finalCheckForGoalOrMiss(s.position),!this.goalScored&&!this.missRegistered&&!this.isCompletingKick&&(console.log("Calling handleKickComplete immediately after ball stopped (slow speed)"),this.handleKickComplete()))}finalCheckForGoalOrMiss(t){const d=t.z>=25,u=t.x>=-3.66-.11&&t.x<=3.66+.11,p=t.y>=0-.11&&t.y<=2.44+.11;if(d&&u&&p&&!this.goalScored&&!this.missRegistered){console.log("🎉🎉🎉 GOAL DETECTED in finalCheckForGoalOrMiss! 🎉🎉🎉",{ballPosition:{x:t.x.toFixed(2),y:t.y.toFixed(2),z:t.z.toFixed(2)}}),typeof this.handleGoal=="function"&&this.handleGoal();return}if(t.z>25+.3&&!this.goalScored&&!this.missRegistered){const y=t.x<-3.77||t.x>3.77,v=t.y<0-.11||t.y>2.44+.11;if(y||v){console.log("❌ MISS detected in finalCheckForGoalOrMiss"),this.missRegistered||this.onMiss();return}}}checkCollisions(t){const d=t.z>=25,u=t.x>=-3.66-.11&&t.x<=3.66+.11,p=t.y>=0-.11&&t.y<=2.44+.11,x=d&&u&&p;if(t.z>24&&t.z<27&&console.log("⚽ Ball near goal:",{ballPos:{x:t.x.toFixed(2),y:t.y.toFixed(2),z:t.z.toFixed(2)},goalLine:25,goalWidth:`[${(-3.66).toFixed(2)}, ${3.66.toFixed(2)}]`,goalHeight:`[${0 .toFixed(2)}, ${2.44.toFixed(2)}]`,hasCrossedGoalLine:d,isWithinGoalWidth:u,isWithinGoalHeight:p,isGoal:x,goalScored:this.goalScored,missRegistered:this.missRegistered}),x&&!this.goalScored&&!this.missRegistered){if(console.log("🎉🎉🎉 GOAL DETECTED in checkCollisions! 🎉🎉🎉",{ballPosition:{x:t.x.toFixed(2),y:t.y.toFixed(2),z:t.z.toFixed(2)},currentKick:this.currentKick,kicksRemaining:this.kicksRemaining,goalScored:this.goalScored,missRegistered:this.missRegistered,scoreBefore:{...this.score}}),typeof this.handleGoal=="function"){console.log("📞 Calling handleGoal() method...");try{this.handleGoal(),console.log("✅ handleGoal() method executed")}catch(y){console.error("❌ Error calling handleGoal():",y)}}else console.error("❌ handleGoal is not a function!",typeof this.handleGoal);this.stopBall();return}if(t.z>25+.3&&!this.goalScored&&!this.missRegistered){const y=t.x<-3.77||t.x>3.77,v=t.y<0-.11||t.y>2.44+.11;if(y||v){console.log("❌ MISS - Ball passed goal but outside bounds",{ballPosition:{x:t.x.toFixed(2),y:t.y.toFixed(2),z:t.z.toFixed(2)},isOutsideGoalWidth:y,isOutsideGoalHeight:v,missRegistered:this.missRegistered}),this.missRegistered||this.onMiss(),this.stopBall();return}}if(this.physics.checkGroundCollision(t,.11)){this.ball.setPosition(t.x,.11,t.z),this.ballVelocity.y<0?this.ballVelocity.y=Math.abs(this.ballVelocity.y)*.3:this.ballVelocity.y=0,this.ballVelocity.x*=.92,this.ballVelocity.z*=.92;const y=Math.sqrt(this.ballVelocity.x*this.ballVelocity.x+this.ballVelocity.z*this.ballVelocity.z);y<.8&&Math.abs(this.ballVelocity.y)<.5&&!this.goalScored&&!this.missRegistered&&(console.log("Ball stopped on ground (slow speed)",{horizontalSpeed:y,position:t.clone(),kicksRemaining:this.kicksRemaining,goalScored:this.goalScored,missRegistered:this.missRegistered}),this.stopBall(),this.ball.setPosition(t.x,.11,t.z),this.finalCheckForGoalOrMiss(t),!this.goalScored&&!this.missRegistered&&!this.isCompletingKick&&(console.log("Calling handleKickComplete immediately after ball stopped on ground"),this.handleKickComplete()))}}stopBall(){this.isBallMoving=!1,this.ballVelocity.set(0,0,0)}handleGoal(){if(this.goalScored){console.log("⚠️ Goal already processed for this kick, ignoring duplicate call...",{currentGoals:this.score.goals});return}console.log("🎯 handleGoal() called - processing goal...",{goalsBefore:this.score.goals,goalScored:this.goalScored}),this.goalScored=!0;const t=this.score.goals;if(this.score.goals=this.score.goals+1,this.score.coins+=10,console.log("🎉 GOAL SCORED! Score updated:",{goalsBefore:t,goalsAfter:this.score.goals,totalCoins:this.score.coins,kicksRemaining:this.kicksRemaining,currentKick:this.currentKick,totalKicks:this.totalKicks,fullScore:{...this.score}}),this.onGoalCallback){console.log("✅ Calling onGoalCallback with score:",this.score);try{this.onGoalCallback(this.score),console.log("✅ onGoalCallback executed successfully")}catch(i){console.error("❌ Error in onGoalCallback:",i)}}else console.error("❌ onGoalCallback is not set! Goals will not update in UI!");this.stopBall(),this.isCompletingKick=!1;const e=this.currentKick>=this.totalKicks||this.kicksRemaining===0;console.log("⏱️ handleGoal: Scheduling onKickComplete",{currentKick:this.currentKick,totalKicks:this.totalKicks,kicksRemaining:this.kicksRemaining,isLastKick:e,isCompletingKick:this.isCompletingKick}),setTimeout(()=>{if(console.log("⏱️ handleGoal: Calling onKickComplete after timeout",{currentKick:this.currentKick,totalKicks:this.totalKicks,kicksRemaining:this.kicksRemaining,isCompletingKick:this.isCompletingKick,isBallMoving:this.isBallMoving,goalScored:this.goalScored,missRegistered:this.missRegistered}),this.isBallMoving&&(console.log("⚠️ Ball still moving, stopping it before onKickComplete"),this.stopBall()),typeof this.handleKickComplete=="function"){console.log("✅ handleKickComplete is a function, calling it...");try{this.handleKickComplete(),console.log("✅ handleKickComplete call completed")}catch(i){console.error("❌ Error calling handleKickComplete:",i)}}else console.error("❌ handleKickComplete is not a function!",typeof this.handleKickComplete)},1500)}onMiss(){if(console.log("🎯 onMiss() method called",{missRegistered:this.missRegistered,currentKick:this.currentKick,kicksRemaining:this.kicksRemaining}),this.missRegistered){console.log("⚠️ Miss already registered for this kick, ignoring duplicate call...",{currentKick:this.currentKick,kicksRemaining:this.kicksRemaining,misses:this.score.misses});return}if(this.missRegistered=!0,console.log("✅ missRegistered set to true"),this.score.misses++,console.log("❌ MISS REGISTERED!",{totalMisses:this.score.misses,kicksRemaining:this.kicksRemaining,currentKick:this.currentKick,totalKicks:this.totalKicks,score:{...this.score}}),this.stopBall(),this.onMissCallback){console.log("📞 Calling onMissCallback with score:",this.score);try{this.onMissCallback(this.score),console.log("✅ onMissCallback executed successfully")}catch(t){console.error("❌ Error in onMissCallback:",t)}}else console.warn("⚠️ onMissCallback is not set!");this.isCompletingKick=!1,setTimeout(()=>{console.log("⏱️ onMiss: Scheduling handleKickComplete",{currentKick:this.currentKick,kicksRemaining:this.kicksRemaining,missRegistered:this.missRegistered}),this.handleKickComplete()},1e3)}handleKickComplete(){if(console.log("📞 handleKickComplete() called",{isCompletingKick:this.isCompletingKick,goalScored:this.goalScored,missRegistered:this.missRegistered,kicksRemaining:this.kicksRemaining,currentKick:this.currentKick,totalKicks:this.totalKicks}),this.isCompletingKick&&this.kicksRemaining>=0){console.log("⚠️ onKickComplete already in progress, ignoring duplicate call");return}if(this.isCompletingKick=!0,console.log("✅ onKickComplete processing...",{goalScored:this.goalScored,missRegistered:this.missRegistered,kicksRemaining:this.kicksRemaining,currentKick:this.currentKick,totalKicks:this.totalKicks}),!this.goalScored&&!this.missRegistered){const e=this.ball.getPosition(),i=.11,s=25,o=7.32,a=2.44,r=s,n=-o/2,l=o/2,h=0,d=a,u=e.z>=r,p=e.x>=n-i&&e.x<=l+i,x=e.y>=h-i&&e.y<=d+i,y=u&&p&&x;if(console.log("Final check on kick complete:",{ballPosition:{x:e.x.toFixed(2),y:e.y.toFixed(2),z:e.z.toFixed(2)},hasCrossedGoalLine:u,isWithinGoalWidth:p,isWithinGoalHeight:x,isGoal:y,goalScored:this.goalScored,missRegistered:this.missRegistered}),y){console.log("✅ Goal detected on kick complete! Registering goal..."),this.isCompletingKick=!1,this.handleGoal();return}if(!this.goalScored&&!this.missRegistered){console.log("❌ Ball stopped - registering miss in handleKickComplete..."),this.isCompletingKick=!1;try{this.onMiss(),console.log("✅ onMiss() called successfully from handleKickComplete")}catch(v){console.error("❌ Error calling onMiss() from handleKickComplete:",v)}return}else this.missRegistered&&console.log("⚠️ Miss already registered, skipping duplicate registration")}else console.log("Goal or miss already registered:",{goalScored:this.goalScored,missRegistered:this.missRegistered});this.isCompletingKick=!1,console.log("Kick complete:",{currentKick:this.currentKick,kicksRemaining:this.kicksRemaining,goals:this.score.goals,misses:this.score.misses});const t=this.kicksRemaining===0||this.currentKick>=this.totalKicks;if(console.log("🔍 Checking if level complete:",{currentKick:this.currentKick,totalKicks:this.totalKicks,kicksRemaining:this.kicksRemaining,condition1:this.kicksRemaining===0,condition2:this.currentKick>=this.totalKicks,isLevelComplete:t}),t){console.log("✅✅✅ LEVEL COMPLETE! All kicks finished! ✅✅✅",{currentKick:this.currentKick,totalKicks:this.totalKicks,kicksRemaining:this.kicksRemaining,finalScore:{...this.score}}),this.onLevelComplete();return}this.kicksRemaining>0||this.currentKick<this.totalKicks?(console.log("🔄 Resetting ball position for next kick...",{currentKick:this.currentKick,totalKicks:this.totalKicks,kicksRemaining:this.kicksRemaining}),this.resetBallPosition(),console.log("✅ Ball reset complete, ready for next kick")):console.log("⏸️ Not resetting ball - level complete"),this.onKickCompleteCallback&&this.onKickCompleteCallback({kick:this.currentKick,remaining:this.kicksRemaining,score:this.score,attemptUsed:!1})}resetBallPosition(){this.ball.setPosition(0,.2,2),this.ball.reset(),this.sceneManager&&this.sceneManager.player&&this.sceneManager.player.updatePosition(this.ball.getPosition()),this.stopBall(),this.isBallMoving=!1,this.goalScored=!1,this.missRegistered=!1,this.isCompletingKick=!1,console.log(`Ball reset to fixed position: (0, ${.2}, 2)`),console.log("✅ Ball state reset:",{isBallMoving:this.isBallMoving,goalScored:this.goalScored,missRegistered:this.missRegistered,isCompletingKick:this.isCompletingKick})}onLevelComplete(){if(this.kicksRemaining<0){console.log("⚠️ Level already completed, ignoring duplicate call");return}if(console.log("🎯🎯🎯 onLevelComplete() called! 🎯🎯🎯",{currentKick:this.currentKick,totalKicks:this.totalKicks,kicksRemaining:this.kicksRemaining,score:{...this.score}}),this.kicksRemaining=-1,this.stopBall(),this.score.coins+=5,console.log("✅ Level complete! Bonus: +5 coins",{totalCoins:this.score.coins,goals:this.score.goals,misses:this.score.misses,finalScore:{...this.score}}),this.onLevelCompleteCallback){console.log("✅✅✅ Calling onLevelCompleteCallback with score:",this.score);try{this.onLevelCompleteCallback(this.score),console.log("✅✅✅ onLevelCompleteCallback executed successfully!")}catch(t){console.error("❌❌❌ Error in onLevelCompleteCallback:",t)}}else console.error("❌❌❌ onLevelCompleteCallback is not set! Results screen will not show!")}startLevel(t){this.currentKick=0,this.kicksRemaining=5,this.initialCoins=this.stateManager?this.stateManager.getCoins():0,this.score={goals:0,misses:0,coins:0},this.targetManager&&this.targetManager.createTargetsForLevel(t),this.resetBallPosition()}onKickStart(t){this.onKickStartCallback=t}onKickComplete(t){this.onKickCompleteCallback=t}onGoal(t){this.onGoalCallback=t}onMiss(t){this.onMissCallback=t}onLevelComplete(t){this.onLevelCompleteCallback=t}onTargetHit(t){this.onTargetHitCallback=t}getGameState(){return{currentKick:this.currentKick,kicksRemaining:this.kicksRemaining,isBallMoving:this.isBallMoving,score:this.score}}}class $t{constructor(t="coin",e=new M(0,1,25),i=5){this.type=t,this.position=e.clone(),this.reward=i,this.isHit=!1,this.mesh=null,this.size=.5,this.createMesh()}createMesh(){const t=new $;let e,i;switch(this.type){case"coin":e=new S({color:16766720,metalness:.8,roughness:.2,emissive:16766720,emissiveIntensity:.3}),i=new U(this.size/2,this.size/2,.05,16);break;case"lightning":e=new S({color:16776960,emissive:16776960,emissiveIntensity:.5});const n=new Pt;n.moveTo(0,this.size/2),n.lineTo(-this.size/4,this.size/4),n.lineTo(0,0),n.lineTo(this.size/4,-this.size/4),n.lineTo(0,-this.size/2),n.lineTo(-this.size/4,-this.size/4),n.lineTo(0,0),n.lineTo(this.size/4,this.size/4),n.lineTo(0,this.size/2);const l={depth:.1,bevelEnabled:!1};i=new zt(n,l);break;case"fire":e=new S({color:16729344,emissive:16729344,emissiveIntensity:.6}),i=new it(this.size/2,16,16);break;default:e=new S({color:16766720,metalness:.8,roughness:.2}),i=new U(this.size/2,this.size/2,.05,16)}const s=new f(i,e);s.castShadow=!0,s.receiveShadow=!0;const o=i.clone(),a=new Q({color:e.color,transparent:!0,opacity:.3,side:lt}),r=new f(o,a);r.scale.multiplyScalar(1.2),t.add(r),t.add(s),this.type==="coin"&&(s.rotation.x=Math.PI/2,r.rotation.x=Math.PI/2),this.type==="lightning"&&(s.rotation.z=Math.PI/2),this.mesh=t,this.mesh.position.copy(this.position),this.animationOffset=Math.random()*Math.PI*2}update(t){if(this.isHit||!this.mesh)return;const s=1+Math.sin(Date.now()*.001*2+this.animationOffset)*.1;this.mesh.scale.set(s,s,s),this.type==="coin"&&(this.mesh.rotation.z+=t*.5)}checkCollision(t,e=.11){return this.isHit?!1:t.distanceTo(this.position)<this.size/2+e}hit(){if(this.isHit)return!1;if(this.isHit=!0,this.mesh){const t=this.mesh.scale.x,e=Date.now(),i=300,s=()=>{var n;const o=Date.now()-e,a=Math.min(o/i,1),r=t*(1-a);this.mesh.scale.set(r,r,r),(n=this.mesh.material)==null||n.forEach(l=>{l.opacity!==void 0&&(l.opacity=1-a)}),a<1?requestAnimationFrame(s):this.mesh.visible=!1};s()}return!0}getMesh(){return this.mesh}reset(){var t;this.isHit=!1,this.mesh&&(this.mesh.visible=!0,this.mesh.scale.set(1,1,1),(t=this.mesh.material)==null||t.forEach(e=>{e.opacity!==void 0&&(e.opacity=1)}))}}class Ft{constructor(t,e){this.goal=t,this.scene=e,this.targets=[],this.currentLevel=1}createTargetsForLevel(t){this.clearTargets(),this.currentLevel=t;const e=this.goal.getBounds();e.maxX-e.minX,e.maxY-e.minY;const i=e.maxZ-.5;switch(t){case 1:this.createRandomTargets(e,i,2,3,["coin"]);break;case 2:this.createRandomTargets(e,i,3,4,["coin","lightning"]);break;case 3:this.createRandomTargets(e,i,4,5,["coin","lightning","fire"]);break;case 4:this.createRandomTargets(e,i,5,6,["coin","lightning","fire"]);break;case 5:this.createRandomTargets(e,i,6,8,["coin","lightning","fire"]);break;default:this.createRandomTargets(e,i,2,3,["coin"])}}createRandomTargets(t,e,i,s,o){const a=Math.floor(Math.random()*(s-i+1))+i,r=t.maxX-t.minX,n=t.maxY-t.minY,l=3,h=r/l,d=n/l,u=new Set;for(let p=0;p<a;p++){let x,y,v,k=0;do x=Math.floor(Math.random()*l),y=Math.floor(Math.random()*l),v=`${x},${y}`,k++;while(u.has(v)&&k<50);if(k>=50)continue;u.add(v);const K=t.minX+(x+.5)*h+(Math.random()-.5)*h*.6,P=t.minY+(y+.5)*d+(Math.random()-.5)*d*.6,R=Math.max(t.minX+.5,Math.min(t.maxX-.5,K)),w=Math.max(t.minY+.5,Math.min(t.maxY-.5,P)),B=o[Math.floor(Math.random()*o.length)],F=new $t(B,new M(R,w,e),5);this.targets.push(F),this.scene.add(F.getMesh())}}checkTargetHits(t){const e=[];for(const i of this.targets)i.checkCollision(t)&&(i.hit(),e.push(i));return e}getRewardFromHits(t){return t.reduce((e,i)=>e+i.reward,0)}update(t){for(const e of this.targets)e.update(t)}clearTargets(){for(const t of this.targets)t.mesh&&this.scene&&this.scene.remove(t.mesh);this.targets=[]}resetTargets(){for(const t of this.targets)t.reset()}}class Vt{constructor(t,e,i,s=null,o=null,a=null){this.renderer=t,this.gameLogic=e,this.cameraController=i,this.sceneManager=s,this.inputHandler=o,this.targetManager=a,this.isRunning=!1,this.animationId=null,this.lastTime=0}init(){console.log("Game Engine initialized")}start(){if(this.isRunning)return;this.isRunning=!0,this.isPaused=!1,this.lastTime=performance.now()/1e3;const t=e=>{if(!this.isRunning||this.isPaused){this.isRunning&&(this.animationId=requestAnimationFrame(t));return}const i=e/1e3;let s=i-this.lastTime;this.lastTime=i,s=Math.min(s,.1),this.gameLogic.update(s),this.targetManager&&this.targetManager.update(s),this.cameraController&&this.cameraController.update();try{if(this.sceneManager&&typeof this.sceneManager.getPlayer=="function"){const o=this.sceneManager.getPlayer();o&&o.isAnimating&&typeof o.updateAnimation=="function"&&o.updateAnimation(s)}}catch(o){console.error("Error updating player animation:",o)}this.inputHandler&&this.inputHandler.checkAndExecuteKick(),this.renderer.render(),this.animationId=requestAnimationFrame(t)};this.animationId=requestAnimationFrame(t)}stop(){this.isRunning=!1,this.isPaused=!1,this.animationId&&(cancelAnimationFrame(this.animationId),this.animationId=null)}pause(){this.isPaused=!0}resume(){this.isPaused=!1,this.lastTime=performance.now()/1e3}update(t){this.gameLogic.update(t)}}class It{constructor(t,e,i=null){this.camera=t,this.ball=e,this.player=i,this.initialPosition=new M(0,1.7,-3),this.initialLookAt=new M(0,.5,2)}update(){}reset(){this.camera.position.copy(this.initialPosition),this.camera.lookAt(this.initialLookAt),this.camera.updateMatrixWorld(),console.log("Camera reset to 3D position:",{position:this.camera.position,lookAt:this.initialLookAt})}init(){this.reset()}}class jt{constructor(t="game-container",e=null){this.container=document.getElementById(t),this.audioManager=e,this.hudElement=null,this.createHUD()}createHUD(){this.hudElement=document.createElement("div"),this.hudElement.id="game-hud",this.hudElement.innerHTML=`
      <div class="hud-top-left">
        <div class="hud-item">
          <span class="hud-label">Удар:</span>
          <span class="hud-value" id="kick-counter">1/5</span>
        </div>
        <div class="hud-item">
          <span class="hud-label">Монети:</span>
          <span class="hud-value" id="coin-counter">0</span>
        </div>
      </div>
      <div class="hud-top-right">
        <div class="hud-item">
          <span class="hud-label">Голи:</span>
          <span class="hud-value" id="goal-counter">0</span>
        </div>
        <div class="hud-item">
          <span class="hud-label">Промахи:</span>
          <span class="hud-value" id="miss-counter">0</span>
        </div>
      </div>
      <div class="hud-bottom-right">
        <button id="pause-button" class="pause-button" style="
          background: rgba(0, 0, 0, 0.6);
          border: 2px solid rgba(255, 255, 255, 0.3);
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          font-weight: bold;
          pointer-events: all;
          transition: all 0.3s;
          backdrop-filter: blur(4px);
        ">⏸ Пауза</button>
      </div>
    `;const t=document.createElement("style");t.textContent=`
      #game-hud {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 100;
        font-family: Arial, sans-serif;
        color: white;
      }

      .hud-top-left {
        position: absolute;
        top: 20px;
        left: 20px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .hud-top-right {
        position: absolute;
        top: 20px;
        right: 20px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .hud-bottom-right {
        position: absolute;
        bottom: 20px;
        right: 20px;
      }

      .pause-button:hover {
        background: rgba(0, 0, 0, 0.8) !important;
        border-color: rgba(255, 255, 255, 0.5) !important;
        transform: translateY(-2px);
      }

      .pause-button:active {
        transform: translateY(0);
      }

      .hud-item {
        display: flex;
        align-items: center;
        gap: 8px;
        background: rgba(0, 0, 0, 0.6);
        padding: 8px 16px;
        border-radius: 8px;
        backdrop-filter: blur(4px);
        border: 1px solid rgba(255, 255, 255, 0.2);
      }

      .hud-label {
        font-size: 14px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.8);
      }

      .hud-value {
        font-size: 18px;
        font-weight: bold;
        color: #fff;
      }

      #coin-counter {
        color: #ffd700;
      }
    `,document.head.appendChild(t),this.container.appendChild(this.hudElement)}updateKickCounter(t,e){const i=document.getElementById("kick-counter");i&&(i.textContent=`${t}/${e}`)}updateCoins(t){const e=document.getElementById("coin-counter");e?(console.log("💰 HUD: Updating coin counter:",t,"Type:",typeof t),e.textContent=t,console.log("💰 HUD: Coin counter updated to:",e.textContent),e.style.transform="scale(1.2)",setTimeout(()=>{e.style.transform="scale(1)"},200)):console.error("❌ HUD: Coin counter element not found!")}updateGoals(t){const e=document.getElementById("goal-counter");e?(console.log("Updating goals counter:",t),e.textContent=t,console.log("Goals counter updated to:",e.textContent)):console.error("Goal counter element not found!")}updateMisses(t){const e=document.getElementById("miss-counter");e&&(e.textContent=t)}update(t){t.kick!==void 0&&t.total!==void 0&&this.updateKickCounter(t.kick,t.total),t.coins!==void 0&&this.updateCoins(t.coins),t.goals!==void 0&&this.updateGoals(t.goals),t.misses!==void 0&&this.updateMisses(t.misses)}showRewardNotification(t,e){this.audioManager&&this.audioManager.playSound("coin");const i=document.createElement("div");if(i.className="reward-notification",i.innerHTML=`
      <div class="reward-amount">+${t} монет</div>
      <div class="reward-reason">${e}</div>
    `,!document.getElementById("reward-notification-style")){const s=document.createElement("style");s.id="reward-notification-style",s.textContent=`
        .reward-notification {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(0, 0, 0, 0.8);
          padding: 20px 40px;
          border-radius: 12px;
          text-align: center;
          z-index: 200;
          animation: rewardPop 0.5s ease-out;
          pointer-events: none;
        }

        .reward-amount {
          font-size: 32px;
          font-weight: bold;
          color: #ffd700;
          margin-bottom: 8px;
        }

        .reward-reason {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.9);
        }

        @keyframes rewardPop {
          0% {
            transform: translate(-50%, -50%) scale(0.5);
            opacity: 0;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.1);
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
        }
      `,document.head.appendChild(s)}this.container.appendChild(i),setTimeout(()=>{i.style.animation="rewardPop 0.5s ease-out reverse",setTimeout(()=>{i.parentNode&&i.parentNode.removeChild(i)},500)},2e3)}hide(){this.hudElement&&(this.hudElement.style.display="none")}show(){this.hudElement&&(this.hudElement.style.display="block")}dispose(){this.hudElement&&this.hudElement.parentNode&&this.hudElement.parentNode.removeChild(this.hudElement)}}class Ut{constructor(){this.storageKey="freeKickMaster_save",this.defaultState={coins:0,unlockedLevels:[1],completedLevels:[],purchasedUniforms:[],purchasedBalls:[],selectedUniform:null,selectedBall:null,levelStats:{}},this.state=this.loadState()}loadState(){try{const t=localStorage.getItem(this.storageKey);if(t){const e=JSON.parse(t);return{...this.defaultState,...e}}}catch(t){console.error("Error loading state:",t)}return{...this.defaultState}}saveState(){try{localStorage.setItem(this.storageKey,JSON.stringify(this.state))}catch(t){console.error("Error saving state:",t)}}getProgress(){return{coins:this.state.coins,unlockedLevels:[...this.state.unlockedLevels],completedLevels:[...this.state.completedLevels],purchasedUniforms:[...this.state.purchasedUniforms],purchasedBalls:[...this.state.purchasedBalls],selectedUniform:this.state.selectedUniform,selectedBall:this.state.selectedBall,levelStats:{...this.state.levelStats}}}updateCoins(t){const e=this.state.coins;return this.state.coins=Math.max(0,this.state.coins+t),this.saveState(),console.log("💰 StateManager.updateCoins:",{amount:t,before:e,after:this.state.coins,saved:this.state.coins}),this.state.coins}getCoins(){return this.state.coins}unlockLevel(t){this.state.unlockedLevels.includes(t)||(this.state.unlockedLevels.push(t),this.state.unlockedLevels.sort((e,i)=>e-i),this.saveState())}isLevelUnlocked(t){return this.state.unlockedLevels.includes(t)}completeLevel(t,e=0){this.state.completedLevels.includes(t)||this.state.completedLevels.push(t),this.state.levelStats[t]||(this.state.levelStats[t]={coins:0,bestScore:0,completed:!1}),this.state.levelStats[t].coins=Math.max(this.state.levelStats[t].coins,e),this.state.levelStats[t].completed=!0;const i=t+1;i<=5&&this.unlockLevel(i),this.saveState()}getLevelStats(t){return this.state.levelStats[t]||{coins:0,bestScore:0,completed:!1}}purchaseItem(t,e,i){if(this.state.coins<i)return{success:!1,error:"Недостатньо монет"};const s=t==="uniform"?"purchasedUniforms":"purchasedBalls";return this.state[s].includes(e)?{success:!1,error:"Предмет вже куплено"}:(this.state.coins-=i,this.state[s].push(e),this.saveState(),{success:!0,remainingCoins:this.state.coins})}isItemPurchased(t,e){const i=t==="uniform"?"purchasedUniforms":"purchasedBalls";return this.state[i].includes(e)}selectUniform(t){return this.isItemPurchased("uniform",t)?(this.state.selectedUniform=t,this.saveState(),!0):!1}selectBall(t){return this.isItemPurchased("ball",t)?(this.state.selectedBall=t,this.saveState(),!0):!1}getSelectedUniform(){return this.state.selectedUniform}getSelectedBall(){return this.state.selectedBall}resetProgress(){this.state={...this.defaultState},this.saveState()}getGameState(){return{currentLevel:this.state.currentLevel||null,currentKick:this.state.currentKick||0,score:{goals:this.state.currentGoals||0,misses:this.state.currentMisses||0,coins:this.state.currentCoins||0}}}setGameState(t){var e,i,s;this.state.currentLevel=t.currentLevel,this.state.currentKick=t.currentKick,this.state.currentGoals=((e=t.score)==null?void 0:e.goals)||0,this.state.currentMisses=((i=t.score)==null?void 0:i.misses)||0,this.state.currentCoins=((s=t.score)==null?void 0:s.coins)||0}}class Ht{constructor(t="game-container",e){this.container=document.getElementById(t),this.stateManager=e,this.currentScreen=null,this.screens={},this.init()}init(){this.uiContainer=document.createElement("div"),this.uiContainer.id="ui-container",this.uiContainer.style.cssText=`
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1000;
    `,this.container.appendChild(this.uiContainer)}registerScreen(t,e){this.screens[t]=e}showScreen(t){this.currentScreen&&this.screens[this.currentScreen]&&this.screens[this.currentScreen].hide(),this.screens[t]?(this.screens[t].show(),this.currentScreen=t):console.warn(`Screen ${t} not found`)}hideCurrentScreen(){this.currentScreen&&this.screens[this.currentScreen]&&(this.screens[this.currentScreen].hide(),this.currentScreen=null)}getContainer(){return this.uiContainer}updateHUD(t){this.screens.hud&&this.screens.hud.update(t)}showRewardNotification(t,e){this.screens.hud&&this.screens.hud.showRewardNotification(t,e)}handleMenuNavigation(t,e=null){switch(t){case"start":this.showScreen("levelSelect");break;case"shop":this.showScreen("shop");break;case"settings":this.showScreen("settings");break;case"profile":this.showScreen("profile");break;case"back":this.showScreen("mainMenu"),e&&e.musicEnabled&&e.playMusic("menu",!0);break;case"play":this.hideCurrentScreen();break;default:console.warn(`Unknown navigation action: ${t}`)}}dispose(){Object.values(this.screens).forEach(t=>{t.dispose&&t.dispose()}),this.uiContainer&&this.uiContainer.parentNode&&this.uiContainer.parentNode.removeChild(this.uiContainer)}}class Nt{constructor(t,e,i){this.container=t,this.stateManager=e,this.onNavigate=i,this.element=null,this.createMenu()}createMenu(){this.element=document.createElement("div"),this.element.id="main-menu",this.element.className="screen",this.element.style.cssText=`
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      pointer-events: all;
      z-index: 1001;
      padding: max(20px, 5vh) 20px 20px;
      overflow-y: auto;
      overflow-x: hidden;
    `;const t=this.stateManager.getCoins();this.element.innerHTML=`
      <div class="menu-content" style="
        text-align: center;
        color: white;
        max-width: 600px;
        width: 100%;
        padding: 0;
        margin-top: max(20px, 3vh);
      ">
        <h1 style="
          font-size: clamp(32px, 8vw, 64px);
          margin-bottom: 20px;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
          font-weight: bold;
        ">Free Kick Master</h1>
        
        <div style="
          font-size: clamp(18px, 4vw, 24px);
          margin-bottom: clamp(20px, 5vh, 40px);
          color: #ffd700;
          font-weight: 600;
        ">
          Монети: ${t}
        </div>

        <div class="menu-buttons" style="
          display: flex;
          flex-direction: column;
          gap: clamp(15px, 3vh, 20px);
          width: 100%;
        ">
          <button class="menu-button" data-action="start" style="
            padding: clamp(15px, 3vh, 20px) clamp(30px, 6vw, 40px);
            font-size: clamp(18px, 4vw, 24px);
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
          ">Старт гри</button>
          
          <button class="menu-button" data-action="shop" style="
            padding: clamp(15px, 3vh, 20px) clamp(30px, 6vw, 40px);
            font-size: clamp(18px, 4vw, 24px);
            background: #2196F3;
            color: white;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
          ">Магазин</button>
          
          <button class="menu-button" data-action="settings" style="
            padding: clamp(15px, 3vh, 20px) clamp(30px, 6vw, 40px);
            font-size: clamp(18px, 4vw, 24px);
            background: #FF9800;
            color: white;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
          ">Налаштування</button>
          
          <button class="menu-button" data-action="profile" style="
            padding: clamp(15px, 3vh, 20px) clamp(30px, 6vw, 40px);
            font-size: clamp(18px, 4vw, 24px);
            background: #9C27B0;
            color: white;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
          ">Профіль</button>
        </div>
      </div>
    `;const e=document.createElement("style");e.textContent=`
      .menu-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(0,0,0,0.4) !important;
      }
      .menu-button:active {
        transform: translateY(0);
      }
    `,document.head.appendChild(e),this.element.querySelectorAll(".menu-button").forEach(i=>{i.addEventListener("click",s=>{window.startMenuMusicIfNeeded&&window.startMenuMusicIfNeeded();const o=s.target.getAttribute("data-action");this.onNavigate&&this.onNavigate(o)})}),this.container.appendChild(this.element),this.hide()}show(){if(this.element){this.element.style.display="flex";const t=this.element.querySelector(".menu-content > div");t&&(t.textContent=`Монети: ${this.stateManager.getCoins()}`),window.startMenuMusicIfNeeded&&setTimeout(()=>{window.startMenuMusicIfNeeded()},100)}}hide(){this.element&&(this.element.style.display="none")}dispose(){this.element&&this.element.parentNode&&this.element.parentNode.removeChild(this.element)}}class Ot{constructor(t,e,i,s){this.container=t,this.stateManager=e,this.onLevelSelect=i,this.onBack=s,this.element=null,this.createMenu()}createMenu(){this.element=document.createElement("div"),this.element.id="level-select",this.element.className="screen",this.element.style.cssText=`
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      pointer-events: all;
      z-index: 1001;
      padding: max(20px, 5vh) 20px 20px;
      overflow-y: auto;
      overflow-x: hidden;
    `,this.updateLevels(),this.container.appendChild(this.element),this.hide()}updateLevels(){const t=this.stateManager.getProgress(),e=[1,2,3,4,5];this.element.innerHTML=`
      <div class="level-select-content" style="
        text-align: center;
        color: white;
        max-width: 800px;
        width: 100%;
        margin-top: max(10px, 2vh);
      ">
        <h1 style="
          font-size: clamp(28px, 6vw, 48px);
          margin-bottom: clamp(20px, 4vh, 40px);
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        ">Вибір рівня</h1>
        
        <div class="levels-grid" style="
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
          gap: clamp(10px, 2vw, 20px);
          margin-bottom: clamp(20px, 4vh, 40px);
        ">
          ${e.map(s=>{const o=t.unlockedLevels.includes(s),a=t.completedLevels.includes(s);return`
              <div class="level-card" data-level="${s}" style="
                background: ${o?"rgba(255,255,255,0.2)":"rgba(0,0,0,0.3)"};
                border-radius: 12px;
                padding: clamp(10px, 2vw, 20px);
                cursor: ${o?"pointer":"not-allowed"};
                opacity: ${o?"1":"0.6"};
                transition: all 0.3s;
                border: 2px solid ${o?"#4CAF50":"#666"};
                position: relative;
              ">
                ${o?"":`
                  <div style="
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    font-size: 24px;
                  ">🔒</div>
                `}
                
                <div style="
                  font-size: clamp(32px, 6vw, 48px);
                  margin-bottom: 10px;
                  font-weight: bold;
                ">${s}</div>
                
                <div style="
                  font-size: clamp(12px, 2vw, 14px);
                  margin-bottom: 10px;
                  color: ${a?"#4CAF50":"#ccc"};
                ">
                  ${a?"✓ Завершено":o?"Доступно":"Заблоковано"}
                </div>
              </div>
            `}).join("")}
        </div>

        <button class="back-button" style="
          padding: clamp(12px, 2.5vh, 15px) clamp(25px, 5vw, 30px);
          font-size: clamp(16px, 3.5vw, 20px);
          background: #f44336;
          color: white;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.3s;
        ">Назад</button>
      </div>
    `;const i=document.createElement("style");i.textContent=`
      .level-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 16px rgba(0,0,0,0.3);
      }
      .back-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
      }
    `,document.getElementById("level-select-style")||(i.id="level-select-style",document.head.appendChild(i)),this.element.querySelectorAll(".level-card").forEach(s=>{const o=parseInt(s.getAttribute("data-level"));t.unlockedLevels.includes(o)&&s.addEventListener("click",()=>{this.onLevelSelect&&this.onLevelSelect(o)})}),this.element.querySelector(".back-button").addEventListener("click",()=>{this.onBack&&this.onBack()})}show(){this.element&&(this.element.style.display="flex",this.updateLevels())}hide(){this.element&&(this.element.style.display="none")}dispose(){this.element&&this.element.parentNode&&this.element.parentNode.removeChild(this.element)}}class Yt{constructor(t,e,i,s,o){this.container=t,this.stateManager=e,this.onNext=i,this.onRetry=s,this.onMenu=o,this.element=null,this.createScreen()}createScreen(){this.element=document.createElement("div"),this.element.id="results-screen",this.element.className="screen",this.element.style.cssText=`
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: all;
      z-index: 1002;
    `,this.container.appendChild(this.element),this.hide()}show(t,e){if(!this.element)return;const{goals:i,misses:s,coins:o,totalCoins:a}=e,r=i>=3,n=t+1,l=n<=5;r&&l&&this.stateManager.unlockLevel(n);const h=r?"🎉 Перемога!":"😔 Поразка",d=r?"#4CAF50":"#f44336",u=r?"linear-gradient(135deg, #4CAF50 0%, #45a049 100%)":"linear-gradient(135deg, #f44336 0%, #d32f2f 100%)",p=r?`Вітаємо! Ви забили ${i} голів і пройшли рівень!`:`Ви забили ${i} голів. Для перемоги потрібно мінімум 3 голи.`;this.element.innerHTML=`
      <div class="results-content" style="
        background: ${u};
        border-radius: 20px;
        padding: clamp(20px, 4vh, 40px);
        max-width: 600px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        text-align: center;
        color: white;
        box-shadow: 0 10px 40px rgba(0,0,0,0.5);
        margin: max(20px, 5vh) auto;
      ">
        <h1 style="
          font-size: clamp(32px, 7vw, 56px);
          margin-bottom: clamp(15px, 2vh, 20px);
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
          color: ${d};
        ">${h}</h1>
        
        <p style="
          font-size: clamp(18px, 4vw, 22px);
          margin-bottom: clamp(20px, 3vh, 30px);
          opacity: 0.95;
        ">${p}</p>
        
        <div class="stats" style="
          margin-bottom: clamp(20px, 3vh, 30px);
          font-size: clamp(18px, 4vw, 24px);
          background: rgba(0, 0, 0, 0.2);
          padding: clamp(15px, 3vh, 25px);
          border-radius: 12px;
        ">
          <div style="margin-bottom: 15px;">
            <span style="color: #4CAF50; font-weight: bold;">Голи:</span> ${i}
          </div>
          <div style="margin-bottom: 15px;">
            <span style="color: #f44336; font-weight: bold;">Промахи:</span> ${s}
          </div>
          <div style="margin-bottom: 15px;">
            <span style="color: #ffd700; font-weight: bold;">Зароблено монет:</span> ${o}
          </div>
          <div style="
            margin-top: clamp(15px, 2vh, 20px);
            padding-top: clamp(15px, 2vh, 20px);
            border-top: 2px solid rgba(255,255,255,0.3);
            font-size: clamp(22px, 4.5vw, 28px);
            color: #ffd700;
          ">
            Всього монет: ${a}
          </div>
        </div>

        <div class="buttons" style="
          display: flex;
          gap: clamp(10px, 2vw, 15px);
          justify-content: center;
          flex-wrap: wrap;
        ">
          ${r&&l?`
            <button class="result-button" data-action="next" style="
              padding: clamp(12px, 2.5vh, 15px) clamp(25px, 5vw, 30px);
              font-size: clamp(16px, 3.5vw, 20px);
              background: #4CAF50;
              color: white;
              border: none;
              border-radius: 12px;
              cursor: pointer;
              font-weight: bold;
              transition: all 0.3s;
            ">Наступний рівень</button>
          `:""}
          
          ${r?"":`
            <button class="result-button" data-action="retry" style="
              padding: clamp(12px, 2.5vh, 15px) clamp(25px, 5vw, 30px);
              font-size: clamp(16px, 3.5vw, 20px);
              background: #2196F3;
              color: white;
              border: none;
              border-radius: 12px;
              cursor: pointer;
              font-weight: bold;
              transition: all 0.3s;
            ">Спробувати знову</button>
          `}
          
          <button class="result-button" data-action="menu" style="
            padding: clamp(12px, 2.5vh, 15px) clamp(25px, 5vw, 30px);
            font-size: clamp(16px, 3.5vw, 20px);
            background: #757575;
            color: white;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s;
          ">В меню</button>
        </div>
      </div>
    `;const x=document.createElement("style");x.textContent=`
      .result-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
      }
    `,document.getElementById("results-screen-style")||(x.id="results-screen-style",document.head.appendChild(x)),this.element.querySelectorAll(".result-button").forEach(y=>{y.addEventListener("click",v=>{switch(v.target.getAttribute("data-action")){case"next":this.onNext&&this.onNext(n);break;case"retry":this.onRetry&&this.onRetry(t);break;case"menu":this.onMenu&&this.onMenu();break}})}),this.element.style.display="flex"}hide(){this.element&&(this.element.style.display="none")}dispose(){this.element&&this.element.parentNode&&this.element.parentNode.removeChild(this.element)}}const H=[{id:"default_striped",name:"Смугаста форма",description:"Класична смугаста форма (червона/синя)",price:0,rarity:"basic",jerseyColor:16711680,stripeColor:255,shortsColor:1718876,bootsColor:16711680,hasStripes:!0},{id:"basic_white",name:"Базова біла",description:"Класична біла форма",price:50,rarity:"basic",jerseyColor:16777215,shortsColor:16777215,bootsColor:0,hasStripes:!1},{id:"basic_blue",name:"Базова синя",description:"Класична синя форма",price:50,rarity:"basic",jerseyColor:26316,shortsColor:26316,bootsColor:0,hasStripes:!1},{id:"basic_red",name:"Базова червона",description:"Класична червона форма",price:50,rarity:"basic",jerseyColor:13369344,shortsColor:13369344,bootsColor:0,hasStripes:!1},{id:"rare_gold",name:"Золота форма",description:"Рідкісна золота форма",price:200,rarity:"rare",jerseyColor:16766720,shortsColor:16766720,bootsColor:16766720,hasStripes:!1},{id:"rare_black",name:"Чорна форма",description:"Рідкісна чорна форма",price:200,rarity:"rare",jerseyColor:0,shortsColor:0,bootsColor:0,hasStripes:!1},{id:"premium_rainbow",name:"Веселкова форма",description:"Преміум веселкова форма",price:500,rarity:"premium",jerseyColor:16711935,stripeColor:65535,shortsColor:65280,bootsColor:16776960,hasStripes:!0}];function Wt(){return H}const st=[{id:"classic",name:"Класичний м'яч",description:"Стандартний чорно-білий м'яч",price:0,rarity:"basic",color:16777215,pattern:"classic"},{id:"golden",name:"Золотий м'яч",description:"Золотий м'яч",price:150,rarity:"rare",color:16766720,pattern:"golden"},{id:"red",name:"Червоний м'яч",description:"Червоний м'яч",price:75,rarity:"basic",color:16711680,pattern:"solid"},{id:"blue",name:"Синій м'яч",description:"Синій м'яч",price:75,rarity:"basic",color:255,pattern:"solid"},{id:"heavy",name:"Важкий м'яч",description:"М'яч з важкою фізикою",price:300,rarity:"rare",color:3355443,pattern:"solid",physics:{mass:2}},{id:"light",name:"Легкий м'яч",description:"М'яч з легкою фізикою",price:300,rarity:"rare",color:16777215,pattern:"solid",physics:{mass:.5}},{id:"premium_rainbow",name:"Веселковий м'яч",description:"Преміум веселковий м'яч",price:500,rarity:"premium",color:16711935,pattern:"rainbow"}];function rt(){return st}class Dt{constructor(t){this.stateManager=t}getAvailableUniforms(){return Wt()}getAvailableBalls(){return rt()}purchaseUniform(t){const e=H.find(i=>i.id===t);return e?this.stateManager.purchaseItem("uniform",t,e.price):{success:!1,error:"Форма не знайдена"}}purchaseBall(t){const e=st.find(i=>i.id===t);return e?this.stateManager.purchaseItem("ball",t,e.price):{success:!1,error:"М'яч не знайдено"}}isUniformPurchased(t){return this.stateManager.isItemPurchased("uniform",t)}isBallPurchased(t){return this.stateManager.isItemPurchased("ball",t)}selectUniform(t){return this.stateManager.selectUniform(t)}selectBall(t){return this.stateManager.selectBall(t)}getSelectedUniform(){const t=this.stateManager.getSelectedUniform();return t?H.find(e=>e.id===t):H[0]}getSelectedBall(){const t=this.stateManager.getSelectedBall();return t?st.find(e=>e.id===t):st[0]}}class Xt{constructor(t,e,i){this.container=t,this.stateManager=e,this.onBack=i,this.shopManager=new Dt(e),this.currentTab="uniforms",this.element=null,this.createScreen()}createScreen(){this.element=document.createElement("div"),this.element.id="shop-screen",this.element.className="screen",this.element.style.cssText=`
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      pointer-events: all;
      z-index: 1001;
      padding: max(20px, 5vh) 20px 20px;
      overflow-y: auto;
      overflow-x: hidden;
    `,this.updateContent(),this.container.appendChild(this.element),this.hide()}updateContent(){const t=this.stateManager.getCoins(),e=this.shopManager.getAvailableUniforms(),i=this.shopManager.getAvailableBalls();this.element.innerHTML=`
      <div class="shop-content" style="
        max-width: 1000px;
        width: 100%;
        color: white;
        padding-top: max(10px, 2vh);
      ">
        <h1 style="
          font-size: clamp(28px, 6vw, 42px);
          margin-bottom: clamp(15px, 3vh, 20px);
          text-align: center;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        ">Магазин</h1>
        
        <div style="
          font-size: clamp(20px, 4.5vw, 28px);
          margin-bottom: clamp(15px, 3vh, 20px);
          text-align: center;
          color: #ffd700;
          font-weight: bold;
        ">
          Монети: ${t}
        </div>

        <div class="tabs" style="
          display: flex;
          gap: clamp(10px, 2vw, 15px);
          margin-bottom: clamp(20px, 4vh, 30px);
          justify-content: center;
          flex-wrap: wrap;
        ">
          <button class="tab-button ${this.currentTab==="uniforms"?"active":""}" 
                  data-tab="uniforms" style="
            padding: clamp(10px, 2vh, 12px) clamp(30px, 6vw, 40px);
            font-size: clamp(16px, 3.5vw, 18px);
            background: ${this.currentTab==="uniforms"?"#9C27B0":"rgba(255,255,255,0.2)"};
            color: white;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s;
          ">Форма</button>
          
          <button class="tab-button ${this.currentTab==="balls"?"active":""}" 
                  data-tab="balls" style="
            padding: clamp(10px, 2vh, 12px) clamp(30px, 6vw, 40px);
            font-size: clamp(16px, 3.5vw, 18px);
            background: ${this.currentTab==="balls"?"#4CAF50":"rgba(255,255,255,0.2)"};
            color: white;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s;
          ">М'ячі</button>
        </div>

        <div class="items-grid" style="
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(min(150px, 100%), 1fr));
          gap: clamp(15px, 3vw, 20px);
          margin-bottom: clamp(20px, 4vh, 30px);
          max-height: calc(100vh - 350px);
          overflow-y: auto;
          padding: 10px;
        ">
          ${this.currentTab==="uniforms"?e.map(o=>this.renderUniformItem(o)).join(""):i.map(o=>this.renderBallItem(o)).join("")}
        </div>

        <div style="text-align: center;">
          <button class="back-button" style="
            padding: 15px 30px;
            font-size: 20px;
            background: #f44336;
            color: white;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            font-weight: bold;
          ">Назад</button>
        </div>
      </div>
    `;const s=document.createElement("style");s.textContent=`
      .tab-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
      }
      .tab-button.active {
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
      }
    `,document.getElementById("shop-screen-style")||(s.id="shop-screen-style",document.head.appendChild(s)),this.element.querySelectorAll(".tab-button").forEach(o=>{o.addEventListener("click",a=>{this.currentTab=a.target.getAttribute("data-tab"),this.updateContent()})}),this.element.querySelectorAll(".purchase-button").forEach(o=>{o.addEventListener("click",a=>{const r=a.target.getAttribute("data-item-id"),n=a.target.getAttribute("data-item-type");this.handlePurchase(n,r)})}),this.element.querySelectorAll(".select-button").forEach(o=>{o.addEventListener("click",a=>{const r=a.target.getAttribute("data-item-id"),n=a.target.getAttribute("data-item-type");this.handleSelect(n,r)})}),this.element.querySelector(".back-button").addEventListener("click",()=>{this.onBack&&this.onBack()})}renderUniformItem(t){const e=this.shopManager.isUniformPurchased(t.id),i=this.stateManager.getSelectedUniform()===t.id,s=this.stateManager.getCoins()>=t.price;return`
      <div class="shop-item" style="
        background: rgba(255,255,255,0.1);
        border-radius: 12px;
        padding: 20px;
        text-align: center;
        border: 2px solid ${i?"#4CAF50":"transparent"};
      ">
        <div style="
          width: 80px;
          height: 80px;
          background: ${this.getColorHex(t.jerseyColor||t.color||16777215)};
          border-radius: 50%;
          margin: 0 auto 15px;
          border: 3px solid white;
        "></div>
        
        <div style="font-size: 18px; font-weight: bold; margin-bottom: 5px;">
          ${t.name}
        </div>
        
        <div style="font-size: 14px; color: #ccc; margin-bottom: 10px;">
          ${t.description}
        </div>
        
        <div style="font-size: 20px; color: #ffd700; margin-bottom: 15px; font-weight: bold;">
          ${t.price===0?"Безкоштовно":`${t.price} монет`}
        </div>
        
        ${e?`
          ${i?`
            <div style="color: #4CAF50; font-weight: bold; margin-bottom: 10px;">Обрано</div>
          `:`
            <button class="select-button" 
                    data-item-type="uniform" 
                    data-item-id="${t.id}"
                    style="
              padding: 10px 20px;
              font-size: 16px;
              background: #2196F3;
              color: white;
              border: none;
              border-radius: 8px;
              cursor: pointer;
              width: 100%;
              font-weight: bold;
            ">Обрати</button>
          `}
        `:`
          <button class="purchase-button" 
                  data-item-type="uniform" 
                  data-item-id="${t.id}"
                  style="
            padding: 10px 20px;
            font-size: 16px;
            background: ${s?"#4CAF50":"#666"};
            color: white;
            border: none;
            border-radius: 8px;
            cursor: ${s?"pointer":"not-allowed"};
            width: 100%;
            font-weight: bold;
          ">${t.price===0?"Обрати":"Купити"}</button>
        `}
      </div>
    `}renderBallItem(t){const e=this.shopManager.isBallPurchased(t.id),i=this.stateManager.getSelectedBall()===t.id,s=this.stateManager.getCoins()>=t.price;return`
      <div class="shop-item" style="
        background: rgba(255,255,255,0.1);
        border-radius: 12px;
        padding: 20px;
        text-align: center;
        border: 2px solid ${i?"#4CAF50":"transparent"};
      ">
        <div style="
          width: 80px;
          height: 80px;
          background: ${this.getColorHex(t.color)};
          border-radius: 50%;
          margin: 0 auto 15px;
          border: 3px solid white;
        "></div>
        
        <div style="font-size: 18px; font-weight: bold; margin-bottom: 5px;">
          ${t.name}
        </div>
        
        <div style="font-size: 14px; color: #ccc; margin-bottom: 10px;">
          ${t.description}
        </div>
        
        <div style="font-size: 20px; color: #ffd700; margin-bottom: 15px; font-weight: bold;">
          ${t.price===0?"Безкоштовно":`${t.price} монет`}
        </div>
        
        ${e?`
          ${i?`
            <div style="color: #4CAF50; font-weight: bold; margin-bottom: 10px;">Обрано</div>
          `:`
            <button class="select-button" 
                    data-item-type="ball" 
                    data-item-id="${t.id}"
                    style="
              padding: 10px 20px;
              font-size: 16px;
              background: #2196F3;
              color: white;
              border: none;
              border-radius: 8px;
              cursor: pointer;
              width: 100%;
              font-weight: bold;
            ">Обрати</button>
          `}
        `:`
          <button class="purchase-button" 
                  data-item-type="ball" 
                  data-item-id="${t.id}"
                  style="
            padding: 10px 20px;
            font-size: 16px;
            background: ${s?"#4CAF50":"#666"};
            color: white;
            border: none;
            border-radius: 8px;
            cursor: ${s?"pointer":"not-allowed"};
            width: 100%;
            font-weight: bold;
          ">${t.price===0?"Обрати":"Купити"}</button>
        `}
      </div>
    `}getColorHex(t){return t==null?"#ffffff":"#"+(typeof t=="number"?t:parseInt(t,16)).toString(16).padStart(6,"0")}handlePurchase(t,e){let i;t==="uniform"?i=this.shopManager.purchaseUniform(e):i=this.shopManager.purchaseBall(e),i.success?(alert(`Успішно куплено! Залишилось монет: ${i.remainingCoins}`),this.updateContent()):alert(`Помилка: ${i.error}`)}handleSelect(t,e){let i;t==="uniform"?(i=this.shopManager.selectUniform(e),i&&this.applyUniformToPlayer&&this.applyUniformToPlayer(e)):t==="ball"&&(i=this.shopManager.selectBall(e),i&&this.applyBallToGame&&this.applyBallToGame(e)),i&&this.updateContent()}show(){this.element&&(this.element.style.display="flex",this.updateContent())}hide(){this.element&&(this.element.style.display="none")}dispose(){this.element&&this.element.parentNode&&this.element.parentNode.removeChild(this.element)}}class qt{constructor(t,e,i){this.container=t,this.stateManager=e,this.onBack=i,this.element=null,this.createScreen()}createScreen(){this.element=document.createElement("div"),this.element.id="profile-screen",this.element.className="screen",this.element.style.cssText=`
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      pointer-events: all;
      z-index: 1001;
      padding: max(20px, 5vh) 20px 20px;
      overflow-y: auto;
      overflow-x: hidden;
    `,this.updateContent(),this.container.appendChild(this.element),this.hide()}updateContent(){const t=this.stateManager.getProgress(),e=this.stateManager.getCoins(),i=t.completedLevels.length;t.unlockedLevels.length;let s=0;Object.keys(t.levelStats).forEach(a=>{const r=t.levelStats[a];s+=Math.floor((r.coins||0)/10)}),this.element.innerHTML=`
      <div class="profile-content" style="
        max-width: 800px;
        width: 100%;
        color: white;
        text-align: center;
        margin-top: max(10px, 2vh);
      ">
        <h1 style="
          font-size: clamp(28px, 6vw, 48px);
          margin-bottom: clamp(20px, 4vh, 40px);
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        ">Профіль гравця</h1>
        
        <div class="profile-stats" style="
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: clamp(15px, 3vw, 20px);
          margin-bottom: clamp(20px, 4vh, 40px);
        ">
          <div class="stat-card" style="
            background: rgba(255,255,255,0.2);
            border-radius: 12px;
            padding: clamp(15px, 3vw, 20px);
          ">
            <div style="font-size: clamp(20px, 4vw, 24px); color: #ffd700; font-weight: bold; margin-bottom: 10px;">
              ${e}
            </div>
            <div style="font-size: clamp(14px, 3vw, 18px);">Монети</div>
          </div>
          
          <div class="stat-card" style="
            background: rgba(255,255,255,0.2);
            border-radius: 12px;
            padding: clamp(15px, 3vw, 20px);
          ">
            <div style="font-size: clamp(20px, 4vw, 24px); color: #4CAF50; font-weight: bold; margin-bottom: 10px;">
              ${i}/5
            </div>
            <div style="font-size: clamp(14px, 3vw, 18px);">Пройдено рівнів</div>
          </div>
          
          <div class="stat-card" style="
            background: rgba(255,255,255,0.2);
            border-radius: 12px;
            padding: clamp(15px, 3vw, 20px);
          ">
            <div style="font-size: clamp(20px, 4vw, 24px); color: #2196F3; font-weight: bold; margin-bottom: 10px;">
              ${s}
            </div>
            <div style="font-size: clamp(14px, 3vw, 18px);">Забито голів</div>
          </div>
          
          <div class="stat-card" style="
            background: rgba(255,255,255,0.2);
            border-radius: 12px;
            padding: clamp(15px, 3vw, 20px);
          ">
            <div style="font-size: clamp(20px, 4vw, 24px); color: #f44336; font-weight: bold; margin-bottom: 10px;">
              ${t.purchasedUniforms.length+t.purchasedBalls.length}
            </div>
            <div style="font-size: clamp(14px, 3vw, 18px);">Куплено предметів</div>
          </div>
        </div>

        <div class="level-progress" style="
          background: rgba(255,255,255,0.2);
          border-radius: 12px;
          padding: clamp(20px, 4vw, 30px);
          margin-bottom: clamp(20px, 4vh, 30px);
        ">
          <h2 style="font-size: clamp(20px, 4.5vw, 28px); margin-bottom: clamp(15px, 3vh, 20px);">Прогрес по рівнях</h2>
          ${[1,2,3,4,5].map(a=>{const r=this.stateManager.getLevelStats(a),n=t.completedLevels.includes(a),l=t.unlockedLevels.includes(a);return`
              <div style="
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: clamp(12px, 2.5vw, 15px);
                margin-bottom: 10px;
                background: rgba(255,255,255,0.1);
                border-radius: 8px;
                flex-wrap: wrap;
                gap: 10px;
              ">
                <div style="font-size: clamp(16px, 3.5vw, 20px); font-weight: bold;">
                  Рівень ${a}
                  ${n?" ✓":l?"":" 🔒"}
                </div>
                <div style="font-size: clamp(14px, 3vw, 18px); color: #ffd700;">
                  ${r.coins||0} монет
                </div>
              </div>
            `}).join("")}
        </div>

        <div class="inventory" style="
          background: rgba(255,255,255,0.2);
          border-radius: 12px;
          padding: clamp(20px, 4vw, 30px);
          margin-bottom: clamp(20px, 4vh, 30px);
        ">
          <h2 style="font-size: clamp(20px, 4.5vw, 28px); margin-bottom: clamp(15px, 3vh, 20px);">Інвентар</h2>
          
          <div style="margin-bottom: clamp(15px, 3vh, 20px);">
            <h3 style="font-size: clamp(16px, 3.5vw, 20px); margin-bottom: 10px;">Обрана форма:</h3>
            <div style="font-size: clamp(14px, 3vw, 18px); color: #4CAF50;">
              ${t.selectedUniform?`ID: ${t.selectedUniform}`:"Базова біла"}
            </div>
          </div>
          
          <div>
            <h3 style="font-size: clamp(16px, 3.5vw, 20px); margin-bottom: 10px;">Обраний м'яч:</h3>
            <div style="font-size: clamp(14px, 3vw, 18px); color: #4CAF50;">
              ${t.selectedBall?`ID: ${t.selectedBall}`:"Класичний"}
            </div>
          </div>
        </div>

        <button class="back-button" style="
          padding: clamp(12px, 2.5vh, 15px) clamp(25px, 5vw, 30px);
          font-size: clamp(16px, 3.5vw, 20px);
          background: #f44336;
          color: white;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.3s;
        ">Назад</button>
      </div>
    `;const o=document.createElement("style");o.textContent=`
      .back-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
      }
    `,document.getElementById("profile-screen-style")||(o.id="profile-screen-style",document.head.appendChild(o)),this.element.querySelector(".back-button").addEventListener("click",()=>{this.onBack&&this.onBack()})}show(){this.element&&(this.element.style.display="flex",this.updateContent())}hide(){this.element&&(this.element.style.display="none")}dispose(){this.element&&this.element.parentNode&&this.element.parentNode.removeChild(this.element)}}class Zt{constructor(t,e,i,s){this.container=t,this.stateManager=e,this.audioManager=i,this.onBack=s,this.element=null,this.createScreen()}createScreen(){this.element=document.createElement("div"),this.element.id="settings-screen",this.element.className="screen",this.element.style.cssText=`
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      pointer-events: all;
      z-index: 1001;
      padding: max(20px, 5vh) 20px 20px;
      overflow-y: auto;
      overflow-x: hidden;
    `,this.updateContent(),this.container.appendChild(this.element),this.hide()}updateContent(){const t=this.audioManager?this.audioManager.getSettings():{masterVolume:1,soundVolume:1,musicVolume:.5,musicEnabled:!0,soundsEnabled:!0};this.element.innerHTML=`
      <div class="settings-content" style="
        max-width: 600px;
        width: 100%;
        color: white;
        margin-top: max(10px, 2vh);
      ">
        <h1 style="
          font-size: clamp(28px, 6vw, 48px);
          margin-bottom: clamp(20px, 4vh, 40px);
          text-align: center;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        ">Налаштування</h1>
        
        <div class="settings-section" style="
          background: rgba(255,255,255,0.2);
          border-radius: 12px;
          padding: 30px;
          margin-bottom: 30px;
        ">
          <h2 style="font-size: 28px; margin-bottom: 20px;">Аудіо</h2>
          
          <div class="setting-item" style="margin-bottom: 25px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <label style="font-size: 18px;">Загальна гучність</label>
              <span id="master-volume-value" style="font-size: 18px; font-weight: bold; min-width: 50px; text-align: right;">
                ${Math.round(t.masterVolume*100)}%
              </span>
            </div>
            <input type="range" id="master-volume" min="0" max="100" value="${t.masterVolume*100}" 
                   style="width: 100%; height: 8px; border-radius: 4px; outline: none;">
          </div>
          
          <div class="setting-item" style="margin-bottom: clamp(20px, 4vh, 25px);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; flex-wrap: wrap; gap: 10px;">
              <label style="font-size: clamp(14px, 3vw, 18px);">Гучність звуків</label>
              <span id="sound-volume-value" style="font-size: clamp(14px, 3vw, 18px); font-weight: bold; min-width: 50px; text-align: right;">
                ${Math.round(t.soundVolume*100)}%
              </span>
            </div>
            <input type="range" id="sound-volume" min="0" max="100" value="${t.soundVolume*100}" 
                   style="width: 100%; height: 8px; border-radius: 4px; outline: none;">
          </div>
          
          <div class="setting-item" style="margin-bottom: clamp(20px, 4vh, 25px);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; flex-wrap: wrap; gap: 10px;">
              <label style="font-size: clamp(14px, 3vw, 18px);">Гучність музики</label>
              <span id="music-volume-value" style="font-size: clamp(14px, 3vw, 18px); font-weight: bold; min-width: 50px; text-align: right;">
                ${Math.round(t.musicVolume*100)}%
              </span>
            </div>
            <input type="range" id="music-volume" min="0" max="100" value="${t.musicVolume*100}" 
                   style="width: 100%; height: 8px; border-radius: 4px; outline: none;">
          </div>
          
          <div class="setting-item" style="margin-bottom: clamp(12px, 2.5vh, 15px);">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
              <label style="font-size: clamp(14px, 3vw, 18px);">Увімкнути музику</label>
              <input type="checkbox" id="music-enabled" ${t.musicEnabled?"checked":""} 
                     style="width: 24px; height: 24px; cursor: pointer;">
            </div>
          </div>
          
          <div class="setting-item" style="margin-bottom: clamp(12px, 2.5vh, 15px);">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
              <label style="font-size: clamp(14px, 3vw, 18px);">Увімкнути звуки</label>
              <input type="checkbox" id="sounds-enabled" ${t.soundsEnabled?"checked":""} 
                     style="width: 24px; height: 24px; cursor: pointer;">
            </div>
          </div>
        </div>

        <div class="settings-section" style="
          background: rgba(255,255,255,0.2);
          border-radius: 12px;
          padding: clamp(20px, 4vw, 30px);
          margin-bottom: clamp(20px, 4vh, 30px);
        ">
          <h2 style="font-size: clamp(20px, 4.5vw, 28px); margin-bottom: clamp(15px, 3vh, 20px);">Гра</h2>
          
          <div class="setting-item" style="margin-bottom: clamp(15px, 3vh, 20px);">
            <button id="reset-progress" style="
              padding: clamp(12px, 2.5vh, 15px) clamp(25px, 5vw, 30px);
              font-size: clamp(14px, 3vw, 18px);
              background: #f44336;
              color: white;
              border: none;
              border-radius: 12px;
              cursor: pointer;
              font-weight: bold;
              width: 100%;
              transition: all 0.3s;
            ">Скинути прогрес</button>
          </div>
        </div>

        <div style="text-align: center;">
          <button class="back-button" style="
            padding: clamp(12px, 2.5vh, 15px) clamp(25px, 5vw, 30px);
            font-size: clamp(16px, 3.5vw, 20px);
            background: #2196F3;
            color: white;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s;
          ">Назад</button>
        </div>
      </div>
    `;const e=document.createElement("style");e.textContent=`
      .back-button:hover, #reset-progress:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
      }
      input[type="range"] {
        -webkit-appearance: none;
        appearance: none;
        background: rgba(255,255,255,0.3);
      }
      input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 20px;
        height: 20px;
        background: #4CAF50;
        border-radius: 50%;
        cursor: pointer;
      }
      input[type="range"]::-moz-range-thumb {
        width: 20px;
        height: 20px;
        background: #4CAF50;
        border-radius: 50%;
        cursor: pointer;
        border: none;
      }
    `,document.getElementById("settings-screen-style")||(e.id="settings-screen-style",document.head.appendChild(e)),this.setupEventListeners()}setupEventListeners(){const t=this.element.querySelector("#master-volume"),e=this.element.querySelector("#master-volume-value");t&&this.audioManager&&t.addEventListener("input",h=>{const d=parseInt(h.target.value)/100;this.audioManager.setMasterVolume(d),this.audioManager.saveSettings(),e.textContent=Math.round(d*100)+"%"});const i=this.element.querySelector("#sound-volume"),s=this.element.querySelector("#sound-volume-value");i&&this.audioManager&&i.addEventListener("input",h=>{const d=parseInt(h.target.value)/100;this.audioManager.setSoundVolume(d),this.audioManager.saveSettings(),s.textContent=Math.round(d*100)+"%"});const o=this.element.querySelector("#music-volume"),a=this.element.querySelector("#music-volume-value");o&&this.audioManager&&o.addEventListener("input",h=>{const d=parseInt(h.target.value)/100;this.audioManager.setMusicVolume(d),this.audioManager.saveSettings(),a.textContent=Math.round(d*100)+"%"});const r=this.element.querySelector("#music-enabled");r&&this.audioManager&&r.addEventListener("change",h=>{this.audioManager.setMusicEnabled(h.target.checked),this.audioManager.saveSettings()});const n=this.element.querySelector("#sounds-enabled");n&&this.audioManager&&n.addEventListener("change",h=>{this.audioManager.setSoundsEnabled(h.target.checked),this.audioManager.saveSettings()});const l=this.element.querySelector("#reset-progress");l&&l.addEventListener("click",()=>{confirm("Ви впевнені, що хочете скинути весь прогрес? Цю дію неможливо скасувати.")&&(this.stateManager.resetProgress(),alert("Прогрес скинуто!"),this.updateContent())}),this.element.querySelector(".back-button").addEventListener("click",()=>{this.onBack&&this.onBack()})}show(){this.element&&(this.element.style.display="flex",this.updateContent())}hide(){this.element&&(this.element.style.display="none")}dispose(){this.element&&this.element.parentNode&&this.element.parentNode.removeChild(this.element)}}class _t{constructor(t,e,i,s){this.container=t,this.onResume=e,this.onMenu=i,this.onRestart=s,this.element=null,this.createScreen()}createScreen(){this.element=document.createElement("div"),this.element.id="pause-screen",this.element.className="screen",this.element.style.cssText=`
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: all;
      z-index: 2000;
    `,this.element.innerHTML=`
      <div class="pause-content" style="
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 20px;
        padding: clamp(30px, 6vw, 50px);
        max-width: 500px;
        width: 90%;
        text-align: center;
        color: white;
        box-shadow: 0 10px 40px rgba(0,0,0,0.5);
      ">
        <h1 style="
          font-size: clamp(32px, 6vw, 48px);
          margin-bottom: clamp(20px, 4vh, 30px);
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        ">Пауза</h1>
        
        <div class="pause-buttons" style="
          display: flex;
          flex-direction: column;
          gap: clamp(15px, 3vh, 20px);
        ">
          <button class="pause-button" data-action="resume" style="
            padding: clamp(15px, 3vh, 20px) clamp(30px, 6vw, 40px);
            font-size: clamp(18px, 4vw, 24px);
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
          ">Продовжити</button>
          
          <button class="pause-button" data-action="restart" style="
            padding: clamp(15px, 3vh, 20px) clamp(30px, 6vw, 40px);
            font-size: clamp(18px, 4vw, 24px);
            background: #FF9800;
            color: white;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
          ">Перезапустити</button>
          
          <button class="pause-button" data-action="menu" style="
            padding: clamp(15px, 3vh, 20px) clamp(30px, 6vw, 40px);
            font-size: clamp(18px, 4vw, 24px);
            background: #f44336;
            color: white;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
          ">Вихід в меню</button>
        </div>
        
        <div style="
          margin-top: clamp(20px, 4vh, 30px);
          font-size: clamp(12px, 2.5vw, 14px);
          color: rgba(255,255,255,0.7);
        ">
          Натисніть ESC для продовження
        </div>
      </div>
    `;const t=document.createElement("style");t.textContent=`
      .pause-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(0,0,0,0.4) !important;
      }
      .pause-button:active {
        transform: translateY(0);
      }
    `,document.getElementById("pause-screen-style")||(t.id="pause-screen-style",document.head.appendChild(t)),this.element.querySelectorAll(".pause-button").forEach(e=>{e.addEventListener("click",i=>{const s=i.target.getAttribute("data-action");s==="resume"&&this.onResume?this.onResume():s==="restart"&&this.onRestart?this.onRestart():s==="menu"&&this.onMenu&&this.onMenu()})}),this.container.appendChild(this.element),this.hide()}show(){this.element&&(this.element.style.display="flex")}hide(){this.element&&(this.element.style.display="none")}dispose(){this.element&&this.element.parentNode&&this.element.parentNode.removeChild(this.element)}}class Jt{constructor(){this.sounds={},this.music=null,this.musicAudio=null,this.masterVolume=1,this.soundVolume=1,this.musicVolume=.5,this.musicEnabled=!1,this.soundsEnabled=!0;try{this.audioContext=new(window.AudioContext||window.webkitAudioContext)}catch{console.warn("Web Audio API not supported, using HTML5 Audio"),this.audioContext=null}this.loadSounds()}loadSounds(){const t="/src/audio/sounds/378e471317469fa.mp3",e={kick:t,goal:t,miss:t,coin:t,click:t,menu:t};Object.keys(e).forEach(i=>{this.sounds[i]={url:e[i],audio:null,loaded:!1},this.preloadSound(i)})}preloadSound(t){if(this.sounds[t])try{const e=new Audio(this.sounds[t].url);e.preload="auto",e.volume=this.soundVolume*this.masterVolume,e.addEventListener("canplaythrough",()=>{this.sounds[t].loaded=!0}),e.addEventListener("error",()=>{console.warn(`Sound ${t} failed to load, will use silent fallback`),this.sounds[t].loaded=!1}),this.sounds[t].audio=e}catch(e){console.warn(`Error preloading sound ${t}:`,e),this.sounds[t].loaded=!1}}playSound(t,e=1){if(!(!this.soundsEnabled||!this.masterVolume)){if(!this.sounds[t]){console.warn(`Sound ${t} not found`);return}try{const i=this.sounds[t];let s;i.audio?s=i.audio.cloneNode():(s=new Audio(i.url),i.audio=s),s.volume=this.soundVolume*this.masterVolume*e,s.play().catch(o=>{console.warn(`Failed to play sound ${t}:`,o)})}catch(i){console.warn(`Error playing sound ${t}:`,i)}}}playMusic(t,e=!0){if(!this.musicEnabled||!this.masterVolume){console.log("Music disabled or volume is 0");return}const i=document.getElementById("game-hud");if(i&&i.style.display!=="none"){console.log("Game is active, music will not play");return}this.stopMusic();const s="/src/audio/sounds/378e471317469fa.mp3";try{this.musicAudio=new Audio(s),this.musicAudio.loop=e,this.musicAudio.volume=this.musicVolume*this.masterVolume,this.musicAudio.addEventListener("error",a=>{console.warn(`Music ${t} failed to load:`,a),this.musicAudio=null}),this.musicAudio.addEventListener("loadeddata",()=>{console.log("Music loaded, attempting to play...")}),this.music=t;const o=this.musicAudio.play();o!==void 0?o.then(()=>{console.log(`Music ${t} started successfully`)}).catch(a=>{console.log("Music autoplay prevented (will play on user interaction):",a.name)}):console.log("Music play() returned undefined (older browser)")}catch(o){console.warn(`Error playing music ${t}:`,o)}}resumeMusic(){const t=document.getElementById("game-hud");if(t&&t.style.display!=="none"){console.log("Game is active, music will not resume");return}this.music&&this.musicAudio&&this.musicEnabled?this.musicAudio.paused?(console.log("Resuming paused music..."),this.musicAudio.play().then(()=>{console.log("Music resumed successfully")}).catch(e=>{console.warn("Failed to resume music:",e)})):console.log("Music is already playing"):console.log("Cannot resume music:",{hasMusic:!!this.music,hasAudio:!!this.musicAudio,enabled:this.musicEnabled})}isMusicPlaying(){return this.musicAudio&&!this.musicAudio.paused&&!this.musicAudio.ended}stopMusic(){this.musicAudio&&(this.musicAudio.pause(),this.musicAudio.currentTime=0,this.musicAudio.onplay=null,this.musicAudio.onpause=null,this.musicAudio.onended=null,this.musicAudio=null,this.music=null,console.log("Music stopped"))}setMasterVolume(t){this.masterVolume=Math.max(0,Math.min(1,t)),this.updateVolumes()}setSoundVolume(t){this.soundVolume=Math.max(0,Math.min(1,t)),this.updateVolumes()}setMusicVolume(t){this.musicVolume=Math.max(0,Math.min(1,t)),this.musicAudio&&(this.musicAudio.volume=this.musicVolume*this.masterVolume)}updateVolumes(){this.musicAudio&&(this.musicAudio.volume=this.musicVolume*this.masterVolume),Object.keys(this.sounds).forEach(t=>{this.sounds[t].audio&&(this.sounds[t].audio.volume=this.soundVolume*this.masterVolume)})}setMusicEnabled(t){this.musicEnabled=t,t?this.music&&this.playMusic(this.music,!0):this.stopMusic()}setSoundsEnabled(t){this.soundsEnabled=t}getSettings(){return{masterVolume:this.masterVolume,soundVolume:this.soundVolume,musicVolume:this.musicVolume,musicEnabled:this.musicEnabled,soundsEnabled:this.soundsEnabled}}loadSettings(){try{const t=localStorage.getItem("freeKickMaster_audioSettings");if(t){const e=JSON.parse(t);this.masterVolume=e.masterVolume??1,this.soundVolume=e.soundVolume??1,this.musicVolume=e.musicVolume??.5,this.musicEnabled=e.musicEnabled??!0,this.soundsEnabled=e.soundsEnabled??!0,this.updateVolumes()}}catch(t){console.warn("Error loading audio settings:",t)}}saveSettings(){try{localStorage.setItem("freeKickMaster_audioSettings",JSON.stringify({masterVolume:this.masterVolume,soundVolume:this.soundVolume,musicVolume:this.musicVolume,musicEnabled:this.musicEnabled,soundsEnabled:this.soundsEnabled}))}catch(t){console.warn("Error saving audio settings:",t)}}dispose(){this.stopMusic(),Object.values(this.sounds).forEach(t=>{t.audio&&(t.audio.pause(),t.audio=null)}),this.sounds={}}}console.log("Free Kick Master - Game Starting...");document.addEventListener("DOMContentLoaded",()=>{const b=document.getElementById("game-container");if(!b){console.error("Game container not found!");return}try{const t=new Ut,e=new Jt;e.loadSettings();let i=!1;const s=()=>{if(i){e.musicAudio&&e.musicAudio.paused&&e.resumeMusic();return}e.musicEnabled&&(e.playMusic("menu",!0),i=!0,console.log("Menu music started"))};window.startMenuMusicIfNeeded=s;let o=null,a=!1,r=!1;o=c=>{if(a)return;const m=document.getElementById("game-hud");m&&m.style.display!=="none"||r||i||(console.log("User interaction detected, starting music..."),s(),document.removeEventListener("click",o,!0),document.removeEventListener("touchstart",o,!0),document.removeEventListener("keydown",o,!0),document.removeEventListener("mousedown",o,!0),r=!0)};const n=new Ht("game-container",t),l=["mainMenu","levelSelect","shop","settings","profile"],h=["hud","results","pause"],d=n.showScreen.bind(n);n.showScreen=function(c){d(c),h.includes(c)&&e&&(e.stopMusic(),console.log("Music stopped - game screen active:",c))};const u=new Lt(b);u.init();const p=new Kt(u);p.init();const x=p.getBall(),y=p.getGoal(),v=new Ft(y,u.getScene()),k=new Bt(x,y,p,t,v);let K=v;const P=new jt("game-container",e);n.registerScreen("hud",P);let R=1,w=null,B=null,F=null,G=!1,E=null;const V=c=>{R=c,G=!1,e&&(e.stopMusic(),console.log("Music stopped for level start")),o&&!r&&(document.removeEventListener("click",o,!0),document.removeEventListener("touchstart",o,!0),document.removeEventListener("keydown",o,!0),document.removeEventListener("mousedown",o,!0),r=!0),a=!0,n.hideCurrentScreen(),E&&E.hide(),n.showScreen("hud"),k.startLevel(c);const m=t.getCoins();P.update({kick:1,total:5,coins:m,goals:0,misses:0});const g=p.getPlayer(),z=t.getSelectedUniform(),C=H.find(I=>I.id===z)||H[0];g&&C&&(console.log("Applying uniform to player:",C),g.applyUniform(C));const A=t.getSelectedBall(),T=rt(),Z=T.find(I=>I.id===A)||T[0],ct=p.getBall();if(ct&&Z){console.log("Applying ball style:",Z);const I={color:Z.color,patternColor:Z.pattern==="classic"?0:Z.patternColor||0,hasPattern:Z.pattern!=="solid"};ct.applyBallStyle(I)}B=new Gt(u,u.camera,u.scene,x,g),B.init(),B.onKick(I=>{e.playSound("kick"),k.processKick(I.direction,I.power,I.swipeSpeed||0)}),F=new It(u.camera,x,g),F.init(),w&&w.stop(),w=new Vt(u,k,F,p,B,K),w.init(),w.start(),N()},N=()=>{const c=g=>{(g.key==="Escape"||g.key==="Esc")&&O()};document.removeEventListener("keydown",c),document.addEventListener("keydown",c);const m=document.getElementById("pause-button");m&&(m.onclick=()=>{O()})},O=()=>{!w||!w.isRunning||(G=!G,G?(w.pause(),E&&E.show()):(w.resume(),E&&E.hide(),e&&e.stopMusic()))},ot=()=>{G=!1,w&&w.resume(),E&&E.hide(),e&&e.stopMusic()},_=()=>{w&&w.stop(),a=!1,E&&E.hide(),n.hideCurrentScreen(),n.showScreen("mainMenu")},nt=()=>{w&&w.stop(),i&&e.musicAudio&&e.musicAudio.paused&&e.resumeMusic(),n.hideCurrentScreen(),n.showScreen("mainMenu")};k.onKickStart(c=>{console.log("Kick started:",c),P&&P.update({kick:c.kick,total:c.total,coins:t?t.getCoins():c.score.coins,goals:c.score.goals,misses:c.score.misses})}),k.onKickComplete(c=>{console.log("Kick complete callback:",c);const m=k.getGameState();if(t){const z=k.initialCoins||0,C=c.score.coins,A=z+C,T=t.getCoins();T!==A&&(console.log("Updating coins in state manager:",{currentCoins:T,targetTotal:A,difference:A-T}),t.updateCoins(A-T))}const g={kick:m.currentKick,total:5,remaining:m.kicksRemaining,coins:t?t.getCoins():m.score.coins,goals:m.score.goals,misses:m.score.misses};console.log("🔄 Refreshing HUD after kick complete (no value changes):",g),P.update(g),console.log("✅ HUD refreshed after kick complete:",{kick:g.kick,remaining:g.remaining,coins:g.coins,goals:g.goals,misses:g.misses})}),k.onTargetHit((c,m)=>{P&&P.showRewardNotification(`Мішень! +${m} монет`),e&&e.playSound("coin")}),k.onGoal(c=>{if(console.log("🎯 GOAL callback triggered! Score object:",c),console.log("🎯 Score.goals value:",c.goals),console.log("🎯 Score type:",typeof c),console.log("🎯 Score keys:",Object.keys(c)),e.playSound("goal"),t){const z=t.getCoins();t.updateCoins(10),console.log("Coins updated:",z,"->",t.getCoins())}const m=k.getGameState();console.log("🎯 Game state goals:",m.score.goals);const g={kick:m.currentKick,total:5,remaining:m.kicksRemaining,coins:t?t.getCoins():c.coins,goals:c.goals||m.score.goals||0,misses:c.misses||m.score.misses||0};console.log("🎯 Updating HUD with data:",g),P.update(g),P.showRewardNotification(10,"Гол!"),console.log("✅ HUD updated after goal:",{goals:g.goals,misses:g.misses,coins:g.coins,remaining:g.remaining})}),k.onMiss(c=>{console.log("MISS callback! Score:",c),e.playSound("miss");const m=k.getGameState();P.update({kick:m.currentKick,total:5,remaining:m.kicksRemaining,coins:t?t.getCoins():c.coins,goals:c.goals,misses:c.misses}),console.log("HUD updated after miss:",{goals:c.goals,misses:c.misses,coins:t?t.getCoins():c.coins,remaining:m.kicksRemaining})}),k.onLevelComplete(c=>{if(console.log("🎉🎉🎉 Level complete callback triggered! Final score:",c),console.log("🎉 Score details:",{goals:c.goals,misses:c.misses,coins:c.coins}),w&&(w.stop(),console.log("✅ Game engine stopped")),a=!1,t){const g=k.initialCoins||0,z=c.coins,C=g+z,A=t.getCoins();A!==C&&t.updateCoins(C-A),t.completeLevel(R,z),console.log("✅ Level completion saved to state manager")}e.playSound("coin"),n.hideCurrentScreen(),console.log("✅ HUD hidden");const m=n.screens.results;if(m){const g=t?t.getCoins():c.coins;console.log("✅✅✅ Showing results screen:",{level:R,goals:c.goals,misses:c.misses,coins:c.coins,totalCoins:g}),n.showScreen("results"),m.show(R,{goals:c.goals,misses:c.misses,coins:c.coins,totalCoins:g}),console.log("✅✅✅ Results screen shown and displayed!")}else console.error("❌❌❌ Results screen not found in uiManager.screens!"),console.error("Available screens:",Object.keys(n.screens||{}))});const X=new Nt(n.getContainer(),t,c=>{n.handleMenuNavigation(c,e)});n.registerScreen("mainMenu",X);const J=new Ot(n.getContainer(),t,c=>{V(c)},()=>{n.showScreen("mainMenu")});n.registerScreen("levelSelect",J);const Y=new Yt(n.getContainer(),t,c=>{V(c)},c=>{V(c)},()=>{n.showScreen("mainMenu")});n.registerScreen("results",Y);const j=new Xt(n.getContainer(),t,()=>{n.showScreen("mainMenu")});j.applyUniformToPlayer=c=>{const m=H.find(z=>z.id===c)||H[0],g=p?p.getPlayer():null;g&&m&&(console.log("Applying uniform to player from shop:",m),g.applyUniform(m))},j.applyBallToGame=c=>{const m=rt(),g=m.find(C=>C.id===c)||m[0],z=p?p.getBall():null;if(z&&g){console.log("Applying ball style from shop:",g);const C={color:g.color,patternColor:g.pattern==="classic"?0:g.patternColor||0,hasPattern:g.pattern!=="solid"};z.applyBallStyle(C)}},n.registerScreen("shop",j);const tt=new qt(n.getContainer(),t,()=>{n.showScreen("mainMenu")});n.registerScreen("profile",tt);const q=new Zt(n.getContainer(),t,e,()=>{n.showScreen("mainMenu")});n.registerScreen("settings",q);const et=()=>{R&&(w&&w.stop(),a=!1,G=!1,E&&E.hide(),V(R))};E=new _t(n.getContainer(),ot,_,et),n.showScreen("mainMenu"),console.log("Game initialized successfully!")}catch(t){console.error("Error initializing game:",t)}});
