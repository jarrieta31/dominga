import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minute'
})
export class MinutePipe implements PipeTransform {

  transform(minute: number): string {
    var txtSalida = "";

    if (minute < 1) {
      txtSalida = "0 min";
    } else {
      let cut = Math.trunc(minute);
      txtSalida = cut.toString() + " min";
    }

    return txtSalida;
  }

}
