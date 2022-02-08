import { Component, OnInit, Input } from '@angular/core';
import { timeStamp } from 'console';
import { Subscription } from 'rxjs';
import { PlaceService } from 'src/app/services/database/place.service';
import { TextToSpeechService } from 'src/app/services/text-to-speech.service';
import { TipoSputtr } from 'src/app/shared/tipo-sputtr';

@Component({
  selector: 'app-text-to-speech',
  templateUrl: './text-to-speech.component.html',
  styleUrls: ['./text-to-speech.component.scss'],
})

export class TextToSpeechComponent implements OnInit {

  @Input() descripcion: string = "";

  speaking : boolean = false;
  paused   : boolean = false;
  escuchar : boolean = false;
  onendsuscription : Subscription;
  vr : string[] = ['1', '1.5', '2']; //representa las velocidades de reproduccion
  spUttData : TipoSputtr = {
      rate   : '1.6', //  Velocidad de Reproduccion: Rango 0.1 - 10, xDefecto 1
      text   : '', // Texto a convertir a audio
  }

  constructor(
    private ttsSvc  : TextToSpeechService,
) {}


  ngOnInit() {}

  pausarReproduccion()   {this.ttsSvc.pausar();  }
  reanudarReproduccion() {this.ttsSvc.reanudar();}
  detenerReproduccion()  {this.ttsSvc.detener()  }
/**Elimina los caracteres raros del texto que viene de la DB */
limpiarTexto( text : string) : string{
  let _txt : string;
  _txt = text.replace(/<[^>]*>?/g, '');
  return _txt;
}
/**Toma el texto de la descripcion y se lo pasa al servicio para que pase a audio */
reproducirDescripcion( texto : string ){
    this.spUttData.text = this.limpiarTexto( texto );
/*se suscribe al observable onend$ que emite un valor cuando es invocado por el
  evento onend(). ver SpeechSyntesis*/  
    this.onEndSuscription();
    this.ttsSvc.reproducir(this.spUttData);
}
/**
 * Se suscribe al observable onend$
 * @returns Boolean 
 * retorna el valor de Subscription.closed 
 */
onEndSuscription(){
  this.onendsuscription = this.ttsSvc.onend$.subscribe((onend:boolean) => {
    if(!onend){
      this.speaking = onend;
      this.paused   = onend;
      this.eliminarSuscripcion();
    }
  }, error => { console.error(`ttsComponent::onEnSuscirption::hubo un error en la suscripcion: ${error}`);
  }, complete => {
    console.log(complete)
    return this.onendsuscription.closed;
  })
}
/**Elimina la suscripcion al observable onend$ una vez que finaliza la 
 * reproduccion de un audio */
eliminarSuscripcion(){
  if(!this.onendsuscription.closed) this.onendsuscription.unsubscribe();
}
/**Cambia la velocidad de reproduccion
 * Al momento la funcionalidad tiene velociadad por defecto
 */
velocidadReproduccion( v : string ){
    let largo = this.vr.length;
    let idx = this.vr.indexOf(v);
    if(idx === largo-1)
        this.spUttData.rate = this.vr[0];
    else this.spUttData.rate = this.vr[idx+1];
}

}
