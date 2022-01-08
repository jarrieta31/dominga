import { Pipe, PipeTransform } from '@angular/core';
import { DondeDormir } from '../../shared/donde-dormir';

@Pipe({
  name: 'filtroDondeDormir'
})
export class FiltroDondeDormirPipe implements PipeTransform {

  transform(dondeDormir: DondeDormir[], data: any): DondeDormir[] {

  	if(data.length === 0){
    	return dondeDormir;
  	}

   if(data.localidad != null || data.localidad != undefined) data.localidad = data.localidad.toLowerCase();

  	return dondeDormir.filter( item => {
  		return item.localidad.toLowerCase().includes(data.localidad)
  	})
  }
}
