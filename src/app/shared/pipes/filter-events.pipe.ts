import { Pipe, PipeTransform } from "@angular/core";
import { Eventos } from "../../shared/eventos";

@Pipe({
  name: "filterEvents",
})
export class FilterEventsPipe implements PipeTransform {
  transform(eventos: Eventos[], data: any): Eventos[] {
    if (data.length === 0) {
      return eventos;
    }

    data.formulario["departamento"] = data.formulario["departamento"].toLowerCase();
    data.formulario["general"] = data.formulario["general"].toLowerCase();

    return eventos.filter((item) => {
      return (
        item.departamento
          .toLowerCase()
          .includes(data.formulario["departamento"]) &&
        (item.descripcion.toLowerCase().includes(data.formulario["general"]) ||
          item.titulo.toLowerCase().includes(data.formulario["general"]))
      );
    });
  }
}
