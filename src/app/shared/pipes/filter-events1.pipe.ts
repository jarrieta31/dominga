import { Pipe, PipeTransform } from '@angular/core';
import { Eventos } from '../eventos';
import { format, parseISO } from 'date-fns';

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
/**Filtro por tipo de moneda es descartado por el cliente. Para que funcione descomentar estas lines
    if ( dataform.moneda === null || dataform.moneda === undefined || dataform.moneda === false )  dataform.moneda = "$";
    else dataform.moneda = "u$s";
*/

/**Filtro xFecha Inicio: Si no selecciona fechaIncio, toma la fecha del dia. */
    if ( dataform.fecha_inicio === null || dataform.fecha_inicio === undefined || dataform.fecha_inicio === "")  dataform.fecha_inicio = new Date();
    else {
      dataform.fecha_inicio = new Date(format(parseISO(dataform.fecha_inicio),'MM/dd/yyy'))
    }

/**Filtro xFechaFin: Si no se selecciona fechaFin, toma la fechaInicio + 90 dias. */
    if ( dataform.fecha_fin === null || dataform.fecha_fin === undefined || dataform.fecha_fin === "")  {
      const dias = 90;
      let fecha_fin : Date = new Date(dataform.fecha_inicio)
      fecha_fin.setDate( fecha_fin.getDate() + dias ); 
      dataform.fecha_fin =  new Date(format(fecha_fin, 'MM/dd/yy'));
    }
    else {
      dataform.fecha_fin = new Date(format(parseISO(dataform.fecha_fin),'MM/dd/yyy'));
      if( dataform.fecha_inicio.getTime() >= dataform.fecha_fin.getTime() ){
        const dias = 90;
        let fecha_fin : Date = new Date(dataform.fecha_inicio)
        fecha_fin.setDate( fecha_fin.getDate() + dias ); 
        dataform.fecha_fin =  new Date(format(fecha_fin, 'MM/dd/yy'));
      }
    }

/**Filtro por precio. */      
    // if ( dataform.precio === null || dataform.precio < 0 || dataform.precio === undefined )   dataform.precio = 0;
    return eventos.filter((ev) => {
      return(
            ev.tipo.toLowerCase().includes( dataform.tipo)  
        &&  ev.localidad.toLowerCase().includes( dataform.localidad) 
        &&  dataform.fecha_inicio.getTime() <= ev.fechaInicio.getTime()
        &&  dataform.fecha_fin.getTime() >= ev.fechaInicio.getTime()
/**Filtro por tipo de moneda es descartado por el cliente.*/
        // &&  ev.moneda.toLowerCase() === dataform.moneda.toLowerCase()  
        )
      });
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
