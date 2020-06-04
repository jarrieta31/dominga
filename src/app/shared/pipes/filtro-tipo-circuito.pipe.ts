import { Pipe, PipeTransform } from '@angular/core';
import { Place } from '../../shared/place';

@Pipe({
  name: 'filtroTipoCircuito'
})
export class FiltroTipoCircuitoPipe implements PipeTransform {

  transform(tipoCircuito: Place[], texto: string): Place[] {
    
    if( texto.length === 0){
    	return tipoCircuito;
    }

    texto = texto.toLowerCase();

    return tipoCircuito.filter( item => {
    	return item.nombre.toLowerCase().includes( texto) 
    })
  }

}
