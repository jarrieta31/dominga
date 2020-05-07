import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroMasOpciones'
})
export class FiltroMasOpcionesPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return null;
  }

}
