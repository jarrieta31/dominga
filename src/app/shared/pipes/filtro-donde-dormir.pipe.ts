import { Pipe, PipeTransform } from '@angular/core';
import { DondeDormir } from '../../shared/donde-dormir';

@Pipe({
  name: 'filtroDondeDormir'
})
export class FiltroDondeDormirPipe implements PipeTransform {

  transform(dondeDormir: DondeDormir[], texto: string): DondeDormir[] {

  	if(texto.length === 0){
    	return dondeDormir;
  	}

    texto = texto.toLowerCase();

  	return dondeDormir.filter( item => {
  		return item.nombre.toLowerCase().includes(texto)
  		|| item.direccion.toLowerCase().includes(texto)
  		|| item.telefono.toLowerCase().includes(texto);
  	})
  }
}
