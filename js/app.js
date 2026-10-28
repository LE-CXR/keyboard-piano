
/* ========== Storage ========== */
const PRE='kpiano.v1.';
const TIMBRE_COUNT=10;
const MAX_PARTICLES=18;
const MAX_CHORD_HISTORY=6;
const storage={
  get(k,fb){try{const v=localStorage.getItem(PRE+k);return v===null?fb:v;}catch(e){return fb;}},
  set(k,v){try{localStorage.setItem(PRE+k,String(v));}catch(e){}}
};
function safeNum(raw,min,max,fb){const n=Number(raw);if(!Number.isFinite(n)||n<min||n>max)return fb;return n;}
function safeEnum(raw,list,fb){return list.includes(raw)?raw:fb;}
function safeBool(raw,fb){return raw==='true'?true:raw==='false'?false:fb;}
function getInitialHintMode(){
  const direct=storage.get('keyHintMode',null);
  if(direct==='letters'||direct==='notes'||direct==='off')return direct;
  const old=storage.get('showKeyHints',null);
  if(old==='true'){storage.set('keyHintMode','letters');return 'letters';}
  if(old==='false'){storage.set('keyHintMode','off');return 'off';}
  return 'letters';
}

const IS_MOBILE=(function(){
  try{return matchMedia('(pointer: coarse)').matches&&matchMedia('(hover: none)').matches;}
  catch(e){return /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);}
})();

const state={
  locale:safeEnum(storage.get('locale','zh'),['zh','en'],'zh'),
  theme:safeEnum(storage.get('theme','dark'),['light','dark','sakura','ocean','galaxy'],'dark'),
  series:safeEnum(storage.get('series','electronic'),['electronic','natural'],'electronic'),
  masterVolume:safeNum(storage.get('masterVolume',80),0,100,80),
  timbre:safeNum(storage.get('timbre',1),0,TIMBRE_COUNT-1,1),
  keyMode:safeEnum(storage.get('keyMode','mode1'),['mode1','mode2'],'mode1'),
  octaveStart:{
    mode1:safeNum(storage.get('octaveStart.mode1',3),0,5,3),
    mode2:safeNum(storage.get('octaveStart.mode2',4),0,7,4),
  },
  fadeTime:safeNum(storage.get('fadeTime',0.4),0,3,0.4),
  keyHintMode:getInitialHintMode(),
  shakeIntensity:safeNum(storage.get('shakeIntensity',2),1,5,2),
  shakeUnlocked:safeBool(storage.get('shakeUnlocked','false'),false),
  ambient:safeBool(storage.get('ambient','false'),false),
  reverb:safeNum(storage.get('reverb',50),0,100,50),
  orientationMode:safeEnum(storage.get('orientationMode','auto'),['auto','force','off'],'auto'),
  gyroEnabled:safeBool(storage.get('gyroEnabled','true'),true),
  haptics:safeBool(storage.get('haptics','true'),true),
  metronomeOn:safeBool(storage.get('metronomeOn','false'),false),
  bpm:safeNum(storage.get('bpm',90),40,240,90),
  beatsPerBar:safeNum(storage.get('beatsPerBar',4),2,4,4),
  introSeen:safeBool(storage.get('introSeen','false'),false),
};
function save(key,value){
  if(key==='octaveStart'){storage.set('octaveStart.mode1',value.mode1);storage.set('octaveStart.mode2',value.mode2);}
  else storage.set(key,value);
}

/* ========== i18n ========== */
const I18N={
  zh:{
    'app.title':'键盘钢琴','overlay.title':'键盘钢琴','overlay.desc':'浏览器里的迷你钢琴','overlay.btn':'点击开始',
    'intro.title':'键盘钢琴','intro.desc':'键盘、鼠标或触屏即可演奏',
    'intro.tip1':'键盘：Z-M / A-K / Q-I 三排','intro.tip2':'鼠标：左键单击，右键和弦','intro.tip3':'↑↓ 八度 · [ ] 模式 · 0-9 音色','intro.btn':'开始演奏',
    'drawer.title':'控制面板',
    'section.play':'演奏','section.tempo':'节拍与演示','section.record':'录音','section.look':'外观与语言','section.device':'设备',
    'field.volume':'主音量','field.series':'音色系列','field.timbre':'当前音色','field.mode':'键位模式',
    'field.fade':'淡出时间','field.language':'语言','field.theme':'主题',
    'field.hints':'键位提示','field.shake':'抖动强度','field.ambient':'氛围模式','field.reverb':'混响强度',
    'field.orientation':'横屏模式','field.gyro':'陀螺仪检测',
    'field.metronome':'节拍器','field.bpm':'速度','field.beats':'拍号',
    'field.recording':'录音','field.demo':'演示曲目','field.haptics':'触觉反馈',
    'metronome.on':'开启','metronome.off':'关闭',
    'metronome.status.on':'{bpm} BPM · {beats}/4','metronome.status.off':'',
    'rec.start':'● 录音','rec.play':'▶ 回放','rec.stop':'■ 停止',
    'rec.export':'↓ 导出','rec.import':'↑ 导入','rec.clear':'✕ 清空',
    'rec.status.idle':'','rec.status.recording':'录音中…','rec.status.playing':'回放中…',
    'rec.status.count':'{n} 事件','rec.status.empty':'',
    'rec.exported':'已导出录音','rec.imported':'已导入 {n} 个事件','rec.importFail':'导入失败','rec.cleared':'已清空录音','rec.topbar':'录音','rec.topbar.on':'录音中',
    'demo.play':'▶ 播放','demo.stop':'■ 停止','demo.status.playing':'播放中…','demo.status.idle':'','demo.now':'演示 · {name}',
    'demo.twinkle':'小星星','demo.ode':'欢乐颂','demo.birthday':'生日快乐',
    'ambient.on':'开启','ambient.off':'关闭',
    'orientation.auto':'自动','orientation.force':'强制','orientation.off':'关闭',
    'gyro.on':'开启','gyro.off':'关闭',
    'haptics.on':'开启','haptics.off':'关闭',
    'mode.1':'模式一','mode.2':'模式二',
    'series.electronic':'电子系列','series.natural':'原生系列',
    'lang.zh':'简体中文','lang.en':'English',
    'theme.light':'暖纸','theme.dark':'墨夜','theme.sakura':'赤陶','theme.ocean':'海雾','theme.galaxy':'余烬',
    'hints.letters':'字母','hints.notes':'音名','hints.off':'关闭',
    'help.title':'帮助','help.tab.text':'文本说明','help.tab.mini':'迷你键盘示意图',
    'help.keyboard':'键盘操作',
    'help.mode1Line':'模式一：三排键各对应一个八度，黑键需用鼠标弹奏',
    'help.mode2Line':'模式二：单八度，白键 + 黑键全键盘',
    'help.funcs':'功能键','help.funcOctave':'八度','help.funcMode':'模式','help.funcTimbre':'音色',
    'help.mouse':'鼠标操作','help.mouseLeft':'左键：单击发声；按住拖动可滑过多个琴键',
    'help.mouseRight':'右键：单击同时触发 ±1 八度的三音',
    'help.touch':'触摸操作','help.touchLine':'单指轻触或拖动，与鼠标左键相同',
    'help.timbres':'音色对照（数字键 0–9）',
    'help.fade':'长按超过 1 秒再松开，尾音时长加倍；氛围模式仅增加混响，不改变音高',
    'timbre.0':'单簧管','timbre.1':'钢琴','timbre.2':'电钢琴','timbre.3':'风琴','timbre.4':'弦乐',
    'timbre.5':'长笛','timbre.6':'吉他','timbre.7':'贝斯','timbre.8':'萨克斯','timbre.9':'小号',
    'chip.mode':'模式一','chip.mode2':'模式二',
    'chip.timbre.title':'左键下一个 / 右键上一个','chip.mode.title':'点击切换模式',
    'hint.mode1':'低音 Z X C V B N M , · 中音 A S D F G H J K · 高音 Q W E R T Y U I',
    'hint.mode2':'白键 A S D F G H J K · 黑键 W E T Y U',
    'hint.rotate':'请解锁屏幕旋转或手动横屏',
    'share.title':'分享 / 打开链接',
    'share.desc':'复制下方链接，可在任意浏览器中打开使用。',
    'share.copy':'复制链接','share.open':'在浏览器打开','share.system':'系统分享',
    'share.copied':'链接已复制到剪贴板 ✓','share.copyFail':'复制失败，请长按输入框手动复制',
    'share.manual':'若未自动跳转，请复制上方链接并在浏览器中打开',
    'share.iosHint':'请点击右上角「…」并选择「在 Safari 中打开」',
    'stats.notes':'♪ {n}','stats.chords':'♬ {n}','stats.time':'⏱ {t}',
    'status.hint.session':'已演奏 {n} 音符 · {t}',
  },
  en:{
    'app.title':'Keyboard Piano','overlay.title':'Keyboard Piano','overlay.desc':'A mini piano played with your keyboard','overlay.btn':'Click to Start',
    'intro.title':'Keyboard Piano','intro.desc':'Play with keyboard, mouse or touch',
    'intro.tip1':'Keyboard: Z-M / A-K / Q-I','intro.tip2':'Mouse: left click, right click for chord','intro.tip3':'↑↓ octave · [ ] mode · 0-9 timbre','intro.btn':'Start Playing',
    'drawer.title':'Settings',
    'section.play':'Play','section.tempo':'Tempo & Demo','section.record':'Recording','section.look':'Look & Language','section.device':'Device',
    'field.volume':'Master Volume','field.series':'Timbre Series','field.timbre':'Timbre','field.mode':'Key Mode',
    'field.fade':'Release Time','field.language':'Language','field.theme':'Theme',
    'field.hints':'Key Hints','field.shake':'Shake Intensity','field.ambient':'Ambient Mode','field.reverb':'Reverb',
    'field.orientation':'Orientation','field.gyro':'Gyroscope',
    'field.metronome':'Metronome','field.bpm':'Tempo','field.beats':'Beats',
    'field.recording':'Recording','field.demo':'Demo Song','field.haptics':'Haptics',
    'metronome.on':'On','metronome.off':'Off',
    'metronome.status.on':'{bpm} BPM · {beats}/4','metronome.status.off':'',
    'rec.start':'● Record','rec.play':'▶ Play','rec.stop':'■ Stop',
    'rec.export':'↓ Export','rec.import':'↑ Import','rec.clear':'✕ Clear',
    'rec.status.idle':'','rec.status.recording':'Recording…','rec.status.playing':'Playing…',
    'rec.status.count':'{n} events','rec.status.empty':'',
    'rec.exported':'Recording exported','rec.imported':'Imported {n} events','rec.importFail':'Import failed','rec.cleared':'Recording cleared','rec.topbar':'Record','rec.topbar.on':'Recording',
    'demo.play':'▶ Play','demo.stop':'■ Stop','demo.status.playing':'Playing…','demo.status.idle':'','demo.now':'Demo · {name}',
    'demo.twinkle':'Twinkle','demo.ode':'Ode to Joy','demo.birthday':'Happy Birthday',
    'ambient.on':'On','ambient.off':'Off',
    'orientation.auto':'Auto','orientation.force':'Force','orientation.off':'Off',
    'gyro.on':'On','gyro.off':'Off',
    'haptics.on':'On','haptics.off':'Off',
    'mode.1':'Mode 1','mode.2':'Mode 2',
    'series.electronic':'Electronic','series.natural':'Natural',
    'lang.zh':'简体中文','lang.en':'English',
    'theme.light':'Paper','theme.dark':'Ink','theme.sakura':'Clay','theme.ocean':'Mist','theme.galaxy':'Ember',
    'hints.letters':'Letters','hints.notes':'Notes','hints.off':'Off',
    'help.title':'Help','help.tab.text':'Text','help.tab.mini':'Mini Keyboard',
    'help.keyboard':'Keyboard',
    'help.mode1Line':'Mode 1: three rows, one octave each; black keys via mouse',
    'help.mode2Line':'Mode 2: single octave, white + black keys',
    'help.funcs':'Function Keys','help.funcOctave':'octave','help.funcMode':'mode','help.funcTimbre':'timbre',
    'help.mouse':'Mouse','help.mouseLeft':'Left click: play; drag to glide across keys',
    'help.mouseRight':'Right click: play the note ± 1 octave (3 notes)',
    'help.touch':'Touch','help.touchLine':'Single finger tap or drag, same as left mouse button',
    'help.timbres':'Timbre Map (0–9)',
    'help.fade':'Hold > 1s before release: tail time doubles. Ambient Mode only adds reverb, no pitch shift.',
    'timbre.0':'Clarinet','timbre.1':'Piano','timbre.2':'E-Piano','timbre.3':'Organ','timbre.4':'Strings',
    'timbre.5':'Flute','timbre.6':'Guitar','timbre.7':'Bass','timbre.8':'Saxophone','timbre.9':'Trumpet',
    'chip.mode':'Mode 1','chip.mode2':'Mode 2',
    'chip.timbre.title':'Click: next / Right-click: previous','chip.mode.title':'Click to switch mode',
    'hint.mode1':'Low Z X C V B N M , · Mid A S D F G H J K · High Q W E R T Y U I',
    'hint.mode2':'White A S D F G H J K · Black W E T Y U',
    'hint.rotate':'Please unlock screen rotation or rotate manually',
    'share.title':'Share / Open Link',
    'share.desc':'Copy the link below and open it in any browser.',
    'share.copy':'Copy Link','share.open':'Open in Browser','share.system':'System Share',
    'share.copied':'Link copied ✓','share.copyFail':'Copy failed — long-press the field to copy manually',
    'share.manual':'If nothing happens, copy the link above and open it in a browser',
    'share.iosHint':'Tap "…" at the top-right and choose "Open in Safari"',
    'stats.notes':'♪ {n}','stats.chords':'♬ {n}','stats.time':'⏱ {t}',
    'status.hint.session':'Played {n} notes · {t}',
  }
};
function t(key,params){
  let str=(I18N[state.locale]&&I18N[state.locale][key])||I18N.zh[key]||key;
  if(params)for(const k in params)str=str.replace(new RegExp('\\{'+k+'\\}','g'),params[k]);
  return str;
}
function applyI18n(){
  document.documentElement.lang=state.locale==='zh'?'zh-CN':'en';
  document.querySelectorAll('[data-i18n]').forEach(el=>{el.textContent=t(el.dataset.i18n);});
  const chipT=document.getElementById('chipTimbre');
  const chipM=document.getElementById('chipMode');
  const btnS=document.getElementById('btnShare');
  if(chipT)chipT.title=t('chip.timbre.title');
  if(chipM)chipM.title=t('chip.mode.title');
  if(btnS)btnS.title=t('share.title');
  updateChips();
  buildTimbreOptions();
  buildDemoOptions();
  renderHelp();
  updateHintsLabel();
  updateDemoNow();
  updateRecUI();
}

