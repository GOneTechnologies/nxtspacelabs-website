/* ═══════════════════════════════════════════════════════════════
   NextSpace Labs — lightweight persistent scene for sub-pages
   Aurora blob + twinkling stars, no globe / butterfly / idle logo.
   © 2026 NextSpace Labs Private Limited · Original code
   Three.js r166 (MIT) · Simplex noise (public domain, Ashima Arts)
   ═══════════════════════════════════════════════════════════════ */

import * as THREE from 'three';

(function initSceneLite() {
  const canvas = document.getElementById('scene');
  if (!canvas) return;
  // Skip WebGL entirely if unsupported OR user requests reduced motion —
  // premium.js adds body.no-webgl which the CSS uses to show a static gradient.
  if (document.body.classList.contains('no-webgl')) return;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 3000);
  camera.position.set(0, 0, 700);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  /* Aurora — same shader as homepage */
  const auroraGeo = new THREE.SphereGeometry(200, 96, 96);
  const auroraMat = new THREE.ShaderMaterial({
    uniforms: {
      uTime:   { value: 0 },
      uScroll: { value: 0 },
      uMouse:  { value: new THREE.Vector2(0, 0) },
      uColorA: { value: new THREE.Color('#7C3AED') },
      uColorB: { value: new THREE.Color('#EC4899') },
      uColorC: { value: new THREE.Color('#3B82F6') }
    },
    vertexShader: `
      varying vec3 vNormal; varying vec3 vPos; uniform float uTime;
      vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
      vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
      vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
      vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}
      float snoise(vec3 v){
        const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);
        vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
        vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;
        vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
        vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+2.*C.xxx;vec3 x3=x0-1.+3.*C.xxx;
        i=mod289(i);
        vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
        float n_=.142857142857;vec3 ns=n_*D.wyz-D.xzx;
        vec4 j=p-49.*floor(p*ns.z*ns.z);
        vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);
        vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.-abs(x)-abs(y);
        vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
        vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;vec4 sh=-step(h,vec4(0.));
        vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
        vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
        vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
        p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
        vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);m=m*m;
        return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
      }
      void main() {
        vNormal = normal;
        vec3 p = position;
        float n = snoise(p*0.008 + uTime*0.13);
        float n2 = snoise(p*0.022 - uTime*0.09);
        p += normal * (n*22.0 + n2*9.0);
        vPos = p;
        gl_Position = projectionMatrix*modelViewMatrix*vec4(p,1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vNormal; varying vec3 vPos;
      uniform float uTime; uniform float uScroll; uniform vec2 uMouse;
      uniform vec3 uColorA; uniform vec3 uColorB; uniform vec3 uColorC;
      void main() {
        float t = sin(uTime*0.25 + vPos.y*0.006)*0.5+0.5;
        float t2 = sin(uTime*0.18 + vPos.x*0.008)*0.5+0.5;
        vec3 col = mix(uColorA, uColorB, t);
        col = mix(col, uColorC, t2*0.55);
        float rim = 1.0 - abs(dot(vNormal, vec3(0,0,1)));
        col += rim * 0.35;
        vec2 sc = (gl_FragCoord.xy/vec2(1280,720))*2.0-1.0;
        float md = length(sc-uMouse);
        col += vec3(0.6,0.4,0.9) * smoothstep(0.6, 0.0, md) * 0.25;
        float fade = smoothstep(0.0, 1.0, 1.0 - uScroll*0.35);
        gl_FragColor = vec4(col, 0.5*fade + 0.28);
      }
    `,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.BackSide
  });
  const aurora = new THREE.Mesh(auroraGeo, auroraMat);
  scene.add(aurora);

  /* Stars — 900 twinkling (lighter than homepage) */
  const N = 900;
  const sp = new Float32Array(N * 3);
  const sc = new Float32Array(N * 3);
  const ss = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    const r = 320 + Math.random() * 1000;
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(1 - 2 * Math.random());
    sp[i*3]   = r * Math.sin(ph) * Math.cos(th);
    sp[i*3+1] = r * Math.sin(ph) * Math.sin(th);
    sp[i*3+2] = r * Math.cos(ph);
    const c = Math.random();
    if (c < 0.7)      { sc[i*3]=0.95; sc[i*3+1]=0.93; sc[i*3+2]=0.88; }
    else if (c < 0.9) { sc[i*3]=0.65; sc[i*3+1]=0.55; sc[i*3+2]=0.98; }
    else              { sc[i*3]=0.96; sc[i*3+1]=0.44; sc[i*3+2]=0.71; }
    ss[i] = Math.random() * 3 + 0.5;
  }
  const sg = new THREE.BufferGeometry();
  sg.setAttribute('position', new THREE.BufferAttribute(sp, 3));
  sg.setAttribute('color', new THREE.BufferAttribute(sc, 3));
  sg.setAttribute('size', new THREE.BufferAttribute(ss, 1));
  const sMat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uPr: { value: renderer.getPixelRatio() } },
    vertexShader: `attribute float size; attribute vec3 color;
      varying vec3 vColor; uniform float uTime; uniform float uPr;
      void main(){ vColor = color; vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mv;
        float tw = sin(uTime*1.8 + position.x*0.01 + position.y*0.01) * 0.4 + 0.6;
        gl_PointSize = size * tw * (300.0/-mv.z) * uPr; }`,
    fragmentShader: `varying vec3 vColor;
      void main(){ vec2 uv = gl_PointCoord - 0.5; float d = length(uv);
        float a = smoothstep(0.5, 0.0, d); float g = smoothstep(0.5, 0.1, d) * 0.5;
        gl_FragColor = vec4(vColor + vec3(g), a); }`,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
  });
  const stars = new THREE.Points(sg, sMat);
  scene.add(stars);

  /* Interactions */
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  window.addEventListener('mousemove', e => {
    mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.ty = -((e.clientY / window.innerHeight) * 2 - 1);
  });
  let scrollT = 0;
  function upScroll() {
    const m = document.body.scrollHeight - window.innerHeight;
    scrollT = Math.max(0, Math.min(1, window.scrollY / m));
  }
  window.addEventListener('scroll', upScroll);
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    sMat.uniforms.uPr.value = renderer.getPixelRatio();
  });

  const clock = new THREE.Clock();
  let scrollN = 0;
  function loop() {
    const t = clock.getElapsedTime();
    auroraMat.uniforms.uTime.value = t;
    sMat.uniforms.uTime.value = t;
    auroraMat.uniforms.uScroll.value = scrollT;
    scrollN += (scrollT - scrollN) * 0.045;
    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;
    auroraMat.uniforms.uMouse.value.set(mouse.x, mouse.y);
    camera.position.z = 700 - scrollN * 220;
    camera.position.y = scrollN * 90 + mouse.y * 22;
    camera.position.x = mouse.x * 30;
    camera.rotation.z = mouse.x * 0.014;
    camera.lookAt(0, scrollN * 60, 0);
    aurora.rotation.y = t * 0.055;
    aurora.rotation.x = t * 0.035;
    aurora.position.x = Math.sin(t * 0.13) * 55;
    aurora.position.y = Math.cos(t * 0.11) * 40 - scrollN * 80;
    stars.rotation.y = t * 0.007;
    stars.rotation.x = -scrollN * 0.25;
    renderer.render(scene, camera);
    requestAnimationFrame(loop);
  }
  loop();
})();
