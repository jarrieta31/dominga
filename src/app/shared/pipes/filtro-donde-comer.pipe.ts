import { Pipe, PipeTransform } from "@angular/core";
import { DondeComer } from "../../shared/donde-comer";

@Pipe({
  name: "filtroDondeComer",
})
export class FiltroDondeComerPipe implements PipeTransform {
  transform(eat: DondeComer[], data: any): DondeComer[] {
    if (data.length === 0) {
      return eat;
    }

    if (data.localidad !== undefined || data.localidad !== null)
      data.localidad = data.localidad.toLowerCase();

    return eat.filter((item) => {
      return item.localidad.toLowerCase().includes(data.localidad);
    });
  }
}
