import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroInformacion'
})
export class FiltroInformacionPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return null;
  }

}
