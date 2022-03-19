import { Pipe, PipeTransform } from "@angular/core";
import { Artistas } from "../artistas";

@Pipe({
  name: "filterArtist",
})
export class FilterArtistPipe implements PipeTransform {
  transform(artist: any[], data: any): Artistas[] | any[] {
    if (data.length === 0) {
      return artist;
    }

    if (data.localidad !== null) data.localidad = data.localidad.toLowerCase();
    else data.localidad = "";

    if (data.categoria !== null) data.categoria = data.categoria.toLowerCase();
    else data.categoria = "";

    const art = artist.filter((item) => {
      return (
        item.localidad.toLowerCase().includes(data.localidad) &&
        item.categoria.toLowerCase().includes(data.categoria)
      );
    });

    const vacio: any[] = [
      {
        "vacio": 1,
      },
    ];

    if (art.length === 0) {
      return vacio;
    } else return art;
  }
}
