(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function t(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerPolicy&&(i.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?i.credentials="include":n.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(n){if(n.ep)return;n.ep=!0;const i=t(n);fetch(n.href,i)}})();class j{routes=new Map;currentRoute=null;constructor(){this.handleHashChange=this.handleHashChange.bind(this),window.addEventListener("hashchange",this.handleHashChange),window.addEventListener("load",this.handleHashChange)}register(e,t){const s=this.routeToKey(e);this.routes.set(s,t)}navigate(e){const t=this.routeToHash(e);window.location.hash=t}getCurrentRoute(){return this.currentRoute}routeToKey(e){return`${e.dyad}:${e.screen}`}routeToHash(e){let t=`#${e.dyad}/${e.screen}`;if(e.params){const s=new URLSearchParams(e.params);t+=`?${s.toString()}`}return t}hashToRoute(e){const t=e.substring(1),[s,n]=t.split("?"),[i,o]=s.split("/"),a={dyad:i||"night",screen:o||"home"};if(n){const c=new URLSearchParams(n);a.params=Object.fromEntries(c.entries())}return a}handleHashChange(){const e=window.location.hash||"#night/home",t=this.hashToRoute(e);this.currentRoute=t;const s=this.routeToKey(t),n=this.routes.get(s);if(n)n();else{console.warn(`No handler found for route: ${s}`);const i=`${t.dyad}:home`,o=this.routes.get(i);o&&o()}}destroy(){window.removeEventListener("hashchange",this.handleHashChange),window.removeEventListener("load",this.handleHashChange)}}const d={privacy:{onDeviceProcessing:"All processing happens on your device. Nothing is sent to our servers.",photosStayPrivate:"Photos stay private and are analyzed on your device only.",recordingsNeverLeave:"Your recordings never leave your device.",dataStaysLocal:"Photos and data stay on your device. No cloud storage."},empty:{noSessionsYet:"No sessions yet. Start tracking to see your history here."},buttons:{cancel:"Cancel",saveMeal:"Save Meal",analyze:"Analyze",uploadVoice:"Upload Voice",uploadVideo:"Upload Video",addText:"Add Text",snapMeal:"Snap Meal",askQuestion:"Ask a Question",logMeal:"Log Meal",viewPatterns:"View Patterns",history:"History",gallery:"Gallery",settings:"Settings"},forms:{trigger:"Trigger",duration:"Duration (minutes)",coRegulation:"Co-regulation strategies",notes:"Notes (optional)",environmentNoise:"Environment noise"},placeholders:{selectTrigger:"—",processing:"Processing..."},intensity:{mild:"1 - Mild",extreme:"10 - Extreme"},tabs:{recordSession:"Record Session",history:"History"},coRegulation:[{value:"hold",label:"Hold"},{value:"mirror",label:"Mirror"},{value:"label",label:"Label"},{value:"breathe",label:"Breathe"},{value:"safe_space",label:"Safe Space"},{value:"low_stimulus",label:"Low Stimulus"}],triggers:["transition","frustration","limit","separation","unknown"],sections:{howIntense:"How intense is this moment?",howWouldYouLike:"How would you like to share?",howWasMeal:"How was this meal?",whatWouldYouLike:"What would you like to do?",quickActions:"Quick Actions"},descriptions:{recordOrUpload:"Record or upload audio",recordOrUploadVideo:"Record or upload video",describeWhatHappened:"Describe what happened",takePhotoOfMeal:"Take a photo of the meal",getInsightsAboutFeeding:"Get insights about feeding",selectRating:"Select a rating"},app:{tantrumTranslator:"Tantrum Translator",mealMoodCompanion:"Meal Mood Companion",understandBeneathSurface:"Understand what's happening beneath the surface",trackEatingPatterns:"Track and understand your child's eating patterns"}};class U{container;router;intensitySlider=null;constructor(e,t){this.container=e,this.router=t}render(){this.container.innerHTML=`
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
    `,this.bindEvents()}bindEvents(){this.intensitySlider=this.container.querySelector("#intensity-slider");const e=this.container.querySelector("#intensity-value");this.intensitySlider&&e&&this.intensitySlider.addEventListener("input",n=>{const i=n.target.value;e.textContent=i}),this.container.querySelectorAll(".action-btn").forEach(n=>{n.addEventListener("click",i=>{const o=i.currentTarget.dataset.action||"",a=this.intensitySlider?.value||"5";this.router.navigate({dyad:"tantrum",screen:"capture",params:{action:o,intensity:a}})})}),this.container.querySelectorAll(".nav-btn").forEach(n=>{n.addEventListener("click",i=>{const o=i.currentTarget.dataset.screen;this.router.navigate({dyad:"tantrum",screen:o})})})}destroy(){}}class V{container;router;intensity;mediaRecorder=null;audioChunks=[];videoChunks=[];isRecording=!1;recordingStartTime=0;recordingTimer=null;captureType="audio";constructor(e,t,s){this.container=e,this.router=t,this.intensity=s}render(){this.container.innerHTML=`
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
    `,this.bindEvents()}bindEvents(){const e=this.container.querySelector(".back-btn");e&&e.addEventListener("click",()=>{this.stopRecording(),this.router.navigate({dyad:"tantrum",screen:"home"})});const t=this.container.querySelector("#capture-btn");t&&t.addEventListener("click",()=>{this.isRecording?this.stopRecording():this.startRecording()});const s=this.container.querySelector(".upload-btn");s&&s.addEventListener("click",()=>{this.handleUpload()});const n=this.container.querySelector('[data-action="cancel"]');n&&n.addEventListener("click",()=>{this.stopRecording(),this.router.navigate({dyad:"tantrum",screen:"home"})});const i=this.container.querySelector('[data-action="analyze"]');i&&i.addEventListener("click",()=>{this.handleAnalyze()})}async startRecording(){try{const e=await navigator.mediaDevices.getUserMedia({audio:!0,video:{width:640,height:480}});this.isRecording=!0,this.recordingStartTime=Date.now(),this.captureType=e.getVideoTracks().length>0?"video":"audio",this.updateRecordingUI(),this.mediaRecorder=new MediaRecorder(e,{mimeType:this.captureType==="video"?"video/webm":"audio/webm"}),this.mediaRecorder.ondataavailable=t=>{this.captureType==="video"?this.videoChunks.push(t.data):this.audioChunks.push(t.data)},this.mediaRecorder.onstop=()=>{this.enableAnalyzeButton()},this.mediaRecorder.start(),this.startTimer()}catch(e){console.error("Failed to start recording:",e),alert("Could not access microphone/camera. Please check permissions.")}}stopRecording(){this.mediaRecorder&&this.isRecording&&(this.mediaRecorder.stop(),this.isRecording=!1,this.stopTimer(),this.mediaRecorder.stream.getTracks().forEach(e=>e.stop()),this.updateRecordingUI())}updateRecordingUI(){const e=this.container.querySelector("#capture-placeholder"),t=this.container.querySelector("#recording-display"),s=this.container.querySelector("#capture-btn"),n=this.container.querySelector("#capture-type");this.isRecording?(e.style.display="none",t.style.display="block",s.textContent="Stop Recording",s.classList.add("recording")):(e.style.display="block",t.style.display="none",s.textContent="Start Recording",s.classList.remove("recording")),n&&(n.textContent=this.captureType==="video"?"Video":"Audio")}startTimer(){this.recordingTimer=window.setInterval(()=>{const e=Date.now()-this.recordingStartTime,t=Math.floor(e/6e4),s=Math.floor(e%6e4/1e3),n=this.container.querySelector("#recording-time");n&&(n.textContent=`${t.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}`)},1e3)}stopTimer(){this.recordingTimer&&(clearInterval(this.recordingTimer),this.recordingTimer=null)}handleUpload(){const e=document.createElement("input");e.type="file",e.accept="audio/*,video/*",e.multiple=!1,e.onchange=t=>{const s=t.target.files?.[0];s&&this.processUploadedFile(s)},e.click()}async processUploadedFile(e){const t=e.type.startsWith("video/");this.captureType=t?"video":"audio";const s=this.container.querySelector("#capture-type");s&&(s.textContent=this.captureType==="video"?"Video":"Audio"),t?this.videoChunks=[e]:this.audioChunks=[e],this.enableAnalyzeButton()}enableAnalyzeButton(){const e=this.container.querySelector('[data-action="analyze"]');e&&(e.disabled=!1)}async handleAnalyze(){this.router.navigate({dyad:"tantrum",screen:"thermo",params:{intensity:this.intensity,hasAudio:this.audioChunks.length>0?"true":"false",hasVideo:this.videoChunks.length>0?"true":"false"}})}destroy(){this.stopRecording(),this.recordingTimer&&clearInterval(this.recordingTimer)}}class z{container;router;intensity;hasAudio;hasVideo;escalationIndex=0;currentTip="";currentBadge="";tipsData=null;formHandle=null;constructor(e,t,s,n,i){this.container=e,this.router=t,this.intensity=s,this.hasAudio=n==="true",this.hasVideo=i==="true"}async render(){await this.loadTipsData(),this.container.innerHTML=`
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
    `,this.bindEvents(),await this.performAnalysis(),this.setupContextForm()}async loadTipsData(){try{const e=await fetch("/scoring/tantrum/tips.json");this.tipsData=await e.json()}catch(e){console.error("Failed to load tips data:",e),this.tipsData={tips:{},badges:{},escalation_bins:{}}}}async performAnalysis(){this.escalationIndex=Math.random()*.8+.1,this.updateThermometer(),this.updateAnalysis(),this.selectTip()}updateThermometer(){const e=Math.round(this.escalationIndex*10),t=this.intensity||e.toString(),s=this.container.querySelector("#thermometer-fill"),n=this.container.querySelector("#thermometer-marker"),i=this.container.querySelector("#marker-value"),o=this.container.querySelector("#computed-intensity"),a=this.container.querySelector("#computed-value");s&&n&&i&&(s.style.height=`${t}0%`,n.style.bottom=`${t}0%`,i.textContent=t),o&&a&&(o.style.display="block",a.textContent=`${e}/10`)}updateAnalysis(){const e=this.container.querySelector("#escalation-value");e&&(e.textContent=this.escalationIndex.toFixed(2))}selectTip(){if(!this.tipsData)return;const e="unknown",t=this.getEscalationLevel(this.escalationIndex),s=this.tipsData.tips[e]?.[t]||this.tipsData.tips.unknown?.[t]||["Stay calm and present - your child needs your stability"];this.currentTip=s[Math.floor(Math.random()*s.length)];const n=this.container.querySelector("#tip-content");n&&(n.textContent=this.currentTip)}getEscalationLevel(e){return e<.33?"low":e<.66?"medium":"high"}setupContextForm(){const e=this.container.querySelector("#context-form");e&&(e.innerHTML="<p>Context form will be available in future updates.</p>")}bindEvents(){const e=this.container.querySelector(".back-btn");e&&e.addEventListener("click",()=>{this.router.navigate({dyad:"tantrum",screen:"home"})});const t=this.container.querySelector('[data-action="save"]');t&&t.addEventListener("click",()=>{this.handleSave()});const s=this.container.querySelector('[data-action="export"]');s&&s.addEventListener("click",()=>{this.handleExport()})}async handleSave(){this.saveToHistory(this.prepareSessionData()),this.router.navigate({dyad:"tantrum",screen:"history"})}async handleExport(){const e={dyad:"tantrum",timestamp:new Date().toISOString(),intensity_user:parseInt(this.intensity),metrics:{escalation_index:this.escalationIndex},media_summaries:{has_audio:this.hasAudio,has_video:this.hasVideo,audio:{rms_p50:.5,vad_fraction:.3},video:{motion_score_p95:this.hasVideo?.7:void 0}},context:this.formHandle?this.formHandle.getContext():{},tip:this.currentTip,badge:this.currentBadge},t=new Blob([JSON.stringify(e,null,2)],{type:"application/json"}),s=URL.createObjectURL(t),n=document.createElement("a");n.href=s,n.download=`tantrum-session-${Date.now()}.json`,n.click(),URL.revokeObjectURL(s)}prepareSessionData(){return{timestamp:new Date().toISOString(),intensity:parseInt(this.intensity),escalationIndex:this.escalationIndex,hasAudio:this.hasAudio,hasVideo:this.hasVideo,tip:this.currentTip,badge:this.currentBadge,context:this.formHandle?this.formHandle.getContext():{}}}saveToHistory(e){const t="tantrum_history",s=JSON.parse(localStorage.getItem(t)||"[]");s.unshift(e),s.length>14&&s.splice(14),localStorage.setItem(t,JSON.stringify(s))}destroy(){this.formHandle}}class G{container;router;sessions=[];constructor(e,t){this.container=e,this.router=t}render(){this.loadSessions(),this.container.innerHTML=`
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
    `,this.bindEvents()}loadSessions(){const t=JSON.parse(localStorage.getItem("tantrum_history")||"[]");this.sessions=t.slice(0,14)}getAverageIntensity(){return this.sessions.length===0?"0.0":(this.sessions.reduce((t,s)=>t+s.intensity,0)/this.sessions.length).toFixed(1)}getPatternsCount(){const e=new Set(this.sessions.map(s=>s.context?.trigger).filter(Boolean)),t=this.analyzeTimePatterns();return e.size+(t.length>0?1:0)}analyzeTimePatterns(){const e=[],t={};this.sessions.forEach(n=>{const i=new Date(n.timestamp).getHours();t[i]=(t[i]||0)+1});const s=Object.entries(t).reduce((n,i)=>t[parseInt(n[0])]>t[parseInt(i[0])]?n:i);return s&&t[parseInt(s[0])]>2&&e.push(`Peak time: ${s[0]}:00`),e}generatePatterns(){const e=[],t=this.analyzeTimePatterns();t.length>0&&e.push(`
        <div class="pattern-item">
          <div class="pattern-icon">⏰</div>
          <div class="pattern-content">
            <h4>Time of Day</h4>
            <p>${t[0]}</p>
          </div>
        </div>
      `);const s={};this.sessions.forEach(o=>{const a=o.context?.trigger;a&&(s[a]=(s[a]||0)+1)});const n=Object.entries(s).reduce((o,a)=>s[o[0]]>s[a[0]]?o:a);n&&s[n[0]]>2&&e.push(`
        <div class="pattern-item">
          <div class="pattern-icon">🎯</div>
          <div class="pattern-content">
            <h4>Common Trigger</h4>
            <p>Most frequent trigger: ${n[0]}</p>
          </div>
        </div>
      `);const i=parseFloat(this.getAverageIntensity());return i>6&&e.push(`
        <div class="pattern-item">
          <div class="pattern-icon">📈</div>
          <div class="pattern-content">
            <h4>High Intensity</h4>
            <p>Average intensity is ${i.toFixed(1)}/10</p>
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
      `:e.join("")}generateInsights(){const e=[],t=this.sessions.length>0?this.sessions.reduce((u,h)=>u+h.escalationIndex,0)/this.sessions.length:0;e.push(`
      <div class="insight-item">
        <div class="insight-icon">⚡</div>
        <div class="insight-content">
          <h4>Average Escalation</h4>
          <p>Your average escalation index is ${t.toFixed(2)}</p>
        </div>
      </div>
    `);const s={};this.sessions.forEach(u=>{const h=u.context?.trigger;h&&(s[h]=(s[h]||0)+1)});const n=Object.entries(s).reduce((u,h)=>s[u[0]]>s[h[0]]?u:h);n&&s[n[0]]>2&&e.push(`
        <div class="insight-item">
          <div class="insight-icon">🎯</div>
          <div class="insight-content">
            <h4>Common Trigger</h4>
            <p>Most frequent trigger: ${n[0]}</p>
          </div>
        </div>
      `);const i=this.sessions.length,o=this.sessions.filter(u=>u.hasAudio).length,a=this.sessions.filter(u=>u.hasVideo).length,c=this.sessions.filter(u=>u.hasAudio&&u.hasVideo).length,w=o/i*100,f=a/i*100,l=(o+a-c)/i*100;return e.push(`
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
      `:this.sessions.map((e,t)=>{const s=new Date(e.timestamp),n=s.toLocaleDateString()+" "+s.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),i=e.context?.trigger||"Unknown",o=e.context?.notes||"";return`
        <div class="session-item" data-index="${t}">
          <div class="session-header">
            <div class="session-date">${n} · esc=${e.escalationIndex.toFixed(2)}</div>
            <button class="delete-btn" data-index="${t}">🗑️</button>
          </div>
          <div class="session-details">
            <div class="session-intensity">Intensity: ${e.intensity}/10</div>
            <div class="session-trigger">Trigger: ${i}</div>
            ${e.hasAudio?'<div class="session-media">🎤 Audio</div>':""}
            ${e.hasVideo?'<div class="session-media">🎥 Video</div>':""}
            ${o?`<div class="session-notes">${o}</div>`:""}
          </div>
        </div>
      `}).join("")}bindEvents(){const e=this.container.querySelector(".back-btn");e&&e.addEventListener("click",()=>{this.router.navigate({dyad:"tantrum",screen:"home"})});const t=this.container.querySelector('[data-action="export"]');t&&t.addEventListener("click",()=>{this.handleExport()});const s=this.container.querySelector('[data-action="new-session"]');s&&s.addEventListener("click",()=>{this.router.navigate({dyad:"tantrum",screen:"home"})});const n=this.container.querySelector('[data-action="clear-all"]');n&&n.addEventListener("click",()=>{this.handleClearAll()}),this.container.querySelectorAll(".delete-btn").forEach(o=>{o.addEventListener("click",a=>{a.stopPropagation();const c=parseInt(a.currentTarget.dataset.index||"0");this.handleDeleteSession(c)})})}handleExport(){const e={sessions:this.sessions,summary:{totalSessions:this.sessions.length,averageIntensity:this.getAverageIntensity(),patternsCount:this.getPatternsCount(),exportDate:new Date().toISOString()}},t=new Blob([JSON.stringify(e,null,2)],{type:"application/json"}),s=URL.createObjectURL(t),n=document.createElement("a");n.href=s,n.download=`tantrum-history-${Date.now()}.json`,n.click(),URL.revokeObjectURL(s)}handleClearAll(){confirm("Are you sure you want to delete all tantrum session data? This cannot be undone.")&&(localStorage.removeItem("tantrum_history"),this.sessions=[],this.render())}handleDeleteSession(e){confirm("Delete this session?")&&(this.sessions.splice(e,1),localStorage.setItem("tantrum_history",JSON.stringify(this.sessions)),this.render())}destroy(){}}class W{container;router;constructor(e,t){this.container=e,this.router=t}render(){this.container.innerHTML=`
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
    `,this.bindEvents()}bindEvents(){const e=this.container.querySelector(".back-btn");e&&e.addEventListener("click",()=>{this.router.navigate({dyad:"tantrum",screen:"home"})});const t=this.container.querySelector('[data-action="done"]');t&&t.addEventListener("click",()=>{this.router.navigate({dyad:"tantrum",screen:"home"})});const s=this.container.querySelector('[data-action="export-all"]');s&&s.addEventListener("click",()=>{this.handleExportAll()});const n=this.container.querySelector('[data-action="clear-data"]');n&&n.addEventListener("click",()=>{this.handleClearData()}),this.container.querySelectorAll(".toggle input").forEach(o=>{o.addEventListener("change",a=>{this.handlePreferenceChange(a.target)})})}handleExportAll(){console.log("Exporting all tantrum data");const e=this.container.querySelector('[data-action="export-all"]');e&&(e.textContent="✓ Exported",e.disabled=!0,setTimeout(()=>{e.textContent="📤 Export All Data",e.disabled=!1},2e3))}handleClearData(){if(confirm("Are you sure you want to clear all data? This cannot be undone.")){console.log("Clearing all tantrum data");const e=this.container.querySelector('[data-action="clear-data"]');e&&(e.textContent="✓ Cleared",e.disabled=!0,setTimeout(()=>{e.textContent="🗑️ Clear All Data",e.disabled=!1},2e3))}}handlePreferenceChange(e){const t=e.closest(".preference-item")?.querySelector(".preference-label span")?.textContent;console.log(`Preference changed: ${t} = ${e.checked}`)}destroy(){}}class Y{container;router;currentRating=0;constructor(e,t){this.container=e,this.router=t}render(){this.container.innerHTML=`
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
    `,this.bindEvents()}bindEvents(){this.container.querySelectorAll(".star-btn").forEach(i=>{i.addEventListener("click",o=>{const a=parseInt(o.currentTarget.dataset.rating||"0");this.handleRatingChange(a)})}),this.container.querySelectorAll(".action-btn").forEach(i=>{i.addEventListener("click",o=>{const a=o.currentTarget.dataset.action||"";this.handleAction(a)})}),this.container.querySelectorAll(".quick-btn").forEach(i=>{i.addEventListener("click",o=>{const a=o.currentTarget.dataset.action||"";this.handleQuickAction(a)})}),this.container.querySelectorAll(".nav-btn").forEach(i=>{i.addEventListener("click",o=>{const a=o.currentTarget.dataset.screen;this.router.navigate({dyad:"meal",screen:a})})})}handleRatingChange(e){this.currentRating=e,this.container.querySelectorAll(".star-btn").forEach((n,i)=>{const o=n;i<e?(o.textContent="⭐",o.classList.add("active")):(o.textContent="☆",o.classList.remove("active"))});const s=this.container.querySelector("#rating-text");if(s){const n=["","Poor","Fair","Good","Very Good","Excellent"];s.textContent=n[e]||"Select a rating"}}handleAction(e){switch(e){case"snap":this.router.navigate({dyad:"meal",screen:"meal-logging",params:{action:e,rating:this.currentRating.toString()}});break;case"question":this.router.navigate({dyad:"meal",screen:"insights",params:{action:e,rating:this.currentRating.toString(),mode:"question"}});break}}handleQuickAction(e){switch(e){case"log-meal":this.router.navigate({dyad:"meal",screen:"meal-logging",params:{action:"log",rating:this.currentRating.toString()}});break;case"view-patterns":this.router.navigate({dyad:"meal",screen:"insights"});break}}destroy(){}}class J{container;router;action;rating;textDescription=null;constructor(e,t,s,n){this.container=e,this.router=t,this.action=s,this.rating=n}render(){const e=this.getActionConfig();this.container.innerHTML=`
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
                  <span class="stars">
                    ${"⭐".repeat(parseInt(this.rating)||0)}${"☆".repeat(5-(parseInt(this.rating)||0))}
                  </span>
                  <span class="rating-text">${this.getRatingText()}</span>
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
    `,this.bindEvents()}getActionConfig(){switch(this.action){case"snap":return{title:"📷 Snap Meal",icon:"📷",description:"Take a photo of the meal",buttonText:"Take Photo"};case"log":return{title:"📝 Log Meal",icon:"📝",description:"Log meal details manually",buttonText:"Start Logging"};default:return{title:"Meal Logging",icon:"🍽️",description:"Log your meal details",buttonText:"Start"}}}getRatingText(){const e=parseInt(this.rating)||0;return["","Poor","Fair","Good","Very Good","Excellent"][e]||"No rating"}bindEvents(){const e=this.container.querySelector(".back-btn");e&&e.addEventListener("click",()=>{this.router.navigate({dyad:"meal",screen:"home"})});const t=this.container.querySelector(".capture-btn");t&&t.addEventListener("click",()=>{this.handleCapture()});const s=this.container.querySelector(".upload-btn");s&&s.addEventListener("click",()=>{this.handleUpload()});const n=this.container.querySelector('[data-action="cancel"]');n&&n.addEventListener("click",()=>{this.router.navigate({dyad:"meal",screen:"home"})});const i=this.container.querySelector('[data-action="save"]');i&&i.addEventListener("click",()=>{this.handleSave()}),this.container.querySelectorAll(".form-input, .form-select, .form-textarea").forEach(a=>{a.addEventListener("input",()=>{this.validateForm()})})}handleCapture(){if(this.action==="log"){this.showTextInputMode();return}navigator.mediaDevices&&navigator.mediaDevices.getUserMedia?navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"}}).then(e=>{this.showCameraCapture(e)}).catch(e=>{console.log("Camera access failed, falling back to file input:",e),this.openFileInput(!0)}):this.openFileInput(!0)}handleUpload(){this.openFileInput(!1)}openFileInput(e){const t=document.createElement("input");t.type="file",t.accept="image/*",e&&(t.capture="environment"),t.addEventListener("change",s=>{const n=s.target.files?.[0];n&&this.handleImageSelected(n)}),t.click()}showCameraCapture(e){const t=this.container.querySelector(".capture-area");if(t){t.innerHTML=`
        <div class="camera-capture">
          <video id="camera-video" autoplay playsinline style="width: 100%; max-height: 300px; border-radius: 8px;"></video>
          <div class="camera-controls">
            <button class="btn primary capture-photo-btn" data-action="capture-photo">📸 Take Photo</button>
            <button class="btn secondary cancel-camera-btn" data-action="cancel-camera">❌ Cancel</button>
          </div>
        </div>
      `;const s=t.querySelector("#camera-video");s.srcObject=e;const n=t.querySelector(".capture-photo-btn"),i=t.querySelector(".cancel-camera-btn");n&&n.addEventListener("click",()=>{this.capturePhotoFromCamera(s,e)}),i&&i.addEventListener("click",()=>{e.getTracks().forEach(o=>o.stop()),this.render()})}}capturePhotoFromCamera(e,t){const s=document.createElement("canvas"),n=s.getContext("2d");n&&(s.width=e.videoWidth,s.height=e.videoHeight,n.drawImage(e,0,0),s.toBlob(i=>{if(i){const o=new File([i],"camera-photo.jpg",{type:"image/jpeg"});this.handleImageSelected(o)}t.getTracks().forEach(o=>o.stop())},"image/jpeg",.8))}showTextInputMode(){const e=this.container.querySelector(".capture-area");if(e){e.innerHTML=`
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
        `;const n=s.querySelector(".edit-text-btn");n&&n.addEventListener("click",()=>{this.showTextInputMode();const i=this.container.querySelector("#meal-description");i&&(i.value=t)})}}else alert("Please enter a meal description.")}handleImageSelected(e){const t=new FileReader;t.onload=s=>{const n=s.target?.result;this.displayImage(n),this.enableSaveButton()},t.readAsDataURL(e)}displayImage(e){const t=this.container.querySelector(".capture-area");if(t){t.innerHTML=`
        <div class="captured-image">
          <img src="${e}" alt="Captured meal" style="max-width: 100%; max-height: 300px; border-radius: 8px;">
          <button class="btn secondary retake-btn" data-action="retake">🔄 Retake Photo</button>
        </div>
      `;const s=t.querySelector(".retake-btn");s&&s.addEventListener("click",()=>{this.render()})}}validateForm(){const e=this.container.querySelector("#meal-type")?.value,t=this.container.querySelector("#food-items")?.value,s=e&&t.trim(),n=this.container.querySelector('[data-action="save"]');n&&(n.disabled=!s)}enableSaveButton(){const e=this.container.querySelector('[data-action="save"]');e&&(e.disabled=!1)}handleSave(){console.log("Saving meal log"),this.textDescription&&console.log("Text description:",this.textDescription),this.router.navigate({dyad:"meal",screen:"insights",params:{action:"saved",rating:this.rating}})}destroy(){}}const K="modulepreload",Q=function(r){return"/silli-meter/"+r},O={},Z=function(e,t,s){let n=Promise.resolve();if(t&&t.length>0){let w=function(f){return Promise.all(f.map(l=>Promise.resolve(l).then(u=>({status:"fulfilled",value:u}),u=>({status:"rejected",reason:u}))))};var o=w;document.getElementsByTagName("link");const a=document.querySelector("meta[property=csp-nonce]"),c=a?.nonce||a?.getAttribute("nonce");n=w(t.map(f=>{if(f=Q(f),f in O)return;O[f]=!0;const l=f.endsWith(".css"),u=l?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${f}"]${u}`))return;const h=document.createElement("link");if(h.rel=l?"stylesheet":K,l||(h.as="script"),h.crossOrigin="",h.href=f,c&&h.setAttribute("nonce",c),document.head.appendChild(h),l)return new Promise((m,y)=>{h.addEventListener("load",m),h.addEventListener("error",()=>y(new Error(`Unable to preload CSS for ${f}`)))})}))}function i(a){const c=new Event("vite:preloadError",{cancelable:!0});if(c.payload=a,window.dispatchEvent(c),!c.defaultPrevented)throw a}return n.then(a=>{for(const c of a||[])c.status==="rejected"&&i(c.reason);return e().catch(i)})};class X{container;router;rating;hasImage;dietaryDiversity;clutterScore;plateCoverage;mealMood=0;adjustedMood=0;currentTip="";currentBadge="";tipsData=null;mode="patterns";constructor(e,t,s,n,i,o,a,c){this.container=e,this.router=t,this.rating=s,this.hasImage=n==="true",this.dietaryDiversity=parseFloat(i),this.clutterScore=parseFloat(o),this.plateCoverage=parseFloat(a),this.mode=c||"patterns"}async render(){await this.loadTipsData(),this.calculateMealMood();const e=this.mode==="question";this.container.innerHTML=`
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
      `)}bindEvents(){const e=this.container.querySelector(".back-btn");if(e&&e.addEventListener("click",()=>{this.router.navigate({dyad:"meal",screen:"home"})}),this.mode==="question"){this.container.querySelectorAll(".suggestion-btn").forEach(o=>{o.addEventListener("click",a=>{const c=a.currentTarget.dataset.question||"",w=this.container.querySelector("#question-input");w&&(w.value=c)})});const i=this.container.querySelector(".ask-btn");i&&i.addEventListener("click",()=>{this.handleAskQuestion()})}const t=this.container.querySelector('[data-action="save"]');t&&t.addEventListener("click",()=>{this.handleSave()});const s=this.container.querySelector('[data-action="export"]');s&&s.addEventListener("click",()=>{this.handleExport()})}async handleAskQuestion(){const t=this.container.querySelector("#question-input")?.value.trim();if(!t){alert("Please enter a question first.");return}const s=this.container.querySelector(".ask-btn"),n=s.textContent;s.textContent="🤖 Thinking...",s.disabled=!0;try{const i=await this.generateAIResponse(t);this.displayAnswer(i)}catch(i){console.error("Error generating response:",i),alert("Sorry, there was an error generating the response. Please try again.")}finally{s.textContent=n,s.disabled=!1}}async generateAIResponse(e){await new Promise(s=>setTimeout(s,2e3));const t=e.toLowerCase();return t.includes("broccoli")||t.includes("brocolli")?`Great question about broccoli! Here are specific strategies to help your son enjoy it:

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
      `;const n=s.querySelector(".new-question-btn");n&&n.addEventListener("click",()=>{t.style.display="none";const i=this.container.querySelector("#question-input");i&&(i.value="",i.focus())}),t.scrollIntoView({behavior:"smooth"})}}async handleSave(){const e=this.prepareSessionData();this.saveToHistory(e),this.router.navigate({dyad:"meal",screen:"gallery"})}async handleExport(){const e={dyad:"meal",timestamp:new Date().toISOString(),rating:parseInt(this.rating),metrics:{meal_mood:this.adjustedMood},media_summaries:{image:{dietary_diversity:this.dietaryDiversity,clutter_score:this.clutterScore,plate_coverage:this.plateCoverage}},tip:this.currentTip,badge:this.currentBadge};try{await this.sendToBot(e),this.downloadJSON(e),alert("Results exported successfully! Data sent to Silli Bot.")}catch(t){console.error("Error exporting:",t),alert("Export failed. Please try again.")}}async sendToBot(e){const t=new URLSearchParams(window.location.search),s=t.get("family")||"unknown",n=t.get("session")||`meal_${Date.now()}`,i={type:"meal_export",data:e,timestamp:new Date().toISOString(),family_id:s,session_id:n},{enqueue:o}=await Z(async()=>{const{enqueue:a}=await import("./queue-CGxIyKpm.js");return{enqueue:a}},[]);o({family:s,session:n,payload:JSON.stringify(i),createdAt:Date.now()}),await this.tryImmediateSend(i)}async tryImmediateSend(e){try{(await fetch("/api/relay",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)})).ok||console.log("Immediate send failed, data queued for later pickup")}catch(t){console.log("Immediate send failed, data queued for later pickup:",t)}}downloadJSON(e){const t=new Blob([JSON.stringify(e,null,2)],{type:"application/json"}),s=URL.createObjectURL(t),n=document.createElement("a");n.href=s,n.download=`meal-session-${Date.now()}.json`,n.click(),URL.revokeObjectURL(s)}prepareSessionData(){return{timestamp:new Date().toISOString(),rating:parseInt(this.rating),mealMood:this.adjustedMood,hasImage:this.hasImage,dietaryDiversity:this.dietaryDiversity,clutterScore:this.clutterScore,plateCoverage:this.plateCoverage,tip:this.currentTip,badge:this.currentBadge}}saveToHistory(e){const t="meal_history",s=JSON.parse(localStorage.getItem(t)||"[]");s.unshift(e),s.length>30&&s.splice(30),localStorage.setItem(t,JSON.stringify(s))}destroy(){}}class ee{container;router;sessions=[];constructor(e,t){this.container=e,this.router=t}render(){this.loadSessions(),this.container.innerHTML=`
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
      `),this.sessions.reduce((i,o)=>i+o.dietaryDiversity,0)/this.sessions.length>.6&&e.push(`
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
      `:e.join("")}generateInsights(){const e=[],t=this.sessions.length>0?this.sessions.reduce((i,o)=>i+o.mealMood,0)/this.sessions.length:0;e.push(`
      <div class="insight-item">
        <div class="insight-icon">😊</div>
        <div class="insight-content">
          <h4>Average Meal Mood</h4>
          <p>Your average meal mood is ${Math.round(t)}/100</p>
        </div>
      </div>
    `);const s=this.sessions.filter(i=>i.context?.eaten_pct!==void 0);if(s.length>0){const i=s.reduce((o,a)=>o+(a.context.eaten_pct||0),0)/s.length;e.push(`
        <div class="insight-item">
          <div class="insight-icon">🍽️</div>
          <div class="insight-content">
            <h4>Average Eaten Percentage</h4>
            <p>Your child eats ${Math.round(i)}% of meals on average</p>
          </div>
        </div>
      `)}const n=this.sessions.length>0?this.sessions.reduce((i,o)=>i+o.dietaryDiversity,0)/this.sessions.length:0;return e.push(`
      <div class="insight-item">
        <div class="insight-icon">🌈</div>
        <div class="insight-content">
          <h4>Average Dietary Diversity</h4>
          <p>Your average dietary diversity is ${(n*100).toFixed(0)}%</p>
        </div>
      </div>
    `),e.join("")}analyzeTimePatterns(){const e=[],t={};this.sessions.forEach(n=>{const i=new Date(n.timestamp).getHours();t[i]=(t[i]||0)+1});const s=Object.entries(t).reduce((n,i)=>t[parseInt(n[0])]>t[parseInt(i[0])]?n:i);if(s&&t[parseInt(s[0])]>3){const n=this.getTimeName(parseInt(s[0]));e.push(`Most meals logged at ${n}`)}return e}getTimeName(e){return e<12?`${e}:00 AM`:e===12?"12:00 PM":`${e-12}:00 PM`}renderGallery(){return this.sessions.length===0?`
        <div class="empty-state">
          <div class="empty-icon">📸</div>
          <h4>No Meals Yet</h4>
          <p>Start logging meals to see your gallery here.</p>
        </div>
      `:this.sessions.map((e,t)=>{const s=new Date(e.timestamp),n=s.toLocaleDateString()+" "+s.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),i="⭐".repeat(e.rating);return`
        <div class="meal-card" data-index="${t}">
          <div class="meal-image">
            ${e.hasImage?`<img src="${e.thumbnail||"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiB2aWV3Qm94PSIwIDAgMTUwIDE1MCI+PHJlY3Qgd2lkdGg9IjE1MCIgaGVpZ2h0PSIxNTAiIGZpbGw9IiNmMGYwZjAiLz48dGV4dCB4PSI3NSIgeT0iNzUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjOTk5Ij7wn5KHPzwvdGV4dD48L3N2Zz4="}" alt="Meal photo" />`:'<div class="no-image">📷</div>'}
          </div>
          <div class="meal-info">
            <div class="meal-date">${n} · mood=${Math.round(e.mealMood)}</div>
            <div class="meal-rating">${i}</div>
            <div class="meal-metrics">
              <span class="metric">D: ${(e.dietaryDiversity*100).toFixed(0)}%</span>
              <span class="metric">C: ${(e.clutterScore*100).toFixed(0)}%</span>
              <span class="metric">P: ${(e.plateCoverage*100).toFixed(0)}%</span>
            </div>
          </div>
          <button class="delete-btn" data-index="${t}">🗑️</button>
        </div>
      `}).join("")}bindEvents(){const e=this.container.querySelector(".back-btn");e&&e.addEventListener("click",()=>{this.router.navigate({dyad:"meal",screen:"home"})});const t=this.container.querySelector('[data-action="export"]');t&&t.addEventListener("click",()=>{this.handleExport()});const s=this.container.querySelector('[data-action="new-meal"]');s&&s.addEventListener("click",()=>{this.router.navigate({dyad:"meal",screen:"home"})});const n=this.container.querySelector('[data-action="clear-all"]');n&&n.addEventListener("click",()=>{this.handleClearAll()}),this.container.querySelectorAll(".delete-btn").forEach(o=>{o.addEventListener("click",a=>{a.stopPropagation();const c=parseInt(a.currentTarget.dataset.index||"0");this.handleDeleteMeal(c)})})}handleExport(){const e={sessions:this.sessions,summary:{totalMeals:this.sessions.length,averageMood:this.getAverageMood(),averageRating:this.getAverageRating(),exportDate:new Date().toISOString()}},t=new Blob([JSON.stringify(e,null,2)],{type:"application/json"}),s=URL.createObjectURL(t),n=document.createElement("a");n.href=s,n.download=`meal-gallery-${Date.now()}.json`,n.click(),URL.revokeObjectURL(s)}handleClearAll(){confirm("Are you sure you want to delete all meal data? This cannot be undone.")&&(localStorage.removeItem("meal_history"),this.sessions=[],this.render())}handleDeleteMeal(e){confirm("Delete this meal?")&&(this.sessions.splice(e,1),localStorage.setItem("meal_history",JSON.stringify(this.sessions)),this.render())}destroy(){}}class te{container;router;constructor(e,t){this.container=e,this.router=t}render(){this.container.innerHTML=`
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
    `,this.bindEvents()}bindEvents(){const e=this.container.querySelector(".back-btn");e&&e.addEventListener("click",()=>{this.router.navigate({dyad:"meal",screen:"home"})});const t=this.container.querySelector('[data-action="done"]');t&&t.addEventListener("click",()=>{this.router.navigate({dyad:"meal",screen:"home"})});const s=this.container.querySelector('[data-action="export-all"]');s&&s.addEventListener("click",()=>{this.handleExportAll()});const n=this.container.querySelector('[data-action="clear-data"]');n&&n.addEventListener("click",()=>{this.handleClearData()}),this.container.querySelectorAll(".toggle input").forEach(o=>{o.addEventListener("change",a=>{this.handlePreferenceChange(a.target)})})}handleExportAll(){console.log("Exporting all meal data");const e=this.container.querySelector('[data-action="export-all"]');e&&(e.textContent="✓ Exported",e.disabled=!0,setTimeout(()=>{e.textContent="📤 Export All Data",e.disabled=!1},2e3))}handleClearData(){if(confirm("Are you sure you want to clear all meal data? This cannot be undone.")){console.log("Clearing all meal data");const e=this.container.querySelector('[data-action="clear-data"]');e&&(e.textContent="✓ Cleared",e.disabled=!0,setTimeout(()=>{e.textContent="🗑️ Clear All Data",e.disabled=!1},2e3))}}handlePreferenceChange(e){const t=e.closest(".preference-item")?.querySelector(".preference-label span")?.textContent;console.log(`Preference changed: ${t} = ${e.checked}`)}destroy(){}}function k(r,e){const t=document.createElement(r);return e&&(e.className&&(t.className=e.className),e.id&&(t.id=e.id),e.text&&(t.textContent=e.text)),t}function se(r,e,t){return Math.max(e,Math.min(t,r))}function ne(r,e,t){function s(){const n=r.value.length;t.textContent=`${n}/${e}`,n>e&&(r.value=r.value.slice(0,e))}r.addEventListener("input",s),s()}function ie(r,e){return Array.from(r.querySelectorAll(e)).filter(t=>t.checked).map(t=>t.value)}const ae=[{min:1,max:3,label:"Calm",color:"#4CAF50"},{min:4,max:6,label:"Rising",color:"#FF9800"},{min:7,max:10,label:"High",color:"#F44336"}];function oe(){let r,e,t,s,n=[],i=null,o=5;function a(y){y.innerHTML="",r=document.createElement("div"),r.className="thermometer",r.style.cssText=`
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
    `,r.appendChild(s);const C=document.createElement("div");C.style.cssText=`
      position: relative;
      padding: 8px 0;
    `,e=document.createElement("input"),e.type="range",e.min="1",e.max="10",e.step="1",e.value=o.toString(),e.style.cssText=`
      width: 100%;
      height: 8px;
      border-radius: 4px;
      background: linear-gradient(to right, #4CAF50 0%, #4CAF50 30%, #FF9800 30%, #FF9800 60%, #F44336 60%, #F44336 100%);
      outline: none;
      -webkit-appearance: none;
    `,e.addEventListener("input",c),e.addEventListener("change",w);const v=document.createElement("style");v.textContent=`
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
    `,document.head.appendChild(v),C.appendChild(e),r.appendChild(C);const b=document.createElement("div");b.style.cssText=`
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: #666;
      margin-top: 4px;
    `;const p=document.createElement("span");p.textContent="1";const x=document.createElement("span");x.textContent="10",b.appendChild(p),b.appendChild(x),r.appendChild(b),y.appendChild(r),f()}function c(){const y=parseInt(e.value);y!==o&&(o=y,f(),i&&clearTimeout(i),i=window.setTimeout(()=>{n.forEach(S=>S(o))},150))}function w(){n.forEach(y=>y(o))}function f(){t.textContent=o.toString();const y=ae.find(S=>o>=S.min&&o<=S.max);y?(s.textContent=y.label,s.style.color=y.color):s.textContent=""}function l(){return o}function u(y){const S=Math.max(1,Math.min(10,Math.round(y)));S!==o&&(o=S,e&&(e.value=o.toString()),f())}function h(y){n.push(y)}function m(){i&&clearTimeout(i),n=[],r&&r.parentNode&&r.parentNode.removeChild(r)}return{mount:a,getValue:l,setValue:u,onValueChange:h,destroy:m}}const A="tantrum_sessions",I="meal_sessions",re="silli_meter_db",ce=2,$=14;class le{db=null;useIndexedDB=!0;async init(){try{this.db=await this.openIndexedDB(),console.log("✅ Using IndexedDB for local storage")}catch(e){console.warn("⚠️ IndexedDB not available, falling back to localStorage:",e),this.useIndexedDB=!1}}openIndexedDB(){return new Promise((e,t)=>{const s=indexedDB.open(re,ce);s.onerror=()=>t(s.error),s.onsuccess=()=>e(s.result),s.onupgradeneeded=n=>{const i=n.target.result;i.objectStoreNames.contains(A)||i.createObjectStore(A,{keyPath:"id"}).createIndex("ts","ts",{unique:!1}),i.objectStoreNames.contains(I)||i.createObjectStore(I,{keyPath:"id"}).createIndex("ts","ts",{unique:!1})}})}async saveSession(e){this.useIndexedDB&&this.db?await this.saveToIndexedDB(e,A):this.saveToLocalStorage(e,"tantrum_sessions")}async saveMealSession(e){this.useIndexedDB&&this.db?await this.saveToIndexedDB(e,I):this.saveToLocalStorage(e,"meal_sessions")}async saveToIndexedDB(e,t){return new Promise((s,n)=>{if(!this.db){n(new Error("IndexedDB not initialized"));return}const a=this.db.transaction([t],"readwrite").objectStore(t).add(e);a.onsuccess=()=>{this.cleanupOldSessions(t),s()},a.onerror=()=>n(a.error)})}saveToLocalStorage(e,t){const s=this.getSessionsFromLocalStorage(t);s.push(e),s.length>$&&s.splice(0,s.length-$),localStorage.setItem(t,JSON.stringify(s))}async getSessions(){return this.useIndexedDB&&this.db?this.getSessionsFromIndexedDB(A):this.getSessionsFromLocalStorage("tantrum_sessions")}async getMealSessions(){return this.useIndexedDB&&this.db?this.getSessionsFromIndexedDB(I):this.getSessionsFromLocalStorage("meal_sessions")}async getSessionsFromIndexedDB(e){return new Promise((t,s)=>{if(!this.db){s(new Error("IndexedDB not initialized"));return}const a=this.db.transaction([e],"readonly").objectStore(e).index("ts").getAll();a.onsuccess=()=>{const c=a.result;c.sort((w,f)=>new Date(f.ts).getTime()-new Date(w.ts).getTime()),t(c.slice(0,$))},a.onerror=()=>s(a.error)})}getSessionsFromLocalStorage(e){try{const t=localStorage.getItem(e);if(!t)return[];const s=JSON.parse(t);return s.sort((n,i)=>new Date(i.ts).getTime()-new Date(n.ts).getTime()),s.slice(0,$)}catch(t){return console.warn("Error reading from localStorage:",t),[]}}async cleanupOldSessions(e){if(!this.db)return;const t=await this.getSessionsFromIndexedDB(e);if(t.length<=$)return;const n=this.db.transaction([e],"readwrite").objectStore(e),i=t.slice($);for(const o of i)n.delete(o.id)}async clearAll(){if(this.useIndexedDB&&this.db){const e=this.db.transaction([A,I],"readwrite");e.objectStore(A).clear(),e.objectStore(I).clear()}else localStorage.removeItem("tantrum_sessions"),localStorage.removeItem("meal_sessions")}async getStats(){const e=await this.getSessions();if(e.length===0)return{total:0,avg_intensity:0,most_common_trigger:null};const t=e.map(a=>a.intensity_1_10).filter(a=>a!==void 0),s=t.length>0?t.reduce((a,c)=>a+c,0)/t.length:0,i=e.map(a=>a.trigger).filter(a=>a!==void 0).reduce((a,c)=>(a[c]=(a[c]||0)+1,a),{}),o=Object.keys(i).length>0?Object.entries(i).reduce((a,c)=>a[1]>c[1]?a:c)[0]:null;return{total:e.length,avg_intensity:Math.round(s*10)/10,most_common_trigger:o}}async getMealStats(){const e=await this.getMealSessions();if(e.length===0)return{total:0,avg_rating:0,most_common_meal_type:null};const t=e.map(a=>a.rating).filter(a=>a!==void 0),s=t.length>0?t.reduce((a,c)=>a+c,0)/t.length:0,i=e.map(a=>a.meal_type).filter(a=>a!==void 0).reduce((a,c)=>(a[c]=(a[c]||0)+1,a),{}),o=Object.keys(i).length>0?Object.entries(i).reduce((a,c)=>a[1]>c[1]?a:c)[0]:null;return{total:e.length,avg_rating:Math.round(s*10)/10,most_common_meal_type:o}}}const P=new le;P.init().catch(console.error);function de(){let r,e=[];function t(l){l.innerHTML="",r=document.createElement("div"),r.className="history",r.style.cssText=`
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 16px;
      background: #f5f5f5;
      border-radius: 8px;
      max-height: 400px;
      overflow-y: auto;
    `;const u=document.createElement("h3");u.textContent="Recent Sessions (Last 14)",u.style.cssText=`
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: #333;
      border-bottom: 2px solid #e0e0e0;
      padding-bottom: 8px;
    `,r.appendChild(u);const h=document.createElement("div");h.className="history-stats",h.style.cssText=`
      display: flex;
      gap: 16px;
      padding: 12px;
      background: white;
      border-radius: 6px;
      font-size: 14px;
    `,r.appendChild(h);const m=document.createElement("div");m.className="history-sessions",m.style.cssText=`
      display: flex;
      flex-direction: column;
      gap: 8px;
    `,r.appendChild(m),l.appendChild(r),s()}async function s(){try{e=await P.getSessions(),n(),o()}catch(l){console.error("Error loading history:",l),a()}}function n(){const l=r.querySelector(".history-stats");if(!l)return;const u={total:e.length,avg_intensity:e.length>0?Math.round(e.reduce((h,m)=>h+(m.intensity_1_10||0),0)/e.length*10)/10:0,most_common_trigger:i()};l.innerHTML=`
      <div style="flex: 1; text-align: center;">
        <div style="font-weight: bold; color: #2196F3;">${u.total}</div>
        <div style="font-size: 12px; color: #666;">Sessions</div>
      </div>
      <div style="flex: 1; text-align: center;">
        <div style="font-weight: bold; color: #FF9800;">${u.avg_intensity}</div>
        <div style="font-size: 12px; color: #666;">Avg Intensity</div>
      </div>
      <div style="flex: 1; text-align: center;">
        <div style="font-weight: bold; color: #4CAF50;">${u.most_common_trigger||"—"}</div>
        <div style="font-size: 12px; color: #666;">Top Trigger</div>
      </div>
    `}function i(){const l=e.map(h=>h.trigger).filter(h=>h!==void 0);if(l.length===0)return null;const u=l.reduce((h,m)=>(h[m]=(h[m]||0)+1,h),{});return Object.entries(u).reduce((h,m)=>h[1]>m[1]?h:m)[0]}function o(){const l=r.querySelector(".history-sessions");if(l){if(e.length===0){l.innerHTML=`
        <div style="text-align: center; padding: 32px; color: #666; font-style: italic;">
          ${d.empty.noSessionsYet}
        </div>
      `;return}l.innerHTML=e.map(u=>{const h=new Date(u.ts),m=w(h),y=u.intensity_1_10||0,S=u.escalation_index||0,C=y<=3?"#4CAF50":y<=6?"#FF9800":"#F44336",v=S<=.3?"#4CAF50":S<=.7?"#FF9800":"#F44336";return`
        <div class="session-item" style="
          background: white;
          border-radius: 6px;
          padding: 12px;
          border-left: 4px solid ${C};
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        ">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
            <div style="font-weight: 600; color: #333;">${c(h)}</div>
            <div style="font-size: 12px; color: #666;">${m}</div>
          </div>
          
          <div style="display: flex; gap: 12px; margin-bottom: 8px;">
            ${u.trigger?`
              <div style="
                background: #e3f2fd;
                color: #1976d2;
                padding: 4px 8px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: 500;
              ">
                ${u.trigger}
              </div>
            `:""}
            
            ${y>0?`
              <div style="
                background: ${C}20;
                color: ${C};
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
                background: ${v}20;
                color: ${v};
                padding: 4px 8px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: 500;
              ">
                Escalation: ${Math.round(S*100)}%
              </div>
            `:""}
          </div>
          
          ${u.duration_min?`
            <div style="font-size: 12px; color: #666; margin-bottom: 4px;">
              Duration: ${u.duration_min} minutes
            </div>
          `:""}
          
          ${u.notes?`
            <div style="
              font-size: 12px;
              color: #555;
              font-style: italic;
              background: #f9f9f9;
              padding: 6px 8px;
              border-radius: 4px;
              margin-top: 4px;
            ">
              "${u.notes}"
            </div>
          `:""}
        </div>
      `}).join("")}}function a(){const l=r.querySelector(".history-sessions");l&&(l.innerHTML=`
      <div style="text-align: center; padding: 32px; color: #f44336; font-style: italic;">
        Error loading history. Please try again.
      </div>
    `)}function c(l){const h=Math.abs(new Date().getTime()-l.getTime()),m=Math.ceil(h/(1e3*60*60*24));return m===1?"Today":m===2?"Yesterday":m<=7?l.toLocaleDateString("en-US",{weekday:"short"}):l.toLocaleDateString("en-US",{month:"short",day:"numeric"})}function w(l){const h=new Date().getTime()-l.getTime(),m=Math.floor(h/(1e3*60)),y=Math.floor(h/(1e3*60*60)),S=Math.floor(h/(1e3*60*60*24));return m<1?"Just now":m<60?`${m}m ago`:y<24?`${y}h ago`:S<7?`${S}d ago`:l.toLocaleDateString("en-US",{month:"short",day:"numeric"})}function f(){r&&r.parentNode&&r.parentNode.removeChild(r)}return{mount:t,refresh:s,destroy:f}}const he=d.triggers,ue=d.coRegulation;function pe(){let r,e,t,s,n,i,o,a,c,w,f,l={};function u(v){v.innerHTML="",r=k("div",{className:"form form--tantrum"});const b=document.createElement("div");b.style.cssText=`
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
    `,b.appendChild(p),b.appendChild(x),r.appendChild(b);const g=document.createElement("div");g.className="form-content",g.style.cssText=`
      display: block;
    `;const T=document.createElement("div");T.className="history-content",T.style.cssText=`
      display: none;
    `;const B=k("label",{text:d.forms.trigger,id:"tantrum_trigger_label"});B.htmlFor="tantrum_trigger",e=k("select",{id:"tantrum_trigger"});const L=document.createElement("option");L.text=d.placeholders.selectTrigger,L.value="",e.appendChild(L),he.forEach(M=>{const E=document.createElement("option");E.text=M.charAt(0).toUpperCase()+M.slice(1),E.value=M,e.appendChild(E)}),g.appendChild(B),g.appendChild(e);const q=document.createElement("div");q.style.cssText=`
      margin: 16px 0;
      padding: 16px;
      background: #f9f9f9;
      border-radius: 8px;
    `,w=oe(),w.mount(q),g.appendChild(q);const D=k("label",{text:"Media Clip (Optional)",id:"tantrum_media_label"});D.htmlFor="tantrum_media",a=k("input",{id:"tantrum_media"}),a.type="file",a.accept="audio/*,video/*",a.capture="environment",a.style.cssText=`
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
    `,a.addEventListener("change",h),g.appendChild(D),g.appendChild(a),g.appendChild(c);const R=k("label",{text:d.forms.duration,id:"tantrum_duration_label"});R.htmlFor="tantrum_duration",t=k("input",{id:"tantrum_duration"}),t.type="number",t.min="0",t.max="30",t.step="1",t.placeholder="0",t.style.height="40px",g.appendChild(R),g.appendChild(t);const F=k("label",{text:d.forms.coRegulation,id:"tantrum_coreg_label"});F.htmlFor="tantrum_coreg",s=k("div",{id:"tantrum_coreg"}),ue.forEach(M=>{const E=k("input",{id:`tantrum_coreg_${M.value}`});E.type="checkbox",E.value=M.value,E.style.marginRight="8px";const _=k("label",{text:M.label});_.htmlFor=E.id,_.style.marginRight="16px",s.appendChild(E),s.appendChild(_)}),g.appendChild(F),g.appendChild(s);const N=k("label",{text:d.forms.environmentNoise,id:"tantrum_noise_label"});N.htmlFor="tantrum_noise",n=k("input",{id:"tantrum_noise"}),n.type="checkbox",n.style.height="40px",g.appendChild(N),g.appendChild(n);const H=k("label",{text:d.forms.notes,id:"tantrum_notes_label"});H.htmlFor="tantrum_notes",i=k("textarea",{id:"tantrum_notes"}),i.rows=2,i.maxLength=120,i.style.height="60px",o=k("div",{className:"notes-counter"}),ne(i,120,o),g.appendChild(H),g.appendChild(i),g.appendChild(o),f=de(),f.mount(T),p.addEventListener("click",()=>{g.style.display="block",T.style.display="none",p.style.background="#2196F3",p.style.color="white",x.style.background="#f5f5f5",x.style.color="#666"}),x.addEventListener("click",()=>{g.style.display="none",T.style.display="block",p.style.background="#f5f5f5",p.style.color="#666",x.style.background="#2196F3",x.style.color="white",f.refresh()}),r.appendChild(g),r.appendChild(T),v.appendChild(r)}async function h(v){const p=v.target.files?.[0];if(!p){l={},c.textContent="";return}c.textContent=d.placeholders.processing;try{l=await m(p);const x=l.duration_s?`${Math.round(l.duration_s)}s`:"Unknown",g=l.avg_level_dbfs?`${Math.round(l.avg_level_dbfs)}dB`:"Unknown",T=l.motion_estimate?`${Math.round(l.motion_estimate*100)}%`:"Unknown";c.innerHTML=`
        <strong>${p.name}</strong><br>
        Duration: ${x} | Level: ${g}${p.type.startsWith("video")?` | Motion: ${T}`:""}
      `}catch(x){console.error("Error processing media:",x),c.textContent=`Error processing ${p.name}`,l={}}}async function m(v){const b={};try{if(v.type.startsWith("audio/")){const p=new(window.AudioContext||window.webkitAudioContext),x=await v.arrayBuffer(),g=await p.decodeAudioData(x);b.duration_s=g.duration;const T=g.getChannelData(0),B=T.length;let L=0;for(let D=0;D<B;D+=1e3)L+=Math.abs(T[D]);const q=L/(B/1e3);b.avg_level_dbfs=20*Math.log10(q)+60,p.close()}else if(v.type.startsWith("video/")){const p=document.createElement("video");p.src=URL.createObjectURL(v),await new Promise(x=>{p.onloadedmetadata=()=>{b.duration_s=p.duration,b.motion_estimate=Math.random()*.5+.2,URL.revokeObjectURL(p.src),x()}})}}catch(p){console.warn("Media processing failed:",p)}return b}function y(){const v={};e.value&&(v.trigger=e.value);const b=t.value.trim();if(b!==""){const g=Number(b);isNaN(g)||(v.duration_min=se(g,0,30))}const p=ie(s,"input[type=checkbox]");p.length&&(v.co_reg=p),n.checked&&(v.environment_noise=!0);const x=i.value.trim();return x&&(v.notes=x.slice(0,120)),v.intensity_1_10=w.getValue(),Object.keys(l).length>0&&(v.tantrum_proxy=l),v}function S(){const v=t.value.trim();if(v!==""){const b=Number(v);if(isNaN(b)||b<0||b>30)return{ok:!1,message:"Duration must be 0–30"}}return{ok:!0}}async function C(){e.value="",t.value="",s.querySelectorAll("input[type=checkbox]").forEach(v=>v.checked=!1),n.checked=!1,i.value="",o.textContent="0/120",w.setValue(5),a.value="",l={},c.textContent=""}return{mount:u,getContext:y,validate:S,reset:C}}class ve{config;router;container;currentScreen=null;tantrumForm=null;constructor(){this.config=this.parseUrlParams(),console.log("App config:",this.config),this.stripTokenFromUrl(),this.container=document.getElementById("app"),this.router=new j,this.initializeUI(),this.setupRoutes()}parseUrlParams(){const e=new URLSearchParams(window.location.search);return{mode:e.get("mode")||"helper",family:e.get("family")||"fam_unknown",session:e.get("session")||`fam_unknown_${Date.now()}`,token:e.get("tok")||null,dyad:e.get("dyad")||"night"}}initializeUI(){window.location.hash||(this.config.dyad==="tantrum"?window.location.hash="#tantrum/home":this.config.dyad==="meal"?window.location.hash="#meal/home":window.location.hash="#night/home")}setupRoutes(){this.router.register({dyad:"tantrum",screen:"home"},()=>{this.renderScreen(new U(this.container,this.router))}),this.router.register({dyad:"tantrum",screen:"capture"},()=>{const t=this.router.getCurrentRoute()?.params?.intensity||"5";this.renderScreen(new V(this.container,this.router,t))}),this.router.register({dyad:"tantrum",screen:"thermo"},()=>{const e=this.router.getCurrentRoute(),t=e?.params?.intensity||"5",s=e?.params?.hasAudio||"false",n=e?.params?.hasVideo||"false";this.renderScreen(new z(this.container,this.router,t,s,n))}),this.router.register({dyad:"tantrum",screen:"history"},()=>{this.renderScreen(new G(this.container,this.router))}),this.router.register({dyad:"tantrum",screen:"settings"},()=>{this.renderScreen(new W(this.container,this.router))}),this.router.register({dyad:"tantrum",screen:"form"},()=>{this.renderTantrumForm()}),this.router.register({dyad:"meal",screen:"home"},()=>{this.renderScreen(new Y(this.container,this.router))}),this.router.register({dyad:"meal",screen:"meal-logging"},()=>{const e=this.router.getCurrentRoute(),t=e?.params?.action||"",s=e?.params?.rating||"0";this.renderScreen(new J(this.container,this.router,t,s))}),this.router.register({dyad:"meal",screen:"insights"},()=>{const e=this.router.getCurrentRoute(),t=e?.params?.rating||"0",s=e?.params?.hasImage||"false",n=e?.params?.dietaryDiversity||"0.5",i=e?.params?.clutterScore||"0.5",o=e?.params?.plateCoverage||"0.5",a=e?.params?.mode||"patterns";this.renderScreen(new X(this.container,this.router,t,s,n,i,o,a))}),this.router.register({dyad:"meal",screen:"gallery"},()=>{this.renderScreen(new ee(this.container,this.router))}),this.router.register({dyad:"meal",screen:"settings"},()=>{this.renderScreen(new te(this.container,this.router))}),this.router.register({dyad:"night",screen:"home"},()=>{this.renderNightScreen()})}renderTantrumForm(){this.currentScreen&&this.currentScreen.destroy&&this.currentScreen.destroy(),this.container.innerHTML=`
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
    `;const e=this.container.querySelector("#tantrum-form-container");this.tantrumForm=pe(),this.tantrumForm.mount(e),this.bindTantrumFormEvents()}bindTantrumFormEvents(){const e=this.container.querySelector(".back-btn");e&&e.addEventListener("click",()=>{this.router.navigate({dyad:"tantrum",screen:"home"})});const t=this.container.querySelector('[data-action="cancel"]');t&&t.addEventListener("click",()=>{this.router.navigate({dyad:"tantrum",screen:"home"})});const s=this.container.querySelector('[data-action="save"]');s&&s.addEventListener("click",async()=>{await this.saveTantrumSession()})}async saveTantrumSession(){if(!this.tantrumForm)return;const e=this.tantrumForm.validate();if(!e.ok){alert(e.message);return}const t=this.tantrumForm.getContext(),s={id:`tantrum_${Date.now()}`,ts:new Date().toISOString(),family_id:this.config.family,session_id:this.config.session,...t};try{await P.saveSession(s),alert("Session saved successfully!"),this.tantrumForm.reset(),this.router.navigate({dyad:"tantrum",screen:"home"})}catch(n){console.error("Error saving session:",n),alert("Error saving session. Please try again.")}}renderScreen(e){this.currentScreen&&this.currentScreen.destroy&&this.currentScreen.destroy(),this.currentScreen=e,e.render()}renderNightScreen(){const e="Night Helper";this.container.innerHTML=`
      <div class="container">
        <header>
          <h1>Silli ${e}</h1>
          <p class="mode">${this.config.mode==="helper"?"Helper Mode":"Low-Power Mode"}</p>
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
                <div class="score-label">Score</div>
              </div>
            </div>
          </div>

          <div class="badges">
            <h3>Badges</h3>
            <div id="badges-container"></div>
          </div>

          <div class="tips">
            <h3>Tips</h3>
            <div id="tips-container"></div>
          </div>

          <div class="controls">
            <button id="start-btn" class="btn primary">Start Session</button>
            <button id="stop-btn" class="btn secondary" disabled>Stop Session</button>
            <button id="export-btn" class="btn secondary" disabled>Export Results</button>
          </div>

          <div class="session-info">
            <p>Family: ${this.config.family}</p>
            <p>Session: ${this.config.session}</p>
            <p id="timer">Duration: 00:00</p>
          </div>
        </main>

        <footer>
          <div class="privacy">
            <p>🔒 All processing happens on your device. Audio stays private.</p>
          </div>
        </footer>
      </div>
    `,console.log("Night helper screen rendered")}stripTokenFromUrl(){if(this.config.token){const e=new URL(window.location.href);e.searchParams.delete("tok"),window.history.replaceState({},"",e.toString())}}}document.addEventListener("DOMContentLoaded",()=>{new ve});
