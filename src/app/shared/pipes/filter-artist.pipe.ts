import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterArtist'
})
export class FilterArtistPipe implements PipeTransform {

  transform(artist: any[], data: any): any {
    if (data.length === 0) {
      return artist;
    }

    if(data.nombre !== null) data.nombre = data.nombre.toLowerCase(); 
    else data.nombre = ""

    if(data.tipo !== null) data.tipo = data.tipo.toLowerCase();
    else data.tipo = ""

    return artist.filter((item) => {
      return (
        item.nombre.toLowerCase().includes(data.nombre) &&
        item.tipo.toLowerCase().includes(data.tipo)
      );
    });
  }

}
