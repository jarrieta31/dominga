import { Pipe, PipeTransform } from '@angular/core';
import { DondeDomrir } from '../donde-dormir';

@Pipe({
  name: 'filtroMasOpciones'
})
export class FiltroMasOpcionesPipe implements PipeTransform {

  transform(Opciones: DondeDomrir[], texto: string): DondeDomrir[] {
    
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
