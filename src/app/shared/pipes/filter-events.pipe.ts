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

    if (data.formulario["departamento"] === undefined) {
      data.formulario["departamento"] = "";
    }

    if (data.formulario["general"] === undefined) {
      data.formulario["general"] = "";
    }

    if (data.formulario["localidad"] === undefined) {
      data.formulario["localidad"] = "";
    }

    data.formulario["departamento"] =
      data.formulario["departamento"].toLowerCase();
    data.formulario["general"] = data.formulario["general"].toLowerCase();
    data.formulario["localidad"] = data.formulario["localidad"].toLowerCase();

    return eventos.filter((item) => {
      return (
        item.departamento
          .toLowerCase()
          .includes(data.formulario["departamento"]) &&
        (item.descripcion.toLowerCase().includes(data.formulario["general"]) ||
          item.titulo.toLowerCase().includes(data.formulario["general"])) &&
        item.localidad.toLowerCase().includes(data.formulario["localidad"])
      );
    });
  }
}
