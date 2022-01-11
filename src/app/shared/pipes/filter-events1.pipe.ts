import { Pipe, PipeTransform } from '@angular/core';
import { Eventos } from '../eventos';

@Pipe({
  name: 'filterEvents1'
})
export class FilterEvents1Pipe implements PipeTransform {

  transform(eventos: Eventos[], dataform: any): Eventos[] {
    console.log(dataform);
  
    if ( dataform.length === 0 ) {
      return eventos;
    }

    if ( dataform.tipo === undefined || dataform.tipo === null ) dataform.tipo = "all";
    if ( dataform.localidad === undefined || dataform.localidad === null ) dataform.localidad = "all";

    /**se asume que los valores siempre van a ser string, ya sea vacio "" o con datos */
    let tipo = dataform.tipo.toLowerCase();
    let loc = dataform.localidad.toLowerCase();
    if( tipo === "" ) tipo = "all";
    if( loc === "" ) loc = "all";
    /**No aplica filtros  */
      if (tipo === "all" && loc === "all" ) {
      return eventos;
    }
    /**Filtra solo por tipo */
    if (tipo != "all" && tipo != "all" && loc === "all" || loc === "all" ) {
      return eventos.filter((ev) => {
        return(
          ev.tipo.toLowerCase().includes(tipo)
        )
      })  
    }
    /**Filtra solo por localidad */
    if (loc != "all" && loc != "all" && tipo === "all" || tipo === "all" ) {
      return eventos.filter((ev) => {
        return(
          ev.localidad.toLowerCase().includes(loc)
        )
      })  
    }

  }

}
