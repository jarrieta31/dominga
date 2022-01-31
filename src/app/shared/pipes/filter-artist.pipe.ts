import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterArtist'
})
export class FilterArtistPipe implements PipeTransform {

  transform(artist: any[], data: any): any {
    if (data.length === 0) {
      return artist;
    }

    if(data.localidad !== null) data.localidad = data.localidad.toLowerCase(); 
    else data.localidad = ""

    if(data.categoria !== null) data.categoria = data.categoria.toLowerCase();
    else data.categoria = ""

    return artist.filter((item) => {
      return (
        item.localidad.toLowerCase().includes(data.localidad) &&
        item.categoria.toLowerCase().includes(data.categoria)
      );
    });
  }

}
