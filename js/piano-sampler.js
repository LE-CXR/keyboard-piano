/* Sampled acoustic grand (midi-js-soundfonts MusyngKite). CC-friendly CDN. */
(function(global){
  const NOTE_NAMES=['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'];
  const BASES=[
    'https://cdn.jsdelivr.net/gh/gleitz/midi-js-soundfonts@gh-pages/MusyngKite/acoustic_grand_piano-mp3/',
    'https://gleitz.github.io/midi-js-soundfonts/MusyngKite/acoustic_grand_piano-mp3/'
  ];
  const MIDI_MIN=21,MIDI_MAX=108;

  function midiToName(midi){
    const n=Math.max(MIDI_MIN,Math.min(MIDI_MAX,midi|0));
    return NOTE_NAMES[n%12]+(Math.floor(n/12)-1);
  }

  class PianoSampler{
    constructor(){
      this.ctx=null;
      this.buffers=new Map();
      this.loading=new Map();
      this.ready=false;
      this.failed=false;
      this._prefetching=false;
      this.base=BASES[0];
    }
    attach(ctx){this.ctx=ctx;}
    urlFor(midi){return this.base+midiToName(midi)+'.mp3';}
    async loadOne(midi){
      const key=midi|0;
      if(this.buffers.has(key))return this.buffers.get(key);
      if(this.loading.has(key))return this.loading.get(key);
      if(!this.ctx)return null;
      const p=(async()=>{
        let lastErr=null;
        for(const base of BASES){
          try{
            const res=await fetch(base+midiToName(key)+'.mp3',{mode:'cors'});
            if(!res.ok)throw new Error('HTTP '+res.status);
            const ab=await res.arrayBuffer();
            const buf=await this.ctx.decodeAudioData(ab.slice(0));
            this.buffers.set(key,buf);
            this.base=base;
            this.ready=true;
            return buf;
          }catch(e){lastErr=e;}
        }
        this.failed=true;
        throw lastErr||new Error('sample fail');
      })();
      this.loading.set(key,p);
      try{return await p;}finally{this.loading.delete(key);}
    }
    prefetchRange(lo,hi){
      if(!this.ctx||this._prefetching)return;
      this._prefetching=true;
      const jobs=[];
      for(let m=lo;m<=hi;m++){
        if(!this.buffers.has(m))jobs.push(this.loadOne(m).catch(()=>null));
      }
      Promise.all(jobs).finally(()=>{this._prefetching=false;});
    }
    has(midi){return this.buffers.has(midi|0);}
  }

  class SampleVoice{
    constructor(engine,midi,buffer,velocity){
      this.engine=engine;this.ctx=engine.ctx;
      this.midi=midi;this.buffer=buffer;
      this.velocity=Math.max(.15,Math.min(1,Number(velocity)||.75));
      this.peak=.55*this.velocity;
      this.state='idle';this._disposeTimer=null;
      this.src=null;this.voiceGain=null;this.panNode=null;
      this._startTime=0;this._attackEnd=0;this._sustainStart=0;this._sustainVal=this.peak;
      this._build();
    }
    _build(){
      const ctx=this.ctx;
      this.voiceGain=ctx.createGain();
      this.voiceGain.gain.value=0.0001;
      let out=this.voiceGain;
      if(typeof ctx.createStereoPanner==='function'){
        this.panNode=ctx.createStereoPanner();
        this.panNode.pan.value=Math.max(-.35,Math.min(.35,((this.midi-60)/48)*.35));
        this.voiceGain.connect(this.panNode);
        out=this.panNode;
      }
      out.connect(this.engine.dryGain);
      out.connect(this.engine.wetInput);
      this.src=ctx.createBufferSource();
      this.src.buffer=this.buffer;
      this.src.connect(this.voiceGain);
    }
    start(when){
      if(this.state!=='idle')return;
      const attack=0.004;
      const g=this.voiceGain.gain;
      g.cancelScheduledValues(when);
      g.setValueAtTime(0.0001,when);
      g.linearRampToValueAtTime(this.peak,when+attack);
      try{this.src.start(when);}catch(e){}
      this.state='sustain';
      this._startTime=when;this._attackEnd=when+attack;
      this._sustainStart=when+attack;this._sustainVal=this.peak;
      const dur=this.buffer.duration||2;
      this.src.onended=()=>{if(this.state!=='disposed')this.dispose();};
      /* safety dispose after buffer + tail */
      clearTimeout(this._disposeTimer);
      this._disposeTimer=setTimeout(()=>this.dispose(),(dur+1)*1000);
    }
    release(when,sec){
      if(this.state==='disposed'||this.state==='released')return;
      const g=this.voiceGain.gain;
      let cur=this.peak;
      try{
        /* approximate current gain */
        if(when<this._attackEnd){
          const span=Math.max(.001,this._attackEnd-this._startTime);
          cur=Math.max(this.peak*((when-this._startTime)/span),0.0001);
        }else cur=Math.max(this._sustainVal,0.0001);
      }catch(e){}
      g.cancelScheduledValues(when);
      g.setValueAtTime(cur,when);
      const s=Math.max(sec,.04);
      g.exponentialRampToValueAtTime(0.0001,when+s);
      this.state='released';
      clearTimeout(this._disposeTimer);
      this._disposeTimer=setTimeout(()=>this.dispose(),Math.max(0,(when+s-this.ctx.currentTime)*1000)+80);
    }
    stop(when){this.release(when,.02);}
    dispose(){
      if(this.state==='disposed')return;
      this.state='disposed';
      clearTimeout(this._disposeTimer);
      try{
        this.src.onended=null;
        try{this.src.stop();}catch(e){}
        this.src.disconnect();
        if(this.panNode)this.panNode.disconnect();
        this.voiceGain.disconnect();
      }catch(e){}
    }
  }

  global.PianoSampler=PianoSampler;
  global.SampleVoice=SampleVoice;
  global.pianoSampler=new PianoSampler();
})(typeof window!=='undefined'?window:globalThis);
