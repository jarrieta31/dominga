import { Injectable } from '@angular/core';
import { TipoSputtr } from '../shared/tipo-sputtr';

@Injectable({
  providedIn: 'root'
})
export class TextToSpeechService  {

  vozSeleccionada : any;
  spSynt : SpeechSynthesis = window.speechSynthesis;
  spUttr : SpeechSynthesisUtterance;
  textoxDefecto : 'Usted esta en la aplicacion Domingo!, de casa dominga';
  velocidadReproduccion : Object[] = [
    { '1'      : 1.2 },
    { '1.5'    : 1.5 },
    { '2'      : 2   },
  ]
  tvoz : SpeechSynthesisVoice = {
    default      : false,// true si es la voz por defecto 
    localService : false,// true si es la voz local por defecto
    lang         : '',   // identificador
    name         : '',   // nombre de la voz
    voiceURI     : '',   // ?
  }

  tSpUtt : TipoSputtr = {
    rate   : '1', //  Velocidad de Reproduccion: Rango 0.1 - 10, xDefecto 1
    text   : '1', // Texto a convertir a audio
  }

  constructor() {
    this.cargar();
  }

  cargar(){
    this.spUttr = new SpeechSynthesisUtterance(this.textoxDefecto);
    this.spUttr.voice = this.vozEspanol;
  }

  get vozEspanol(){
    let voces = this.spSynt.getVoices();
    let voz : SpeechSynthesisVoice;
    voces.forEach((v) => {
      if(v.lang == 'es-Es' || v.lang == 'es-419')
        voz = v;
    })
    return voz;
  }

/**
 * 
 * @param spData 
 *  speak: sintetiza una declaración, generando la voz correspondiente.  
    pause: detiene temporalmente la voz sintética que esté en marcha.
    resume: reanuda la síntesis de voz previamente pausada.
    cancel: cancela el habla y además elimina cualquier declaración que haya todavía en cola para ser sintetizada.
 */
  

  reproducir( spUttrData : TipoSputtr ){
    this.spUttr.rate = this.velocidad( spUttrData.rate );
    this.spUttr.text = spUttrData.text;
    this.spSynt.speak(this.spUttr);
  }
  
  pausar(){this.spSynt.pause();}
  
  reanudar(){this.spSynt.resume();}
  
  detener(){this.spSynt.cancel();}
  
  pausado(){ return this.spSynt.paused; }

  reproduciendo(){ return this.spSynt.speaking; }

  velocidad( v : string ){
    switch (v) {
      case '1'  : return 1.2;
      case '1.5': return 1.5;
      case '2'  : return 2  ;
        
      default: return 1;
    }
  }
}
