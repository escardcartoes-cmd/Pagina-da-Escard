/* Abertura Escard - injeta a tela de abertura sobre a home.
   Carregado por: <script src="/abertura.js" defer></script>
   ------------------------------------------------------------------
   AJUSTES: as duas linhas abaixo sao as unicas que voce precisa mexer. */
(function(){
  "use strict";

  var ESC_ASSETS = "/";                 /* pasta publica dos .webp */
  var ESC_CONFIG = {
    espera: 10000,                      /* quanto fica parada apos as frases (ms) */
    redirecionar: "",                   /* vazio = revela o site atras */
    umaVezPorSessao: true               /* true = toca uma vez por sessao */
  };

  /* ---------------- daqui para baixo nao precisa mexer ---------------- */

  var CSS    = "#esc-ab{\n  --ui-bg:#ffffff;--ui-fg:#14181f;--ui-muted:#5c6672;--ui-line:#e2e6ec;\n  --ui-accent:#c2410c;--ui-radius:10px;--ui-shadow:0 6px 28px rgba(15,20,28,.20);\n  position:fixed;inset:0;z-index:2147483000;background:#000;\n  font-family:-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,Helvetica,Arial,sans-serif;\n  -webkit-text-size-adjust:100%}\n#esc-ab,#esc-ab *{box-sizing:border-box}\n.esc-stage{position:fixed;inset:0}\n.esc-stage__canvas{display:block;width:100%;height:100%}\n.esc-stage__fallback{position:absolute;inset:0;display:none;align-items:center;justify-content:center;\n  padding:24px;text-align:center;color:#f4f6f8;font-size:15px;line-height:1.6}\n.stage--failed .esc-stage__canvas{display:none}\n.stage--failed .esc-stage__fallback{display:flex}\n.esc-loader{position:fixed;inset:0;z-index:5;display:flex;align-items:center;justify-content:center;\n  background:#000;color:#8b949e;font-size:13px;letter-spacing:.08em;text-transform:uppercase}\n.esc-loader[hidden]{display:none}\n.esc-panel__toggle{position:fixed;top:max(12px,env(safe-area-inset-top));left:max(12px,env(safe-area-inset-left));\n  z-index:3;width:40px;height:40px;padding:0;border:1px solid rgba(255,255,255,.28);\n  border-radius:var(--ui-radius);background:rgba(10,12,16,.42);color:#fff;font-size:17px;\n  line-height:1;cursor:pointer;-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)}\n.esc-panel__toggle:hover{background:rgba(10,12,16,.68)}\n.esc-panel__toggle:focus-visible{outline:2px solid #fff;outline-offset:2px}\n.esc-panel{position:fixed;top:max(60px,calc(env(safe-area-inset-top) + 60px));\n  left:max(12px,env(safe-area-inset-left));z-index:4;\n  width:min(300px,calc(100vw - 24px));max-height:min(74vh,600px);overflow-y:auto;padding:16px;\n  background:var(--ui-bg);color:var(--ui-fg);border:1px solid var(--ui-line);\n  border-radius:var(--ui-radius);box-shadow:var(--ui-shadow);-webkit-overflow-scrolling:touch}\n.esc-panel[hidden]{display:none}\n.esc-panel__title{margin:0 0 4px;font-size:13px;font-weight:700;letter-spacing:.04em;text-transform:uppercase}\n.esc-panel__hint{margin:0 0 14px;font-size:12px;line-height:1.5;color:var(--ui-muted)}\n.esc-panel__field{margin-bottom:14px}\n.esc-panel__label{display:flex;justify-content:space-between;gap:8px;margin-bottom:5px;font-size:12px;font-weight:600}\n.esc-panel__value{color:var(--ui-accent);font-variant-numeric:tabular-nums}\n.esc-panel__range{width:100%;height:22px;accent-color:var(--ui-accent);cursor:pointer}\n.esc-panel__range:focus-visible{outline:2px solid var(--ui-accent);outline-offset:3px}\n.esc-panel__row{display:flex;gap:8px}\n.esc-panel__row .esc-panel__btn{flex:1}\n.esc-panel__select{width:100%;padding:9px 10px;font:inherit;font-size:13px;border:1px solid var(--ui-line);\n  border-radius:8px;background:#f6f8fa;color:var(--ui-fg)}\n.esc-panel__actions{margin-top:16px;padding-top:14px;border-top:1px solid var(--ui-line);\n  display:flex;flex-direction:column;gap:8px}\n.esc-panel__btn{width:100%;padding:11px 12px;font-size:13px;font-weight:600;font-family:inherit;\n  border-radius:8px;cursor:pointer;border:1px solid var(--ui-line);background:#f6f8fa;color:var(--ui-fg)}\n.esc-panel__btn--primary{background:var(--ui-accent);border-color:var(--ui-accent);color:#fff}\n.esc-panel__btn--rec[aria-pressed=\"true\"]{background:#b91c1c;border-color:#b91c1c;color:#fff}\n.esc-panel__btn:disabled{opacity:.55;cursor:progress}\n.esc-panel__btn:focus-visible{outline:2px solid var(--ui-accent);outline-offset:2px}\n.esc-panel__status{margin:10px 0 0;font-size:12px;line-height:1.5;color:var(--ui-muted);min-height:1em}\n\n/* ---------- camada de texto da abertura ---------- */\n.esc-abertura{position:fixed;inset:0;z-index:2;display:flex;align-items:center;\n  padding:0 6vw;pointer-events:none}\n.esc-abertura__col{width:min(640px,52vw);pointer-events:auto}\n\n.esc-abertura__eyebrow{display:flex;align-items:center;gap:16px;margin:0 0 30px;\n  font-family:-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,Helvetica,Arial,sans-serif;\n  font-size:.70rem;font-weight:600;letter-spacing:.30em;text-transform:uppercase;\n  color:rgba(255,255,255,.80)}\n.esc-abertura__rule{display:block;width:56px;height:2px;background:#D81E2C;flex:none;\n  transform-origin:left center}\n\n.esc-abertura__title{margin:0 0 28px;\n  font-family:Didot,\"Bodoni 72\",\"Bodoni MT\",\"Iowan Old Style\",Georgia,\"Times New Roman\",serif;\n  font-size:clamp(2.7rem,6.0vw,5.2rem);font-weight:400;line-height:1.04;\n  letter-spacing:-.015em;color:#fff}\n.esc-abertura__title em{font-style:normal;color:#D81E2C}\n.esc-abertura__line{display:block}\n\n.esc-abertura__body{margin:0 0 38px;max-width:30em;\n  font-family:-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,Helvetica,Arial,sans-serif;\n  font-size:clamp(.98rem,1.25vw,1.10rem);line-height:1.68;color:rgba(255,255,255,.70)}\n\n.esc-abertura__cta{display:inline-flex;align-items:center;gap:12px;padding:15px 30px;\n  font-family:-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,Helvetica,Arial,sans-serif;\n  font-size:.95rem;font-weight:600;color:#fff;background:#D81E2C;border:0;border-radius:999px;\n  cursor:pointer;transition:background .25s ease,transform .25s ease}\n.esc-abertura__cta:hover{background:#ef2434;transform:translateY(-1px)}\n.esc-abertura__cta:focus-visible{outline:2px solid #fff;outline-offset:3px}\n.esc-abertura__cta span{transition:transform .25s ease}\n.esc-abertura__cta:hover span{transform:translateX(4px)}\n\n.esc-abertura__foot{position:absolute;left:6vw;bottom:5vh;margin:0;\n  font-family:-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,Helvetica,Arial,sans-serif;\n  font-size:.68rem;font-weight:600;letter-spacing:.24em;text-transform:uppercase;\n  color:rgba(255,255,255,.34)}\n\n/* acender: a luz do sol alcanca as palavras */\n@keyframes acender{\n  0%  {opacity:0;transform:translateY(20px);filter:blur(8px) brightness(2.4) saturate(1.5)}\n  55% {opacity:1}\n  100%{opacity:1;transform:none;filter:blur(0) brightness(1) saturate(1)}\n}\n@keyframes tracar{from{transform:scaleX(0)}to{transform:scaleX(1)}}\n\n/* apoio: entra rapido e quieto */\n.esc-abertura__kicker,.esc-abertura__body,.esc-abertura__cta,.esc-abertura__foot{\n  display:inline-block;opacity:0;animation:acender .92s cubic-bezier(.16,.84,.30,1) both}\n.esc-abertura__body{display:block}\n/* titulo: massa maior, tempo maior \u2014 a luz varre palavra por palavra */\n.esc-abertura__word{display:inline-block;opacity:0;\n  animation:acender 1.30s cubic-bezier(.12,.78,.24,1) both}\n.esc-abertura__word--vermelho{color:#D81E2C}\n.esc-abertura__rule{animation:tracar .90s cubic-bezier(.16,.84,.30,1) both;animation-delay:.60s}\n.esc-abertura__kicker{animation-delay:.78s}\n.esc-abertura__body  {animation-delay:4.30s}\n.esc-abertura__cta   {animation-delay:4.72s}\n.esc-abertura__foot  {animation-delay:5.02s}\n\n/* saida */\n.esc-stage,.esc-abertura{transition:opacity .85s ease,transform .85s cubic-bezier(.4,0,.2,1)}\n#esc-ab.esc-out .esc-stage,#esc-ab.esc-out .esc-abertura{opacity:0;transform:scale(1.035)}\n#esc-ab.esc-out .esc-panel,#esc-ab.esc-out .esc-panel__toggle{opacity:0}\n\n@media (max-width:820px){\n  .esc-abertura{align-items:flex-start;padding-top:12vh}\n  .esc-abertura__col{width:88vw}\n  .esc-abertura__body{max-width:34em}\n}\n@media (prefers-reduced-motion:reduce){\n  .esc-abertura__kicker,.esc-abertura__word,.esc-abertura__body,.esc-abertura__cta,.esc-abertura__foot,\n  .esc-abertura__rule{animation:none;opacity:1;transform:none;filter:none}\n}\n.esc-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}";
  var MARKUP = "<main class=\"esc-stage\" id=\"esc-stage\">\n  <canvas class=\"esc-stage__canvas\" id=\"esc-scene\" aria-label=\"Sol com plasma em movimento cont\u00ednuo sobre campo estelar\"></canvas>\n  <p class=\"esc-stage__fallback\" id=\"esc-fallback\" role=\"alert\">\n    Este navegador n\u00e3o conseguiu iniciar o WebGL necess\u00e1rio para a cena.<br>\n    Tente outro navegador ou ative a acelera\u00e7\u00e3o de hardware.\n  </p>\n  <section class=\"esc-abertura\" id=\"esc-abertura\" aria-label=\"Abertura Escard\">\n    <div class=\"esc-abertura__col\">\n      <p class=\"esc-abertura__eyebrow\"><i class=\"esc-abertura__rule\" aria-hidden=\"true\"></i><span class=\"esc-abertura__kicker\">Conex\u00f5es al\u00e9m do horizonte</span></p>\n      <h1 class=\"esc-abertura__title\">\n        <span class=\"esc-abertura__line\"><span class=\"esc-abertura__word\" style=\"animation-delay:1.85s\">A</span> <span class=\"esc-abertura__word\" style=\"animation-delay:1.96s\">Escard</span> <span class=\"esc-abertura__word\" style=\"animation-delay:2.07s\">ganhou</span></span>\n        <span class=\"esc-abertura__line\"><span class=\"esc-abertura__word\" style=\"animation-delay:2.34s\">um</span> <span class=\"esc-abertura__word esc-abertura__word--vermelho\" style=\"animation-delay:2.45s\">universo</span> <span class=\"esc-abertura__word esc-abertura__word--vermelho\" style=\"animation-delay:2.56s\">inteiro.</span></span>\n      </h1>\n      <p class=\"esc-abertura__body\">Solu\u00e7\u00f5es em cart\u00f5es com processamento pr\u00f3prio. Um mundo de possibilidades, conex\u00f5es luminosas e experi\u00eancias que ganham vida.</p>\n      <button class=\"esc-abertura__cta\" id=\"esc-entrar\" type=\"button\">Entrar no universo Escard <span aria-hidden=\"true\">&#8594;</span></button>\n    </div>\n    <p class=\"esc-abertura__foot\">Escard &middot; Presente em cada \u00f3rbita</p>\n  </section>\n\n</main>\n\n<div class=\"esc-loader\" id=\"esc-loader\">carregando</div>\n\n<button class=\"esc-panel__toggle\" id=\"esc-toggle\" type=\"button\" hidden aria-expanded=\"false\" aria-controls=\"esc-panel\" title=\"Ajustes (tecla C)\">\n  <span aria-hidden=\"true\">&#10022;</span><span class=\"esc-sr\">Abrir ajustes</span>\n</button>\n\n<aside class=\"esc-panel\" id=\"esc-panel\" hidden aria-label=\"Ajustes\">\n  <h1 class=\"esc-panel__title\">Ajustes</h1>\n  <p class=\"esc-panel__hint\">Calibrado pelo v\u00eddeo de refer\u00eancia: 12 px/s no disco, limbo 1,3x mais r\u00e1pido, c\u00e9u im\u00f3vel. Todo pixel \u00e9 do seu render, apenas deslocado.</p>\n\n  <div class=\"esc-panel__field\">\n    <label class=\"esc-panel__label\" for=\"esc-ctl-speed\">Velocidade do plasma <span class=\"esc-panel__value\" id=\"esc-val-speed\"></span></label>\n    <input class=\"esc-panel__range\" id=\"esc-ctl-speed\" type=\"range\" min=\"0\" max=\"24\" step=\"0.5\">\n  </div>\n  <div class=\"esc-panel__field\">\n    <label class=\"esc-panel__label\" for=\"esc-ctl-amp\">Amplitude do ciclo <span class=\"esc-panel__value\" id=\"esc-val-amp\"></span></label>\n    <input class=\"esc-panel__range\" id=\"esc-ctl-amp\" type=\"range\" min=\"40\" max=\"200\" step=\"2\">\n  </div>\n  <div class=\"esc-panel__field\">\n    <label class=\"esc-panel__label\" for=\"esc-ctl-zoomloop\">Ciclo do push-in <span class=\"esc-panel__value\" id=\"esc-val-zoomloop\"></span></label>\n    <input class=\"esc-panel__range\" id=\"esc-ctl-zoomloop\" type=\"range\" min=\"20\" max=\"180\" step=\"1\">\n  </div>\n  <div class=\"esc-panel__field\">\n    <label class=\"esc-panel__label\" for=\"esc-ctl-zoom\">Push-in da c\u00e2mera <span class=\"esc-panel__value\" id=\"esc-val-zoom\"></span></label>\n    <input class=\"esc-panel__range\" id=\"esc-ctl-zoom\" type=\"range\" min=\"0\" max=\"0.2\" step=\"0.002\">\n  </div>\n  <div class=\"esc-panel__field\">\n    <label class=\"esc-panel__label\" for=\"esc-ctl-exposure\">Exposi\u00e7\u00e3o <span class=\"esc-panel__value\" id=\"esc-val-exposure\"></span></label>\n    <input class=\"esc-panel__range\" id=\"esc-ctl-exposure\" type=\"range\" min=\"0.6\" max=\"1.6\" step=\"0.01\">\n  </div>\n  <div class=\"esc-panel__field\">\n    <label class=\"esc-panel__label\" for=\"esc-ctl-scale\">Escala de render <span class=\"esc-panel__value\" id=\"esc-val-scale\"></span></label>\n    <input class=\"esc-panel__range\" id=\"esc-ctl-scale\" type=\"range\" min=\"0.5\" max=\"3\" step=\"0.05\">\n  </div>\n\n  <div class=\"esc-panel__actions\">\n    <div class=\"esc-panel__field\" style=\"margin:0\">\n      <label class=\"esc-panel__label\" for=\"esc-ctl-export\">Resolu\u00e7\u00e3o do PNG</label>\n      <select class=\"esc-panel__select\" id=\"esc-ctl-export\">\n        <option value=\"1920\">2K \u2014 1920 x 1080</option>\n        <option value=\"3840\" selected>4K \u2014 3840 x 2160</option>\n        <option value=\"7680\">8K \u2014 7680 x 4320</option>\n      </select>\n    </div>\n    <button class=\"esc-panel__btn esc-panel__btn--primary\" id=\"esc-export\" type=\"button\">Exportar frame</button>\n    <button class=\"esc-panel__btn esc-panel__btn--rec\" id=\"esc-record\" type=\"button\" aria-pressed=\"false\">Gravar loop (WebM)</button>\n    <div class=\"esc-panel__row\">\n      <button class=\"esc-panel__btn\" id=\"esc-freeze\" type=\"button\" aria-pressed=\"false\">Congelar</button>\n      <button class=\"esc-panel__btn\" id=\"esc-reset\" type=\"button\">Padr\u00e3o</button>\n    </div>\n    <p class=\"esc-panel__status\" id=\"esc-status\" role=\"status\" aria-live=\"polite\"></p>\n  </div>\n</aside>";
  var VS     = "attribute vec2 aPos;\nvarying vec2 vUv;\nvoid main(){\n  vUv = aPos * 0.5 + 0.5;\n  gl_Position = vec4(aPos, 0.0, 1.0);\n}";
  var FS     = "#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\n\nvarying vec2 vUv;\n\nuniform sampler2D uTex;\nuniform sampler2D uFlow;\nuniform vec2  uRes;\nuniform vec2  uTexRes;\nuniform float uTime;\nuniform float uCycle;\nuniform float uZoomLoop;\nuniform float uAmp;\nuniform float uZoom;\nuniform float uExposure;\n\nconst float IMG_ASPECT = 1.7777778;\n\nvoid main(){\n  float aspect = uRes.x / max(uRes.y, 1.0);\n\n  /* enquadramento cover da imagem 16:9 */\n  vec2 p = vUv - 0.5;\n  p.x *= aspect;\n  float imgH = max(1.0, aspect / IMG_ASPECT);\n  float imgW = imgH * IMG_ASPECT;\n\n  /* push-in lento em direcao ao sol, fechando no fim do ciclo */\n  float t  = fract(uTime / max(uCycle, 0.05));\n  float tz = fract(uTime / max(uZoomLoop, 1.0));\n  float zoom = 1.0 + uZoom * 0.5 * (1.0 - cos(tz * 6.28318530718));\n  vec2 target = vec2(0.30, -0.16);\n  vec2 pv = target + (p - target) / zoom;\n\n  vec2 uv = vec2(0.5 + pv.x / imgW, 0.5 + pv.y / imgH);\n\n  /* campo Euleriano: velocidade imediata, constante no tempo, lida da propria foto */\n  vec2 F = (texture2D(uFlow, uv).xy - 0.5) * 2.0 * uAmp / uTexRes;\n\n  /* loop de Holynski: escoa para frente e para tras, mistura os dois */\n  vec2 uvA = uv - F * t;\n  vec2 uvB = uv - F * (t - 1.0);\n  vec3 col = mix(texture2D(uTex, uvA).rgb, texture2D(uTex, uvB).rgb, t);\n\n  col *= uExposure;\n\n  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);\n}";

  function injetar(){
    if(document.getElementById("esc-ab")){ return; }

    var st = document.createElement("style");
    st.textContent = CSS;
    document.head.appendChild(st);

    var sv = document.createElement("script");
    sv.type = "x-shader/x-vertex"; sv.id = "esc-vs"; sv.textContent = VS;
    document.head.appendChild(sv);

    var sf = document.createElement("script");
    sf.type = "x-shader/x-fragment"; sf.id = "esc-fs"; sf.textContent = FS;
    document.head.appendChild(sf);

    var raiz = document.createElement("div");
    raiz.id = "esc-ab";
    raiz.innerHTML = MARKUP;
    document.body.appendChild(raiz);

    iniciar();
  }

  var iniciar = function(){
    (function(){
      "use strict";
    
      var ASSETS   = ESC_ASSETS;   /* pasta onde os dois .webp ficam publicados */
      var TEX_BASE = ASSETS + "abertura-sol.webp";
      var TEX_FLOW = ASSETS + "abertura-fluxo.webp";
    
      /* ---------- integração ---------- */
      var CONFIG = ESC_CONFIG;
    
      if(CONFIG.umaVezPorSessao && window.sessionStorage){
        try{ if(sessionStorage.getItem("escardAberturaVista")){ remover(); return; } }catch(e){}
      }
    
      var FLOW_FRAC = 0.2248;   /* magnitude media do campo no disco */
      var DEFAULTS = { speed: 12, amp: 140, zoomloop: 60, zoom: 0.05, exposure: 1.00, scale: 1.00 };
      var CONTROLS = [
        { key:"speed", decimals:1 }, { key:"amp", decimals:0 }, { key:"zoomloop", decimals:0 },
        { key:"zoom", decimals:3 }, { key:"exposure", decimals:2 }, { key:"scale", decimals:2 }
      ];
    
      var state = {};
      var key;
      for(key in DEFAULTS){
        if(Object.prototype.hasOwnProperty.call(DEFAULTS, key)){ state[key] = DEFAULTS[key]; }
      }
    
      var ROOT      = document.getElementById("esc-ab");
      var htmlOverflow = document.documentElement.style.overflow;
      var bodyOverflow = document.body.style.overflow;
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      function remover(){
        if(ROOT && ROOT.parentNode){ ROOT.parentNode.removeChild(ROOT); }
        document.documentElement.style.overflow = htmlOverflow;
        document.body.style.overflow = bodyOverflow;
      }
      var stage     = document.getElementById("esc-stage");
      var canvas    = document.getElementById("esc-scene");
      var panel     = document.getElementById("esc-panel");
      var toggle    = document.getElementById("esc-toggle");
      var statusEl  = document.getElementById("esc-status");
      var freezeBtn = document.getElementById("esc-freeze");
      var recBtn    = document.getElementById("esc-record");
      var loader    = document.getElementById("esc-loader");
    
      var reduceMotion = false;
      if(window.matchMedia){
        reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      }
      var frozen = reduceMotion;
    
      function setStatus(msg){ if(statusEl){ statusEl.textContent = msg; } }
    
      function fail(msg){
        document.documentElement.style.overflow = htmlOverflow;
        document.body.style.overflow = bodyOverflow;
        stage.className = "esc-stage esc-stage--failed";
        if(panel){ panel.hidden = true; }
        if(toggle){ toggle.hidden = true; }
        if(loader){ loader.hidden = true; }
        if(msg){ document.getElementById("esc-fallback").textContent = msg; }
      }
    
      var gl = null;
      try{
        var opts = {
          alpha:false, antialias:false, depth:false, stencil:false,
          preserveDrawingBuffer:true, premultipliedAlpha:false, powerPreference:"high-performance"
        };
        gl = canvas.getContext("webgl", opts) || canvas.getContext("experimental-webgl", opts);
      }catch(err){ gl = null; }
      if(!gl){ fail(); return; }
    
      function compile(type, src){
        var sh = gl.createShader(type);
        gl.shaderSource(sh, src);
        gl.compileShader(sh);
        if(!gl.getShaderParameter(sh, gl.COMPILE_STATUS)){ gl.deleteShader(sh); return null; }
        return sh;
      }
    
      var vs = compile(gl.VERTEX_SHADER, document.getElementById("esc-vs").textContent);
      var fs = compile(gl.FRAGMENT_SHADER, document.getElementById("esc-fs").textContent);
      if(!vs || !fs){ fail(); return; }
    
      var prog = gl.createProgram();
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.bindAttribLocation(prog, 0, "aPos");
      gl.linkProgram(prog);
      if(!gl.getProgramParameter(prog, gl.LINK_STATUS)){ fail(); return; }
      gl.useProgram(prog);
    
      var buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    
      var U = {};
      var names = ["uTex","uFlow","uRes","uTexRes","uTime","uCycle","uZoomLoop","uAmp","uZoom","uExposure"];
      var i;
      for(i = 0; i < names.length; i++){ U[names[i]] = gl.getUniformLocation(prog, names[i]); }
    
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    
      var texBase = null, texFlow = null, baseSize = [1,1];
      var loaded = 0, ready = false;
    
      function makeTexture(image){
        var tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        return tex;
      }
    
      function load(src, onDone){
        var img = new Image();
        img.onload = function(){ onDone(img); };
        img.onerror = function(){ fail("Não foi possível carregar os dados embutidos."); };
        img.src = src;
      }
    
      function afterLoad(){
        loaded += 1;
        if(loaded === 2){
          ready = true;
          loader.hidden = true;
          window.requestAnimationFrame(frame);
        }
      }
    
      load(TEX_BASE, function(img){
        texBase = makeTexture(img);
        baseSize = [img.width, img.height];
        afterLoad();
      });
      load(TEX_FLOW, function(img){
        texFlow = makeTexture(img);
        afterLoad();
      });
    
      var dpr = 1;
      function resize(){
        dpr = Math.min(window.devicePixelRatio || 1, 2) * state.scale;
        var w = Math.max(1, Math.round(canvas.clientWidth  * dpr));
        var h = Math.max(1, Math.round(canvas.clientHeight * dpr));
        var maxDim = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE) || 4096;
        if(w > maxDim){ h = Math.round(h * maxDim / w); w = maxDim; }
        if(h > maxDim){ w = Math.round(w * maxDim / h); h = maxDim; }
        if(canvas.width !== w || canvas.height !== h){ canvas.width = w; canvas.height = h; }
      }
    
      function now(){
        return (window.performance && performance.now) ? performance.now() : Date.now();
      }
      var startTime = now();
      var frozenAt = 0.0;
      function currentTime(){
        if(frozen){ return frozenAt; }
        return (now() - startTime) / 1000.0;
      }
    
      function draw(timeSeconds, width, height){
        gl.viewport(0, 0, width, height);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texBase);
        gl.uniform1i(U.uTex, 0);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, texFlow);
        gl.uniform1i(U.uFlow, 1);
        gl.uniform2f(U.uRes, width, height);
        gl.uniform2f(U.uTexRes, baseSize[0], baseSize[1]);
        gl.uniform1f(U.uTime, timeSeconds);
        gl.uniform1f(U.uCycle, Math.max(0.05, FLOW_FRAC * state.amp / Math.max(state.speed, 0.01)));
        gl.uniform1f(U.uZoomLoop, state.zoomloop);
        gl.uniform1f(U.uAmp, state.amp);
        gl.uniform1f(U.uZoom, state.zoom);
        gl.uniform1f(U.uExposure, state.exposure);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }
    
      var running = true;
      function frame(){
        if(!running || !ready){ return; }
        resize();
        draw(currentTime(), canvas.width, canvas.height);
        window.requestAnimationFrame(frame);
      }
    
      function syncLabel(cfg){
        var out = document.getElementById("esc-val-" + cfg.key);
        if(out){ out.textContent = state[cfg.key].toFixed(cfg.decimals); }
      }
      function bind(cfg){
        var input = document.getElementById("esc-ctl-" + cfg.key);
        if(!input){ return; }
        input.value = String(state[cfg.key]);
        syncLabel(cfg);
        input.addEventListener("input", function(){
          var v = parseFloat(input.value);
          if(isNaN(v)){ return; }
          state[cfg.key] = v;
          syncLabel(cfg);
        });
      }
      var c;
      for(c = 0; c < CONTROLS.length; c++){ bind(CONTROLS[c]); }
    
      function setPanel(open){
        panel.hidden = !open;
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      }
      toggle.addEventListener("click", function(){ setPanel(panel.hidden); });
      function aoTeclar(ev){
        if(ev.key === "c" || ev.key === "C"){ toggle.hidden = false; setPanel(panel.hidden); }
        if(ev.key === "Escape" && !panel.hidden){ setPanel(false); }
      }
      document.addEventListener("keydown", aoTeclar);
    
      freezeBtn.addEventListener("click", function(){
        if(!frozen){
          frozenAt = currentTime();
          frozen = true;
          freezeBtn.textContent = "Retomar";
          freezeBtn.setAttribute("aria-pressed", "true");
        }else{
          startTime = now() - frozenAt * 1000.0;
          frozen = false;
          freezeBtn.textContent = "Congelar";
          freezeBtn.setAttribute("aria-pressed", "false");
        }
      });
    
      document.getElementById("esc-reset").addEventListener("click", function(){
        var k, j, cfg, input;
        for(k in DEFAULTS){
          if(Object.prototype.hasOwnProperty.call(DEFAULTS, k)){ state[k] = DEFAULTS[k]; }
        }
        for(j = 0; j < CONTROLS.length; j++){
          cfg = CONTROLS[j];
          input = document.getElementById("esc-ctl-" + cfg.key);
          if(input){ input.value = String(state[cfg.key]); }
          syncLabel(cfg);
        }
        setStatus("Valores restaurados.");
      });
    
      var exportBtn = document.getElementById("esc-export");
      exportBtn.addEventListener("click", function(){
        var want   = parseInt(document.getElementById("esc-ctl-export").value, 10) || 3840;
        var maxDim = Math.min(gl.getParameter(gl.MAX_RENDERBUFFER_SIZE) || 4096,
                              gl.getParameter(gl.MAX_TEXTURE_SIZE) || 4096);
        var outW = Math.min(want, maxDim);
        var outH = Math.round(outW * 9 / 16);
        if(outH > maxDim){ outH = maxDim; outW = Math.round(outH * 16 / 9); }
    
        var prevW = canvas.width, prevH = canvas.height;
        var prevSW = canvas.style.width, prevSH = canvas.style.height;
    
        exportBtn.disabled = true;
        running = false;
        setStatus(outW < want
          ? "Limite da GPU: exportando em " + outW + "x" + outH + "."
          : "Renderizando " + outW + "x" + outH + "...");
    
        window.setTimeout(function(){
          var restored = false;
          function restore(){
            if(restored){ return; }
            restored = true;
            canvas.style.width = prevSW;
            canvas.style.height = prevSH;
            canvas.width = prevW;
            canvas.height = prevH;
            running = true;
            exportBtn.disabled = false;
            window.requestAnimationFrame(frame);
          }
          function send(blob){
            if(!blob){ setStatus("Falha ao gerar o PNG."); restore(); return; }
            var url = URL.createObjectURL(blob);
            var a = document.createElement("a");
            a.href = url;
            a.download = "abertura-escard-" + outW + "x" + outH + ".png";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.setTimeout(function(){ URL.revokeObjectURL(url); }, 5000);
            setStatus("PNG " + outW + "x" + outH + " exportado.");
            restore();
          }
          try{
            canvas.style.width  = canvas.clientWidth + "px";
            canvas.style.height = canvas.clientHeight + "px";
            canvas.width  = outW;
            canvas.height = outH;
            draw(currentTime(), outW, outH);
            if(canvas.toBlob){ canvas.toBlob(send, "image/png"); }
            else{
              var link = document.createElement("a");
              link.href = canvas.toDataURL("image/png");
              link.download = "abertura-escard-" + outW + "x" + outH + ".png";
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              setStatus("PNG exportado.");
              restore();
            }
          }catch(err){
            setStatus("O dispositivo não suportou esta resolução.");
            restore();
          }
        }, 40);
      });
    
      var recorder = null;
      var chunks = [];
      recBtn.addEventListener("click", function(){
        if(recorder){ recorder.stop(); return; }
        if(!window.MediaRecorder || !canvas.captureStream){
          setStatus("Este navegador não suporta gravação. Use o Chrome no desktop.");
          return;
        }
        var stream, mime = "";
        var candidates = ["video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm"];
        var m;
        for(m = 0; m < candidates.length; m++){
          if(MediaRecorder.isTypeSupported(candidates[m])){ mime = candidates[m]; break; }
        }
        try{
          stream = canvas.captureStream(30);
          recorder = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 24000000 });
        }catch(err){
          setStatus("Não foi possível iniciar a gravação.");
          recorder = null;
          return;
        }
        chunks = [];
        recorder.ondataavailable = function(ev){
          if(ev.data && ev.data.size > 0){ chunks.push(ev.data); }
        };
        recorder.onstop = function(){
          var blob = new Blob(chunks, { type: "video/webm" });
          var url = URL.createObjectURL(blob);
          var a = document.createElement("a");
          a.href = url;
          a.download = "abertura-escard-" + canvas.width + "x" + canvas.height + ".webm";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.setTimeout(function(){ URL.revokeObjectURL(url); }, 6000);
          recorder = null;
          recBtn.textContent = "Gravar loop (WebM)";
          recBtn.setAttribute("aria-pressed", "false");
          setStatus("Vídeo salvo em " + canvas.width + "x" + canvas.height + ".");
        };
        startTime = now();
        frozen = false;
        freezeBtn.textContent = "Congelar";
        freezeBtn.setAttribute("aria-pressed", "false");
        recorder.start();
        recBtn.textContent = "Parar gravação";
        recBtn.setAttribute("aria-pressed", "true");
        setStatus("Gravando — o ciclo do plasma fecha a cada " + (FLOW_FRAC * state.amp / Math.max(state.speed, 0.01)).toFixed(1) + "s.");
      });
    
      /* ---------- saída da abertura ---------- */
      var REVELACAO_MS = reduceMotion ? 250 : 5940;
      var saindo = false;
      var armado = false;
    
      function encerrar(){
        if(saindo){ return; }
        saindo = true;
        desarmar();
        ROOT.className = "esc-out";
        window.setTimeout(function(){
          running = false;
          window.removeEventListener("resize", resize);
          document.removeEventListener("keydown", aoTeclar);
          if(CONFIG.umaVezPorSessao && window.sessionStorage){
            try{ sessionStorage.setItem("escardAberturaVista","1"); }catch(e){}
          }
          remover();
          if(CONFIG.redirecionar){ window.location.href = CONFIG.redirecionar; return; }
          var ev;
          try{ ev = new CustomEvent("escard:abertura-fim"); }
          catch(e){ ev = document.createEvent("Event"); ev.initEvent("escard:abertura-fim", true, true); }
          document.dispatchEvent(ev);
        }, 880);
      }
    
      var GATILHOS = ["mousemove","mousedown","wheel","keydown","touchstart","scroll"];
      function aoInteragir(){ encerrar(); }
      function desarmar(){
        var i;
        for(i = 0; i < GATILHOS.length; i++){
          window.removeEventListener(GATILHOS[i], aoInteragir, true);
        }
        armado = false;
      }
      function armar(){
        if(armado || saindo){ return; }
        var i;
        for(i = 0; i < GATILHOS.length; i++){
          window.addEventListener(GATILHOS[i], aoInteragir, true);
        }
        armado = true;
      }
    
      /* as frases aparecem inteiras primeiro; só depois o mouse/teclado passa a encerrar */
      window.setTimeout(function(){
        armar();
        window.setTimeout(encerrar, CONFIG.espera);
      }, REVELACAO_MS);
    
      var entrar = document.getElementById("esc-entrar");
      if(entrar){
        entrar.addEventListener("click", function(ev){ ev.stopPropagation(); encerrar(); });
      }
    
      /* o painel de ajuste some da versão pública; ?ajustes=1 ou tecla C traz de volta */
      if(window.location.search.indexOf("ajustes=1") !== -1){ toggle.hidden = false; }
    
      window.addEventListener("resize", resize);
      if(reduceMotion){
        freezeBtn.textContent = "Retomar";
        freezeBtn.setAttribute("aria-pressed", "true");
        setStatus("Animação pausada: seu sistema pede movimento reduzido.");
      }
    })();
  };

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", injetar);
  }else{
    injetar();
  }
})();
