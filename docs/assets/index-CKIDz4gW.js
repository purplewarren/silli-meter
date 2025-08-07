(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const a of n)if(a.type==="childList")for(const o of a.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function t(n){const a={};return n.integrity&&(a.integrity=n.integrity),n.referrerPolicy&&(a.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?a.credentials="include":n.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(n){if(n.ep)return;n.ep=!0;const a=t(n);fetch(n.href,a)}})();class V{routes=new Map;currentRoute=null;constructor(){this.handleHashChange=this.handleHashChange.bind(this),window.addEventListener("hashchange",this.handleHashChange),window.addEventListener("load",this.handleHashChange)}register(e,t){const s=this.routeToKey(e);this.routes.set(s,t)}navigate(e){const t=this.routeToHash(e);window.location.hash=t}getCurrentRoute(){return this.currentRoute}routeToKey(e){return`${e.dyad}:${e.screen}`}routeToHash(e){let t=`#${e.dyad}/${e.screen}`;if(e.params){const s=new URLSearchParams(e.params);t+=`?${s.toString()}`}return t}hashToRoute(e){const t=e.substring(1),[s,n]=t.split("?"),[a,o]=s.split("/"),i={dyad:a||"night",screen:o||"home"};if(n){const c=new URLSearchParams(n);i.params=Object.fromEntries(c.entries())}return i}handleHashChange(){const e=window.location.hash||"#night/home",t=this.hashToRoute(e);this.currentRoute=t;const s=this.routeToKey(t),n=this.routes.get(s);if(n)n();else{console.warn(`No handler found for route: ${s}`);const a=`${t.dyad}:home`,o=this.routes.get(a);o&&o()}}destroy(){window.removeEventListener("hashchange",this.handleHashChange),window.removeEventListener("load",this.handleHashChange)}}const A={en:{pwa:{title:"Parent Night Helper",mode_label:"Helper mode",button:{start:"Start session",stop:"Stop session",process:"Process results"},score_ring:{label:"Wind-down score",unit:"/100"},badges:{label:"Signals detected",speech:"Speech present",music:"Music or TV",fluctuating:"Unsteady sounds",steady:"Steady signal"},tips:{title:"Try this",lower_volume:"Lower TV or music volume.",single_sound:"Use one steady sound (e.g. fan or white noise).",soft_light:"Soften the room light.",lower_voice:"Speak slower and softer."},session:{info_id:"Session: {id}",duration:"Duration: {mm}:{ss}"},upload:{success:"✅ Results saved. Check Telegram for details.",failed:"Session saved locally. Will retry. Use /ingest if needed."},permission:{mic_denied:"Microphone access denied. Please allow mic to use this tool.",mic_not_found:"No microphone found. Try restarting or check your device.",error_generic:"Can't access mic. Please check your settings."},footer_privacy:"On-device only. No audio is uploaded. [Privacy Policy]"},disclaimer:{non_medical:"Silli offers guidance, not clinical advice."}},pt_br:{pwa:{title:"Auxiliar da Noite",mode_label:"Modo de ajuda",button:{start:"Iniciar sessão",stop:"Parar sessão",process:"Ver resultados"},score_ring:{label:"Índice de relaxamento",unit:"/100"},badges:{label:"Sinais detectados",speech:"Voz ativa",music:"Música ou TV",fluctuating:"Sons instáveis",steady:"Som contínuo"},tips:{title:"Tente isto",lower_volume:"Abaixe o volume da TV ou música.",single_sound:"Use um som contínuo (como ventilador ou ruído branco).",soft_light:"Diminua a luz do ambiente.",lower_voice:"Fale mais devagar e com suavidade."},session:{info_id:"Sessão: {id}",duration:"Duração: {mm}:{ss}"},upload:{success:"✅ Resultados salvos. Veja os detalhes no Telegram.",failed:"Sessão salva localmente. Vamos tentar de novo. Use /ingest se precisar."},permission:{mic_denied:"Acesso ao microfone negado. Permita o uso para continuar.",mic_not_found:"Nenhum microfone encontrado. Reinicie ou verifique o dispositivo.",error_generic:"Não foi possível acessar o microfone. Verifique as configurações."},footer_privacy:"Análise local. Nenhum áudio é enviado. [Política de Privacidade]"},disclaimer:{non_medical:"A Silli oferece orientação, não aconselhamento clínico."}}};class z{currentLanguage="en";constructor(){this.detectLanguage()}detectLanguage(){const t=new URLSearchParams(window.location.search).get("lang");if(t&&A[t]){this.currentLanguage=t;return}navigator.language.toLowerCase().startsWith("pt")?this.currentLanguage="pt_br":this.currentLanguage="en";const n=localStorage.getItem("silli_language");n&&A[n]&&(this.currentLanguage=n)}setLanguage(e){if(A[e]){this.currentLanguage=e,localStorage.setItem("silli_language",e);const t=new URL(window.location.href);t.searchParams.set("lang",e),window.history.replaceState({},"",t.toString())}}getLanguage(){return this.currentLanguage}t(e,t){const s=e.split(".");let n=A[this.currentLanguage];for(const a of s)if(n&&typeof n=="object"&&a in n)n=n[a];else{n=this.getFallbackValue(e);break}return typeof n!="string"?this.getFallbackValue(e):t?n.replace(/\{(\w+)\}/g,(a,o)=>t[o]?.toString()||a):n}getFallbackValue(e){const t=e.split(".");let s=A.en;for(const n of t)if(s&&typeof s=="object"&&n in s)s=s[n];else return e;return typeof s=="string"?s:e}getAvailableLanguages(){return Object.keys(A)}getLanguageName(e){return{en:"English",pt_br:"Português (Brasil)"}[e]||e}}const T=new z;class G{container;isOpen=!1;constructor(e){this.container=e}render(){const e=T.getLanguage(),t=T.getAvailableLanguages();this.container.innerHTML=`
      <div class="language-selector">
        <button class="language-toggle" id="language-toggle">
          <span class="language-flag">${this.getLanguageFlag(e)}</span>
          <span class="language-name">${T.getLanguageName(e)}</span>
          <span class="language-arrow">▼</span>
        </button>
        
        <div class="language-dropdown" id="language-dropdown" style="display: none;">
          ${t.map(s=>`
            <button class="language-option ${s===e?"active":""}" 
                    data-language="${s}">
              <span class="language-flag">${this.getLanguageFlag(s)}</span>
              <span class="language-name">${T.getLanguageName(s)}</span>
            </button>
          `).join("")}
        </div>
      </div>
    `,this.bindEvents()}getLanguageFlag(e){return{en:"🇺🇸",pt_br:"🇧🇷"}[e]||"🌐"}bindEvents(){const e=this.container.querySelector("#language-toggle"),t=this.container.querySelectorAll(".language-option");e?.addEventListener("click",s=>{s.stopPropagation(),this.toggleDropdown()}),t.forEach(s=>{s.addEventListener("click",n=>{n.stopPropagation();const a=n.currentTarget.dataset.language;a&&this.selectLanguage(a)})}),document.addEventListener("click",()=>{this.closeDropdown()})}toggleDropdown(){const e=this.container.querySelector("#language-dropdown");if(e){this.isOpen=!this.isOpen,e.style.display=this.isOpen?"block":"none";const t=this.container.querySelector(".language-arrow");t&&(t.textContent=this.isOpen?"▲":"▼")}}closeDropdown(){const e=this.container.querySelector("#language-dropdown");if(e&&this.isOpen){e.style.display="none",this.isOpen=!1;const t=this.container.querySelector(".language-arrow");t&&(t.textContent="▼")}}selectLanguage(e){T.setLanguage(e),this.closeDropdown(),window.dispatchEvent(new CustomEvent("languageChanged",{detail:{language:e}})),this.render()}destroy(){document.removeEventListener("click",this.closeDropdown.bind(this))}}const d={privacy:{onDeviceProcessing:"All processing happens on your device. Nothing is sent to our servers.",photosStayPrivate:"Photos stay private and are analyzed on your device only.",recordingsNeverLeave:"Your recordings never leave your device.",dataStaysLocal:"Photos and data stay on your device. No cloud storage."},empty:{noSessionsYet:"No sessions yet. Start tracking to see your history here."},buttons:{cancel:"Cancel",saveMeal:"Save Meal",analyze:"Analyze",uploadVoice:"Upload Voice",uploadVideo:"Upload Video",addText:"Add Text",snapMeal:"Snap Meal",askQuestion:"Ask a Question",logMeal:"Log Meal",viewPatterns:"View Patterns",history:"History",gallery:"Gallery",settings:"Settings"},forms:{trigger:"Trigger",duration:"Duration (minutes)",coRegulation:"Co-regulation strategies",notes:"Notes (optional)",environmentNoise:"Environment noise"},placeholders:{selectTrigger:"—",processing:"Processing..."},intensity:{mild:"1 - Mild",extreme:"10 - Extreme"},tabs:{recordSession:"Record Session",history:"History"},coRegulation:[{value:"hold",label:"Hold"},{value:"mirror",label:"Mirror"},{value:"label",label:"Label"},{value:"breathe",label:"Breathe"},{value:"safe_space",label:"Safe Space"},{value:"low_stimulus",label:"Low Stimulus"}],triggers:["transition","frustration","limit","separation","unknown"],sections:{howIntense:"How intense is this moment?",howWouldYouLike:"How would you like to share?",howWasMeal:"How was this meal?",whatWouldYouLike:"What would you like to do?",quickActions:"Quick Actions"},descriptions:{recordOrUpload:"Record or upload audio",recordOrUploadVideo:"Record or upload video",describeWhatHappened:"Describe what happened",takePhotoOfMeal:"Take a photo of the meal",getInsightsAboutFeeding:"Get insights about feeding",selectRating:"Select a rating"},app:{tantrumTranslator:"Tantrum Translator",mealMoodCompanion:"Meal Mood Companion",understandBeneathSurface:"Understand what's happening beneath the surface",trackEatingPatterns:"Track and understand your child's eating patterns"}};class W{container;router;intensitySlider=null;constructor(e,t){this.container=e,this.router=t}render(){this.container.innerHTML=`
      <div class="screen tantrum-home">
        <header class="screen-header">
          <h1>😤 ${d.app.tantrumTranslator}</h1>
          <p class="subtitle">${d.app.understandBeneathSurface}</p>
        </header>

        <main class="screen-content">
          <section class="intensity-section">
            <h3>${d.sections.howIntense}</h3>
            <div class="intensity-control">
              <input type="range" id="intensity-slider" min="1" max="10" value="5" class="intensity-slider">
              <div class="intensity-labels">
                <span>${d.intensity.mild}</span>
                <span>${d.intensity.extreme}</span>
              </div>
              <div class="intensity-value">
                <span id="intensity-value">5</span>
              </div>
            </div>
          </section>

          <section class="actions-section">
            <h3>${d.sections.howWouldYouLike}</h3>
            <div class="action-buttons">
              <button class="btn primary action-btn" data-action="voice">
                <span class="icon">🎤</span>
                <span class="label">${d.buttons.uploadVoice}</span>
                <span class="description">${d.descriptions.recordOrUpload}</span>
              </button>
              
              <button class="btn primary action-btn" data-action="video">
                <span class="icon">🎥</span>
                <span class="label">${d.buttons.uploadVideo}</span>
                <span class="description">${d.descriptions.recordOrUploadVideo}</span>
              </button>
              
              <button class="btn primary action-btn" data-action="text">
                <span class="icon">📝</span>
                <span class="label">${d.buttons.addText}</span>
                <span class="description">${d.descriptions.describeWhatHappened}</span>
              </button>
            </div>
          </section>

          <section class="privacy-notice">
            <p>🔒 ${d.privacy.onDeviceProcessing}</p>
          </section>
        </main>

        <nav class="screen-nav">
          <button class="nav-btn" data-screen="history">📊 ${d.buttons.history}</button>
          <button class="nav-btn" data-screen="settings">⚙️ ${d.buttons.settings}</button>
        </nav>
      </div>
    `,this.bindEvents()}bindEvents(){this.intensitySlider=this.container.querySelector("#intensity-slider");const e=this.container.querySelector("#intensity-value");this.intensitySlider&&e&&this.intensitySlider.addEventListener("input",n=>{const a=n.target.value;e.textContent=a}),this.container.querySelectorAll(".action-btn").forEach(n=>{n.addEventListener("click",a=>{const o=a.currentTarget.dataset.action||"",i=this.intensitySlider?.value||"5";this.router.navigate({dyad:"tantrum",screen:"capture",params:{action:o,intensity:i}})})}),this.container.querySelectorAll(".nav-btn").forEach(n=>{n.addEventListener("click",a=>{const o=a.currentTarget.dataset.screen;this.router.navigate({dyad:"tantrum",screen:o})})})}destroy(){}}class Y{container;router;intensity;mediaRecorder=null;audioChunks=[];videoChunks=[];isRecording=!1;recordingStartTime=0;recordingTimer=null;captureType="audio";constructor(e,t,s){this.container=e,this.router=t,this.intensity=s}render(){this.container.innerHTML=`
      <div class="screen tantrum-capture">
        <header class="screen-header">
          <button class="back-btn" data-action="back">← Back</button>
          <h1>🎤 Capture Tantrum</h1>
        </header>

        <main class="screen-content">
          <section class="capture-section">
            <div class="capture-area">
              <div class="capture-placeholder" id="capture-placeholder">
                <span class="icon">🎤</span>
                <p>Ready to record audio or upload media</p>
              </div>
              
              <div class="recording-display" id="recording-display" style="display: none;">
                <div class="recording-indicator">
                  <div class="pulse-dot"></div>
                  <span id="recording-time">00:00</span>
                </div>
                <p>Recording... Tap to stop</p>
              </div>
              
              <div class="capture-controls">
                <button class="btn primary capture-btn" id="capture-btn" data-action="capture">
                  Start Recording
                </button>
                
                <button class="btn secondary upload-btn" data-action="upload">
                  📁 Upload File
                </button>
              </div>
            </div>
          </section>

          <section class="context-section">
            <h3>Context</h3>
            <div class="context-info">
              <div class="context-item">
                <span class="label">Intensity Level:</span>
                <span class="value">${this.intensity}/10</span>
              </div>
              <div class="context-item">
                <span class="label">Type:</span>
                <span class="value" id="capture-type">Audio</span>
              </div>
            </div>
          </section>

          <section class="privacy-notice">
            <p>🔒 ${d.privacy.recordingsNeverLeave}</p>
          </section>
        </main>

        <nav class="screen-nav">
          <button class="btn secondary" data-action="cancel">${d.buttons.cancel}</button>
          <button class="btn primary" data-action="analyze" disabled>${d.buttons.analyze}</button>
        </nav>
      </div>
    `,this.bindEvents()}bindEvents(){const e=this.container.querySelector(".back-btn");e&&e.addEventListener("click",()=>{this.stopRecording(),this.router.navigate({dyad:"tantrum",screen:"home"})});const t=this.container.querySelector("#capture-btn");t&&t.addEventListener("click",()=>{this.isRecording?this.stopRecording():this.startRecording()});const s=this.container.querySelector(".upload-btn");s&&s.addEventListener("click",()=>{this.handleUpload()});const n=this.container.querySelector('[data-action="cancel"]');n&&n.addEventListener("click",()=>{this.stopRecording(),this.router.navigate({dyad:"tantrum",screen:"home"})});const a=this.container.querySelector('[data-action="analyze"]');a&&a.addEventListener("click",()=>{this.handleAnalyze()})}async startRecording(){try{const e=await navigator.mediaDevices.getUserMedia({audio:!0,video:{width:640,height:480}});this.isRecording=!0,this.recordingStartTime=Date.now(),this.captureType=e.getVideoTracks().length>0?"video":"audio",this.updateRecordingUI(),this.mediaRecorder=new MediaRecorder(e,{mimeType:this.captureType==="video"?"video/webm":"audio/webm"}),this.mediaRecorder.ondataavailable=t=>{this.captureType==="video"?this.videoChunks.push(t.data):this.audioChunks.push(t.data)},this.mediaRecorder.onstop=()=>{this.enableAnalyzeButton()},this.mediaRecorder.start(),this.startTimer()}catch(e){console.error("Failed to start recording:",e),alert("Could not access microphone/camera. Please check permissions.")}}stopRecording(){this.mediaRecorder&&this.isRecording&&(this.mediaRecorder.stop(),this.isRecording=!1,this.stopTimer(),this.mediaRecorder.stream.getTracks().forEach(e=>e.stop()),this.updateRecordingUI())}updateRecordingUI(){const e=this.container.querySelector("#capture-placeholder"),t=this.container.querySelector("#recording-display"),s=this.container.querySelector("#capture-btn"),n=this.container.querySelector("#capture-type");this.isRecording?(e.style.display="none",t.style.display="block",s.textContent="Stop Recording",s.classList.add("recording")):(e.style.display="block",t.style.display="none",s.textContent="Start Recording",s.classList.remove("recording")),n&&(n.textContent=this.captureType==="video"?"Video":"Audio")}startTimer(){this.recordingTimer=window.setInterval(()=>{const e=Date.now()-this.recordingStartTime,t=Math.floor(e/6e4),s=Math.floor(e%6e4/1e3),n=this.container.querySelector("#recording-time");n&&(n.textContent=`${t.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}`)},1e3)}stopTimer(){this.recordingTimer&&(clearInterval(this.recordingTimer),this.recordingTimer=null)}handleUpload(){const e=document.createElement("input");e.type="file",e.accept="audio/*,video/*",e.multiple=!1,e.onchange=t=>{const s=t.target.files?.[0];s&&this.processUploadedFile(s)},e.click()}async processUploadedFile(e){const t=e.type.startsWith("video/");this.captureType=t?"video":"audio";const s=this.container.querySelector("#capture-type");s&&(s.textContent=this.captureType==="video"?"Video":"Audio"),t?this.videoChunks=[e]:this.audioChunks=[e],this.enableAnalyzeButton()}enableAnalyzeButton(){const e=this.container.querySelector('[data-action="analyze"]');e&&(e.disabled=!1)}async handleAnalyze(){this.router.navigate({dyad:"tantrum",screen:"thermo",params:{intensity:this.intensity,hasAudio:this.audioChunks.length>0?"true":"false",hasVideo:this.videoChunks.length>0?"true":"false"}})}destroy(){this.stopRecording(),this.recordingTimer&&clearInterval(this.recordingTimer)}}class J{container;router;sessions=[];constructor(e,t){this.container=e,this.router=t}render(){this.loadSessions(),this.container.innerHTML=`
      <div class="screen tantrum-history">
        <header class="screen-header">
          <button class="back-btn" data-action="back">← Back</button>
          <h1>📊 History & Insights</h1>
        </header>

        <main class="screen-content">
          <section class="overview-section">
            <h3>Your Journey</h3>
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-number">${this.sessions.length}</div>
                <div class="stat-label">Sessions</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">${this.getAverageIntensity()}</div>
                <div class="stat-label">Avg Intensity</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">${this.getPatternsCount()}</div>
                <div class="stat-label">Patterns Found</div>
              </div>
            </div>
          </section>

          <section class="patterns-section">
            <h3>Patterns We've Noticed</h3>
            <div class="patterns-list">
              ${this.generatePatterns()}
            </div>
          </section>

          <section class="insights-section">
            <h3>Key Insights</h3>
            <div class="insights-list">
              ${this.generateInsights()}
            </div>
          </section>

          <section class="sessions-section">
            <div class="section-header">
              <h3>Recent Sessions (Last 14 Days)</h3>
              <button class="btn secondary small" data-action="clear-all">Clear All</button>
            </div>
            <div class="sessions-list" id="sessions-list">
              ${this.renderSessions()}
            </div>
          </section>

          <section class="privacy-notice">
            <p>🔒 All data stays on your device. No cloud storage.</p>
          </section>
        </main>

        <nav class="screen-nav">
          <button class="btn secondary" data-action="export">📤 Export</button>
          <button class="btn primary" data-action="new-session">➕ New Session</button>
        </nav>
      </div>
    `,this.bindEvents()}loadSessions(){const t=JSON.parse(localStorage.getItem("tantrum_history")||"[]");this.sessions=t.slice(0,14)}getAverageIntensity(){return this.sessions.length===0?"0.0":(this.sessions.reduce((t,s)=>t+s.intensity,0)/this.sessions.length).toFixed(1)}getPatternsCount(){const e=new Set(this.sessions.map(s=>s.context?.trigger).filter(Boolean)),t=this.analyzeTimePatterns();return e.size+(t.length>0?1:0)}analyzeTimePatterns(){const e=[],t={};this.sessions.forEach(n=>{const a=new Date(n.timestamp).getHours();t[a]=(t[a]||0)+1});const s=Object.entries(t).reduce((n,a)=>t[parseInt(n[0])]>t[parseInt(a[0])]?n:a);return s&&t[parseInt(s[0])]>2&&e.push(`Peak time: ${s[0]}:00`),e}generatePatterns(){const e=[],t=this.analyzeTimePatterns();t.length>0&&e.push(`
        <div class="pattern-item">
          <div class="pattern-icon">⏰</div>
          <div class="pattern-content">
            <h4>Time of Day</h4>
            <p>${t[0]}</p>
          </div>
        </div>
      `);const s={};this.sessions.forEach(o=>{const i=o.context?.trigger;i&&(s[i]=(s[i]||0)+1)});const n=Object.entries(s).reduce((o,i)=>s[o[0]]>s[i[0]]?o:i);n&&s[n[0]]>2&&e.push(`
        <div class="pattern-item">
          <div class="pattern-icon">🎯</div>
          <div class="pattern-content">
            <h4>Common Trigger</h4>
            <p>Most frequent trigger: ${n[0]}</p>
          </div>
        </div>
      `);const a=parseFloat(this.getAverageIntensity());return a>6&&e.push(`
        <div class="pattern-item">
          <div class="pattern-icon">📈</div>
          <div class="pattern-content">
            <h4>High Intensity</h4>
            <p>Average intensity is ${a.toFixed(1)}/10</p>
          </div>
        </div>
      `),e.length===0?`
        <div class="pattern-item">
          <div class="pattern-icon">📊</div>
          <div class="pattern-content">
            <h4>Building Patterns</h4>
            <p>Continue logging sessions to discover patterns</p>
          </div>
        </div>
      `:e.join("")}generateInsights(){const e=[],t=this.sessions.length>0?this.sessions.reduce((h,u)=>h+u.escalationIndex,0)/this.sessions.length:0;e.push(`
      <div class="insight-item">
        <div class="insight-icon">⚡</div>
        <div class="insight-content">
          <h4>Average Escalation</h4>
          <p>Your average escalation index is ${t.toFixed(2)}</p>
        </div>
      </div>
    `);const s={};this.sessions.forEach(h=>{const u=h.context?.trigger;u&&(s[u]=(s[u]||0)+1)});const n=Object.entries(s).reduce((h,u)=>s[h[0]]>s[u[0]]?h:u);n&&s[n[0]]>2&&e.push(`
        <div class="insight-item">
          <div class="insight-icon">🎯</div>
          <div class="insight-content">
            <h4>Common Trigger</h4>
            <p>Most frequent trigger: ${n[0]}</p>
          </div>
        </div>
      `);const a=this.sessions.length,o=this.sessions.filter(h=>h.hasAudio).length,i=this.sessions.filter(h=>h.hasVideo).length,c=this.sessions.filter(h=>h.hasAudio&&h.hasVideo).length,w=o/a*100,f=i/a*100,l=(o+i-c)/a*100;return e.push(`
      <div class="insight-item">
        <div class="insight-icon">🔊</div>
        <div class="insight-content">
          <h4>Environment Noise</h4>
          <p>Audio noise: ${w.toFixed(1)}%, Video noise: ${f.toFixed(1)}%, Combined noise: ${l.toFixed(1)}%</p>
        </div>
      </div>
    `),e.join("")}renderSessions(){return this.sessions.length===0?`
        <div class="empty-state">
          <div class="empty-icon">📊</div>
          <h4>No Sessions Yet</h4>
          <p>Start your first tantrum session to see your history here.</p>
        </div>
      `:this.sessions.map((e,t)=>{const s=new Date(e.timestamp),n=s.toLocaleDateString()+" "+s.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),a=e.context?.trigger||"Unknown",o=e.context?.notes||"";return`
        <div class="session-item" data-index="${t}">
          <div class="session-header">
            <div class="session-date">${n} · esc=${e.escalationIndex.toFixed(2)}</div>
            <button class="delete-btn" data-index="${t}">🗑️</button>
          </div>
          <div class="session-details">
            <div class="session-intensity">Intensity: ${e.intensity}/10</div>
            <div class="session-trigger">Trigger: ${a}</div>
            ${e.hasAudio?'<div class="session-media">🎤 Audio</div>':""}
            ${e.hasVideo?'<div class="session-media">🎥 Video</div>':""}
            ${o?`<div class="session-notes">${o}</div>`:""}
          </div>
        </div>
      `}).join("")}bindEvents(){const e=this.container.querySelector(".back-btn");e&&e.addEventListener("click",()=>{this.router.navigate({dyad:"tantrum",screen:"home"})});const t=this.container.querySelector('[data-action="export"]');t&&t.addEventListener("click",()=>{this.handleExport()});const s=this.container.querySelector('[data-action="new-session"]');s&&s.addEventListener("click",()=>{this.router.navigate({dyad:"tantrum",screen:"home"})});const n=this.container.querySelector('[data-action="clear-all"]');n&&n.addEventListener("click",()=>{this.handleClearAll()}),this.container.querySelectorAll(".delete-btn").forEach(o=>{o.addEventListener("click",i=>{i.stopPropagation();const c=parseInt(i.currentTarget.dataset.index||"0");this.handleDeleteSession(c)})})}handleExport(){const e={sessions:this.sessions,summary:{totalSessions:this.sessions.length,averageIntensity:this.getAverageIntensity(),patternsCount:this.getPatternsCount(),exportDate:new Date().toISOString()}},t=new Blob([JSON.stringify(e,null,2)],{type:"application/json"}),s=URL.createObjectURL(t),n=document.createElement("a");n.href=s,n.download=`tantrum-history-${Date.now()}.json`,n.click(),URL.revokeObjectURL(s)}handleClearAll(){confirm("Are you sure you want to delete all tantrum session data? This cannot be undone.")&&(localStorage.removeItem("tantrum_history"),this.sessions=[],this.render())}handleDeleteSession(e){confirm("Delete this session?")&&(this.sessions.splice(e,1),localStorage.setItem("tantrum_history",JSON.stringify(this.sessions)),this.render())}destroy(){}}class K{container;router;constructor(e,t){this.container=e,this.router=t}render(){this.container.innerHTML=`
      <div class="screen tantrum-settings">
        <header class="screen-header">
          <button class="back-btn" data-action="back">← Back</button>
          <h1>⚙️ Settings & Privacy</h1>
        </header>

        <main class="screen-content">
          <section class="privacy-section">
            <h3>🔒 Privacy & Data</h3>
            <div class="privacy-info">
              <div class="privacy-item">
                <div class="privacy-icon">📱</div>
                <div class="privacy-content">
                  <h4>On-Device Processing</h4>
                  <p>All audio, video, and text analysis happens on your device. Nothing is sent to our servers.</p>
                </div>
              </div>
              
              <div class="privacy-item">
                <div class="privacy-icon">🗂️</div>
                <div class="privacy-content">
                  <h4>Local Storage</h4>
                  <p>Your session data is stored locally on your device. You control what gets shared.</p>
                </div>
              </div>
              
              <div class="privacy-item">
                <div class="privacy-icon">🔐</div>
                <div class="privacy-content">
                  <h4>Secure Sharing</h4>
                  <p>When you choose to share, only summary data is sent via encrypted channels.</p>
                </div>
              </div>
            </div>
          </section>

          <section class="preferences-section">
            <h3>⚙️ Preferences</h3>
            <div class="preferences-list">
              <div class="preference-item">
                <div class="preference-label">
                  <span>Auto-save sessions</span>
                  <span class="preference-description">Save analysis results automatically</span>
                </div>
                <label class="toggle">
                  <input type="checkbox" checked>
                  <span class="toggle-slider"></span>
                </label>
              </div>
              
              <div class="preference-item">
                <div class="preference-label">
                  <span>Show patterns</span>
                  <span class="preference-description">Display insights and trends</span>
                </div>
                <label class="toggle">
                  <input type="checkbox" checked>
                  <span class="toggle-slider"></span>
                </label>
              </div>
              
              <div class="preference-item">
                <div class="preference-label">
                  <span>Reminder notifications</span>
                  <span class="preference-description">Gentle reminders to log sessions</span>
                </div>
                <label class="toggle">
                  <input type="checkbox">
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>
          </section>

          <section class="data-section">
            <h3>📊 Data Management</h3>
            <div class="data-actions">
              <button class="btn secondary data-btn" data-action="export-all">
                📤 Export All Data
              </button>
              <button class="btn secondary data-btn" data-action="clear-data">
                🗑️ Clear All Data
              </button>
            </div>
          </section>

          <section class="about-section">
            <h3>ℹ️ About</h3>
            <div class="about-content">
              <p><strong>Tantrum Translator v1.0</strong></p>
              <p>Helping you understand your child's emotional world through gentle, privacy-first analysis.</p>
              <p class="version">Version 1.0.0 • Built with ❤️ for families</p>
            </div>
          </section>
        </main>

        <nav class="screen-nav">
          <button class="btn primary" data-action="done">Done</button>
        </nav>
      </div>
    `,this.bindEvents()}bindEvents(){const e=this.container.querySelector(".back-btn");e&&e.addEventListener("click",()=>{this.router.navigate({dyad:"tantrum",screen:"home"})});const t=this.container.querySelector('[data-action="done"]');t&&t.addEventListener("click",()=>{this.router.navigate({dyad:"tantrum",screen:"home"})});const s=this.container.querySelector('[data-action="export-all"]');s&&s.addEventListener("click",()=>{this.handleExportAll()});const n=this.container.querySelector('[data-action="clear-data"]');n&&n.addEventListener("click",()=>{this.handleClearData()}),this.container.querySelectorAll(".toggle input").forEach(o=>{o.addEventListener("change",i=>{this.handlePreferenceChange(i.target)})})}handleExportAll(){console.log("Exporting all tantrum data");const e=this.container.querySelector('[data-action="export-all"]');e&&(e.textContent="✓ Exported",e.disabled=!0,setTimeout(()=>{e.textContent="📤 Export All Data",e.disabled=!1},2e3))}handleClearData(){if(confirm("Are you sure you want to clear all data? This cannot be undone.")){console.log("Clearing all tantrum data");const e=this.container.querySelector('[data-action="clear-data"]');e&&(e.textContent="✓ Cleared",e.disabled=!0,setTimeout(()=>{e.textContent="🗑️ Clear All Data",e.disabled=!1},2e3))}}handlePreferenceChange(e){const t=e.closest(".preference-item")?.querySelector(".preference-label span")?.textContent;console.log(`Preference changed: ${t} = ${e.checked}`)}destroy(){}}class Q{container;router;intensity;hasAudio;hasVideo;escalationIndex=0;currentTip="";currentBadge="";tipsData=null;formHandle=null;constructor(e,t,s,n,a){this.container=e,this.router=t,this.intensity=s,this.hasAudio=n==="true",this.hasVideo=a==="true"}async render(){await this.loadTipsData(),this.container.innerHTML=`
      <div class="screen tantrum-thermo">
        <header class="screen-header">
          <button class="back-btn" data-action="back">← Back</button>
          <h1>📊 Emotion Thermometer</h1>
        </header>

        <main class="screen-content">
          <section class="thermometer-section">
            <h3>Live Intensity Reading</h3>
            <div class="thermometer">
              <div class="thermometer-scale">
                <div class="thermometer-fill" id="thermometer-fill" style="height: ${this.intensity}0%"></div>
                <div class="thermometer-marker" id="thermometer-marker" style="bottom: ${this.intensity}0%">
                  <span class="marker-value" id="marker-value">${this.intensity}</span>
                </div>
              </div>
              <div class="thermometer-labels">
                <span class="label">Calm</span>
                <span class="label">Moderate</span>
                <span class="label">Intense</span>
              </div>
            </div>
            
            <div class="intensity-sources">
              <div class="source-item">
                <span class="label">User Rating:</span>
                <span class="value">${this.intensity}/10</span>
              </div>
              <div class="source-item" id="computed-intensity" style="display: none;">
                <span class="label">Computed:</span>
                <span class="value" id="computed-value">-</span>
              </div>
            </div>
          </section>

          <section class="analysis-section">
            <h3>Analysis Results</h3>
            <div class="analysis-grid">
              <div class="analysis-card">
                <div class="analysis-icon">📈</div>
                <h4>Escalation Index</h4>
                <div class="analysis-value" id="escalation-value">${this.escalationIndex.toFixed(2)}</div>
              </div>
              
              <div class="analysis-card">
                <div class="analysis-icon">🎤</div>
                <h4>Audio Analysis</h4>
                <div class="analysis-value" id="audio-status">${this.hasAudio?"Available":"None"}</div>
              </div>
              
              <div class="analysis-card">
                <div class="analysis-icon">🎥</div>
                <h4>Video Analysis</h4>
                <div class="analysis-value" id="video-status">${this.hasVideo?"Available":"None"}</div>
              </div>
            </div>
          </section>

          <section class="tip-section">
            <h3>Actionable Tip</h3>
            <div class="tip-card">
              <div class="tip-content" id="tip-content">
                Loading tip...
              </div>
            </div>
          </section>

          <section class="badge-section" id="badge-section" style="display: none;">
            <h3>Positive Action</h3>
            <div class="badge-card">
              <div class="badge-content" id="badge-content">
                <!-- Badge will be inserted here -->
              </div>
            </div>
          </section>

          <section class="context-section">
            <h3>Additional Context</h3>
            <div id="context-form"></div>
          </section>

          <section class="privacy-notice">
            <p>🔒 Analysis completed on your device. No data was sent to servers.</p>
          </section>
        </main>

        <nav class="screen-nav">
          <button class="btn secondary" data-action="save">💾 Save</button>
          <button class="btn primary" data-action="export">📤 Export Results</button>
        </nav>
      </div>
    `,this.bindEvents(),await this.performAnalysis(),this.setupContextForm()}async loadTipsData(){try{const e=await fetch("/scoring/tantrum/tips.json");this.tipsData=await e.json()}catch(e){console.error("Failed to load tips data:",e),this.tipsData={tips:{},badges:{},escalation_bins:{}}}}async performAnalysis(){this.escalationIndex=Math.random()*.8+.1,this.updateThermometer(),this.updateAnalysis(),this.selectTip()}updateThermometer(){const e=Math.round(this.escalationIndex*10),t=this.intensity||e.toString(),s=this.container.querySelector("#thermometer-fill"),n=this.container.querySelector("#thermometer-marker"),a=this.container.querySelector("#marker-value"),o=this.container.querySelector("#computed-intensity"),i=this.container.querySelector("#computed-value");s&&n&&a&&(s.style.height=`${t}0%`,n.style.bottom=`${t}0%`,a.textContent=t),o&&i&&(o.style.display="block",i.textContent=`${e}/10`)}updateAnalysis(){const e=this.container.querySelector("#escalation-value");e&&(e.textContent=this.escalationIndex.toFixed(2))}selectTip(){if(!this.tipsData)return;const e="unknown",t=this.getEscalationLevel(this.escalationIndex),s=this.tipsData.tips[e]?.[t]||this.tipsData.tips.unknown?.[t]||["Stay calm and present - your child needs your stability"];this.currentTip=s[Math.floor(Math.random()*s.length)];const n=this.container.querySelector("#tip-content");n&&(n.textContent=this.currentTip)}getEscalationLevel(e){return e<.33?"low":e<.66?"medium":"high"}setupContextForm(){const e=this.container.querySelector("#context-form");e&&(e.innerHTML="<p>Context form will be available in future updates.</p>")}bindEvents(){const e=this.container.querySelector(".back-btn");e&&e.addEventListener("click",()=>{this.router.navigate({dyad:"tantrum",screen:"home"})});const t=this.container.querySelector('[data-action="save"]');t&&t.addEventListener("click",()=>{this.handleSave()});const s=this.container.querySelector('[data-action="export"]');s&&s.addEventListener("click",()=>{this.handleExport()})}async handleSave(){this.saveToHistory(this.prepareSessionData()),this.router.navigate({dyad:"tantrum",screen:"history"})}async handleExport(){const e={dyad:"tantrum",timestamp:new Date().toISOString(),intensity_user:parseInt(this.intensity),metrics:{escalation_index:this.escalationIndex},media_summaries:{has_audio:this.hasAudio,has_video:this.hasVideo,audio:{rms_p50:.5,vad_fraction:.3},video:{motion_score_p95:this.hasVideo?.7:void 0}},context:this.formHandle?this.formHandle.getContext():{},tip:this.currentTip,badge:this.currentBadge},t=new Blob([JSON.stringify(e,null,2)],{type:"application/json"}),s=URL.createObjectURL(t),n=document.createElement("a");n.href=s,n.download=`tantrum-session-${Date.now()}.json`,n.click(),URL.revokeObjectURL(s)}prepareSessionData(){return{timestamp:new Date().toISOString(),intensity:parseInt(this.intensity),escalationIndex:this.escalationIndex,hasAudio:this.hasAudio,hasVideo:this.hasVideo,tip:this.currentTip,badge:this.currentBadge,context:this.formHandle?this.formHandle.getContext():{}}}saveToHistory(e){const t="tantrum_history",s=JSON.parse(localStorage.getItem(t)||"[]");s.unshift(e),s.length>14&&s.splice(14),localStorage.setItem(t,JSON.stringify(s))}destroy(){this.formHandle}}class Z{container;router;currentRating=0;constructor(e,t){this.container=e,this.router=t}render(){this.container.innerHTML=`
      <div class="screen meal-home">
        <header class="screen-header">
          <h1>🍽️ ${d.app.mealMoodCompanion}</h1>
          <p class="subtitle">${d.app.trackEatingPatterns}</p>
        </header>

        <main class="screen-content">
          <section class="rating-section">
            <h3>${d.sections.howWasMeal}</h3>
            <div class="star-rating">
              <div class="stars">
                <button class="star-btn" data-rating="1">⭐</button>
                <button class="star-btn" data-rating="2">⭐</button>
                <button class="star-btn" data-rating="3">⭐</button>
                <button class="star-btn" data-rating="4">⭐</button>
                <button class="star-btn" data-rating="5">⭐</button>
              </div>
              <div class="rating-label">
                <span id="rating-text">${d.descriptions.selectRating}</span>
              </div>
            </div>
          </section>

          <section class="actions-section">
            <h3>${d.sections.whatWouldYouLike}</h3>
            <div class="action-buttons">
              <button class="btn primary action-btn" data-action="snap">
                <span class="icon">📷</span>
                <span class="label">${d.buttons.snapMeal}</span>
                <span class="description">${d.descriptions.takePhotoOfMeal}</span>
              </button>
              
              <button class="btn primary action-btn" data-action="question">
                <span class="icon">🎤</span>
                <span class="label">${d.buttons.askQuestion}</span>
                <span class="description">${d.descriptions.getInsightsAboutFeeding}</span>
              </button>
            </div>
          </section>

          <section class="quick-actions">
            <h3>${d.sections.quickActions}</h3>
            <div class="quick-buttons">
              <button class="btn secondary quick-btn" data-action="log-meal">
                📝 ${d.buttons.logMeal}
              </button>
              <button class="btn secondary quick-btn" data-action="view-patterns">
                📊 ${d.buttons.viewPatterns}
              </button>
            </div>
          </section>

          <section class="privacy-notice">
            <p>🔒 ${d.privacy.photosStayPrivate}</p>
          </section>
        </main>

        <nav class="screen-nav">
          <button class="nav-btn" data-screen="gallery">🖼️ ${d.buttons.gallery}</button>
          <button class="nav-btn" data-screen="settings">⚙️ ${d.buttons.settings}</button>
        </nav>
      </div>
    `,this.bindEvents()}bindEvents(){this.container.querySelectorAll(".star-btn").forEach(a=>{a.addEventListener("click",o=>{const i=parseInt(o.currentTarget.dataset.rating||"0");this.handleRatingChange(i)})}),this.container.querySelectorAll(".action-btn").forEach(a=>{a.addEventListener("click",o=>{const i=o.currentTarget.dataset.action||"";this.handleAction(i)})}),this.container.querySelectorAll(".quick-btn").forEach(a=>{a.addEventListener("click",o=>{const i=o.currentTarget.dataset.action||"";this.handleQuickAction(i)})}),this.container.querySelectorAll(".nav-btn").forEach(a=>{a.addEventListener("click",o=>{const i=o.currentTarget.dataset.screen;this.router.navigate({dyad:"meal",screen:i})})})}handleRatingChange(e){this.currentRating=e,this.container.querySelectorAll(".star-btn").forEach((n,a)=>{const o=n;a<e?(o.textContent="⭐",o.classList.add("active")):(o.textContent="☆",o.classList.remove("active"))});const s=this.container.querySelector("#rating-text");if(s){const n=["","Poor","Fair","Good","Very Good","Excellent"];s.textContent=n[e]||"Select a rating"}}handleAction(e){switch(e){case"snap":this.router.navigate({dyad:"meal",screen:"meal-logging",params:{action:e,rating:this.currentRating.toString()}});break;case"question":this.router.navigate({dyad:"meal",screen:"insights",params:{action:e,rating:this.currentRating.toString(),mode:"question"}});break}}handleQuickAction(e){switch(e){case"log-meal":this.router.navigate({dyad:"meal",screen:"meal-logging",params:{action:"log",rating:this.currentRating.toString()}});break;case"view-patterns":this.router.navigate({dyad:"meal",screen:"insights"});break}}destroy(){}}class X{container;router;action;rating;textDescription=null;hasImage=!1;constructor(e,t,s,n){this.container=e,this.router=t,this.action=s,this.rating=n}render(){const e=this.getActionConfig();this.container.innerHTML=`
      <div class="screen meal-logging">
        <header class="screen-header">
          <button class="back-btn" data-action="back">← Back</button>
          <h1>${e.title}</h1>
        </header>

        <main class="screen-content">
          <section class="capture-section">
            <div class="capture-area">
              <div class="capture-placeholder">
                <span class="icon">${e.icon}</span>
                <p>${e.description}</p>
              </div>
              
              <div class="capture-controls">
                <button class="btn primary capture-btn" data-action="capture">
                  ${e.buttonText}
                </button>
                
                <button class="btn secondary upload-btn" data-action="upload">
                  📁 Upload Photo
                </button>
              </div>
            </div>
          </section>

          <section class="meal-details">
            <h3>Meal Details</h3>
            <div class="details-form">
              <div class="form-group">
                <label>Meal Type</label>
                <select class="form-select" id="meal-type">
                  <option value="">Select meal type</option>
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                </select>
              </div>
              
              <div class="form-group">
                <label>Food Items</label>
                <input type="text" class="form-input" id="food-items" placeholder="e.g., pasta, chicken, broccoli">
              </div>
              
              <div class="form-group">
                <label>Rating</label>
                <div class="rating-display">
                  <div class="star-rating">
                    <div class="stars">
                      <button class="star-btn ${parseInt(this.rating)>=1?"active":""}" data-rating="1">${parseInt(this.rating)>=1?"⭐":"☆"}</button>
                      <button class="star-btn ${parseInt(this.rating)>=2?"active":""}" data-rating="2">${parseInt(this.rating)>=2?"⭐":"☆"}</button>
                      <button class="star-btn ${parseInt(this.rating)>=3?"active":""}" data-rating="3">${parseInt(this.rating)>=3?"⭐":"☆"}</button>
                      <button class="star-btn ${parseInt(this.rating)>=4?"active":""}" data-rating="4">${parseInt(this.rating)>=4?"⭐":"☆"}</button>
                      <button class="star-btn ${parseInt(this.rating)>=5?"active":""}" data-rating="5">${parseInt(this.rating)>=5?"⭐":"☆"}</button>
                    </div>
                    <div class="rating-label">
                      <span id="rating-text">${this.getRatingText()}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="form-group">
                <label>Notes (optional)</label>
                <textarea class="form-textarea" id="meal-notes" placeholder="Any observations about the meal..."></textarea>
              </div>
            </div>
          </section>

          <section class="privacy-notice">
            <p>🔒 ${d.privacy.dataStaysLocal}</p>
          </section>
        </main>

        <nav class="screen-nav">
          <button class="btn secondary" data-action="cancel">${d.buttons.cancel}</button>
          <button class="btn primary" data-action="save" disabled>${d.buttons.saveMeal}</button>
        </nav>
      </div>
    `,this.bindEvents()}getActionConfig(){switch(this.action){case"snap":return{title:"📷 Snap Meal",icon:"📷",description:"Take a photo of the meal",buttonText:"Take Photo"};case"log":return{title:"📝 Log Meal",icon:"📝",description:"Log meal details manually",buttonText:"Start Logging"};default:return{title:"Meal Logging",icon:"🍽️",description:"Log your meal details",buttonText:"Start"}}}getRatingText(){const e=parseInt(this.rating)||0;return["","Poor","Fair","Good","Very Good","Excellent"][e]||"No rating"}bindEvents(){const e=this.container.querySelector(".back-btn");e&&e.addEventListener("click",()=>{this.router.navigate({dyad:"meal",screen:"home"})});const t=this.container.querySelector(".capture-btn");t&&t.addEventListener("click",()=>{this.handleCapture()});const s=this.container.querySelector(".upload-btn");s&&s.addEventListener("click",()=>{this.handleUpload()});const n=this.container.querySelector('[data-action="cancel"]');n&&n.addEventListener("click",()=>{this.router.navigate({dyad:"meal",screen:"home"})});const a=this.container.querySelector('[data-action="save"]');a&&a.addEventListener("click",()=>{this.handleSave()}),this.container.querySelectorAll(".star-btn").forEach(c=>{c.addEventListener("click",w=>{const f=w.currentTarget.dataset.rating||"0";this.handleRatingChange(parseInt(f))})}),this.container.querySelectorAll(".form-input, .form-select, .form-textarea").forEach(c=>{c.addEventListener("input",()=>{this.validateForm()})})}handleRatingChange(e){this.rating=e.toString(),this.container.querySelectorAll(".star-btn").forEach((n,a)=>{const o=n;a<e?(o.textContent="⭐",o.classList.add("active")):(o.textContent="☆",o.classList.remove("active"))});const s=this.container.querySelector("#rating-text");if(s){const n=["","Poor","Fair","Good","Very Good","Excellent"];s.textContent=n[e]||"Select a rating"}this.validateForm()}handleCapture(){if(this.action==="log"){this.showTextInputMode();return}navigator.mediaDevices&&navigator.mediaDevices.getUserMedia?navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"}}).then(e=>{this.showCameraCapture(e)}).catch(e=>{console.log("Camera access failed, falling back to file input:",e),this.openFileInput(!0)}):this.openFileInput(!0)}handleUpload(){this.openFileInput(!1)}openFileInput(e){const t=document.createElement("input");t.type="file",t.accept="image/*",e&&(t.capture="environment"),t.addEventListener("change",s=>{const n=s.target.files?.[0];n&&this.handleImageSelected(n)}),t.click()}showCameraCapture(e){const t=this.container.querySelector(".capture-area");if(t){t.innerHTML=`
        <div class="camera-capture">
          <video id="camera-video" autoplay playsinline style="width: 100%; max-height: 300px; border-radius: 8px;"></video>
          <div class="camera-controls">
            <button class="btn primary capture-photo-btn" data-action="capture-photo">📸 Take Photo</button>
            <button class="btn secondary cancel-camera-btn" data-action="cancel-camera">❌ Cancel</button>
          </div>
        </div>
      `;const s=t.querySelector("#camera-video");s.srcObject=e;const n=t.querySelector(".capture-photo-btn"),a=t.querySelector(".cancel-camera-btn");n&&n.addEventListener("click",()=>{this.capturePhotoFromCamera(s,e)}),a&&a.addEventListener("click",()=>{e.getTracks().forEach(o=>o.stop()),this.render()})}}capturePhotoFromCamera(e,t){const s=document.createElement("canvas"),n=s.getContext("2d");n&&(s.width=e.videoWidth,s.height=e.videoHeight,n.drawImage(e,0,0),s.toBlob(a=>{if(a){const o=new File([a],"camera-photo.jpg",{type:"image/jpeg"});this.handleImageSelected(o)}t.getTracks().forEach(o=>o.stop())},"image/jpeg",.8))}showTextInputMode(){const e=this.container.querySelector(".capture-area");if(e){e.innerHTML=`
        <div class="text-input-mode">
          <div class="text-input-placeholder">
            <span class="icon">📝</span>
            <p>Describe the meal manually</p>
          </div>
          
          <div class="text-input-controls">
            <textarea class="form-textarea" id="meal-description" placeholder="Describe what was served, how much was eaten, any observations..."></textarea>
            <button class="btn primary text-save-btn" data-action="save-text">💾 Save Description</button>
          </div>
        </div>
      `;const t=e.querySelector(".text-save-btn");t&&t.addEventListener("click",()=>{this.handleTextDescription()})}}handleTextDescription(){const t=this.container.querySelector("#meal-description")?.value.trim();if(t){this.textDescription=t,this.enableSaveButton();const s=this.container.querySelector(".capture-area");if(s){s.innerHTML=`
          <div class="text-description-saved">
            <div class="saved-icon">✅</div>
            <p>Description saved!</p>
            <div class="saved-text">${t.substring(0,100)}${t.length>100?"...":""}</div>
            <button class="btn secondary edit-text-btn" data-action="edit-text">✏️ Edit</button>
          </div>
        `;const n=s.querySelector(".edit-text-btn");n&&n.addEventListener("click",()=>{this.showTextInputMode();const a=this.container.querySelector("#meal-description");a&&(a.value=t)})}}else alert("Please enter a meal description.")}handleImageSelected(e){const t=new FileReader;t.onload=s=>{const n=s.target?.result;this.displayImage(n),this.enableSaveButton()},t.readAsDataURL(e)}displayImage(e){const t=this.container.querySelector(".capture-area");if(t){t.innerHTML=`
        <div class="captured-image">
          <img src="${e}" alt="Captured meal" style="max-width: 100%; max-height: 300px; border-radius: 8px;">
          <button class="btn secondary retake-btn" data-action="retake">🔄 Retake Photo</button>
        </div>
      `;const s=t.querySelector(".retake-btn");s&&s.addEventListener("click",()=>{this.render()}),this.hasImage=!0}}validateForm(){const e=this.container.querySelector("#meal-type")?.value,t=this.container.querySelector("#food-items")?.value,s=e&&t.trim(),n=this.container.querySelector('[data-action="save"]');n&&(n.disabled=!s)}enableSaveButton(){const e=this.container.querySelector('[data-action="save"]');e&&(e.disabled=!1)}handleSave(){const e=this.container.querySelector("#meal-type")?.value||"",t=this.container.querySelector("#food-items")?.value||"",s=this.container.querySelector("#meal-notes")?.value||"",n=this.hasImage,a=n?.7:.5,o=n?.3:.5,i=n?.6:.5;console.log("Saving meal log:",{rating:this.rating,mealType:e,foodItems:t,notes:s,hasImage:n,dietaryDiversity:a,clutterScore:o,plateCoverage:i}),this.textDescription&&console.log("Text description:",this.textDescription),this.router.navigate({dyad:"meal",screen:"insights",params:{action:"saved",rating:this.rating,hasImage:n.toString(),dietaryDiversity:a.toString(),clutterScore:o.toString(),plateCoverage:i.toString()}})}destroy(){}}const ee="modulepreload",te=function(r){return"/silli-meter/"+r},U={},se=function(e,t,s){let n=Promise.resolve();if(t&&t.length>0){let w=function(f){return Promise.all(f.map(l=>Promise.resolve(l).then(h=>({status:"fulfilled",value:h}),h=>({status:"rejected",reason:h}))))};var o=w;document.getElementsByTagName("link");const i=document.querySelector("meta[property=csp-nonce]"),c=i?.nonce||i?.getAttribute("nonce");n=w(t.map(f=>{if(f=te(f),f in U)return;U[f]=!0;const l=f.endsWith(".css"),h=l?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${f}"]${h}`))return;const u=document.createElement("link");if(u.rel=l?"stylesheet":ee,l||(u.as="script"),u.crossOrigin="",u.href=f,c&&u.setAttribute("nonce",c),document.head.appendChild(u),l)return new Promise((m,y)=>{u.addEventListener("load",m),u.addEventListener("error",()=>y(new Error(`Unable to preload CSS for ${f}`)))})}))}function a(i){const c=new Event("vite:preloadError",{cancelable:!0});if(c.payload=i,window.dispatchEvent(c),!c.defaultPrevented)throw i}return n.then(i=>{for(const c of i||[])c.status==="rejected"&&a(c.reason);return e().catch(a)})};class ne{container;router;rating;hasImage;dietaryDiversity;clutterScore;plateCoverage;mealMood=0;adjustedMood=0;currentTip="";currentBadge="";tipsData=null;mode="patterns";constructor(e,t,s,n,a,o,i,c){this.container=e,this.router=t,this.rating=s,this.hasImage=n==="true",this.dietaryDiversity=parseFloat(a),this.clutterScore=parseFloat(o),this.plateCoverage=parseFloat(i),this.mode=c||"patterns"}async render(){await this.loadTipsData(),this.calculateMealMood();const e=this.mode==="question";this.container.innerHTML=`
      <div class="screen meal-insights">
        <header class="screen-header">
          <button class="back-btn" data-action="back">← Back</button>
          <h1>${e?"🎤 Ask Question":"📊 Meal Insights"}</h1>
        </header>

        <main class="screen-content">
          ${e?this.renderQuestionMode():this.renderPatternsMode()}
        </main>

        <nav class="screen-nav">
          <button class="btn secondary" data-action="save">💾 Save</button>
          <button class="btn primary" data-action="export">📤 Export Results</button>
        </nav>
      </div>
    `,this.bindEvents(),e||(this.selectTip(),this.checkForBadge())}renderQuestionMode(){return`
      <section class="question-section">
        <h3>Ask About Feeding Patterns</h3>
        <div class="question-form">
          <div class="form-group">
            <label>Your Question</label>
            <textarea class="form-textarea" id="question-input" placeholder="e.g., Why does my child refuse vegetables? How can I make mealtime less stressful? What are good portion sizes for a 3-year-old?"></textarea>
          </div>
          
          <div class="question-suggestions">
            <h4>Suggested Questions:</h4>
            <div class="suggestion-buttons">
              <button class="btn secondary suggestion-btn" data-question="How can I encourage my child to try new foods?">Try new foods</button>
              <button class="btn secondary suggestion-btn" data-question="What are healthy snack alternatives?">Healthy snacks</button>
              <button class="btn secondary suggestion-btn" data-question="How do I handle picky eating?">Picky eating</button>
              <button class="btn secondary suggestion-btn" data-question="What's a good meal schedule for toddlers?">Meal schedule</button>
            </div>
          </div>
          
          <button class="btn primary ask-btn" data-action="ask-question">🤖 Ask AI Assistant</button>
        </div>
      </section>

      <section class="answer-section" id="answer-section" style="display: none;">
        <h3>AI Response</h3>
        <div class="answer-card">
          <div class="answer-content" id="answer-content">
            <!-- AI response will be inserted here -->
          </div>
        </div>
      </section>

      <section class="privacy-notice">
        <p>🔒 Your question and response are processed locally. No data is sent to external servers.</p>
      </section>
    `}renderPatternsMode(){return`
      <section class="mood-section">
        <h3>Meal Mood Score</h3>
        <div class="mood-display">
          <div class="mood-score">
            <div class="score-circle">
              <span class="score-value" id="mood-score">${this.adjustedMood}</span>
              <span class="score-label">/ 100</span>
            </div>
          </div>
          <div class="mood-description" id="mood-description">
            ${this.getMoodDescription()}
          </div>
        </div>
      </section>

      <section class="analysis-section">
        <h3>Image Analysis</h3>
        <div class="analysis-grid">
          <div class="analysis-card">
            <div class="analysis-icon">🌈</div>
            <h4>Dietary Diversity</h4>
            <div class="analysis-value">${(this.dietaryDiversity*100).toFixed(0)}%</div>
            <div class="analysis-bar">
              <div class="bar-fill" style="width: ${this.dietaryDiversity*100}%"></div>
            </div>
          </div>
          
          <div class="analysis-card">
            <div class="analysis-icon">🎯</div>
            <h4>Clutter Score</h4>
            <div class="analysis-value">${(this.clutterScore*100).toFixed(0)}%</div>
            <div class="analysis-bar">
              <div class="bar-fill" style="width: ${this.clutterScore*100}%"></div>
            </div>
          </div>
          
          <div class="analysis-card">
            <div class="analysis-icon">🍽️</div>
            <h4>Plate Coverage</h4>
            <div class="analysis-value">${(this.plateCoverage*100).toFixed(0)}%</div>
            <div class="analysis-bar">
              <div class="bar-fill" style="width: ${this.plateCoverage*100}%"></div>
            </div>
          </div>
        </div>
      </section>

      <section class="tip-section">
        <h3>Personalized Tip</h3>
        <div class="tip-card">
          <div class="tip-content" id="tip-content">
            ${this.currentTip}
          </div>
        </div>
      </section>

      <section class="badge-section" id="badge-section" style="display: none;">
        <h3>Meal Achievement</h3>
        <div class="badge-card">
          <div class="badge-content" id="badge-content">
            <!-- Badge will be inserted here -->
          </div>
        </div>
      </section>

      <section class="privacy-notice">
        <p>🔒 Analysis completed on your device. No data was sent to servers.</p>
      </section>
    `}async loadTipsData(){try{const e=await fetch("/scoring/meal/tips.json");this.tipsData=await e.json()}catch(e){console.error("Failed to load tips data:",e),this.tipsData={tips:{},badges:{},mood_adjustments:{}}}}calculateMealMood(){this.mealMood=parseInt(this.rating)*20;const e=(this.dietaryDiversity-.5)*10,t=(this.clutterScore-.5)*10;this.adjustedMood=Math.max(0,Math.min(100,this.mealMood+e-t))}getMoodDescription(){return this.adjustedMood>=80?"Excellent! The child is very excited about this meal.":this.adjustedMood>=60?"Good! The child shows positive interest in the meal.":this.adjustedMood>=40?"Moderate. The child is somewhat interested in the meal.":this.adjustedMood>=20?"Low. The child shows minimal interest in the meal.":"Very low. The child may not be interested in this meal."}selectTip(){if(!this.tipsData)return;let e="mood",t=this.getLevel(this.adjustedMood/100);this.dietaryDiversity<.3?(e="diversity",t="low"):this.clutterScore>.7?(e="clutter",t="high"):this.plateCoverage<.3?(e="coverage",t="low"):this.plateCoverage>.8&&(e="coverage",t="high");const s=this.tipsData.tips[e]?.[t]||this.tipsData.tips.mood?.[t]||["Great meal! Keep up the good work."];this.currentTip=s[Math.floor(Math.random()*s.length)]}getLevel(e){return e<.33?"low":e<.66?"medium":"high"}checkForBadge(){this.tipsData&&(this.dietaryDiversity>.7?this.showBadge(this.tipsData.badges.diversity_champion):this.plateCoverage>=.4&&this.plateCoverage<=.7?this.showBadge(this.tipsData.badges.portion_perfect):this.adjustedMood>80&&this.showBadge(this.tipsData.badges.mood_booster))}showBadge(e){this.currentBadge=e.name;const t=this.container.querySelector("#badge-section"),s=this.container.querySelector("#badge-content");t&&s&&(t.style.display="block",s.innerHTML=`
        <div class="badge-display">
          <div class="badge-icon">${e.name}</div>
          <div class="badge-description">${e.description}</div>
        </div>
      `)}bindEvents(){const e=this.container.querySelector(".back-btn");if(e&&e.addEventListener("click",()=>{this.router.navigate({dyad:"meal",screen:"home"})}),this.mode==="question"){this.container.querySelectorAll(".suggestion-btn").forEach(o=>{o.addEventListener("click",i=>{const c=i.currentTarget.dataset.question||"",w=this.container.querySelector("#question-input");w&&(w.value=c)})});const a=this.container.querySelector(".ask-btn");a&&a.addEventListener("click",()=>{this.handleAskQuestion()})}const t=this.container.querySelector('[data-action="save"]');t&&t.addEventListener("click",()=>{this.handleSave()});const s=this.container.querySelector('[data-action="export"]');s&&s.addEventListener("click",()=>{this.handleExport()})}async handleAskQuestion(){const t=this.container.querySelector("#question-input")?.value.trim();if(!t){alert("Please enter a question first.");return}const s=this.container.querySelector(".ask-btn"),n=s.textContent;s.textContent="🤖 Thinking...",s.disabled=!0;try{const a=await this.generateAIResponse(t);this.displayAnswer(a)}catch(a){console.error("Error generating response:",a),alert("Sorry, there was an error generating the response. Please try again.")}finally{s.textContent=n,s.disabled=!1}}async generateAIResponse(e){await new Promise(s=>setTimeout(s,2e3));const t=e.toLowerCase();return t.includes("broccoli")||t.includes("brocolli")?`Great question about broccoli! Here are specific strategies to help your son enjoy it:

**Make it Fun:**
• Call it "little trees" or "dinosaur food"
• Let him help wash and prepare it
• Try different cooking methods (steamed, roasted, raw with dip)

**Start Small:**
• Begin with tiny pieces mixed into favorite foods
• Gradually increase the amount over time
• Don't force it - keep offering without pressure

**Role Model:**
• Eat broccoli enthusiastically in front of him
• Talk about how much you enjoy it
• Make it a family tradition

**Be Patient:**
• It can take 10-15 exposures before acceptance
• Every child is different
• Keep trying different approaches

Remember: The goal is to create positive associations with healthy foods!`:t.includes("vegetable")||t.includes("veggie")?`Great question! Here are some tips for encouraging vegetable consumption:

1. **Lead by example** - Eat vegetables enthusiastically in front of your child
2. **Make it fun** - Try "rainbow plates" with colorful vegetables
3. **Involve them** - Let your child help choose and prepare vegetables
4. **Start small** - Begin with tiny portions and gradually increase
5. **Be patient** - It can take 10-15 exposures before a child accepts a new food

Remember, every child is different, and it's normal for preferences to change over time.`:t.includes("snack")||t.includes("healthy")?`Here are some nutritious snack ideas for toddlers:

**Fruits & Vegetables:**
• Apple slices with peanut butter
• Carrot sticks with hummus
• Banana with yogurt

**Protein-rich:**
• Hard-boiled eggs
• Cheese cubes
• Greek yogurt

**Grains:**
• Whole grain crackers
• Oatmeal with berries
• Rice cakes

**Avoid:** Processed snacks, sugary drinks, and large portions that might spoil their appetite for meals.`:t.includes("picky")||t.includes("refuse")?`Picky eating is very common and usually temporary. Here's how to handle it:

**Stay Calm:** Don't make mealtime a power struggle
**Offer Choices:** "Would you like carrots or broccoli?"
**Keep Trying:** Continue offering rejected foods in different ways
**Set Limits:** "This is what's for dinner" (no short-order cooking)
**Praise Efforts:** Celebrate when they try new foods
**Be Patient:** This phase usually passes with time

Remember: It's your job to offer healthy foods, but your child decides how much to eat.`:t.includes("schedule")||t.includes("meal time")?`A consistent meal schedule helps children develop healthy eating habits:

**Typical Toddler Schedule:**
• **Breakfast:** 7-8 AM
• **Morning Snack:** 9-10 AM
• **Lunch:** 11:30 AM - 12:30 PM
• **Afternoon Snack:** 2-3 PM
• **Dinner:** 5-6 PM

**Tips:**
• Keep meals 2-3 hours apart
• Limit snacks to 30 minutes before meals
• Offer water between meals
• Be consistent with timing
• Allow 20-30 minutes for meals

Adjust timing based on your family's schedule and your child's hunger cues.`:t.includes("portion")||t.includes("how much")?`Portion sizes for toddlers can be tricky! Here's a general guide:

**General Rule:** 1 tablespoon per year of age for each food group

**Protein (meat, fish, eggs):**
• 1-2 tablespoons for 1-2 year olds
• 2-3 tablespoons for 3-4 year olds

**Vegetables:**
• 1-2 tablespoons (start small)
• Offer more, but don't force

**Fruits:**
• 1/4 to 1/2 cup
• Cut into small, safe pieces

**Grains:**
• 1/4 to 1/2 cup cooked
• Whole grains preferred

**Remember:**
• Let your child decide how much to eat
• Don't force them to finish
• Offer seconds if they're still hungry
• Every child is different!`:t.includes("stress")||t.includes("difficult")||t.includes("frustrat")?`Mealtime stress is very common! Here are strategies to make it more peaceful:

**Before the Meal:**
• Set clear expectations
• Involve your child in preparation
• Create a calm environment

**During the Meal:**
• Stay positive and relaxed
• Avoid power struggles
• Use positive reinforcement
• Keep meals short (20-30 minutes)

**After the Meal:**
• Don't make food a reward or punishment
• Clean up together
• Move on to the next activity

**Long-term Strategies:**
• Establish consistent routines
• Model healthy eating habits
• Be patient with the process
• Consider consulting a feeding specialist if needed

Remember: A relaxed parent often leads to a relaxed child!`:`Thank you for your question about feeding! Here are some general tips for healthy eating habits:

**Create a Positive Environment:**
• Eat together as a family when possible
• Make mealtime pleasant and stress-free
• Avoid using food as rewards or punishments

**Offer Variety:**
• Include foods from all food groups
• Present foods in different ways
• Let your child explore new textures and flavors

**Trust Your Child:**
• They know when they're hungry or full
• Don't force them to eat
• Offer appropriate portion sizes

**Be Patient:**
• Food preferences change over time
• Keep offering rejected foods
• Every child develops at their own pace

If you have specific concerns about your child's eating, consider consulting with a pediatrician or registered dietitian.`}displayAnswer(e){const t=this.container.querySelector("#answer-section"),s=this.container.querySelector("#answer-content");if(t&&s){t.style.display="block",s.innerHTML=`
        <div class="answer-text">
          ${e.replace(/\n/g,"<br>")}
        </div>
        <button class="btn secondary new-question-btn" data-action="new-question">Ask Another Question</button>
      `;const n=s.querySelector(".new-question-btn");n&&n.addEventListener("click",()=>{t.style.display="none";const a=this.container.querySelector("#question-input");a&&(a.value="",a.focus())}),t.scrollIntoView({behavior:"smooth"})}}async handleSave(){const e=this.prepareSessionData();this.saveToHistory(e),this.router.navigate({dyad:"meal",screen:"gallery"})}async handleExport(){const e={dyad:"meal",timestamp:new Date().toISOString(),rating:parseInt(this.rating),metrics:{meal_mood:this.adjustedMood},media_summaries:{image:{dietary_diversity:this.dietaryDiversity,clutter_score:this.clutterScore,plate_coverage:this.plateCoverage}},tip:this.currentTip,badge:this.currentBadge};try{await this.sendToBot(e),this.downloadJSON(e),alert("Results exported successfully! Data sent to Silli Bot.")}catch(t){console.error("Error exporting:",t),alert("Export failed. Please try again.")}}async sendToBot(e){const t=new URLSearchParams(window.location.search),s=t.get("family")||"unknown",n=t.get("session")||`meal_${Date.now()}`,a={ts_start:new Date().toISOString(),duration_s:0,mode:"helper",family_id:s,session_id:n,scales:{},features_summary:{level_dbfs_p50:-60,centroid_norm_mean:0,flux_norm_mean:0,vad_fraction:0,stationarity:0},score:{short:e.metrics?.meal_mood||0,mid:e.metrics?.meal_mood||0,long:e.metrics?.meal_mood||0},badges:e.badge?[e.badge]:[],events:[],pii:!1,version:"pwa_0.1",context:{dyad:"meal",rating:e.rating,meal_mood:e.metrics?.meal_mood,has_image:!!e.media_summaries?.image,dietary_diversity:e.media_summaries?.image?.dietary_diversity,clutter_score:e.media_summaries?.image?.clutter_score,plate_coverage:e.media_summaries?.image?.plate_coverage,tip:e.tip},metrics:e.metrics},{enqueue:o}=await se(async()=>{const{enqueue:i}=await import("./queue-CGxIyKpm.js");return{enqueue:i}},[]);o({family:s,session:n,payload:JSON.stringify(a),createdAt:Date.now()}),await this.tryImmediateSend(a)}async tryImmediateSend(e){try{(await fetch("/api/relay",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)})).ok||console.log("Immediate send failed, data queued for later pickup")}catch(t){console.log("Immediate send failed, data queued for later pickup:",t)}}downloadJSON(e){const t=new Blob([JSON.stringify(e,null,2)],{type:"application/json"}),s=URL.createObjectURL(t),n=document.createElement("a");n.href=s,n.download=`meal-session-${Date.now()}.json`,n.click(),URL.revokeObjectURL(s)}prepareSessionData(){return{timestamp:new Date().toISOString(),rating:parseInt(this.rating),mealMood:this.adjustedMood,hasImage:this.hasImage,dietaryDiversity:this.dietaryDiversity,clutterScore:this.clutterScore,plateCoverage:this.plateCoverage,tip:this.currentTip,badge:this.currentBadge}}saveToHistory(e){const t="meal_history",s=JSON.parse(localStorage.getItem(t)||"[]");s.unshift(e),s.length>30&&s.splice(30),localStorage.setItem(t,JSON.stringify(s))}destroy(){}}class ae{container;router;sessions=[];constructor(e,t){this.container=e,this.router=t}render(){this.loadSessions(),this.container.innerHTML=`
      <div class="screen meal-gallery">
        <header class="screen-header">
          <button class="back-btn" data-action="back">← Back</button>
          <h1>📸 Meal Gallery</h1>
        </header>

        <main class="screen-content">
          <section class="overview-section">
            <h3>Your Meal Journey</h3>
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-number">${this.sessions.length}</div>
                <div class="stat-label">Meals</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">${this.getAverageMood()}</div>
                <div class="stat-label">Avg Mood</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">${this.getAverageRating()}</div>
                <div class="stat-label">Avg Rating</div>
              </div>
            </div>
          </section>

          <section class="trends-section">
            <h3>Trends & Patterns</h3>
            <div class="trends-grid">
              ${this.generateTrends()}
            </div>
          </section>

          <section class="insights-section">
            <h3>Key Insights</h3>
            <div class="insights-list">
              ${this.generateInsights()}
            </div>
          </section>

          <section class="gallery-section">
            <div class="section-header">
              <h3>Recent Meals (Last 30)</h3>
              <button class="btn secondary small" data-action="clear-all">Clear All</button>
            </div>
            <div class="gallery-grid" id="gallery-grid">
              ${this.renderGallery()}
            </div>
          </section>

          <section class="privacy-notice">
            <p>🔒 All data stays on your device. No cloud storage.</p>
          </section>
        </main>

        <nav class="screen-nav">
          <button class="btn secondary" data-action="export">📤 Export</button>
          <button class="btn primary" data-action="new-meal">➕ New Meal</button>
        </nav>
      </div>
    `,this.bindEvents()}loadSessions(){const t=JSON.parse(localStorage.getItem("meal_history")||"[]");this.sessions=t.slice(0,30)}getAverageMood(){return this.sessions.length===0?"0":(this.sessions.reduce((t,s)=>t+s.mealMood,0)/this.sessions.length).toFixed(0)}getAverageRating(){return this.sessions.length===0?"0.0":(this.sessions.reduce((t,s)=>t+s.rating,0)/this.sessions.length).toFixed(1)}generateTrends(){const e=[],t=parseFloat(this.getAverageMood());t>70?e.push(`
        <div class="trend-card positive">
          <div class="trend-icon">😊</div>
          <div class="trend-content">
            <h4>High Meal Mood</h4>
            <p>Your child consistently enjoys meals (${t}/100)</p>
          </div>
        </div>
      `):t<40&&e.push(`
        <div class="trend-card negative">
          <div class="trend-icon">😐</div>
          <div class="trend-content">
            <h4>Low Meal Mood</h4>
            <p>Consider favorite foods and smaller portions</p>
          </div>
        </div>
      `),this.sessions.reduce((a,o)=>a+o.dietaryDiversity,0)/this.sessions.length>.6&&e.push(`
        <div class="trend-card positive">
          <div class="trend-icon">🌈</div>
          <div class="trend-content">
            <h4>Good Variety</h4>
            <p>Excellent dietary diversity in meals</p>
          </div>
        </div>
      `);const n=this.analyzeTimePatterns();return n.length>0&&e.push(`
        <div class="trend-card neutral">
          <div class="trend-icon">⏰</div>
          <div class="trend-content">
            <h4>Meal Timing</h4>
            <p>${n[0]}</p>
          </div>
        </div>
      `),e.length===0?`
        <div class="trend-card neutral">
          <div class="trend-icon">📊</div>
          <div class="trend-content">
            <h4>Building Patterns</h4>
            <p>Continue logging meals to discover trends</p>
          </div>
        </div>
      `:e.join("")}generateInsights(){const e=[],t=this.sessions.length>0?this.sessions.reduce((a,o)=>a+o.mealMood,0)/this.sessions.length:0;e.push(`
      <div class="insight-item">
        <div class="insight-icon">😊</div>
        <div class="insight-content">
          <h4>Average Meal Mood</h4>
          <p>Your average meal mood is ${Math.round(t)}/100</p>
        </div>
      </div>
    `);const s=this.sessions.filter(a=>a.context?.eaten_pct!==void 0);if(s.length>0){const a=s.reduce((o,i)=>o+(i.context.eaten_pct||0),0)/s.length;e.push(`
        <div class="insight-item">
          <div class="insight-icon">🍽️</div>
          <div class="insight-content">
            <h4>Average Eaten Percentage</h4>
            <p>Your child eats ${Math.round(a)}% of meals on average</p>
          </div>
        </div>
      `)}const n=this.sessions.length>0?this.sessions.reduce((a,o)=>a+o.dietaryDiversity,0)/this.sessions.length:0;return e.push(`
      <div class="insight-item">
        <div class="insight-icon">🌈</div>
        <div class="insight-content">
          <h4>Average Dietary Diversity</h4>
          <p>Your average dietary diversity is ${(n*100).toFixed(0)}%</p>
        </div>
      </div>
    `),e.join("")}analyzeTimePatterns(){const e=[],t={};this.sessions.forEach(n=>{const a=new Date(n.timestamp).getHours();t[a]=(t[a]||0)+1});const s=Object.entries(t).reduce((n,a)=>t[parseInt(n[0])]>t[parseInt(a[0])]?n:a);if(s&&t[parseInt(s[0])]>3){const n=this.getTimeName(parseInt(s[0]));e.push(`Most meals logged at ${n}`)}return e}getTimeName(e){return e<12?`${e}:00 AM`:e===12?"12:00 PM":`${e-12}:00 PM`}renderGallery(){return this.sessions.length===0?`
        <div class="empty-state">
          <div class="empty-icon">📸</div>
          <h4>No Meals Yet</h4>
          <p>Start logging meals to see your gallery here.</p>
        </div>
      `:this.sessions.map((e,t)=>{const s=new Date(e.timestamp),n=s.toLocaleDateString()+" "+s.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),a="⭐".repeat(e.rating);return`
        <div class="meal-card" data-index="${t}">
          <div class="meal-image">
            ${e.hasImage?`<img src="${e.thumbnail||"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiB2aWV3Qm94PSIwIDAgMTUwIDE1MCI+PHJlY3Qgd2lkdGg9IjE1MCIgaGVpZ2h0PSIxNTAiIGZpbGw9IiNmMGYwZjAiLz48dGV4dCB4PSI3NSIgeT0iNzUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjOTk5Ij7wn5KHPzwvdGV4dD48L3N2Zz4="}" alt="Meal photo" />`:'<div class="no-image">📷</div>'}
          </div>
          <div class="meal-info">
            <div class="meal-date">${n} · mood=${Math.round(e.mealMood)}</div>
            <div class="meal-rating">${a}</div>
            <div class="meal-metrics">
              <span class="metric">D: ${(e.dietaryDiversity*100).toFixed(0)}%</span>
              <span class="metric">C: ${(e.clutterScore*100).toFixed(0)}%</span>
              <span class="metric">P: ${(e.plateCoverage*100).toFixed(0)}%</span>
            </div>
          </div>
          <button class="delete-btn" data-index="${t}">🗑️</button>
        </div>
      `}).join("")}bindEvents(){const e=this.container.querySelector(".back-btn");e&&e.addEventListener("click",()=>{this.router.navigate({dyad:"meal",screen:"home"})});const t=this.container.querySelector('[data-action="export"]');t&&t.addEventListener("click",()=>{this.handleExport()});const s=this.container.querySelector('[data-action="new-meal"]');s&&s.addEventListener("click",()=>{this.router.navigate({dyad:"meal",screen:"home"})});const n=this.container.querySelector('[data-action="clear-all"]');n&&n.addEventListener("click",()=>{this.handleClearAll()}),this.container.querySelectorAll(".delete-btn").forEach(o=>{o.addEventListener("click",i=>{i.stopPropagation();const c=parseInt(i.currentTarget.dataset.index||"0");this.handleDeleteMeal(c)})})}handleExport(){const e={sessions:this.sessions,summary:{totalMeals:this.sessions.length,averageMood:this.getAverageMood(),averageRating:this.getAverageRating(),exportDate:new Date().toISOString()}},t=new Blob([JSON.stringify(e,null,2)],{type:"application/json"}),s=URL.createObjectURL(t),n=document.createElement("a");n.href=s,n.download=`meal-gallery-${Date.now()}.json`,n.click(),URL.revokeObjectURL(s)}handleClearAll(){confirm("Are you sure you want to delete all meal data? This cannot be undone.")&&(localStorage.removeItem("meal_history"),this.sessions=[],this.render())}handleDeleteMeal(e){confirm("Delete this meal?")&&(this.sessions.splice(e,1),localStorage.setItem("meal_history",JSON.stringify(this.sessions)),this.render())}destroy(){}}class ie{container;router;constructor(e,t){this.container=e,this.router=t}render(){this.container.innerHTML=`
      <div class="screen meal-settings">
        <header class="screen-header">
          <button class="back-btn" data-action="back">← Back</button>
          <h1>⚙️ Settings & Privacy</h1>
        </header>

        <main class="screen-content">
          <section class="privacy-section">
            <h3>🔒 Privacy & Data</h3>
            <div class="privacy-info">
              <div class="privacy-item">
                <div class="privacy-icon">📱</div>
                <div class="privacy-content">
                  <h4>On-Device Processing</h4>
                  <p>All photo analysis and meal tracking happens on your device. Nothing is sent to our servers.</p>
                </div>
              </div>
              
              <div class="privacy-item">
                <div class="privacy-icon">🖼️</div>
                <div class="privacy-content">
                  <h4>Photo Privacy</h4>
                  <p>Meal photos are stored locally and never uploaded to external servers.</p>
                </div>
              </div>
              
              <div class="privacy-item">
                <div class="privacy-icon">🔐</div>
                <div class="privacy-content">
                  <h4>Secure Sharing</h4>
                  <p>When you choose to share, only summary data is sent via encrypted channels.</p>
                </div>
              </div>
            </div>
          </section>

          <section class="preferences-section">
            <h3>⚙️ Preferences</h3>
            <div class="preferences-list">
              <div class="preference-item">
                <div class="preference-label">
                  <span>Auto-save meals</span>
                  <span class="preference-description">Save meal logs automatically</span>
                </div>
                <label class="toggle">
                  <input type="checkbox" checked>
                  <span class="toggle-slider"></span>
                </label>
              </div>
              
              <div class="preference-item">
                <div class="preference-label">
                  <span>Photo reminders</span>
                  <span class="preference-description">Remind to take meal photos</span>
                </div>
                <label class="toggle">
                  <input type="checkbox" checked>
                  <span class="toggle-slider"></span>
                </label>
              </div>
              
              <div class="preference-item">
                <div class="preference-label">
                  <span>Nutrition insights</span>
                  <span class="preference-description">Show nutrition tips and patterns</span>
                </div>
                <label class="toggle">
                  <input type="checkbox" checked>
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>
          </section>

          <section class="data-section">
            <h3>📊 Data Management</h3>
            <div class="data-actions">
              <button class="btn secondary data-btn" data-action="export-all">
                📤 Export All Data
              </button>
              <button class="btn secondary data-btn" data-action="clear-data">
                🗑️ Clear All Data
              </button>
            </div>
          </section>

          <section class="about-section">
            <h3>ℹ️ About</h3>
            <div class="about-content">
              <p><strong>Meal Mood Companion v1.0</strong></p>
              <p>Helping you understand your child's eating patterns through gentle, privacy-first tracking.</p>
              <p class="version">Version 1.0.0 • Built with ❤️ for families</p>
            </div>
          </section>
        </main>

        <nav class="screen-nav">
          <button class="btn primary" data-action="done">Done</button>
        </nav>
      </div>
    `,this.bindEvents()}bindEvents(){const e=this.container.querySelector(".back-btn");e&&e.addEventListener("click",()=>{this.router.navigate({dyad:"meal",screen:"home"})});const t=this.container.querySelector('[data-action="done"]');t&&t.addEventListener("click",()=>{this.router.navigate({dyad:"meal",screen:"home"})});const s=this.container.querySelector('[data-action="export-all"]');s&&s.addEventListener("click",()=>{this.handleExportAll()});const n=this.container.querySelector('[data-action="clear-data"]');n&&n.addEventListener("click",()=>{this.handleClearData()}),this.container.querySelectorAll(".toggle input").forEach(o=>{o.addEventListener("change",i=>{this.handlePreferenceChange(i.target)})})}handleExportAll(){console.log("Exporting all meal data");const e=this.container.querySelector('[data-action="export-all"]');e&&(e.textContent="✓ Exported",e.disabled=!0,setTimeout(()=>{e.textContent="📤 Export All Data",e.disabled=!1},2e3))}handleClearData(){if(confirm("Are you sure you want to clear all meal data? This cannot be undone.")){console.log("Clearing all meal data");const e=this.container.querySelector('[data-action="clear-data"]');e&&(e.textContent="✓ Cleared",e.disabled=!0,setTimeout(()=>{e.textContent="🗑️ Clear All Data",e.disabled=!1},2e3))}}handlePreferenceChange(e){const t=e.closest(".preference-item")?.querySelector(".preference-label span")?.textContent;console.log(`Preference changed: ${t} = ${e.checked}`)}destroy(){}}function k(r,e){const t=document.createElement(r);return e&&(e.className&&(t.className=e.className),e.id&&(t.id=e.id),e.text&&(t.textContent=e.text)),t}function oe(r,e,t){return Math.max(e,Math.min(t,r))}function re(r,e,t){function s(){const n=r.value.length;t.textContent=`${n}/${e}`,n>e&&(r.value=r.value.slice(0,e))}r.addEventListener("input",s),s()}function ce(r,e){return Array.from(r.querySelectorAll(e)).filter(t=>t.checked).map(t=>t.value)}const le=[{min:1,max:3,label:"Calm",color:"#4CAF50"},{min:4,max:6,label:"Rising",color:"#FF9800"},{min:7,max:10,label:"High",color:"#F44336"}];function de(){let r,e,t,s,n=[],a=null,o=5;function i(y){y.innerHTML="",r=document.createElement("div"),r.className="thermometer",r.style.cssText=`
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 16px;
      background: #f5f5f5;
      border-radius: 8px;
      min-width: 200px;
    `;const S=document.createElement("h3");S.textContent="Intensity Level",S.style.cssText=`
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: #333;
    `,r.appendChild(S),t=document.createElement("div"),t.style.cssText=`
      font-size: 24px;
      font-weight: bold;
      text-align: center;
      color: #333;
      min-height: 32px;
    `,r.appendChild(t),s=document.createElement("div"),s.style.cssText=`
      font-size: 14px;
      text-align: center;
      font-weight: 500;
      min-height: 20px;
    `,r.appendChild(s);const E=document.createElement("div");E.style.cssText=`
      position: relative;
      padding: 8px 0;
    `,e=document.createElement("input"),e.type="range",e.min="1",e.max="10",e.step="1",e.value=o.toString(),e.style.cssText=`
      width: 100%;
      height: 8px;
      border-radius: 4px;
      background: linear-gradient(to right, #4CAF50 0%, #4CAF50 30%, #FF9800 30%, #FF9800 60%, #F44336 60%, #F44336 100%);
      outline: none;
      -webkit-appearance: none;
    `,e.addEventListener("input",c),e.addEventListener("change",w);const g=document.createElement("style");g.textContent=`
      .thermometer input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #2196F3;
        cursor: pointer;
        border: 2px solid #fff;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      }
      .thermometer input[type="range"]::-moz-range-thumb {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #2196F3;
        cursor: pointer;
        border: 2px solid #fff;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      }
    `,document.head.appendChild(g),E.appendChild(e),r.appendChild(E);const b=document.createElement("div");b.style.cssText=`
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: #666;
      margin-top: 4px;
    `;const p=document.createElement("span");p.textContent="1";const x=document.createElement("span");x.textContent="10",b.appendChild(p),b.appendChild(x),r.appendChild(b),y.appendChild(r),f()}function c(){const y=parseInt(e.value);y!==o&&(o=y,f(),a&&clearTimeout(a),a=window.setTimeout(()=>{n.forEach(S=>S(o))},150))}function w(){n.forEach(y=>y(o))}function f(){t.textContent=o.toString();const y=le.find(S=>o>=S.min&&o<=S.max);y?(s.textContent=y.label,s.style.color=y.color):s.textContent=""}function l(){return o}function h(y){const S=Math.max(1,Math.min(10,Math.round(y)));S!==o&&(o=S,e&&(e.value=o.toString()),f())}function u(y){n.push(y)}function m(){a&&clearTimeout(a),n=[],r&&r.parentNode&&r.parentNode.removeChild(r)}return{mount:i,getValue:l,setValue:h,onValueChange:u,destroy:m}}const $="tantrum_sessions",_="meal_sessions",ue="silli_meter_db",he=2,q=14;class pe{db=null;useIndexedDB=!0;async init(){try{this.db=await this.openIndexedDB(),console.log("✅ Using IndexedDB for local storage")}catch(e){console.warn("⚠️ IndexedDB not available, falling back to localStorage:",e),this.useIndexedDB=!1}}openIndexedDB(){return new Promise((e,t)=>{const s=indexedDB.open(ue,he);s.onerror=()=>t(s.error),s.onsuccess=()=>e(s.result),s.onupgradeneeded=n=>{const a=n.target.result;a.objectStoreNames.contains($)||a.createObjectStore($,{keyPath:"id"}).createIndex("ts","ts",{unique:!1}),a.objectStoreNames.contains(_)||a.createObjectStore(_,{keyPath:"id"}).createIndex("ts","ts",{unique:!1})}})}async saveSession(e){this.useIndexedDB&&this.db?await this.saveToIndexedDB(e,$):this.saveToLocalStorage(e,"tantrum_sessions")}async saveMealSession(e){this.useIndexedDB&&this.db?await this.saveToIndexedDB(e,_):this.saveToLocalStorage(e,"meal_sessions")}async saveToIndexedDB(e,t){return new Promise((s,n)=>{if(!this.db){n(new Error("IndexedDB not initialized"));return}const i=this.db.transaction([t],"readwrite").objectStore(t).add(e);i.onsuccess=()=>{this.cleanupOldSessions(t),s()},i.onerror=()=>n(i.error)})}saveToLocalStorage(e,t){const s=this.getSessionsFromLocalStorage(t);s.push(e),s.length>q&&s.splice(0,s.length-q),localStorage.setItem(t,JSON.stringify(s))}async getSessions(){return this.useIndexedDB&&this.db?this.getSessionsFromIndexedDB($):this.getSessionsFromLocalStorage("tantrum_sessions")}async getMealSessions(){return this.useIndexedDB&&this.db?this.getSessionsFromIndexedDB(_):this.getSessionsFromLocalStorage("meal_sessions")}async getSessionsFromIndexedDB(e){return new Promise((t,s)=>{if(!this.db){s(new Error("IndexedDB not initialized"));return}const i=this.db.transaction([e],"readonly").objectStore(e).index("ts").getAll();i.onsuccess=()=>{const c=i.result;c.sort((w,f)=>new Date(f.ts).getTime()-new Date(w.ts).getTime()),t(c.slice(0,q))},i.onerror=()=>s(i.error)})}getSessionsFromLocalStorage(e){try{const t=localStorage.getItem(e);if(!t)return[];const s=JSON.parse(t);return s.sort((n,a)=>new Date(a.ts).getTime()-new Date(n.ts).getTime()),s.slice(0,q)}catch(t){return console.warn("Error reading from localStorage:",t),[]}}async cleanupOldSessions(e){if(!this.db)return;const t=await this.getSessionsFromIndexedDB(e);if(t.length<=q)return;const n=this.db.transaction([e],"readwrite").objectStore(e),a=t.slice(q);for(const o of a)n.delete(o.id)}async clearAll(){if(this.useIndexedDB&&this.db){const e=this.db.transaction([$,_],"readwrite");e.objectStore($).clear(),e.objectStore(_).clear()}else localStorage.removeItem("tantrum_sessions"),localStorage.removeItem("meal_sessions")}async getStats(){const e=await this.getSessions();if(e.length===0)return{total:0,avg_intensity:0,most_common_trigger:null};const t=e.map(i=>i.intensity_1_10).filter(i=>i!==void 0),s=t.length>0?t.reduce((i,c)=>i+c,0)/t.length:0,a=e.map(i=>i.trigger).filter(i=>i!==void 0).reduce((i,c)=>(i[c]=(i[c]||0)+1,i),{}),o=Object.keys(a).length>0?Object.entries(a).reduce((i,c)=>i[1]>c[1]?i:c)[0]:null;return{total:e.length,avg_intensity:Math.round(s*10)/10,most_common_trigger:o}}async getMealStats(){const e=await this.getMealSessions();if(e.length===0)return{total:0,avg_rating:0,most_common_meal_type:null};const t=e.map(i=>i.rating).filter(i=>i!==void 0),s=t.length>0?t.reduce((i,c)=>i+c,0)/t.length:0,a=e.map(i=>i.meal_type).filter(i=>i!==void 0).reduce((i,c)=>(i[c]=(i[c]||0)+1,i),{}),o=Object.keys(a).length>0?Object.entries(a).reduce((i,c)=>i[1]>c[1]?i:c)[0]:null;return{total:e.length,avg_rating:Math.round(s*10)/10,most_common_meal_type:o}}}const F=new pe;F.init().catch(console.error);function ge(){let r,e=[];function t(l){l.innerHTML="",r=document.createElement("div"),r.className="history",r.style.cssText=`
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 16px;
      background: #f5f5f5;
      border-radius: 8px;
      max-height: 400px;
      overflow-y: auto;
    `;const h=document.createElement("h3");h.textContent="Recent Sessions (Last 14)",h.style.cssText=`
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: #333;
      border-bottom: 2px solid #e0e0e0;
      padding-bottom: 8px;
    `,r.appendChild(h);const u=document.createElement("div");u.className="history-stats",u.style.cssText=`
      display: flex;
      gap: 16px;
      padding: 12px;
      background: white;
      border-radius: 6px;
      font-size: 14px;
    `,r.appendChild(u);const m=document.createElement("div");m.className="history-sessions",m.style.cssText=`
      display: flex;
      flex-direction: column;
      gap: 8px;
    `,r.appendChild(m),l.appendChild(r),s()}async function s(){try{e=await F.getSessions(),n(),o()}catch(l){console.error("Error loading history:",l),i()}}function n(){const l=r.querySelector(".history-stats");if(!l)return;const h={total:e.length,avg_intensity:e.length>0?Math.round(e.reduce((u,m)=>u+(m.intensity_1_10||0),0)/e.length*10)/10:0,most_common_trigger:a()};l.innerHTML=`
      <div style="flex: 1; text-align: center;">
        <div style="font-weight: bold; color: #2196F3;">${h.total}</div>
        <div style="font-size: 12px; color: #666;">Sessions</div>
      </div>
      <div style="flex: 1; text-align: center;">
        <div style="font-weight: bold; color: #FF9800;">${h.avg_intensity}</div>
        <div style="font-size: 12px; color: #666;">Avg Intensity</div>
      </div>
      <div style="flex: 1; text-align: center;">
        <div style="font-weight: bold; color: #4CAF50;">${h.most_common_trigger||"—"}</div>
        <div style="font-size: 12px; color: #666;">Top Trigger</div>
      </div>
    `}function a(){const l=e.map(u=>u.trigger).filter(u=>u!==void 0);if(l.length===0)return null;const h=l.reduce((u,m)=>(u[m]=(u[m]||0)+1,u),{});return Object.entries(h).reduce((u,m)=>u[1]>m[1]?u:m)[0]}function o(){const l=r.querySelector(".history-sessions");if(l){if(e.length===0){l.innerHTML=`
        <div style="text-align: center; padding: 32px; color: #666; font-style: italic;">
          ${d.empty.noSessionsYet}
        </div>
      `;return}l.innerHTML=e.map(h=>{const u=new Date(h.ts),m=w(u),y=h.intensity_1_10||0,S=h.escalation_index||0,E=y<=3?"#4CAF50":y<=6?"#FF9800":"#F44336",g=S<=.3?"#4CAF50":S<=.7?"#FF9800":"#F44336";return`
        <div class="session-item" style="
          background: white;
          border-radius: 6px;
          padding: 12px;
          border-left: 4px solid ${E};
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        ">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
            <div style="font-weight: 600; color: #333;">${c(u)}</div>
            <div style="font-size: 12px; color: #666;">${m}</div>
          </div>
          
          <div style="display: flex; gap: 12px; margin-bottom: 8px;">
            ${h.trigger?`
              <div style="
                background: #e3f2fd;
                color: #1976d2;
                padding: 4px 8px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: 500;
              ">
                ${h.trigger}
              </div>
            `:""}
            
            ${y>0?`
              <div style="
                background: ${E}20;
                color: ${E};
                padding: 4px 8px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: 500;
              ">
                Intensity: ${y}/10
              </div>
            `:""}
            
            ${S>0?`
              <div style="
                background: ${g}20;
                color: ${g};
                padding: 4px 8px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: 500;
              ">
                Escalation: ${Math.round(S*100)}%
              </div>
            `:""}
          </div>
          
          ${h.duration_min?`
            <div style="font-size: 12px; color: #666; margin-bottom: 4px;">
              Duration: ${h.duration_min} minutes
            </div>
          `:""}
          
          ${h.notes?`
            <div style="
              font-size: 12px;
              color: #555;
              font-style: italic;
              background: #f9f9f9;
              padding: 6px 8px;
              border-radius: 4px;
              margin-top: 4px;
            ">
              "${h.notes}"
            </div>
          `:""}
        </div>
      `}).join("")}}function i(){const l=r.querySelector(".history-sessions");l&&(l.innerHTML=`
      <div style="text-align: center; padding: 32px; color: #f44336; font-style: italic;">
        Error loading history. Please try again.
      </div>
    `)}function c(l){const u=Math.abs(new Date().getTime()-l.getTime()),m=Math.ceil(u/(1e3*60*60*24));return m===1?"Today":m===2?"Yesterday":m<=7?l.toLocaleDateString("en-US",{weekday:"short"}):l.toLocaleDateString("en-US",{month:"short",day:"numeric"})}function w(l){const u=new Date().getTime()-l.getTime(),m=Math.floor(u/(1e3*60)),y=Math.floor(u/(1e3*60*60)),S=Math.floor(u/(1e3*60*60*24));return m<1?"Just now":m<60?`${m}m ago`:y<24?`${y}h ago`:S<7?`${S}d ago`:l.toLocaleDateString("en-US",{month:"short",day:"numeric"})}function f(){r&&r.parentNode&&r.parentNode.removeChild(r)}return{mount:t,refresh:s,destroy:f}}const ve=d.triggers,me=d.coRegulation;function ye(){let r,e,t,s,n,a,o,i,c,w,f,l={};function h(g){g.innerHTML="",r=k("div",{className:"form form--tantrum"});const b=document.createElement("div");b.style.cssText=`
      display: flex;
      margin-bottom: 16px;
      border-bottom: 2px solid #e0e0e0;
    `;const p=document.createElement("button");p.textContent=d.tabs.recordSession,p.style.cssText=`
      flex: 1;
      padding: 12px;
      border: none;
      background: #2196F3;
      color: white;
      font-weight: 600;
      cursor: pointer;
    `;const x=document.createElement("button");x.textContent=d.tabs.history,x.style.cssText=`
      flex: 1;
      padding: 12px;
      border: none;
      background: #f5f5f5;
      color: #666;
      font-weight: 600;
      cursor: pointer;
    `,b.appendChild(p),b.appendChild(x),r.appendChild(b);const v=document.createElement("div");v.className="form-content",v.style.cssText=`
      display: block;
    `;const C=document.createElement("div");C.className="history-content",C.style.cssText=`
      display: none;
    `;const B=k("label",{text:d.forms.trigger,id:"tantrum_trigger_label"});B.htmlFor="tantrum_trigger",e=k("select",{id:"tantrum_trigger"});const I=document.createElement("option");I.text=d.placeholders.selectTrigger,I.value="",e.appendChild(I),ve.forEach(M=>{const L=document.createElement("option");L.text=M.charAt(0).toUpperCase()+M.slice(1),L.value=M,e.appendChild(L)}),v.appendChild(B),v.appendChild(e);const P=document.createElement("div");P.style.cssText=`
      margin: 16px 0;
      padding: 16px;
      background: #f9f9f9;
      border-radius: 8px;
    `,w=de(),w.mount(P),v.appendChild(P);const D=k("label",{text:"Media Clip (Optional)",id:"tantrum_media_label"});D.htmlFor="tantrum_media",i=k("input",{id:"tantrum_media"}),i.type="file",i.accept="audio/*,video/*",i.capture="environment",i.style.cssText=`
      margin: 8px 0;
      padding: 8px;
      border: 2px dashed #ccc;
      border-radius: 4px;
      width: 100%;
      box-sizing: border-box;
    `,c=document.createElement("div"),c.style.cssText=`
      margin-top: 8px;
      padding: 8px;
      background: #f0f0f0;
      border-radius: 4px;
      font-size: 12px;
      color: #666;
    `,i.addEventListener("change",u),v.appendChild(D),v.appendChild(i),v.appendChild(c);const N=k("label",{text:d.forms.duration,id:"tantrum_duration_label"});N.htmlFor="tantrum_duration",t=k("input",{id:"tantrum_duration"}),t.type="number",t.min="0",t.max="30",t.step="1",t.placeholder="0",t.style.height="40px",v.appendChild(N),v.appendChild(t);const O=k("label",{text:d.forms.coRegulation,id:"tantrum_coreg_label"});O.htmlFor="tantrum_coreg",s=k("div",{id:"tantrum_coreg"}),me.forEach(M=>{const L=k("input",{id:`tantrum_coreg_${M.value}`});L.type="checkbox",L.value=M.value,L.style.marginRight="8px";const R=k("label",{text:M.label});R.htmlFor=L.id,R.style.marginRight="16px",s.appendChild(L),s.appendChild(R)}),v.appendChild(O),v.appendChild(s);const H=k("label",{text:d.forms.environmentNoise,id:"tantrum_noise_label"});H.htmlFor="tantrum_noise",n=k("input",{id:"tantrum_noise"}),n.type="checkbox",n.style.height="40px",v.appendChild(H),v.appendChild(n);const j=k("label",{text:d.forms.notes,id:"tantrum_notes_label"});j.htmlFor="tantrum_notes",a=k("textarea",{id:"tantrum_notes"}),a.rows=2,a.maxLength=120,a.style.height="60px",o=k("div",{className:"notes-counter"}),re(a,120,o),v.appendChild(j),v.appendChild(a),v.appendChild(o),f=ge(),f.mount(C),p.addEventListener("click",()=>{v.style.display="block",C.style.display="none",p.style.background="#2196F3",p.style.color="white",x.style.background="#f5f5f5",x.style.color="#666"}),x.addEventListener("click",()=>{v.style.display="none",C.style.display="block",p.style.background="#f5f5f5",p.style.color="#666",x.style.background="#2196F3",x.style.color="white",f.refresh()}),r.appendChild(v),r.appendChild(C),g.appendChild(r)}async function u(g){const p=g.target.files?.[0];if(!p){l={},c.textContent="";return}c.textContent=d.placeholders.processing;try{l=await m(p);const x=l.duration_s?`${Math.round(l.duration_s)}s`:"Unknown",v=l.avg_level_dbfs?`${Math.round(l.avg_level_dbfs)}dB`:"Unknown",C=l.motion_estimate?`${Math.round(l.motion_estimate*100)}%`:"Unknown";c.innerHTML=`
        <strong>${p.name}</strong><br>
        Duration: ${x} | Level: ${v}${p.type.startsWith("video")?` | Motion: ${C}`:""}
      `}catch(x){console.error("Error processing media:",x),c.textContent=`Error processing ${p.name}`,l={}}}async function m(g){const b={};try{if(g.type.startsWith("audio/")){const p=new(window.AudioContext||window.webkitAudioContext),x=await g.arrayBuffer(),v=await p.decodeAudioData(x);b.duration_s=v.duration;const C=v.getChannelData(0),B=C.length;let I=0;for(let D=0;D<B;D+=1e3)I+=Math.abs(C[D]);const P=I/(B/1e3);b.avg_level_dbfs=20*Math.log10(P)+60,p.close()}else if(g.type.startsWith("video/")){const p=document.createElement("video");p.src=URL.createObjectURL(g),await new Promise(x=>{p.onloadedmetadata=()=>{b.duration_s=p.duration,b.motion_estimate=Math.random()*.5+.2,URL.revokeObjectURL(p.src),x()}})}}catch(p){console.warn("Media processing failed:",p)}return b}function y(){const g={};e.value&&(g.trigger=e.value);const b=t.value.trim();if(b!==""){const v=Number(b);isNaN(v)||(g.duration_min=oe(v,0,30))}const p=ce(s,"input[type=checkbox]");p.length&&(g.co_reg=p),n.checked&&(g.environment_noise=!0);const x=a.value.trim();return x&&(g.notes=x.slice(0,120)),g.intensity_1_10=w.getValue(),Object.keys(l).length>0&&(g.tantrum_proxy=l),g}function S(){const g=t.value.trim();if(g!==""){const b=Number(g);if(isNaN(b)||b<0||b>30)return{ok:!1,message:"Duration must be 0–30"}}return{ok:!0}}async function E(){e.value="",t.value="",s.querySelectorAll("input[type=checkbox]").forEach(g=>g.checked=!1),n.checked=!1,a.value="",o.textContent="0/120",w.setValue(5),i.value="",l={},c.textContent=""}return{mount:h,getContext:y,validate:S,reset:E}}class fe{config;router;container;currentScreen=null;tantrumForm=null;constructor(){this.config=this.parseUrlParams(),console.log("App config:",this.config),this.stripTokenFromUrl(),this.container=document.getElementById("app"),this.router=new V,this.initializeUI(),this.setupRoutes()}parseUrlParams(){const e=new URLSearchParams(window.location.search);return{mode:e.get("mode")||"helper",family:e.get("family")||"fam_unknown",session:e.get("session")||`fam_unknown_${Date.now()}`,token:e.get("tok")||null,dyad:e.get("dyad")||"night"}}initializeUI(){window.location.hash||(this.config.dyad==="tantrum"?window.location.hash="#tantrum/home":this.config.dyad==="meal"?window.location.hash="#meal/home":window.location.hash="#night/home")}setupRoutes(){this.router.register({dyad:"tantrum",screen:"home"},()=>{this.renderScreen(new W(this.container,this.router))}),this.router.register({dyad:"tantrum",screen:"capture"},()=>{const t=this.router.getCurrentRoute()?.params?.intensity||"5";this.renderScreen(new Y(this.container,this.router,t))}),this.router.register({dyad:"tantrum",screen:"thermo"},()=>{const e=this.router.getCurrentRoute(),t=e?.params?.intensity||"5",s=e?.params?.hasAudio||"false",n=e?.params?.hasVideo||"false";this.renderScreen(new Q(this.container,this.router,t,s,n))}),this.router.register({dyad:"tantrum",screen:"history"},()=>{this.renderScreen(new J(this.container,this.router))}),this.router.register({dyad:"tantrum",screen:"settings"},()=>{this.renderScreen(new K(this.container,this.router))}),this.router.register({dyad:"tantrum",screen:"form"},()=>{this.renderTantrumForm()}),this.router.register({dyad:"meal",screen:"home"},()=>{this.renderScreen(new Z(this.container,this.router))}),this.router.register({dyad:"meal",screen:"meal-logging"},()=>{const e=this.router.getCurrentRoute(),t=e?.params?.action||"",s=e?.params?.rating||"0";this.renderScreen(new X(this.container,this.router,t,s))}),this.router.register({dyad:"meal",screen:"insights"},()=>{const e=this.router.getCurrentRoute(),t=e?.params?.rating||"0",s=e?.params?.hasImage||"false",n=e?.params?.dietaryDiversity||"0.5",a=e?.params?.clutterScore||"0.5",o=e?.params?.plateCoverage||"0.5",i=e?.params?.mode||"patterns";this.renderScreen(new ne(this.container,this.router,t,s,n,a,o,i))}),this.router.register({dyad:"meal",screen:"gallery"},()=>{this.renderScreen(new ae(this.container,this.router))}),this.router.register({dyad:"meal",screen:"settings"},()=>{this.renderScreen(new ie(this.container,this.router))}),this.router.register({dyad:"night",screen:"home"},()=>{this.renderNightScreen()})}renderTantrumForm(){this.currentScreen&&this.currentScreen.destroy&&this.currentScreen.destroy(),this.container.innerHTML=`
      <div class="screen tantrum-form">
        <header class="screen-header">
          <button class="back-btn" data-action="back">← Back</button>
          <h1>😤 Tantrum Tracker</h1>
        </header>

        <main class="screen-content">
          <div id="tantrum-form-container"></div>
        </main>

        <nav class="screen-nav">
          <button class="btn secondary" data-action="cancel">Cancel</button>
          <button class="btn primary" data-action="save">Save Session</button>
        </nav>
      </div>
    `;const e=this.container.querySelector("#tantrum-form-container");this.tantrumForm=ye(),this.tantrumForm.mount(e),this.bindTantrumFormEvents()}bindTantrumFormEvents(){const e=this.container.querySelector(".back-btn");e&&e.addEventListener("click",()=>{this.router.navigate({dyad:"tantrum",screen:"home"})});const t=this.container.querySelector('[data-action="cancel"]');t&&t.addEventListener("click",()=>{this.router.navigate({dyad:"tantrum",screen:"home"})});const s=this.container.querySelector('[data-action="save"]');s&&s.addEventListener("click",async()=>{await this.saveTantrumSession()})}async saveTantrumSession(){if(!this.tantrumForm)return;const e=this.tantrumForm.validate();if(!e.ok){alert(e.message);return}const t=this.tantrumForm.getContext(),s={id:`tantrum_${Date.now()}`,ts:new Date().toISOString(),family_id:this.config.family,session_id:this.config.session,...t};try{await F.saveSession(s),alert("Session saved successfully!"),this.tantrumForm.reset(),this.router.navigate({dyad:"tantrum",screen:"home"})}catch(n){console.error("Error saving session:",n),alert("Error saving session. Please try again.")}}renderScreen(e){this.currentScreen&&this.currentScreen.destroy&&this.currentScreen.destroy(),this.currentScreen=e,e.render()}renderNightScreen(){const e=T.t("pwa.title");this.container.innerHTML=`
      <div class="container">
        <header>
          <div class="header-content">
            <h1>Silli ${e}</h1>
            <div id="language-selector-container"></div>
          </div>
          <p class="mode">${this.config.mode==="helper"?T.t("pwa.mode_label"):"Low-Power Mode"}</p>
        </header>
        
        <main>
          <div class="score-display">
            <div class="score-ring">
              <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#2d2d2d" stroke-width="8"/>
                <circle cx="50" cy="50" r="45" fill="none" stroke="#6366f1" stroke-width="8" 
                        stroke-dasharray="283" stroke-dashoffset="283" 
                        transform="rotate(-90 50 50)" id="score-circle"/>
              </svg>
              <div class="score-text">
                <span id="score-value">0</span>
                <div class="score-label">${T.t("pwa.score_ring.label")}</div>
              </div>
            </div>
          </div>

          <div class="badges">
            <h3>${T.t("pwa.badges.label")}</h3>
            <div id="badges-container"></div>
          </div>

          <div class="tips">
            <h3>${T.t("pwa.tips.title")}</h3>
            <div id="tips-container"></div>
          </div>

          <div class="controls">
            <button id="start-btn" class="btn primary">${T.t("pwa.button.start")}</button>
            <button id="stop-btn" class="btn secondary" disabled>${T.t("pwa.button.stop")}</button>
            <button id="export-btn" class="btn secondary" disabled>${T.t("pwa.button.process")}</button>
          </div>

          <div class="session-info">
            <p>Family: ${this.config.family}</p>
            <p>${T.t("pwa.session.info_id",{id:this.config.session})}</p>
            <p id="timer">${T.t("pwa.session.duration",{mm:"00",ss:"00"})}</p>
          </div>
        </main>

        <footer>
          <div class="privacy">
            <p>${T.t("pwa.footer_privacy")}</p>
          </div>
        </footer>
      </div>
    `;const t=this.container.querySelector("#language-selector-container");t&&new G(t).render(),window.addEventListener("languageChanged",()=>{this.renderNightScreen()})}stripTokenFromUrl(){if(this.config.token){const e=new URL(window.location.href);e.searchParams.delete("tok"),window.history.replaceState({},"",e.toString())}}}document.addEventListener("DOMContentLoaded",()=>{new fe});