/* ========== Note ========== */
const NOTE_NAMES=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
function midiName(midi){return NOTE_NAMES[midi%12]+(Math.floor(midi/12)-1);}
function nameToMidi(name){
  const m=name.match(/^([A-G]#?)(-?\d)$/);
  if(!m)return null;
  const base={'C':0,'C#':1,'D':2,'D#':3,'E':4,'F':5,'F#':6,'G':7,'G#':8,'A':9,'A#':10,'B':11};
  return (Number(m[2])+1)*12+base[m[1]];
}

/* ========== Chord Recognition ========== */
const CHORD_TEMPLATES=[
  {suffix:'',intervals:[0,4,7]},{suffix:'m',intervals:[0,3,7]},{suffix:'dim',intervals:[0,3,6]},
  {suffix:'aug',intervals:[0,4,8]},{suffix:'sus2',intervals:[0,2,7]},{suffix:'sus4',intervals:[0,5,7]},
  {suffix:'maj7',intervals:[0,4,7,11]},{suffix:'7',intervals:[0,4,7,10]},{suffix:'m7',intervals:[0,3,7,10]},
  {suffix:'m7b5',intervals:[0,3,6,10]},{suffix:'dim7',intervals:[0,3,6,9]},{suffix:'6',intervals:[0,4,7,9]},
  {suffix:'m6',intervals:[0,3,7,9]},{suffix:'add9',intervals:[0,2,4,7]},{suffix:'maj9',intervals:[0,2,4,7,11]},
  {suffix:'9',intervals:[0,2,4,7,10]},{suffix:'m9',intervals:[0,2,3,7,10]},
];
function identifyChord(midis){
  if(!midis||midis.length<3)return '';
  const uniqPcs=[...new Set(midis.map(m=>m%12))];
  if(uniqPcs.length<3)return '';
  const bassPc=Math.min(...midis)%12;
  const tryRoots=[bassPc,...uniqPcs.filter(pc=>pc!==bassPc)];
  for(const root of tryRoots){
    const intervalSet=new Set(midis.map(m=>((m-root)%12+12)%12));
    for(const tpl of CHORD_TEMPLATES){
      if(tpl.intervals.length!==intervalSet.size)continue;
      let ok=true;
      for(const iv of tpl.intervals){if(!intervalSet.has(iv)){ok=false;break;}}
      if(ok)return NOTE_NAMES[root]+tpl.suffix;
    }
  }
  return '';
}

/* ========== Audio ========== */
const TIMBRES_ELECTRONIC=[
  /* 0 clarinet — odd harmonics, reedier */ {layers:[{wave:'square',ratio:1,amp:1},{wave:'sine',ratio:3,amp:.55},{wave:'sine',ratio:5,amp:.22},{wave:'sine',ratio:7,amp:.1},{wave:'sine',ratio:9,amp:.04}],attack:.08,decay:.16,sustain:.8,noise:.015,filter:4800,gainCal:.86},
  /* 1 piano — hammer + bright partials */ {layers:[{wave:'triangle',ratio:1,amp:1},{wave:'triangle',ratio:2,amp:.48},{wave:'sine',ratio:3,amp:.26},{wave:'sine',ratio:4,amp:.12},{wave:'sine',ratio:5,amp:.06},{wave:'sine',ratio:6,amp:.03}],attack:.003,decay:.5,sustain:.18,noise:.025,noiseBurst:.42,filter:7600,gainCal:1.05},
  /* 2 e-piano — bell-ish inharmonics, soft attack */ {layers:[{wave:'sine',ratio:1,amp:1},{wave:'sine',ratio:2,amp:.22,detune:12},{wave:'sine',ratio:4.05,amp:.14,detune:-7},{wave:'sine',ratio:6.1,amp:.07,detune:4}],attack:.012,decay:1.05,sustain:.28,filter:5600,gainCal:.98},
  /* 3 organ */ {layers:[{wave:'sine',ratio:1,amp:1},{wave:'sine',ratio:2,amp:.55},{wave:'sine',ratio:3,amp:.35},{wave:'sine',ratio:4,amp:.25},{wave:'sine',ratio:6,amp:.15},{wave:'sine',ratio:8,amp:.1}],attack:.015,decay:.04,sustain:.92,gainCal:.8},
  /* 4 strings */ {layers:[{wave:'sawtooth',ratio:1,amp:1,detune:-8},{wave:'sawtooth',ratio:1,amp:.9,detune:8},{wave:'sawtooth',ratio:2,amp:.25,detune:3}],attack:.28,decay:.25,sustain:.82,filter:4800,gainCal:.68,lfo:{rate:5.2,depth:9}},
  /* 5 flute — airy even partials + breath */ {layers:[{wave:'sine',ratio:1,amp:1},{wave:'sine',ratio:2,amp:.1},{wave:'triangle',ratio:2.01,amp:.04,detune:3}],noise:.075,attack:.1,decay:.1,sustain:.84,filter:7000,gainCal:.8},
  /* 6 guitar — bright pluck, short body */ {layers:[{wave:'sawtooth',ratio:1,amp:1},{wave:'triangle',ratio:2,amp:.45},{wave:'sine',ratio:3,amp:.2},{wave:'sine',ratio:4,amp:.1},{wave:'sine',ratio:5,amp:.04}],attack:.0015,decay:.32,sustain:.08,noise:.035,noiseBurst:.48,filter:6400,gainCal:.96},
  /* 7 bass — sub-heavy, dark, sustained */ {layers:[{wave:'sine',ratio:1,amp:1},{wave:'sine',ratio:.5,amp:.85},{wave:'square',ratio:1,amp:.35},{wave:'sawtooth',ratio:2,amp:.12}],attack:.018,decay:.28,sustain:.72,filter:1600,gainCal:1.2},
  /* 8 sax */ {layers:[{wave:'sawtooth',ratio:1,amp:1,detune:-5},{wave:'sawtooth',ratio:1,amp:.85,detune:5},{wave:'square',ratio:2,amp:.22}],attack:.07,decay:.18,sustain:.74,noise:.025,filter:4600,gainCal:.78,distortion:true},
  /* 9 trumpet */ {layers:[{wave:'square',ratio:1,amp:1},{wave:'sawtooth',ratio:2,amp:.35},{wave:'sine',ratio:3,amp:.2},{wave:'sine',ratio:4,amp:.1}],attack:.045,decay:.14,sustain:.8,filter:6400,gainCal:.88},
];
const TIMBRES_NATURAL=[
  /* 0 clarinet — odd stack, woody */ {layers:[{wave:'sine',ratio:1,amp:1},{wave:'sine',ratio:3,amp:.48},{wave:'sine',ratio:5,amp:.22},{wave:'sine',ratio:7,amp:.1},{wave:'sine',ratio:9,amp:.04}],noise:.03,attack:.08,decay:.14,sustain:.74,filter:2900,gainCal:.88},
  /* 1 piano — hammer noise, short sustain */ {layers:[{wave:'sine',ratio:1,amp:1},{wave:'triangle',ratio:2,amp:.45},{wave:'sine',ratio:3,amp:.24},{wave:'sine',ratio:4,amp:.12},{wave:'sine',ratio:5,amp:.06}],noise:.04,noiseBurst:.38,attack:.0025,decay:.78,sustain:.06,filter:5200,gainCal:1.0},
  /* 2 e-piano — soft bell, long decay, no hammer */ {layers:[{wave:'sine',ratio:1,amp:1},{wave:'sine',ratio:2,amp:.14,detune:9},{wave:'sine',ratio:3.02,amp:.1,detune:-4},{wave:'sine',ratio:5.05,amp:.05}],attack:.014,decay:1.35,sustain:.16,filter:3400,gainCal:.98},
  /* 3 organ */ {layers:[{wave:'sine',ratio:1,amp:1},{wave:'sine',ratio:2,amp:.55},{wave:'sine',ratio:3,amp:.32},{wave:'sine',ratio:4,amp:.2},{wave:'sine',ratio:5,amp:.12}],attack:.025,decay:.05,sustain:.86,filter:3600,gainCal:.84},
  /* 4 strings */ {layers:[{wave:'triangle',ratio:1,amp:1,detune:-4},{wave:'triangle',ratio:1,amp:1,detune:4},{wave:'sine',ratio:2,amp:.2}],attack:.38,decay:.22,sustain:.76,lfo:{rate:5.5,depth:6},filter:2800,gainCal:.72},
  /* 5 flute — pure + breath, little odd energy */ {layers:[{wave:'sine',ratio:1,amp:1},{wave:'sine',ratio:2,amp:.06}],noise:.07,attack:.12,decay:.09,sustain:.82,filter:4600,gainCal:.86},
  /* 6 guitar — mid pluck, short */ {layers:[{wave:'triangle',ratio:1,amp:1},{wave:'triangle',ratio:2,amp:.5},{wave:'sine',ratio:3,amp:.22},{wave:'sine',ratio:4,amp:.1}],noise:.045,noiseBurst:.4,attack:.0015,decay:.4,sustain:.04,filter:4800,gainCal:.98},
  /* 7 bass — round sub, dark */ {layers:[{wave:'sine',ratio:1,amp:1},{wave:'sine',ratio:.5,amp:.7},{wave:'triangle',ratio:1,amp:.25},{wave:'triangle',ratio:2,amp:.1}],attack:.022,decay:.42,sustain:.58,filter:1400,gainCal:1.22},
  /* 8 sax */ {layers:[{wave:'triangle',ratio:1,amp:1},{wave:'triangle',ratio:2,amp:.38},{wave:'sine',ratio:3,amp:.15}],noise:.04,attack:.1,decay:.2,sustain:.68,filter:2800,gainCal:.84},
  /* 9 trumpet */ {layers:[{wave:'triangle',ratio:1,amp:1},{wave:'sine',ratio:2,amp:.35},{wave:'sine',ratio:3,amp:.18},{wave:'sine',ratio:4,amp:.08}],attack:.055,decay:.14,sustain:.7,filter:3800,gainCal:.92},
];
function getCurrentTimbres(){return state.series==='natural'?TIMBRES_NATURAL:TIMBRES_ELECTRONIC;}
const FLT_MIN=.0001;
const DISPOSE_TAIL=60;
function makeTanhCurve(k){const n=1024,c=new Float32Array(n);for(let i=0;i<n;i++){const x=(i/(n-1))*2-1;c[i]=Math.tanh(x*k);}return c;}

function clampVelocity(v){
  const n=Number(v);
  if(!Number.isFinite(n))return .75;
  return Math.max(.15,Math.min(1,n));
}
const velocityTracker={
  lastPtrDown:0,lastPtrUp:0,lastPtrDur:120,
  lastKeyAt:0,lastKeyGap:400,
  onPointerDown(){this.lastPtrDown=performance.now();},
  onPointerUp(){
    const now=performance.now();
    if(this.lastPtrDown>0){
      this.lastPtrDur=Math.max(12,now-this.lastPtrDown);
      this.lastPtrUp=now;
    }
  },
  /* use prior tap duration + pointerType; drag uses medium */
  estimatePointer(e,{drag}={}){
    if(drag)return .55;
    if(e&&typeof e.pressure==='number'&&e.pressure>0&&e.pointerType!=='mouse'){
      return clampVelocity(.25+e.pressure*.75);
    }
    const dur=this.lastPtrDur;
    /* short prior tap → harder strike; long hold → softer next */
    let fromDur=.78;
    if(dur<45)fromDur=.95;
    else if(dur<90)fromDur=.85;
    else if(dur<160)fromDur=.72;
    else if(dur<280)fromDur=.58;
    else fromDur=.45;
    const byType=e&&e.pointerType==='touch'?.7:e&&e.pointerType==='pen'?.8:.76;
    return clampVelocity(fromDur*.55+byType*.45);
  },
  estimateKeyboard(){
    const now=performance.now();
    const gap=this.lastKeyAt?now-this.lastKeyAt:9999;
    this.lastKeyGap=gap;this.lastKeyAt=now;
    if(gap<55)return .55;
    if(gap<110)return .68;
    if(gap<200)return .78;
    return .85;
  }
};

class Voice{
  constructor(engine,midi,preset,velocity){
    this.engine=engine;this.ctx=engine.ctx;
    this.midi=midi;this.preset=preset;
    this.velocity=clampVelocity(velocity);
    this.baseFreq=440*Math.pow(2,(midi-69)/12);
    this.peak=.25*(preset.gainCal||1)*this.velocity;
    this.oscs=[];this.noiseNode=null;this.noiseBurstNode=null;this.lfoNode=null;
    this.distNode=null;this.filterNode=null;this.panNode=null;
    this.state='idle';this._disposeTimer=null;
    this._startTime=0;this._attackEnd=0;this._sustainStart=0;this._sustainVal=FLT_MIN;
    this._build();
  }
  _build(){
    const ctx=this.ctx,p=this.preset;
    this.voiceGain=ctx.createGain();
    this.voiceGain.gain.value=FLT_MIN;
    let out=this.voiceGain;
    if(typeof ctx.createStereoPanner==='function'){
      this.panNode=ctx.createStereoPanner();
      const pan=Math.max(-.25,Math.min(.25,((this.midi-60)/48)*.25));
      this.panNode.pan.value=pan;
      this.voiceGain.connect(this.panNode);
      out=this.panNode;
    }
    out.connect(this.engine.dryGain);
    out.connect(this.engine.wetInput);
    let chainHead=this.voiceGain;
    if(p.distortion){
      this.distNode=ctx.createWaveShaper();
      this.distNode.curve=makeTanhCurve(3);
      this.distNode.connect(chainHead);chainHead=this.distNode;
    }
    if(p.filter){
      this.filterNode=ctx.createBiquadFilter();
      this.filterNode.type='lowpass';
      /* heavier hits open the filter (brighter) */
      const open=0.72+0.45*this.velocity;
      this.filterNode.frequency.value=p.filter*open;
      this.filterNode.Q.value=.5;
      this.filterNode.connect(chainHead);chainHead=this.filterNode;
    }
    const freq=this.baseFreq;
    p.layers.forEach(L=>{
      const osc=ctx.createOscillator();
      osc.type=L.wave;
      osc.frequency.value=freq*(L.ratio||1);
      if(L.detune)osc.detune.value=L.detune;
      const g=ctx.createGain();g.gain.value=L.amp;
      osc.connect(g);g.connect(chainHead);osc.start();
      this.oscs.push({osc,gain:g,ratio:L.ratio||1});
    });
    if(p.noise){
      const src=ctx.createBufferSource();
      src.buffer=this.engine.noiseBuffer;src.loop=true;
      const g=ctx.createGain();g.gain.value=p.noise;
      src.connect(g);g.connect(chainHead);src.start();
      this.noiseNode={src,gain:g};
    }
    if(typeof p.noiseBurst==='number'&&p.noiseBurst>0){
      const src=ctx.createBufferSource();
      src.buffer=this.engine.noiseBuffer;
      const g=ctx.createGain();g.gain.value=FLT_MIN;
      src.connect(g);g.connect(chainHead);src.start();
      this.noiseBurstNode={src,gain:g,amp:p.noiseBurst*(0.55+0.7*this.velocity)};
    }
    if(p.lfo){
      const lfo=ctx.createOscillator();lfo.type='sine';
      lfo.frequency.value=p.lfo.rate;
      const lg=ctx.createGain();lg.gain.value=p.lfo.depth;
      lfo.connect(lg);
      this.oscs.forEach(o=>lg.connect(o.osc.detune));
      lfo.start();
      this.lfoNode={lfo,gain:lg};
    }
  }
  start(when){
    if(this.state!=='idle')return;
    const p=this.preset;
    const attack=p.attack*(this.engine.fxActive?2:1);
    const sustain=Math.max(this.peak*p.sustain,FLT_MIN);
    const g=this.voiceGain.gain;
    g.cancelScheduledValues(when);
    g.setValueAtTime(FLT_MIN,when);
    g.linearRampToValueAtTime(this.peak,when+attack);
    g.linearRampToValueAtTime(sustain,when+attack+p.decay);
    if(this.noiseBurstNode){
      const bg=this.noiseBurstNode.gain.gain;
      const amp=Math.max(this.noiseBurstNode.amp,FLT_MIN);
      bg.cancelScheduledValues(when);
      bg.setValueAtTime(amp,when);
      bg.exponentialRampToValueAtTime(FLT_MIN,when+.032);
    }
    this.state='sustain';
    this._startTime=when;this._attackEnd=when+attack;
    this._sustainStart=this._attackEnd+p.decay;this._sustainVal=sustain;
  }
  release(when,sec){
    if(this.state==='disposed'||this.state==='released')return;
    const g=this.voiceGain.gain;
    let cur;
    if(when<this._attackEnd){
      const span=Math.max(.001,this._attackEnd-this._startTime);
      const tt=Math.max(0,(when-this._startTime)/span);
      cur=Math.max(this.peak*tt,FLT_MIN);
    }else if(when<this._sustainStart){
      const span=Math.max(.001,this._sustainStart-this._attackEnd);
      const tt=Math.min(1,(when-this._attackEnd)/span);
      cur=Math.max(this.peak+(this._sustainVal-this.peak)*tt,FLT_MIN);
    }else{
      cur=Math.max(this._sustainVal,FLT_MIN);
    }
    g.cancelScheduledValues(when);
    g.setValueAtTime(cur,when);
    const s=Math.max(sec,.02);
    g.exponentialRampToValueAtTime(FLT_MIN,when+s);
    this.state='released';
    const delay=Math.max(0,(when+s-this.ctx.currentTime)*1000)+DISPOSE_TAIL;
    clearTimeout(this._disposeTimer);
    this._disposeTimer=setTimeout(()=>this.dispose(),delay);
  }
  stop(when){this.release(when,.02);}
  dispose(){
    if(this.state==='disposed')return;
    this.state='disposed';
    clearTimeout(this._disposeTimer);
    try{
      this.oscs.forEach(o=>{o.osc.stop();o.osc.disconnect();o.gain.disconnect();});
      if(this.noiseNode){this.noiseNode.src.stop();this.noiseNode.src.disconnect();this.noiseNode.gain.disconnect();}
      if(this.noiseBurstNode){this.noiseBurstNode.src.stop();this.noiseBurstNode.src.disconnect();this.noiseBurstNode.gain.disconnect();}
      if(this.lfoNode){this.lfoNode.lfo.stop();this.lfoNode.lfo.disconnect();this.lfoNode.gain.disconnect();}
      if(this.distNode)this.distNode.disconnect();
      if(this.filterNode)this.filterNode.disconnect();
      if(this.panNode)this.panNode.disconnect();
      this.voiceGain.disconnect();
    }catch(e){}
  }
}

class AudioEngine{
  constructor(){
    this.ctx=null;this.masterGain=null;this.compressor=null;
    this.dryGain=null;this.wetGain=null;this.wetInput=null;
    this.noiseBuffer=null;this.voices=new Map();
    this.fxActive=false;this.volume=.8;
    this.analyser=null;this.freqData=null;
    this._resuming=null;
  }
  _makeImpulse(duration,decay){
    const rate=this.ctx.sampleRate;
    const len=Math.floor(rate*duration);
    const buf=this.ctx.createBuffer(2,len,rate);
    for(let ch=0;ch<2;ch++){
      const data=buf.getChannelData(ch);
      for(let i=0;i<len;i++){const tt=i/len;data[i]=(Math.random()*2-1)*Math.pow(1-tt,decay);}
    }
    return buf;
  }
  _initWetChain(){
    const ctx=this.ctx;
    this.wetLowpass=ctx.createBiquadFilter();
    this.wetLowpass.type='lowpass';
    this.wetLowpass.frequency.value=2500;
    this.wetLowpass.Q.value=.7;
    this.wetSum=ctx.createGain();this.wetSum.gain.value=1;
    try{
      this.wetConvolver=ctx.createConvolver();
      this.wetConvolver.buffer=this._makeImpulse(1.8,3);
      this.wetConvGain=ctx.createGain();this.wetConvGain.gain.value=.75;
      this.wetLowpass.connect(this.wetConvolver);
      this.wetConvolver.connect(this.wetConvGain);
      this.wetConvGain.connect(this.wetSum);
    }catch(e){this.wetConvolver=null;}
    this.wetDelay=ctx.createDelay(1.0);this.wetDelay.delayTime.value=.2;
    this.wetFeedback=ctx.createGain();this.wetFeedback.gain.value=.25;
    this.wetDelayGain=ctx.createGain();this.wetDelayGain.gain.value=.3;
    this.wetLowpass.connect(this.wetDelay);
    this.wetDelay.connect(this.wetFeedback);
    this.wetFeedback.connect(this.wetDelay);
    this.wetDelay.connect(this.wetDelayGain);
    this.wetDelayGain.connect(this.wetSum);
    this.wetOutGain=ctx.createGain();this.wetOutGain.gain.value=.75;
    this.wetSum.connect(this.wetOutGain);
    this.wetOutGain.connect(this.wetGain);
    this.wetInput.connect(this.wetLowpass);
  }
  init(){
    if(this.ctx)return;
    const Ctx=window.AudioContext||window.webkitAudioContext;
    if(!Ctx)return;
    try{this.ctx=new Ctx();}catch(e){return;}
    this.volume=state.masterVolume/100;
    this.masterGain=this.ctx.createGain();
    this.masterGain.gain.value=this.volume;
    this.compressor=this.ctx.createDynamicsCompressor();
    this.compressor.threshold.value=-18;
    this.compressor.knee.value=18;
    this.compressor.ratio.value=3;
    this.compressor.attack.value=.003;
    this.compressor.release.value=.25;
    this.masterGain.connect(this.compressor);
    this.compressor.connect(this.ctx.destination);
    this.analyser=this.ctx.createAnalyser();
    this.analyser.fftSize=256;
    this.analyser.smoothingTimeConstant=.7;
    this.masterGain.connect(this.analyser);
    this.freqData=new Uint8Array(this.analyser.frequencyBinCount);
    this.dryGain=this.ctx.createGain();this.dryGain.gain.value=1;
    this.dryGain.connect(this.masterGain);
    this.wetGain=this.ctx.createGain();this.wetGain.gain.value=0;
    this.wetGain.connect(this.masterGain);
    this.wetInput=this.ctx.createGain();
    this._initWetChain();
    const len=this.ctx.sampleRate;
    this.noiseBuffer=this.ctx.createBuffer(1,len,this.ctx.sampleRate);
    const data=this.noiseBuffer.getChannelData(0);
    for(let i=0;i<len;i++)data[i]=Math.random()*2-1;
    if(this.fxActive){
      const wet=(state.reverb/100)*.7;
      this.dryGain.gain.value=1-wet;
      this.wetGain.gain.value=wet;
    }
    try{
      this.ctx.addEventListener('statechange',()=>{
        if(this.ctx.state==='interrupted'||this.ctx.state==='suspended'){
          this._needsResume=true;
        }
      });
    }catch(e){}
  }
  resume(){
    this.init();
    if(!this.ctx)return Promise.resolve();
    if(this.ctx.state==='running')return Promise.resolve();
    if(this._resuming)return this._resuming;
    this._resuming=this.ctx.resume().then(()=>{this._needsResume=false;}).catch(()=>{}).then(()=>{this._resuming=null;});
    return this._resuming;
  }
  setVolume(v01){
    this.volume=v01;
    if(this.masterGain)this.masterGain.gain.setTargetAtTime(v01,this.ctx.currentTime,.02);
  }
  noteOn(midi,velocity){
    const vel=clampVelocity(velocity);
    if(!this.ctx){this.init();if(!this.ctx)return;}
    if(this.ctx.state!=='running'){
      this.resume().then(()=>{
        if(this.ctx&&this.ctx.state==='running')this._soundNote(midi,vel);
      });
      return;
    }
    this._soundNote(midi,vel);
  }
  _soundNote(midi,velocity){
    const vel=clampVelocity(velocity);
    const old=this.voices.get(midi);
    if(old){old.release(this.ctx.currentTime,.02);this.voices.delete(midi);}
    const preset=getCurrentTimbres()[state.timbre]||getCurrentTimbres()[1];
    const v=new Voice(this,midi,preset,vel);
    v.start(this.ctx.currentTime);
    this.voices.set(midi,v);
  }
  noteOff(midi,sec){
    if(!this.ctx)return;
    const v=this.voices.get(midi);
    if(!v)return;
    this.voices.delete(midi);
    v.release(this.ctx.currentTime,sec);
  }
  allNotesOff(sec){
    if(!this.ctx)return;
    this.voices.forEach(v=>v.release(this.ctx.currentTime,sec));
    this.voices.clear();
  }
  hardKillAll(){
    if(!this.ctx)return;
    this.voices.forEach(v=>v.stop(this.ctx.currentTime));
    this.voices.clear();
  }
  setFx(){
    const active=state.ambient;
    this.fxActive=active;
    if(!this.ctx)return;
    const wet=active?(state.reverb/100)*.7:0;
    const dry=1-wet;
    const now=this.ctx.currentTime;
    this.dryGain.gain.setTargetAtTime(dry,now,.08);
    this.wetGain.gain.setTargetAtTime(wet,now,.08);
  }
}
const engine=new AudioEngine();
function getReleaseSec(){return state.fadeTime<=0?.02:state.fadeTime;}
function getReleaseSecWithFx(){return getReleaseSec()*(engine.fxActive?1.3:1);}

/* ========== Ref Count ========== */
const midiRefCount=new Map();
function noteOnSafe(midi,velocity){
  const c=midiRefCount.get(midi)||0;
  midiRefCount.set(midi,c+1);
  if(c===0){engine.noteOn(midi,velocity);recorder.log(midi,true);stats.onNoteOn(midi);haptic(8);}
}
function noteOffSafe(midi,sec){
  const c=midiRefCount.get(midi)||0;
  if(c<=0)return;
  if(c===1){midiRefCount.delete(midi);engine.noteOff(midi,sec);recorder.log(midi,false);}
  else midiRefCount.set(midi,c-1);
}
function resetAllNotes(sec){engine.allNotesOff(sec);midiRefCount.clear();}
function hardKillAllNotes(){engine.hardKillAll();midiRefCount.clear();}

/* ========== Haptics ========== */
function haptic(ms){
  if(!state.haptics)return;
  if(!IS_MOBILE)return;
  if(navigator.vibrate)try{navigator.vibrate(ms);}catch(e){}
}

/* ========== Stats ========== */
const stats={
  notes:0,chords:0,maxChord:0,sessionStart:Date.now(),
  lastChordName:'',lastChordTime:0,comboChords:0,
  onNoteOn(_midi){
    this.notes++;
    if(this.notes===20)easterEgg.stars();
    updateStatsLabel();
    checkChordCombo();
  },
  onChordDetected(name){
    if(name&&name!==this.lastChordName){
      this.lastChordName=name;
      const now=Date.now();
      if(now-this.lastChordTime<2000)this.comboChords++;
      else this.comboChords=1;
      this.lastChordTime=now;
      if(this.comboChords>=3)easterEgg.rainbow();
    }
  }
};
function updateStatsLabel(){
  const el=document.getElementById('statsLabel');
  if(!el)return;
  const dur=Math.round((Date.now()-stats.sessionStart)/1000);
  const mm=Math.floor(dur/60),ss=dur%60;
  const timeStr=mm+':'+String(ss).padStart(2,'0');
  el.innerHTML=`<span>${t('stats.notes',{n:stats.notes})}</span><span>${t('stats.chords',{n:stats.chords})}</span><span>${t('stats.time',{t:timeStr})}</span>`;
}
setInterval(updateStatsLabel,1000);

/* ========== Chord History ========== */
const chordHistoryArr=[];
function pushChordHistory(name){
  if(!name)return;
  if(chordHistoryArr[0]===name)return;
  chordHistoryArr.unshift(name);
  if(chordHistoryArr.length>MAX_CHORD_HISTORY)chordHistoryArr.pop();
  renderChordHistory();
  stats.onChordDetected(name);
}
function renderChordHistory(){
  const el=document.getElementById('chordHistory');
  if(!el)return;
  el.innerHTML='';
  chordHistoryArr.forEach((name,i)=>{
    const s=document.createElement('span');
    s.className='kp-chord-history__item'+(i===0?' is-latest':'');
    s.textContent=name;
    el.appendChild(s);
  });
}

/* ========== Recorder ========== */
const recorder={
  events:[],startTime:0,recording:false,playing:false,
  playIndex:0,playStartTime:0,playRaf:null,
  start(){
    this.events=[];this.startTime=performance.now();this.recording=true;
    document.getElementById('btnRec').classList.add('is-recording');
    updateRecUI();
  },
  stop(){
    this.recording=false;
    document.getElementById('btnRec').classList.remove('is-recording');
    updateRecUI();
  },
  log(midi,isOn){
    if(!this.recording)return;
    this.events.push({t:Math.round(performance.now()-this.startTime),midi,on:isOn});
    updateRecUI();
  },
  play(){
    if(this.playing||this.events.length===0)return;
    this.stopPlay();
    this.playing=true;this.playIndex=0;this.playStartTime=performance.now();
    document.getElementById('btnRecPlay').disabled=true;
    document.getElementById('btnRecStop').disabled=false;
    this._loop();
  },
  _loop(){
    if(!this.playing)return;
    const elapsed=performance.now()-this.playStartTime;
    while(this.playIndex<this.events.length&&this.events[this.playIndex].t<=elapsed){
      const ev=this.events[this.playIndex];
      if(ev.on)noteOnSafe(ev.midi);
      else noteOffSafe(ev.midi,getReleaseSecWithFx());
      this.playIndex++;
    }
    if(this.playIndex>=this.events.length){
      this.playing=false;
      this.playRaf=null;
      setTimeout(()=>resetAllNotes(getReleaseSecWithFx()),200);
      updateRecUI();
      return;
    }
    this.playRaf=requestAnimationFrame(()=>this._loop());
  },
  stopPlay(){
    this.playing=false;
    if(this.playRaf){cancelAnimationFrame(this.playRaf);this.playRaf=null;}
    resetAllNotes(getReleaseSecWithFx());
    updateRecUI();
  },
  clear(){
    this.stopPlay();this.stop();
    this.events=[];
    updateRecUI();
  },
  export(){
    return JSON.stringify({version:1,events:this.events});
  },
  import(json){
    try{
      const d=JSON.parse(json);
      if(d&&Array.isArray(d.events)){
        this.events=d.events.slice().sort((a,b)=>a.t-b.t);
        updateRecUI();
        return this.events.length;
      }
    }catch(e){}
    return -1;
  }
};
function updateRecUI(){
  const statusEl=document.getElementById('recStatus');
  const btnPlay=document.getElementById('btnRecPlay');
  const btnStop=document.getElementById('btnRecStop');
  const btnExport=document.getElementById('btnRecExport');
  const btnClear=document.getElementById('btnRecClear');
  const btnStart=document.getElementById('btnRecStart');
  const btnTop=document.getElementById('btnRec');
  if(!statusEl)return;
  let status='';
  if(recorder.recording)status=t('rec.status.recording');
  else if(recorder.playing)status=t('rec.status.playing');
  else if(recorder.events.length>0)status=t('rec.status.count',{n:recorder.events.length});
  statusEl.textContent=status;
  if(btnPlay)btnPlay.disabled=recorder.recording||recorder.playing||recorder.events.length===0;
  if(btnStop)btnStop.disabled=!recorder.playing;
  if(btnExport)btnExport.disabled=recorder.events.length===0;
  if(btnClear)btnClear.disabled=recorder.recording||recorder.playing||recorder.events.length===0;
  if(btnStart){
    btnStart.textContent=recorder.recording?t('rec.stop'):t('rec.start');
    btnStart.classList.toggle('kp-btn--danger',!recorder.recording);
    btnStart.classList.toggle('kp-btn--ghost',recorder.recording);
  }
  if(btnTop){
    btnTop.classList.toggle('is-recording',recorder.recording);
    btnTop.setAttribute('aria-pressed',recorder.recording?'true':'false');
    btnTop.title=recorder.recording?t('rec.topbar.on'):t('rec.topbar');
    btnTop.setAttribute('aria-label',btnTop.title);
  }
}
function flashRecFeedback(msg){
  const el=document.getElementById('recFeedback');
  if(!el)return;
  el.textContent=msg||'';
  if(!msg)return;
  clearTimeout(flashRecFeedback._t);
  flashRecFeedback._t=setTimeout(()=>{if(el.textContent===msg)el.textContent='';},2200);
}

/* ========== Metronome ========== */
class Metronome{
  constructor(engine){
    this.engine=engine;
    this.isOn=false;
    this.timerId=null;
    this.nextNoteTime=0;
    this.currentBeat=0;
    this.scheduleAhead=0.1;
    this.lookahead=25;
    this.onBeat=null;
  }
  start(){
    if(!this.engine.ctx)return false;
    this.isOn=true;
    this.currentBeat=0;
    this.nextNoteTime=this.engine.ctx.currentTime+0.1;
    this._scheduler();
    return true;
  }
  stop(){
    this.isOn=false;
    if(this.timerId){clearTimeout(this.timerId);this.timerId=null;}
    this.currentBeat=0;
  }
  _scheduler(){
    if(!this.isOn)return;
    while(this.nextNoteTime<this.engine.ctx.currentTime+this.scheduleAhead){
      this._click(this.nextNoteTime,this.currentBeat===0);
      this.nextNoteTime+=60/state.bpm;
      this.currentBeat=(this.currentBeat+1)%state.beatsPerBar;
    }
    this.timerId=setTimeout(()=>this._scheduler(),this.lookahead);
  }
  _click(time,isDownbeat){
    const ctx=this.engine.ctx;
    if(!ctx)return;
    const osc=ctx.createOscillator();
    const g=ctx.createGain();
    osc.type='sine';
    osc.frequency.value=isDownbeat?1320:880;
    g.gain.setValueAtTime(0,time);
    g.gain.linearRampToValueAtTime(isDownbeat?0.25:0.12,time+0.005);
    g.gain.exponentialRampToValueAtTime(0.001,time+0.06);
    osc.connect(g);
    g.connect(this.engine.masterGain);
    osc.start(time);
    osc.stop(time+0.1);
    const delay=(time-ctx.currentTime)*1000;
    setTimeout(()=>{
      if(this.onBeat)this.onBeat(isDownbeat);
      haptic(isDownbeat?15:8);
    },Math.max(0,delay));
  }
}
const metronome=new Metronome(engine);
metronome.onBeat=function(isDownbeat){
  const pulse=document.getElementById('beatPulse');
  if(!pulse)return;
  pulse.classList.remove('is-beat','is-downbeat');
  void pulse.offsetWidth;
  pulse.classList.add(isDownbeat?'is-downbeat':'is-beat');
};
function updateMetronomeUI(){
  const status=document.getElementById('metronomeStatus');
  document.querySelectorAll('#setMetronome button').forEach(b=>{
    b.classList.toggle('is-active',(b.dataset.metro==='on')===state.metronomeOn);
  });
  document.querySelectorAll('#setBeats button').forEach(b=>{
    b.classList.toggle('is-active',Number(b.dataset.beats)===state.beatsPerBar);
  });
  document.getElementById('setBpm').value=state.bpm;
  document.getElementById('valBpm').textContent=state.bpm;
  if(status){
    status.textContent=state.metronomeOn?t('metronome.status.on',{bpm:state.bpm,beats:state.beatsPerBar}):'';
  }
}

/* ========== Demo Player ========== */
const DEMOS=[
  /* bpm slightly eased; long notes (2) keep phrase-end breath via hold ratio below */
  {id:'twinkle',bpm:96,notes:[['C5',1],['C5',1],['G5',1],['G5',1],['A5',1],['A5',1],['G5',2],['F5',1],['F5',1],['E5',1],['E5',1],['D5',1],['D5',1],['C5',2],['G5',1],['G5',1],['F5',1],['F5',1],['E5',1],['E5',1],['D5',2],['G5',1],['G5',1],['F5',1],['F5',1],['E5',1],['E5',1],['D5',2],['C5',1],['C5',1],['G5',1],['G5',1],['A5',1],['A5',1],['G5',2],['F5',1],['F5',1],['E5',1],['E5',1],['D5',1],['D5',1],['C5',2]]},
  {id:'ode',bpm:112,notes:[['E5',1],['E5',1],['F5',1],['G5',1],['G5',1],['F5',1],['E5',1],['D5',1],['C5',1],['C5',1],['D5',1],['E5',1],['E5',1.5],['D5',.5],['D5',2],['E5',1],['E5',1],['F5',1],['G5',1],['G5',1],['F5',1],['E5',1],['D5',1],['C5',1],['C5',1],['D5',1],['E5',1],['D5',1.5],['C5',.5],['C5',2]]},
  {id:'birthday',bpm:104,notes:[['G4',.5],['G4',.5],['A4',1],['G4',1],['C5',1],['B4',2],['G4',.5],['G4',.5],['A4',1],['G4',1],['D5',1],['C5',2],['G4',.5],['G4',.5],['G5',1],['E5',1],['C5',1],['B4',1],['A4',2],['F5',.5],['F5',.5],['E5',1],['C5',1],['D5',1],['C5',2]]},
];
const demoPlayer={
  playing:false,timeouts:[],currentId:null,
  play(demoId){
    this.stop();
    const demo=DEMOS.find(d=>d.id===demoId);
    if(!demo)return;
    this.playing=true;this.currentId=demoId;
    document.getElementById('btnDemoPlay').disabled=true;
    document.getElementById('btnDemoStop').disabled=false;
    const beatMs=60000/demo.bpm;
    let acc=0;
    const seq=[];
    demo.notes.forEach(([name,beats])=>{
      /* short notes tighter; phrase-end (beats>=2) more air before next */
      const hold=beats>=2?0.72:beats<=.5?0.78:0.82;
      const gapBoost=beats>=2?beatMs*0.12:0;
      seq.push({name,beats,start:acc,duration:beats*beatMs*hold});
      acc+=beats*beatMs+gapBoost;
    });
    seq.forEach(step=>{
      const midi=nameToMidi(step.name);
      if(midi===null)return;
      const tOn=setTimeout(()=>{
        if(!this.playing)return;
        ensureMidiVisible(midi);
        /* melody: longer / peak phrase notes slightly stronger */
        const vel=step.beats>=2?.92:step.beats<=.5?.7:.85;
        noteOnSafe(midi,vel);
      },step.start);
      const tOff=setTimeout(()=>{
        if(!this.playing)return;
        noteOffSafe(midi,getReleaseSecWithFx());
      },step.start+step.duration);
      this.timeouts.push(tOn,tOff);
    });
    const tEnd=setTimeout(()=>{this.stop();},acc+500);
    this.timeouts.push(tEnd);
    document.getElementById('demoStatus').textContent=t('demo.status.playing');
    updateDemoNow();
  },
  stop(){
    this.playing=false;
    this.timeouts.forEach(t=>clearTimeout(t));
    this.timeouts=[];
    this.currentId=null;
    document.getElementById('btnDemoPlay').disabled=false;
    document.getElementById('btnDemoStop').disabled=true;
    document.getElementById('demoStatus').textContent=t('demo.status.idle');
    updateDemoNow();
  }
};

function updateDemoNow(){
  const el=document.getElementById('demoNow');
  if(!el)return;
  if(demoPlayer.playing&&demoPlayer.currentId){
    el.textContent=t('demo.now',{name:t('demo.'+demoPlayer.currentId)});
    el.classList.add('is-active');
  }else{
    el.textContent='';
    el.classList.remove('is-active');
  }
}

function ensureMidiVisible(midi){
  if(keyIndex.has(midi))return;
  const oct=Math.floor(midi/12)-1;
  let target=oct;
  if(state.keyMode==='mode1'){
    if(oct>=0&&oct<=5)target=oct;
    else if(oct<0)target=0;
    else target=5;
  }else{
    if(oct>=0&&oct<=7)target=oct;
    else if(oct<0)target=0;
    else target=7;
  }
  if(target!==state.octaveStart[state.keyMode]){
    state.octaveStart[state.keyMode]=target;
    save('octaveStart',state.octaveStart);
    renderPiano();
  }
}
function buildDemoOptions(){
  const sel=document.getElementById('setDemo');
  if(!sel)return;
  const cur=sel.value;
  sel.innerHTML='';
  DEMOS.forEach(d=>{
    const opt=document.createElement('option');
    opt.value=d.id;
    opt.textContent=t('demo.'+d.id);
    sel.appendChild(opt);
  });
  if(cur)sel.value=cur;
}

/* ========== Easter Eggs ========== */
const easterEgg={
  rainbow(){
    const layer=document.getElementById('burstLayer');
    if(!layer)return;
    const cx=window.innerWidth/2,cy=window.innerHeight/2;
    const colors=['#e4c27a','#d4b06a','#c9a45a','#7aa392','#f0e6d0','#e09050'];
    for(let i=0;i<8;i++){
      const ring=document.createElement('div');
      ring.className='kp-burst__ring';
      ring.style.left=cx+'px';ring.style.top=cy+'px';
      ring.style.width='80px';ring.style.height='80px';
      ring.style.marginLeft='-40px';ring.style.marginTop='-40px';
      ring.style.borderColor=colors[i%colors.length];
      ring.style.animationDelay=(i*0.06)+'s';
      layer.appendChild(ring);
      setTimeout(()=>ring.remove(),2200);
    }
  },
  stars(){
    const layer=document.getElementById('burstLayer');
    if(!layer)return;
    const symbols=['★','✦','✧','♪','♫'];
    for(let i=0;i<20;i++){
      const s=document.createElement('div');
      s.className='kp-star-fall';
      s.textContent=symbols[Math.floor(Math.random()*symbols.length)];
      s.style.left=Math.random()*100+'vw';
      s.style.fontSize=(14+Math.random()*16)+'px';
      s.style.color=['#e4c27a','#d4b06a','#f0e6d0','#7aa392','#e09050'][Math.floor(Math.random()*5)];
      s.style.animationDuration=(2+Math.random()*2)+'s';
      s.style.animationDelay=(Math.random()*0.4)+'s';
      layer.appendChild(s);
      setTimeout(()=>s.remove(),4500);
    }
  }
};
let chordComboTimer=null;
function checkChordCombo(){
  clearTimeout(chordComboTimer);
  chordComboTimer=setTimeout(()=>{},1000);
}

/* ========== Layout ========== */
function computeLayout(mode,startOctave){
  const whiteSemis=[0,2,4,5,7,9,11];
  const blackAfter=[0,1,3,4,5];
  const blackSemis=[1,3,6,8,10];
  const octaves=mode==='mode1'?3:1;
  const whites=[];
  for(let o=0;o<octaves;o++)for(const s of whiteSemis)whites.push({midi:(startOctave+o+1)*12+s});
  whites.push({midi:(startOctave+octaves+1)*12});
  const blacks=[];
  for(let o=0;o<octaves;o++)for(let k=0;k<blackAfter.length;k++){
    blacks.push({midi:(startOctave+o+1)*12+blackSemis[k],afterIdx:o*7+blackAfter[k]});
  }
  return {whites,blacks,octaves};
}
const WHITE_SEMIS_8=[0,2,4,5,7,9,11,12];
const ROWS_MODE1=[
  {codes:['KeyZ','KeyX','KeyC','KeyV','KeyB','KeyN','KeyM','Comma'],offset:0},
  {codes:['KeyA','KeyS','KeyD','KeyF','KeyG','KeyH','KeyJ','KeyK'],offset:12},
  {codes:['KeyQ','KeyW','KeyE','KeyR','KeyT','KeyY','KeyU','KeyI'],offset:24},
];
const ROWS_MODE2={
  whites:{codes:['KeyA','KeyS','KeyD','KeyF','KeyG','KeyH','KeyJ','KeyK'],semis:WHITE_SEMIS_8},
  blacks:{codes:['KeyW','KeyE','KeyT','KeyY','KeyU'],semis:[1,3,6,8,10]},
};
function computeKeymap(mode,startOctave){
  const map={};
  const base=(startOctave+1)*12;
  const letterMap={KeyZ:'Z',KeyX:'X',KeyC:'C',KeyV:'V',KeyB:'B',KeyN:'N',KeyM:'M',Comma:',',KeyA:'A',KeyS:'S',KeyD:'D',KeyF:'F',KeyG:'G',KeyH:'H',KeyJ:'J',KeyK:'K',KeyQ:'Q',KeyW:'W',KeyE:'E',KeyR:'R',KeyT:'T',KeyY:'Y',KeyU:'U',KeyI:'I'};
  if(mode==='mode1'){
    ROWS_MODE1.forEach(row=>row.codes.forEach((code,i)=>{
      const midi=base+row.offset+WHITE_SEMIS_8[i];
      (map[midi]=map[midi]||[]).push(letterMap[code]);
    }));
  }else{
    ROWS_MODE2.whites.codes.forEach((code,i)=>{
      const midi=base+ROWS_MODE2.whites.semis[i];
      (map[midi]=map[midi]||[]).push(letterMap[code]);
    });
    ROWS_MODE2.blacks.codes.forEach((code,i)=>{
      const midi=base+ROWS_MODE2.blacks.semis[i];
      (map[midi]=map[midi]||[]).push(letterMap[code]);
    });
  }
  return map;
}

/* ========== Piano ========== */
const pianoEl=document.getElementById('pianoKeys');
const scrollEl=document.getElementById('pianoScroll');
let keyIndex=new Map();
const keyRects=new Map();

function keyLabelFor(midi,keymap){
  if(state.keyHintMode==='off')return '';
  if(state.keyHintMode==='notes')return midiName(midi);
  const l=keymap[midi];
  return l&&l.length?l.join('/'):'';
}

function renderPiano(){
  const mode=state.keyMode;
  const start=state.octaveStart[mode];
  const layout=computeLayout(mode,start);
  const keymap=computeKeymap(mode,start);
  const cs=getComputedStyle(scrollEl);
  const padB=parseFloat(cs.paddingBottom)||0;
  let H=Math.max(0,scrollEl.clientHeight-padB);
  const CW=scrollEl.clientWidth||window.innerWidth;
  const N=layout.whites.length;
  let W=CW/N;
  const isSmall=window.innerWidth<=640;
  const MIN_W=isSmall?42:38;
  W=Math.min(Math.max(W,MIN_W),76);
  const BW=W*.62;
  if(!H||H<40)H=Math.max(140,Math.round(Math.min(window.innerHeight*.32,260)));
  pianoEl.innerHTML='';
  pianoEl.style.width=(N*W)+'px';
  pianoEl.style.height=H+'px';
  keyIndex.clear();
  keyRects.clear();
  layout.whites.forEach((w,i)=>{
    const el=document.createElement('div');
    el.className='kp-key kp-key--white';
    el.dataset.midi=w.midi;
    el.style.left=(i*W)+'px';
    el.style.width=W+'px';
    const lbl=keyLabelFor(w.midi,keymap);
    if(lbl){const h=document.createElement('span');h.className='kp-key__hint';h.textContent=lbl;el.appendChild(h);}
    pianoEl.appendChild(el);
    keyIndex.set(w.midi,el);
    keyRects.set(w.midi,{x:i*W,y:0,w:W,h:H});
  });
  layout.blacks.forEach(b=>{
    const el=document.createElement('div');
    el.className='kp-key kp-key--black';
    el.dataset.midi=b.midi;
    const x=(b.afterIdx+1)*W-BW/2;
    el.style.left=x+'px';
    el.style.width=BW+'px';
    const lbl=keyLabelFor(b.midi,keymap);
    if(lbl){const h=document.createElement('span');h.className='kp-key__hint';h.textContent=lbl;el.appendChild(h);}
    pianoEl.appendChild(el);
    keyIndex.set(b.midi,el);
    keyRects.set(b.midi,{x,y:0,w:BW,h:H*.62});
  });
  for(let i=7;i<N;i+=7){
    const line=document.createElement('div');
    line.className='kp-octline';
    line.style.left=(i*W)+'px';
    pianoEl.appendChild(line);
  }
  updateOctaveLabel();
  refreshHighlights();
  requestAnimationFrame(()=>{
    const target=Math.max(0,(scrollEl.scrollWidth-scrollEl.clientWidth)/2);
    scrollEl.scrollLeft=target;
  });
}
function updateOctaveLabel(){
  const mode=state.keyMode;
  const start=state.octaveStart[mode];
  const end=mode==='mode1'?start+3:start+1;
  document.getElementById('octaveLabel').textContent='C'+start+' – C'+end;
}
function updateHintsLabel(){
  const el=document.getElementById('hintsLabel');
  if(!el)return;
  el.textContent=state.keyMode==='mode1'?t('hint.mode1'):t('hint.mode2');
}

/* ========== Note Particles ========== */
const NOTE_SYMBOLS=['♪','♫','♩','♬','✦','✧'];
let particleCount=0;
function spawnNoteParticle(midi){
  const layer=document.getElementById('noteLayer');
  if(!layer)return;
  const kr=keyRects.get(midi);
  if(!kr)return;
  if(particleCount>=MAX_PARTICLES)return;
  const scrollRect=scrollEl.getBoundingClientRect();
  const x=scrollRect.left+kr.x-scrollEl.scrollLeft+kr.w/2;
  const y=scrollRect.top+kr.y+kr.h*.35;
  const el=document.createElement('div');
  el.className='kp-note-particle';
  el.textContent=NOTE_SYMBOLS[Math.floor(Math.random()*NOTE_SYMBOLS.length)];
  const palette=['#e4c27a','#d4b06a','#f0e6d0','#7aa392','#c9a45a','#e09050'];
  el.style.color=palette[midi%palette.length];
  el.style.left=x+'px';el.style.top=y+'px';
  el.style.fontSize=(14+Math.random()*12)+'px';
  el.style.setProperty('--dx',(Math.random()*60-30)+'px');
  layer.appendChild(el);
  particleCount++;
  setTimeout(()=>{el.remove();particleCount--;},1500);
}
function initBgParticles(){
  const container=document.getElementById('bgParticles');
  if(container){container.innerHTML='';container.hidden=true;}
}

/* ========== Highlights ========== */
let activeSet=new Set();
let subSet=new Set();
const heldKeys=new Map();
const pointerStates=new Map();

function updateHighlights(main,sub){
  const oldActive=activeSet;
  activeSet=new Set(main);
  subSet=new Set(sub);
  keyIndex.forEach((el,midi)=>{
    el.classList.toggle('active',activeSet.has(midi));
    el.classList.toggle('active-sub',!activeSet.has(midi)&&subSet.has(midi));
  });
  activeSet.forEach(midi=>{
    if(!oldActive.has(midi))spawnNoteParticle(midi);
  });
  const wave=document.getElementById('nowWave');
  if(wave)wave.dataset.active=(activeSet.size+subSet.size)>0?'true':'false';
  const all=[...new Set([...activeSet,...subSet])].sort((a,b)=>a-b);
  const el=document.getElementById('nowNotes');
  if(all.length===0){el.textContent='—';el.classList.add('is-empty');}
  else{el.textContent=all.map(midiName).join(' ');el.classList.remove('is-empty');}
  const chordEl=document.getElementById('nowChord');
  if(chordEl){
    const chordName=identifyChord(all);
    if(chordName){
      chordEl.textContent=chordName;
      chordEl.classList.add('is-active');
      pushChordHistory(chordName);
      stats.chords++;
      updateStatsLabel();
    }else{
      chordEl.textContent='';
      chordEl.classList.remove('is-active');
    }
  }
}
function refreshHighlights(){
  const main=new Set();
  const sub=new Set();
  heldKeys.forEach(entry=>main.add(entry.midi));
  pointerStates.forEach(s=>{
    if(s.button===2&&!s.dragStarted&&s.anchorTriad){
      const[a,...rest]=s.anchorTriad;
      main.add(a);
      rest.forEach(m=>sub.add(m));
    }else if(s.lastMidi!==null){
      main.add(s.lastMidi);
    }
  });
  updateHighlights(main,sub);
}
function addAfterglow(midi){
  const el=keyIndex.get(midi);
  if(!el)return;
  if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const isWhite=el.classList.contains('kp-key--white');
  const glow=isWhite
    ?'0 0 28px rgba(212,176,106,.55), 0 0 54px rgba(228,194,122,.28)'
    :'0 0 28px rgba(212,176,106,.5), 0 0 48px rgba(122,163,146,.25)';
  try{el.animate([{boxShadow:glow},{boxShadow:'transparent'}],{duration:900,easing:'ease-out'});}catch(e){}
}

/* ========== Chips ========== */
function updateChips(){
  const seriesLabel=t(state.series==='natural'?'series.natural':'series.electronic');
  document.getElementById('chipTimbre').textContent=
    seriesLabel+' · '+t('timbre.'+state.timbre)+' ('+state.timbre+')';
  document.getElementById('chipMode').textContent=
    state.keyMode==='mode1'?t('chip.mode'):t('chip.mode2');
}

/* ========== Timbre ========== */
function buildTimbreOptions(){
  const sel=document.getElementById('setTimbre');
  if(!sel)return;
  const cur=state.timbre;
  sel.innerHTML='';
  for(let i=0;i<TIMBRE_COUNT;i++){
    const opt=document.createElement('option');
    opt.value=i;
    opt.textContent=i+' · '+t('timbre.'+i);
    sel.appendChild(opt);
  }
  sel.value=String(cur);
}
function applyTimbre(n){
  if(n===state.timbre)return;
  resetAllNotes(.05);
  heldKeys.clear();pointerStates.clear();
  refreshHighlights();
  state.timbre=n;
  save('timbre',n);
  document.getElementById('setTimbre').value=String(n);
  updateChips();
}

/* ========== Shake ========== */
let shakeTimer=null;
function shake(){
  if(!state.shakeUnlocked){
    state.shakeUnlocked=true;
    save('shakeUnlocked','true');
    document.getElementById('fieldShake').hidden=false;
    updateShakeSeg();
  }
  const app=document.getElementById('app');
  app.classList.remove('kp-shake--1','kp-shake--2','kp-shake--3','kp-shake--4','kp-shake--5');
  void app.offsetWidth;
  const cls='kp-shake--'+state.shakeIntensity;
  app.classList.add(cls);
  clearTimeout(shakeTimer);
  shakeTimer=setTimeout(()=>app.classList.remove(cls),300);
}

/* ========== Octave / Mode ========== */
function changeOctave(dir){
  const mode=state.keyMode;
  const cur=state.octaveStart[mode];
  const max=mode==='mode1'?5:7;
  const next=cur+dir;
  if(next<0||next>max){shake();return;}
  resetAllNotes(getReleaseSecWithFx());
  heldKeys.clear();pointerStates.clear();
  refreshHighlights();
  state.octaveStart[mode]=next;
  save('octaveStart',state.octaveStart);
  renderPiano();
}
function setMode(mode){
  if(mode===state.keyMode)return;
  resetAllNotes(getReleaseSecWithFx());
  heldKeys.clear();pointerStates.clear();
  refreshHighlights();
  state.keyMode=mode;
  save('keyMode',mode);
  renderPiano();
  updateModeSeg();
  updateChips();
  updateHintsLabel();
}
function updateModeSeg(){document.querySelectorAll('#setMode button').forEach(b=>b.classList.toggle('is-active',b.dataset.mode===state.keyMode));}
function updateSeriesSeg(){document.querySelectorAll('#setSeries button').forEach(b=>b.classList.toggle('is-active',b.dataset.series===state.series));}
function updateHintsSeg(){document.querySelectorAll('#setHints button').forEach(b=>b.classList.toggle('is-active',b.dataset.hints===state.keyHintMode));}
function updateAmbientSeg(){document.querySelectorAll('#setAmbient button').forEach(b=>{const on=b.dataset.ambient==='on';b.classList.toggle('is-active',on===state.ambient);});}
function updateOrientationSeg(){document.querySelectorAll('#setOrientation button').forEach(b=>b.classList.toggle('is-active',b.dataset.orient===state.orientationMode));}
function updateGyroSeg(){document.querySelectorAll('#setGyro button').forEach(b=>{const on=b.dataset.gyro==='on';b.classList.toggle('is-active',on===state.gyroEnabled);});}
function updateHapticsSeg(){document.querySelectorAll('#setHaptics button').forEach(b=>{const on=b.dataset.haptics==='on';b.classList.toggle('is-active',on===state.haptics);});}
function updateShakeSeg(){document.querySelectorAll('#setShake button').forEach(b=>b.classList.toggle('is-active',Number(b.dataset.shake)===state.shakeIntensity));}

/* ========== Orientation / Gyro ========== */
let gyroPermission='unknown';
let gyroLandscape=false;
let gyroDebounceTimer=null;
let _orientationTimer=null;
let _rotateHintDismissed=false;

function getScreenLandscape(){
  try{
    if(screen.orientation&&typeof screen.orientation.angle==='number'){
      const a=screen.orientation.angle;
      if(a===90||a===270)return true;
      if(a===0||a===180)return false;
    }
  }catch(e){}
  try{
    if(matchMedia('(orientation: landscape)').matches)return true;
    if(matchMedia('(orientation: portrait)').matches)return false;
  }catch(e){}
  return window.innerWidth>window.innerHeight;
}

async function requestGyroPermission(){
  if(!IS_MOBILE)return false;
  if(typeof DeviceOrientationEvent==='undefined')return false;
  if(!state.gyroEnabled)return false;
  if(typeof DeviceOrientationEvent.requestPermission==='function'){
    try{
      const r=await DeviceOrientationEvent.requestPermission();
      gyroPermission=r;
      if(r==='granted'){startGyroListener();return true;}
      return false;
    }catch(e){gyroPermission='denied';return false;}
  }
  gyroPermission='granted';
  startGyroListener();
  return true;
}

let _gyroListening=false;
function startGyroListener(){
  if(_gyroListening)return;
  if(gyroPermission!=='granted')return;
  if(typeof DeviceOrientationEvent==='undefined')return;
  _gyroListening=true;
  window.addEventListener('deviceorientation',e=>{
    if(e.gamma===null||e.beta===null)return;
    const g=Math.abs(e.gamma||0);
    const b=Math.abs(e.beta||0);
    const isPhysLandscape=g>55&&b<70;
    if(isPhysLandscape!==gyroLandscape){
      clearTimeout(gyroDebounceTimer);
      gyroDebounceTimer=setTimeout(()=>{
        gyroLandscape=isPhysLandscape;
        applyOrientation();
      },300);
    }
  },{passive:true});
}

function applyOrientation(){
  if(!IS_MOBILE){
    document.documentElement.removeAttribute('data-device');
    document.documentElement.removeAttribute('data-orientation');
    document.documentElement.removeAttribute('data-force-rotate');
    return;
  }
  document.documentElement.dataset.device='mobile';
  const mode=state.orientationMode;
  const screenLandscape=getScreenLandscape();
  let landscape=false,forceRotate=false,showHint=false;
  if(mode==='off'){landscape=screenLandscape;}
  else if(mode==='force'){landscape=true;forceRotate=!screenLandscape;}
  else{
    if(screenLandscape)landscape=true;
    else if(state.gyroEnabled&&gyroPermission==='granted'&&gyroLandscape)showHint=!screenLandscape;
  }
  document.documentElement.dataset.orientation=landscape?'landscape':'portrait';
  if(forceRotate)document.documentElement.dataset.forceRotate='90';
  else document.documentElement.removeAttribute('data-force-rotate');
  const hintEl=document.getElementById('rotateHint');
  if(hintEl){
    if(showHint&&!_rotateHintDismissed)hintEl.classList.add('is-visible');
    else hintEl.classList.remove('is-visible');
  }
  requestAnimationFrame(()=>renderPiano());
}
function scheduleOrientationUpdate(){
  clearTimeout(_orientationTimer);
  _orientationTimer=setTimeout(applyOrientation,150);
}

/* ========== Help ========== */
let helpTab='text';
function renderHelp(){
  const body=document.getElementById('helpBody');
  if(!body)return;
  if(helpTab==='text')body.innerHTML=helpTextHtml();
  else{body.innerHTML='';body.appendChild(buildMiniKeyboard());}
  document.querySelectorAll('.kp-modal__tab').forEach(tb=>tb.classList.toggle('is-active',tb.dataset.tab===helpTab));
}
function helpTextHtml(){
  let rows='';
  for(let i=0;i<TIMBRE_COUNT;i++)rows+=`<tr><td>${i}</td><td>${t('timbre.'+i)}</td></tr>`;
  return `
    <h3>${t('help.keyboard')}</h3>
    <p><kbd>Z</kbd><kbd>X</kbd><kbd>C</kbd><kbd>V</kbd><kbd>B</kbd><kbd>N</kbd><kbd>M</kbd><kbd>,</kbd>
       &nbsp;/&nbsp;<kbd>A</kbd><kbd>S</kbd><kbd>D</kbd><kbd>F</kbd><kbd>G</kbd><kbd>H</kbd><kbd>J</kbd><kbd>K</kbd>
       &nbsp;/&nbsp;<kbd>Q</kbd><kbd>W</kbd><kbd>E</kbd><kbd>R</kbd><kbd>T</kbd><kbd>Y</kbd><kbd>U</kbd><kbd>I</kbd></p>
    <p>${t('help.mode1Line')}<br>${t('help.mode2Line')}</p>
    <h3>${t('help.funcs')}</h3>
    <p><kbd>↑</kbd><kbd>↓</kbd> ${t('help.funcOctave')} &nbsp;<kbd>[</kbd><kbd>]</kbd> ${t('help.funcMode')} &nbsp;<kbd>0</kbd>–<kbd>9</kbd> ${t('help.funcTimbre')}</p>
    <h3>${t('help.mouse')}</h3>
    <p>${t('help.mouseLeft')}<br>${t('help.mouseRight')}</p>
    <h3>${t('help.touch')}</h3>
    <p>${t('help.touchLine')}</p>
    <h3>${t('help.timbres')}</h3>
    <table>${rows}</table>
    <p>${t('help.fade')}</p>
  `;
}
function buildMiniKeyboard(){
  const mode=state.keyMode;
  const start=mode==='mode1'?3:4;
  const layout=computeLayout(mode,start);
  const keymap=computeKeymap(mode,start);
  const outer=document.createElement('div');
  outer.style.overflowX='auto';
  outer.style.padding='8px 0 6px';
  const wrap=document.createElement('div');
  wrap.className='kp-mini';
  const W=32,BW=W*.62,H=130;
  wrap.style.width=(layout.whites.length*W)+'px';
  wrap.style.height=H+'px';
  wrap.style.margin='0 auto';
  layout.whites.forEach((w,i)=>{
    const el=document.createElement('div');
    el.className='kp-mini__key kp-mini__key--white';
    el.style.left=(i*W)+'px';el.style.width=W+'px';
    const l=keymap[w.midi];
    if(l&&l.length)el.textContent=l.join('/');
    wrap.appendChild(el);
  });
  layout.blacks.forEach(b=>{
    const el=document.createElement('div');
    el.className='kp-mini__key kp-mini__key--black';
    el.style.left=((b.afterIdx+1)*W-BW/2)+'px';
    el.style.width=BW+'px';
    const l=keymap[b.midi];
    if(l&&l.length)el.textContent=l.join('/');
    wrap.appendChild(el);
  });
  outer.appendChild(wrap);
  return outer;
}

/* ========== Input ========== */
function resolveMidi(code){
  const mode=state.keyMode;
  const base=(state.octaveStart[mode]+1)*12;
  if(mode==='mode1'){
    for(let r=0;r<3;r++){
      const i=ROWS_MODE1[r].codes.indexOf(code);
      if(i>=0)return base+ROWS_MODE1[r].offset+WHITE_SEMIS_8[i];
    }
  }else{
    let i=ROWS_MODE2.whites.codes.indexOf(code);
    if(i>=0)return base+ROWS_MODE2.whites.semis[i];
    i=ROWS_MODE2.blacks.codes.indexOf(code);
    if(i>=0)return base+ROWS_MODE2.blacks.semis[i];
  }
  return null;
}
function handleDragEnter(pointerId,newMidi){
  const s=pointerStates.get(pointerId);
  if(!s)return;
  if(newMidi===s.lastMidi)return;
  if(s.button===2&&!s.dragStarted&&s.anchorTriad){
    s.anchorTriad.forEach(m=>{noteOffSafe(m,getReleaseSecWithFx());addAfterglow(m);});
    s.anchorTriad=null;
  }else{
    noteOffSafe(s.lastMidi,getReleaseSecWithFx());
    addAfterglow(s.lastMidi);
  }
  noteOnSafe(newMidi,.55); /* glissando: medium velocity */
  s.lastMidi=newMidi;
  s.dragStarted=true;
  refreshHighlights();
}

/* ========== Pointer ========== */
pianoEl.addEventListener('pointerdown',e=>{
  if(!engine.ctx)engine.init();
  if(engine.ctx&&engine.ctx.state!=='running')engine.resume();
  if(!engine.ctx)return;
  if(e.pointerType==='mouse'&&e.button!==0&&e.button!==2)return;
  if(pointerStates.has(e.pointerId))return;
  const key=e.target.closest('.kp-key');
  if(!key||!key.dataset.midi)return;
  e.preventDefault();
  try{pianoEl.setPointerCapture(e.pointerId);}catch(err){}
  const midi=Number(key.dataset.midi);
  const isRightClick=(e.pointerType==='mouse'&&e.button===2);
  const vel=velocityTracker.estimatePointer(e);
  velocityTracker.onPointerDown();
  const s={pointerType:e.pointerType,button:isRightClick?2:0,lastMidi:midi,dragStarted:false,anchorTriad:null,velocity:vel};
  if(isRightClick){
    const triad=[midi];
    if(midi-12>=21)triad.push(midi-12);
    if(midi+12<=108)triad.push(midi+12);
    s.anchorTriad=triad;
    triad.forEach(m=>noteOnSafe(m,vel));
  }else{noteOnSafe(midi,vel);}
  pointerStates.set(e.pointerId,s);
  refreshHighlights();
});
pianoEl.addEventListener('pointermove',e=>{
  if(!pointerStates.has(e.pointerId))return;
  const el=document.elementFromPoint(e.clientX,e.clientY);
  if(!el)return;
  const key=el.closest('.kp-key');
  if(!key||!key.dataset.midi)return;
  handleDragEnter(e.pointerId,Number(key.dataset.midi));
});
function releasePointer(e){
  const s=pointerStates.get(e.pointerId);
  if(!s)return;
  velocityTracker.onPointerUp();
  if(s.button===2&&!s.dragStarted&&s.anchorTriad){
    s.anchorTriad.forEach(m=>{noteOffSafe(m,getReleaseSecWithFx());addAfterglow(m);});
  }else{
    noteOffSafe(s.lastMidi,getReleaseSecWithFx());
    addAfterglow(s.lastMidi);
  }
  pointerStates.delete(e.pointerId);
  try{pianoEl.releasePointerCapture(e.pointerId);}catch(err){}
  refreshHighlights();
}
pianoEl.addEventListener('pointerup',releasePointer);
pianoEl.addEventListener('pointercancel',releasePointer);
pianoEl.addEventListener('contextmenu',e=>e.preventDefault());

/* Prevent page/scroll steal while playing keys on touch */
scrollEl.addEventListener('touchmove',e=>{
  if(pointerStates.size>0)e.preventDefault();
},{passive:false});

pianoEl.addEventListener('dragstart',e=>e.preventDefault());

/* ========== Touch fallback ========== */
if(!window.PointerEvent){
  let touchMap=new Map();
  pianoEl.addEventListener('touchstart',e=>{
    e.preventDefault();
    if(!engine.ctx)engine.init();
    if(engine.ctx&&engine.ctx.state!=='running')engine.resume();
    for(const touch of e.changedTouches){
      const el=document.elementFromPoint(touch.clientX,touch.clientY);
      const key=el&&el.closest('.kp-key');
      if(!key||!key.dataset.midi)continue;
      const midi=Number(key.dataset.midi);
      touchMap.set(touch.identifier,midi);
      velocityTracker.onPointerDown();
      noteOnSafe(midi,velocityTracker.estimatePointer({pointerType:'touch'}));
    }
    refreshHighlights();
  },{passive:false});
  pianoEl.addEventListener('touchmove',e=>{
    e.preventDefault();
    for(const touch of e.changedTouches){
      const el=document.elementFromPoint(touch.clientX,touch.clientY);
      const key=el&&el.closest('.kp-key');
      if(!key||!key.dataset.midi)continue;
      const midi=Number(key.dataset.midi);
      const prev=touchMap.get(touch.identifier);
      if(prev===midi)continue;
      if(prev!=null){noteOffSafe(prev,getReleaseSecWithFx());addAfterglow(prev);}
      touchMap.set(touch.identifier,midi);
      noteOnSafe(midi,.55);
    }
    refreshHighlights();
  },{passive:false});
  function endTouch(e){
    for(const touch of e.changedTouches){
      const midi=touchMap.get(touch.identifier);
      if(midi!=null){
        velocityTracker.onPointerUp();
        noteOffSafe(midi,getReleaseSecWithFx());addAfterglow(midi);touchMap.delete(touch.identifier);
      }
    }
    refreshHighlights();
  }
  pianoEl.addEventListener('touchend',endTouch);
  pianoEl.addEventListener('touchcancel',endTouch);
}

/* ========== Keyboard ========== */
function isFunctionKey(code){
  return code==='ArrowUp'||code==='ArrowDown'||code==='Numpad8'||code==='Numpad2'
    ||code==='BracketLeft'||code==='BracketRight'
    ||/^Digit[0-9]$/.test(code)||/^Numpad[0-9]$/.test(code);
}
const overlayEl=document.getElementById('overlay');

document.addEventListener('keydown',async e=>{
  if(e.target.closest('input, textarea, select, [contenteditable]'))return;
  if(e.ctrlKey||e.altKey||e.metaKey)return;
  if(!overlayEl.classList.contains('is-hidden')){
    const code=e.code;
    const playable=(resolveMidi(code)!==null);
    if(playable||code==='Space'||code==='Enter'){
      e.preventDefault();
      try{await engine.resume();}catch(err){}
      overlayEl.classList.add('is-hidden');
      maybeShowIntro();
      return;
    }
  }
  const code=e.code;
  if(isFunctionKey(code)){
    e.preventDefault();
    if(e.repeat)return;
    if(code==='ArrowUp'||code==='Numpad8'){changeOctave(1);return;}
    if(code==='ArrowDown'||code==='Numpad2'){changeOctave(-1);return;}
    if(code==='BracketLeft'){setMode('mode1');return;}
    if(code==='BracketRight'){setMode('mode2');return;}
    applyTimbre(Number(code.slice(-1)));
    return;
  }
  if(!engine.ctx||engine.ctx.state!=='running')return;
  if(e.repeat)return;
  if(heldKeys.has(code))return;
  const midi=resolveMidi(code);
  if(midi===null)return;
  const vel=velocityTracker.estimateKeyboard();
  heldKeys.set(code,{midi,pressedAt:performance.now(),velocity:vel});
  noteOnSafe(midi,vel);
  refreshHighlights();
  e.preventDefault();
});
document.addEventListener('keyup',e=>{
  const entry=heldKeys.get(e.code);
  if(!entry)return;
  heldKeys.delete(e.code);
  const d=(performance.now()-entry.pressedAt)/1000;
  let sec=getReleaseSec();
  if(engine.fxActive)sec*=1.5;
  if(d>1)sec*=2;
  noteOffSafe(entry.midi,sec);
  addAfterglow(entry.midi);
  refreshHighlights();
});

/* ========== Blur / Visibility ========== */
function releaseAllInputs(){
  resetAllNotes(getReleaseSecWithFx());
  heldKeys.clear();
  pointerStates.forEach((_,pid)=>{try{pianoEl.releasePointerCapture(pid);}catch(e){}});
  pointerStates.clear();
  refreshHighlights();
}
window.addEventListener('blur',releaseAllInputs);
document.addEventListener('visibilitychange',()=>{
  if(document.visibilityState==='hidden'){
    releaseAllInputs();
  }else{
    if(engine.ctx&&engine.ctx.state!=='running')engine.resume();
  }
});
['pointerdown','touchstart','click'].forEach(evt=>{
  document.addEventListener(evt,()=>{
    if(engine.ctx&&engine.ctx.state!=='running')engine.resume();
  },{passive:true,capture:true});
});

/* ========== Energy Loop ========== */
function startEnergyLoop(){
  const bgEl=document.querySelector('.kp-bg');
  if(!bgEl)return;
  if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  let last=0;
  function tick(now){
    if(now-last>33){
      last=now;
      if(engine.analyser&&engine.ctx&&engine.ctx.state==='running'){
        engine.analyser.getByteFrequencyData(engine.freqData);
        let sum=0;
        const len=engine.freqData.length;
        for(let i=0;i<len;i++)sum+=engine.freqData[i];
        const avg=sum/(len*255);
        const energy=Math.min(1,avg*2.2);
        bgEl.style.setProperty('--energy',energy.toFixed(3));
      }
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* ========== Share ========== */
async function copyText(text){
  try{
    if(navigator.clipboard&&window.isSecureContext){
      await navigator.clipboard.writeText(text);
      return true;
    }
  }catch(e){}
  try{
    const ta=document.createElement('textarea');
    ta.value=text;ta.style.position='fixed';ta.style.left='-9999px';ta.style.top='0';
    ta.setAttribute('readonly','');
    document.body.appendChild(ta);ta.focus();ta.select();ta.setSelectionRange(0,text.length);
    const ok=document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  }catch(e){return false;}
}
function openInExternalBrowser(){
  const url=location.href;
  const ua=navigator.userAgent;
  const isAndroid=/Android/i.test(ua);
  const isIOS=/iPhone|iPad|iPod/i.test(ua);
  if(isAndroid&&/^https?:/i.test(url)){
    try{
      const u=new URL(url);
      const scheme=u.protocol.replace(':','');
      const intentUrl='intent://'+u.host+u.pathname+u.search+u.hash+
        '#Intent;scheme='+scheme+';action=android.intent.action.VIEW;'+
        'S.browser_fallback_url='+encodeURIComponent(url)+';end';
      window.location.href=intentUrl;return;
    }catch(e){}
  }
  if(isIOS){
    const tip=document.getElementById('shareTip');
    if(tip)tip.textContent=t('share.iosHint');
    return;
  }
  const w=window.open(url,'_blank','noopener');
  if(!w||w.closed||typeof w.closed==='undefined'){
    const tip=document.getElementById('shareTip');
    if(tip)tip.textContent=t('share.manual');
  }
}
function initShareUI(){
  const modalShare=document.getElementById('modalShare');
  const shareUrlInput=document.getElementById('shareUrl');
  const shareTip=document.getElementById('shareTip');
  const btnShare=document.getElementById('btnShare');
  if(!modalShare||!btnShare)return;
  if(!navigator.share){
    const sysBtn=document.getElementById('btnSystemShare');
    if(sysBtn)sysBtn.hidden=true;
  }
  function openShare(){
    if(shareUrlInput)shareUrlInput.value=location.href;
    if(shareTip)shareTip.textContent='';
    modalShare.classList.add('is-open');
    setTimeout(()=>{try{shareUrlInput.focus();shareUrlInput.select();}catch(e){}},120);
  }
  function closeShare(){modalShare.classList.remove('is-open');}
  btnShare.addEventListener('click',openShare);
  document.getElementById('btnShareClose').addEventListener('click',closeShare);
  modalShare.addEventListener('click',e=>{if(e.target===modalShare)closeShare();});
  document.getElementById('btnCopyLink').addEventListener('click',async()=>{
    const ok=await copyText(location.href);
    shareTip.textContent=ok?t('share.copied'):t('share.copyFail');
    if(!ok){try{shareUrlInput.focus();shareUrlInput.select();}catch(e){}}
  });
  document.getElementById('btnOpenBrowser').addEventListener('click',openInExternalBrowser);
  document.getElementById('btnSystemShare').addEventListener('click',async()=>{
    if(navigator.share){
      try{
        await navigator.share({title:document.title,text:t('overlay.desc'),url:location.href});
        return;
      }catch(e){if(e&&e.name==='AbortError')return;}
    }
    const ok=await copyText(location.href);
    shareTip.textContent=ok?t('share.copied'):t('share.copyFail');
  });
}

/* ========== First-run Intro ========== */
function maybeShowIntro(){
  if(state.introSeen)return;
  const intro=document.getElementById('introOverlay');
  if(!intro)return;
  intro.classList.remove('is-hidden');
  intro.classList.add('is-open');
}
function hideIntro(){
  const intro=document.getElementById('introOverlay');
  if(!intro)return;
  intro.classList.add('is-hidden');
  intro.classList.remove('is-open');
  state.introSeen=true;
  save('introSeen','true');
}

/* ========== UI Wiring ========== */
const btnStart=document.getElementById('btnStart');
btnStart.addEventListener('click',()=>{
  if(IS_MOBILE&&state.gyroEnabled&&typeof DeviceOrientationEvent!=='undefined'
    &&typeof DeviceOrientationEvent.requestPermission==='function'){
    DeviceOrientationEvent.requestPermission().then(r=>{
      gyroPermission=r;
      if(r==='granted'){startGyroListener();applyOrientation();}
    }).catch(()=>{gyroPermission='denied';});
  }else if(IS_MOBILE&&typeof DeviceOrientationEvent!=='undefined'){
    gyroPermission='granted';
    if(state.gyroEnabled)startGyroListener();
  }
  engine.resume().then(()=>{
    overlayEl.classList.add('is-hidden');
    applyOrientation();
    maybeShowIntro();
  }).catch(()=>{
    overlayEl.classList.add('is-hidden');
    maybeShowIntro();
  });
});
document.getElementById('btnIntroStart').addEventListener('click',hideIntro);

const drawer=document.getElementById('drawer');
const scrim=document.getElementById('scrim');
function openDrawer(){drawer.classList.add('is-open');scrim.classList.add('is-open');}
function closeDrawer(){drawer.classList.remove('is-open');scrim.classList.remove('is-open');}
document.getElementById('btnSettings').addEventListener('click',openDrawer);
document.getElementById('btnDrawerClose').addEventListener('click',closeDrawer);
scrim.addEventListener('click',closeDrawer);

const modal=document.getElementById('modalHelp');
document.getElementById('btnHelp').addEventListener('click',()=>{
  helpTab='text';renderHelp();modal.classList.add('is-open');
});
document.getElementById('btnHelpClose').addEventListener('click',()=>modal.classList.remove('is-open'));
modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('is-open');});
document.querySelectorAll('.kp-modal__tab').forEach(tb=>tb.addEventListener('click',()=>{helpTab=tb.dataset.tab;renderHelp();}));

document.addEventListener('keydown',e=>{
  if(e.key!=='Escape')return;
  const intro=document.getElementById('introOverlay');
  if(intro&&!intro.classList.contains('is-hidden')){hideIntro();return;}
  const shareModal=document.getElementById('modalShare');
  if(shareModal&&shareModal.classList.contains('is-open')){shareModal.classList.remove('is-open');return;}
  if(modal.classList.contains('is-open')){modal.classList.remove('is-open');return;}
  if(drawer.classList.contains('is-open')){closeDrawer();return;}
});

/* Chips */
const chipTimbreEl=document.getElementById('chipTimbre');
chipTimbreEl.addEventListener('contextmenu',e=>e.preventDefault());
chipTimbreEl.addEventListener('pointerup',e=>{
  if(e.pointerType==='mouse'&&e.button===2)applyTimbre((state.timbre+TIMBRE_COUNT-1)%TIMBRE_COUNT);
  else if(e.pointerType==='mouse'&&e.button===0)applyTimbre((state.timbre+1)%TIMBRE_COUNT);
  else if(e.pointerType==='touch'||e.pointerType==='pen')applyTimbre((state.timbre+1)%TIMBRE_COUNT);
});
chipTimbreEl.addEventListener('keydown',e=>{
  if(e.key==='Enter'||e.key===' '){e.preventDefault();applyTimbre((state.timbre+1)%TIMBRE_COUNT);}
});
const chipModeEl=document.getElementById('chipMode');
chipModeEl.addEventListener('contextmenu',e=>e.preventDefault());
chipModeEl.addEventListener('pointerup',e=>{
  const isMR=(e.pointerType==='mouse'&&e.button===2);
  const isML=(e.pointerType==='mouse'&&e.button===0);
  const isT=(e.pointerType==='touch'||e.pointerType==='pen');
  if(isMR||isML||isT)setMode(state.keyMode==='mode1'?'mode2':'mode1');
});
chipModeEl.addEventListener('keydown',e=>{
  if(e.key==='Enter'||e.key===' '){e.preventDefault();setMode(state.keyMode==='mode1'?'mode2':'mode1');}
});

/* Volume */
const setVolume=document.getElementById('setVolume');
setVolume.value=state.masterVolume;
document.getElementById('valVolume').textContent=state.masterVolume+'%';
setVolume.addEventListener('input',()=>{
  state.masterVolume=Number(setVolume.value);
  save('masterVolume',state.masterVolume);
  document.getElementById('valVolume').textContent=state.masterVolume+'%';
  engine.setVolume(state.masterVolume/100);
});

/* Series */
document.querySelectorAll('#setSeries button').forEach(b=>{
  b.addEventListener('click',()=>{
    if(state.series===b.dataset.series)return;
    resetAllNotes(.05);heldKeys.clear();pointerStates.clear();
    refreshHighlights();
    state.series=b.dataset.series;
    save('series',state.series);
    updateSeriesSeg();
    updateChips();
  });
});
document.getElementById('setTimbre').addEventListener('change',e=>applyTimbre(Number(e.target.value)));
document.querySelectorAll('#setMode button').forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.mode)));

