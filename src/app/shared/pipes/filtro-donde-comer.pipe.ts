import { Pipe, PipeTransform } from '@angular/core';
import { DondeComer } from '../../shared/donde-comer';

@Pipe({
  name: 'filtroDondeComer'
})
export class FiltroDondeComerPipe implements PipeTransform {

  transform(dondeComer: DondeComer[], texto: string): DondeComer[] {
    
    if(texto.length === 0){
    	return dondeComer;
    }

    texto = texto.toLowerCase();

    return dondeComer.filter( item => {
    	return item.nombre.toLowerCase().includes(texto)
    	|| item.direccion.toLowerCase().includes(texto)
    	|| item.telefonos.numero.toLowerCase().includes(texto)
    })
  }

}
