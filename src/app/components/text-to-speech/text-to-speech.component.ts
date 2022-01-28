import { Component, OnInit, Input } from '@angular/core';
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
  vr : string[] = ['1', '1.5', '2']; //representa las velocidades de reproduccion
  spUttData : TipoSputtr = {
      rate   : '1.6', //  Velocidad de Reproduccion: Rango 0.1 - 10, xDefecto 1
      text   : '', // Texto a convertir a audio
  }

  constructor(
    private ttsSvc  : TextToSpeechService,
) {}


  ngOnInit() {}

  pausarReproduccion(){this.ttsSvc.pausar();
    console.log(`estoy pausando`);
    
}
reanudarReproduccion(){this.ttsSvc.reanudar();
    console.log(`estoy reanudando`);
    
}
detenerReproduccion(){this.ttsSvc.detener()
    console.log(`estoy cancelando`);
    
}

limpiarTexto( text : string) : string{
  let _txt : string;
  _txt = text.replace(/<[^>]*>?/g, '');
  return _txt;
}

reproducirDescripcion( texto : string ){
    this.spUttData.text = this.limpiarTexto( texto );
    this.ttsSvc.reproducir(this.spUttData);
}

velocidadReproduccion( v : string ){
    let largo = this.vr.length;
    let idx = this.vr.indexOf(v);
    if(idx === largo-1)
        this.spUttData.rate = this.vr[0];
    else this.spUttData.rate = this.vr[idx+1];
}

}