/* Fade */
const setFade=document.getElementById('setFade');
setFade.value=state.fadeTime;
document.getElementById('valFade').textContent=state.fadeTime.toFixed(1)+' s';
setFade.addEventListener('input',()=>{
  state.fadeTime=Number(setFade.value);
  save('fadeTime',state.fadeTime);
  document.getElementById('valFade').textContent=state.fadeTime.toFixed(1)+' s';
});

/* Ambient + Reverb */
document.querySelectorAll('#setAmbient button').forEach(b=>{
  b.addEventListener('click',()=>{
    const on=b.dataset.ambient==='on';
    if(state.ambient===on)return;
    state.ambient=on;save('ambient',on);
    updateAmbientSeg();
    engine.setFx();
    document.getElementById('fieldReverb').hidden=!on;
  });
});
const setReverb=document.getElementById('setReverb');
setReverb.value=state.reverb;
document.getElementById('valReverb').textContent=state.reverb+'%';
setReverb.addEventListener('input',()=>{
  state.reverb=Number(setReverb.value);
  save('reverb',state.reverb);
  document.getElementById('valReverb').textContent=state.reverb+'%';
  engine.setFx();
});

/* Metronome */
document.querySelectorAll('#setMetronome button').forEach(b=>{
  b.addEventListener('click',async()=>{
    const on=b.dataset.metro==='on';
    if(state.metronomeOn===on)return;
    state.metronomeOn=on;save('metronomeOn',on);
    if(on){
      await engine.resume();
      if(!metronome.start()){
        state.metronomeOn=false;save('metronomeOn',false);
      }
    }else{
      metronome.stop();
    }
    updateMetronomeUI();
  });
});
const setBpm=document.getElementById('setBpm');
setBpm.value=state.bpm;
document.getElementById('valBpm').textContent=state.bpm;
setBpm.addEventListener('input',()=>{
  state.bpm=Number(setBpm.value);
  save('bpm',state.bpm);
  document.getElementById('valBpm').textContent=state.bpm;
  updateMetronomeUI();
});
document.querySelectorAll('#setBeats button').forEach(b=>{
  b.addEventListener('click',()=>{
    state.beatsPerBar=Number(b.dataset.beats);
    save('beatsPerBar',state.beatsPerBar);
    updateMetronomeUI();
  });
});

