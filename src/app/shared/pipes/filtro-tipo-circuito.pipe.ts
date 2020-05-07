import { Pipe, PipeTransform } from '@angular/core';
import { TipoCircuito } from '../../shared/tipo-circuito';

@Pipe({
  name: 'filtroTipoCircuito'
})
export class FiltroTipoCircuitoPipe implements PipeTransform {

  transform(tipoCircuito: TipoCircuito[], texto: string): TipoCircuito[] {
    
    if( texto.length === 0){
    	return tipoCircuito;
    }

    texto = texto.toLowerCase();

    return tipoCircuito.filter( item => {
    	return item.nombre.toLowerCase().includes( texto) 
    	|| item.duracion.toLowerCase().includes( texto );
    })
  }

}
