import { Pipe, PipeTransform } from "@angular/core";
import { Place } from "../place";

@Pipe({
  name: "filterPlaces",
})
export class FilterPlacesPipe implements PipeTransform {

  transform(places: Place[], data: any): Place[] {
    if (data.length === 0) {
      return places;
    }

    let distanceLS= localStorage.getItem('distanceActivo');

    if(distanceLS !== null && distanceLS !== undefined) data.localidad = "";

    if (data.localidad !== null) data.localidad = data.localidad.toLowerCase();
    else data.localidad = "";

    if (data.tipo !== null) data.tipo = data.tipo.toLowerCase();
    else data.tipo = "";

    return places.filter((item) => {
      return (
        item.localidad.toLowerCase().includes(data.localidad) &&
        item.tipo.toLowerCase().includes(data.tipo)
      );
    });
  }
}