/* Recording */
document.getElementById('btnRec').addEventListener('click',()=>{
  if(recorder.recording)recorder.stop();
  else{engine.resume();recorder.start();}
});
document.getElementById('btnRecStart').addEventListener('click',async()=>{
  if(recorder.recording){recorder.stop();return;}
  await engine.resume();
  recorder.start();
});
document.getElementById('btnRecPlay').addEventListener('click',async()=>{
  if(recorder.playing){recorder.stopPlay();return;}
  await engine.resume();
  recorder.play();
});
document.getElementById('btnRecStop').addEventListener('click',()=>{
  recorder.stopPlay();
});
document.getElementById('btnRecClear').addEventListener('click',()=>{
  recorder.clear();
  flashRecFeedback(t('rec.cleared'));
});
document.getElementById('btnRecExport').addEventListener('click',()=>{
  if(recorder.events.length===0)return;
  const blob=new Blob([recorder.export()],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;a.download='kpiano-rec-'+Date.now()+'.json';
  document.body.appendChild(a);a.click();
  setTimeout(()=>{URL.revokeObjectURL(url);a.remove();},100);
  flashRecFeedback(t('rec.exported'));
});
document.getElementById('btnRecImport').addEventListener('click',()=>{
  document.getElementById('recFileInput').click();
});
document.getElementById('recFileInput').addEventListener('change',e=>{
  const file=e.target.files[0];
  if(!file)return;
  const reader=new FileReader();
  reader.onload=ev=>{
    const n=recorder.import(ev.target.result);
    if(n<0){flashRecFeedback(t('rec.importFail'));}
    else flashRecFeedback(t('rec.imported',{n}));
  };
  reader.readAsText(file);
  e.target.value='';
});

/* Demo */
document.getElementById('btnDemoPlay').addEventListener('click',async()=>{
  const id=document.getElementById('setDemo').value;
  if(!id)return;
  await engine.resume();
  demoPlayer.play(id);
});
document.getElementById('btnDemoStop').addEventListener('click',()=>demoPlayer.stop());

/* Haptics */
document.querySelectorAll('#setHaptics button').forEach(b=>{
  b.addEventListener('click',()=>{
    const on=b.dataset.haptics==='on';
    if(state.haptics===on)return;
    state.haptics=on;
    save('haptics',on);
    updateHapticsSeg();
    if(on)haptic(20);
  });
});

/* Orientation / Gyro */
document.querySelectorAll('#setOrientation button').forEach(b=>{
  b.addEventListener('click',()=>{
    if(state.orientationMode===b.dataset.orient)return;
    state.orientationMode=b.dataset.orient;
    save('orientationMode',state.orientationMode);
    updateOrientationSeg();
    _rotateHintDismissed=false;
    applyOrientation();
  });
});
document.querySelectorAll('#setGyro button').forEach(b=>{
  b.addEventListener('click',async()=>{
    const on=b.dataset.gyro==='on';
    if(state.gyroEnabled===on)return;
    state.gyroEnabled=on;
    save('gyroEnabled',on);
    updateGyroSeg();
    if(on&&IS_MOBILE){
      await requestGyroPermission();
      applyOrientation();
    }else{
      gyroLandscape=false;
      applyOrientation();
    }
  });
});

/* Rotate hint close */
const btnRotateHintClose=document.getElementById('btnRotateHintClose');
if(btnRotateHintClose){
  btnRotateHintClose.addEventListener('click',e=>{
    e.stopPropagation();
    _rotateHintDismissed=true;
    document.getElementById('rotateHint').classList.remove('is-visible');
  });
}
const rotateHintEl=document.getElementById('rotateHint');
if(rotateHintEl){
  rotateHintEl.addEventListener('click',()=>{
    _rotateHintDismissed=true;
    rotateHintEl.classList.remove('is-visible');
  });
}

/* Language */
function updateLangSeg(){document.querySelectorAll('#setLang button').forEach(b=>b.classList.toggle('is-active',b.dataset.lang===state.locale));}
document.querySelectorAll('#setLang button').forEach(b=>{
  b.addEventListener('click',()=>{
    state.locale=b.dataset.lang;save('locale',state.locale);
    updateLangSeg();applyI18n();
    updateStatsLabel();
    updateMetronomeUI();
    updateRecUI();
  });
});

/* Theme (smooth) */
const setTheme=document.getElementById('setTheme');
setTheme.value=state.theme;
setTheme.addEventListener('change',e=>{
  state.theme=e.target.value;
  save('theme',state.theme);
  const bg=document.getElementById('bgEl');
  if(bg){
    bg.classList.add('is-switching');
    setTimeout(()=>{
      document.documentElement.dataset.theme=state.theme;
      requestAnimationFrame(()=>{
        setTimeout(()=>bg.classList.remove('is-switching'),60);
      });
    },120);
  }else{
    document.documentElement.dataset.theme=state.theme;
  }
});

/* Hints */
document.querySelectorAll('#setHints button').forEach(b=>{
  b.addEventListener('click',()=>{
    if(state.keyHintMode===b.dataset.hints)return;
    state.keyHintMode=b.dataset.hints;
    save('keyHintMode',state.keyHintMode);
    updateHintsSeg();
    renderPiano();
  });
});

/* Shake */
document.querySelectorAll('#setShake button').forEach(b=>{
  b.addEventListener('click',()=>{
    state.shakeIntensity=Number(b.dataset.shake);
    save('shakeIntensity',state.shakeIntensity);
    updateShakeSeg();
  });
});

/* ========== Boot ========== */
function boot(){
  document.documentElement.dataset.theme=state.theme;
  document.getElementById('fieldShake').hidden=!state.shakeUnlocked;
  document.getElementById('fieldReverb').hidden=!state.ambient;
  const sectionDevice=document.getElementById('sectionDevice');
  if(IS_MOBILE){
    document.getElementById('fieldOrientation').hidden=false;
    document.getElementById('fieldGyro').hidden=false;
    document.getElementById('fieldHaptics').hidden=false;
    if(sectionDevice)sectionDevice.hidden=false;
  }else if(sectionDevice){
    sectionDevice.hidden=true;
  }
  engine.fxActive=state.ambient;
  updateLangSeg();
  updateModeSeg();
  updateSeriesSeg();
  updateHintsSeg();
  updateShakeSeg();
  updateAmbientSeg();
  updateOrientationSeg();
  updateGyroSeg();
  updateHapticsSeg();
  updateMetronomeUI();
  updateRecUI();
  initBgParticles();
  initShareUI();
  applyI18n();
  startEnergyLoop();
  engine.setVolume(state.masterVolume/100);
  if(IS_MOBILE){
    if(screen.orientation&&screen.orientation.addEventListener){
      screen.orientation.addEventListener('change',scheduleOrientationUpdate);
    }
    window.addEventListener('orientationchange',scheduleOrientationUpdate);
    window.addEventListener('resize',scheduleOrientationUpdate);
    if(window.visualViewport){
      window.visualViewport.addEventListener('resize',()=>{
        clearTimeout(window.__vt);
        window.__vt=setTimeout(renderPiano,150);
      });
    }
    applyOrientation();
  }else{
    window.addEventListener('resize',()=>{
      clearTimeout(window.__rt);
      window.__rt=setTimeout(renderPiano,120);
    });
  }
  requestAnimationFrame(()=>renderPiano());
  updateStatsLabel();
}
boot();
