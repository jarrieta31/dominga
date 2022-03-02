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


/**Filtro xFecha Inicio: Si no selecciona fechaIncio, toma la fecha del dia. */
    if ( dataform.fecha_inicio === null || dataform.fecha_inicio === undefined || dataform.fecha_inicio === "")  dataform.fecha_inicio = new Date();
    else {
      if(typeof dataform.fecha_inicio === 'object')
        dataform.fecha_inicio = new Date(format(dataform.fecha_inicio,'MM/dd/yyy'))
      else      
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
      if(typeof dataform.fecha_fin === 'object')
        dataform.fecha_fin = new Date(format(dataform.fecha_fin,'MM/dd/yyy'));
      else
        dataform.fecha_fin = new Date(format(parseISO(dataform.fecha_fin),'MM/dd/yyy'));
      if( dataform.fecha_inicio.getTime() >= dataform.fecha_fin.getTime() ){
        const dias = 90;
        let fecha_fin : Date = new Date(dataform.fecha_inicio)
        fecha_fin.setDate( fecha_fin.getDate() + dias ); 
        dataform.fecha_fin =  new Date(format(fecha_fin, 'MM/dd/yy'));
      }
    }
 
    return eventos.filter((ev) => {
      return(
            ev.tipo.toLowerCase().includes( dataform.tipo)  
        &&  ev.localidad.toLowerCase().includes( dataform.localidad) 
        &&  dataform.fecha_inicio.getTime() <= ev.fechaInicio.getTime()
        &&  dataform.fecha_fin.getTime() >= ev.fechaInicio.getTime()
        )
      });
}  
}
