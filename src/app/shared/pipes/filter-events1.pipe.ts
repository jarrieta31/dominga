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
    if ( dataform.precio === undefined || dataform.precio === null || dataform.precio < 0) dataform.precio = 0;
    if ( dataform.moneda === undefined || dataform.moneda === null ) dataform.moneda = "all";

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
    if (tipo != "all" && tipo != "all" && loc === "all" || loc === "all" ) this.filtroxTipo(eventos, tipo);
    /**Filtra solo por localidad */
    if (loc != "all" && loc != "all" && tipo === "all" || tipo === "all" ) this.filtroxTipo(eventos, loc);
      
    }
    
  
   /**Filtra solo por tipo */
  filtroxTipo( eventos: Eventos[] , tipo: string ): Eventos[]{
    return eventos.filter((ev) => {
      return(
        ev.tipo.toLowerCase().includes(tipo)
      )
    })  
  }
  
  /**Filtra solo por localidad */
  filtroxLocalidad( eventos: Eventos[] , loc: string ): Eventos[]{
  return eventos.filter((ev) => {
    return(
      ev.localidad.toLowerCase().includes(loc)
      )
    })  
  }
  /**Filtro por rango de precio. */
  filtroxPrecio( eventos: Eventos[], precioMax: number, precioMin: number ){
    return eventos.filter(ev => ev.precio < precioMax && ev.precio > precioMin);
  }
  /**Ordena por precio de Max a Min */
  ordenarxPrecioDsc( eventos: Eventos[] ){
    return eventos.sort(( a, b ) => {
      if( a > b ) return  1;
      if( a = b ) return  0;
      if( a < b ) return -1;
    })

  }
  /**Ordena por precio de Min a Max */
  ordenarxPrecioAsc( eventos: Eventos[] ){
    return eventos.sort(( a, b ) => {
      if( a < b ) return  1;
      if( a = b ) return  0;
      if( a > b ) return -1;
    })
  }
}
