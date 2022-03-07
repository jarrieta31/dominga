import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "hour",
})
export class HourPipe implements PipeTransform {
  transform(hour: number): string {
    var txtSalida = "";

    if (hour < 1) {
      txtSalida = "0 h";
    } else {
      let cut = Math.trunc(hour);
      txtSalida = cut.toString() + " h";
    }

    return txtSalida;
  }
}
