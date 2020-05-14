import { Pipe, PipeTransform } from '@angular/core';
import { DondeDormir } from '../donde-dormir';

@Pipe({
  name: 'filtroMasOpciones'
})
export class FiltroMasOpcionesPipe implements PipeTransform {

  transform(Opciones: DondeDormir[], texto: string): DondeDormir[] {
    
    if(texto.length === 0){
    	return Opciones;
    }

    texto = texto.toLowerCase();

    return Opciones.filter( item => {
    	return item.nombre.toLowerCase().includes( texto )
    	|| item.telefono.toLowerCase().includes( texto )
    	|| item.direccion.toLowerCase().includes( texto )
    })
  }

}
