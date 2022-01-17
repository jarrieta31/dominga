import { Pipe, PipeTransform } from '@angular/core';
import { Eventos } from '../eventos';

@Pipe({
  name: 'filterEvents1'
})
export class FilterEvents1Pipe implements PipeTransform {

  transform(eventos: Eventos[], dataform: any): Eventos[] {
  
    if ( dataform.length === 0 ) {
      return eventos;
    }

    if ( dataform.localidad !== null )  dataform.localidad = dataform.localidad.toLowerCase();
    else dataform.localidad = "";
    
    if ( dataform.tipo !== null )  dataform.tipo = dataform.tipo.toLowerCase();
    else dataform.tipo = "";

    if ( dataform.moneda === null || dataform.moneda === undefined  )  dataform.moneda = "";

    if ( dataform.precio === null || dataform.precio < 0 || dataform.precio === undefined )   dataform.precio = 0;
    console.log(dataform);
    

    return eventos.filter((ev) => {

      console.log(ev);
      
      return(
            ev.tipo.toLowerCase().includes( dataform.tipo)  
        &&  ev.localidad.toLowerCase().includes( dataform.localidad) 
        // && ev.moneda.toLowerCase().includes( dataform.moneda  ) 
        
    )
  });
    

  }  

  /**Aplica los filtros de localidad, moneda, tipo.*/
  filtrosEventos(  eventos: Eventos[], filtro?: any[] ): Eventos[]{
    filtro.forEach(e => console.log(e))
    
    return eventos.filter((ev) => {
        return(
          ev.tipo.toLowerCase().includes(filtro['tipo']) &&
          ev.localidad.toLowerCase().includes(filtro['loc']) &&
          ev.moneda.toLowerCase().includes(filtro['moneda']) 
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
