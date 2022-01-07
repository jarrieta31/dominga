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

    if (
      data.formulario["fecha_desde"] === "" ||
      data.formulario["fecha_desde"] === undefined
    ) {
      data.formulario["fecha_desde"] = new Date();
    }

    let fec_has =
      "Fri Dec 31 2100 00:00:00 GMT-0300 (hora estándar de Uruguay)";

    if (
      data.formulario["fecha_hasta"] === "" ||
      data.formulario["fecha_hasta"] === undefined
    ) {
      data.formulario["fecha_hasta"] = new Date(fec_has);
    }

    if (data.formulario["fecha_desde"] !== "") {
      data.formulario["fecha_desde"] = new Date(data.formulario["fecha_desde"]);
      let year = data.formulario['fecha_desde'].getFullYear();
      let month = data.formulario['fecha_desde'].getMonth();
      let day = data.formulario['fecha_desde'].getDate();
      let fullDate = new Date(year, month, day);
      data.formulario["fecha_desde"] = fullDate;
    }

    if (data.formulario["fecha_hasta"] !== "") {
      data.formulario["fecha_hasta"] = new Date(data.formulario["fecha_hasta"]);
      let year = data.formulario['fecha_hasta'].getFullYear();
      let month = data.formulario['fecha_hasta'].getMonth();
      let day = data.formulario['fecha_hasta'].getDate();
      let fullDate = new Date(year, month, day, 23, 59, 59);
      data.formulario["fecha_hasta"] = fullDate;
      
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
          item.nombre.toLowerCase().includes(data.formulario["general"])) &&
        item.localidad.toLowerCase().includes(data.formulario["localidad"]) &&
        item.fechaInicio >= data.formulario["fecha_desde"] &&
        item.fechaFin <= data.formulario["fecha_hasta"]
      );
    });
  }
}
