import { Pipe, PipeTransform } from "@angular/core";
import { Eventos } from "../eventos";

@Pipe({
  name: "filterEvents1",
})
export class FilterEvents1Pipe implements PipeTransform {
  transform(eventos: Eventos[], dataform: any): Eventos[] | any[] {
    let dist: string = localStorage.getItem("distanceActivo");
    let distFound: boolean = false;
    if (dataform.length === 0) {
      return eventos;
    }

    if (dataform.localidad !== null)
      dataform.localidad = dataform.localidad.toLowerCase();
    else dataform.localidad = "";

    if (dataform.tipo !== null) dataform.tipo = dataform.tipo.toLowerCase();
    else dataform.tipo = "";

    let fec_ini = new Date();

    if (
      dataform.fecha_inicio === "" ||
      dataform.fecha_inicio === undefined ||
      dataform.fecha_inicio === null
    ) {
      dataform.fecha_inicio = new Date(fec_ini);
    }

    let fec_has =
      "Fri Dec 31 2100 00:00:00 GMT-0300 (hora estándar de Uruguay)";

    if (
      dataform.fecha_fin === "" ||
      dataform.fecha_fin === undefined ||
      dataform.fecha_fin === null
    ) {
      dataform.fecha_fin = new Date(fec_has);
    }

    if (dataform.fecha_inicio !== "") {
      dataform.fecha_inicio = new Date(dataform.fecha_inicio);
      let year = dataform.fecha_inicio.getFullYear();
      let month = dataform.fecha_inicio.getMonth();
      let day = dataform.fecha_inicio.getDate();
      let fullDate = new Date(year, month, day);
      dataform.fecha_inicio = fullDate;
    }

    if (dataform.fecha_fin !== "") {
      dataform.fecha_fin = new Date(dataform.fecha_fin);
      let year = dataform.fecha_fin.getFullYear();
      let month = dataform.fecha_fin.getMonth();
      let day = dataform.fecha_fin.getDate();
      let fullDate = new Date(year, month, day, 23, 59, 59);
      dataform.fecha_fin = fullDate;
    }

    if (dataform.fecha_inicio > dataform.fecha_fin) {
      dataform.fecha_inicio = "";
      dataform.fecha_fin = "";
      return eventos;
    }

    const ev = eventos.filter((ev) => {
      return (
        ev.tipo.toLowerCase().includes(dataform.tipo) &&
        ev.localidad.toLowerCase().includes(dataform.localidad) &&
        dataform.fecha_inicio <= ev.fechaInicio &&
        dataform.fecha_fin >= ev.fechaFin
      );
    });

    const vacio: any[] = [
      {
        vacio: 1,
      },
    ];

    if (dist !== null) {
      if (ev.length > 0) {
        ev.forEach((event) => {
          if (event.distancia < parseInt(dist)) {
            distFound = true;
          }
        });
      }

      if (distFound === false) {
        return vacio;
      }
    }

    if (ev.length === 0) {
      return vacio;
    } else return ev;
  }
}
