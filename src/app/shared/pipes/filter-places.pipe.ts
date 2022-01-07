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

    if(data.localidad !== undefined || data.localidad !== null) data.localidad = data.localidad.toLowerCase(); 
    if(data.tipo !== undefined || data.tipo !== null) data.tipo = data.tipo.toLowerCase();

    return places.filter((item) => {
      return (
        item.localidad.toLowerCase().includes(data.localidad) &&
        item.tipo.toLowerCase().includes(data.tipo)
      );
    });
  }
}
