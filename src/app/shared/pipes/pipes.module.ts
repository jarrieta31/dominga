import { NgModule } from '@angular/core';
import { FiltroPipe } from './filtro.pipe';
import { FiltroTipoCircuitoPipe } from './filtro-tipo-circuito.pipe';
import { FiltroDondeDormirPipe } from './filtro-donde-dormir.pipe';
import { FiltroDondeComerPipe } from './filtro-donde-comer.pipe';
import { FiltroInformacionPipe } from './filtro-informacion.pipe';
import { FiltroMasOpcionesPipe } from './filtro-mas-opciones.pipe';
import { FormatDistancia } from './format-distancia.pipe';
import { FilterEventsPipe } from './filter-events.pipe';
import { FilterPlacesPipe } from './filter-places.pipe';
import { FilterEvents1Pipe } from './filter-events1.pipe';
import { FilterArtistPipe } from './filter-artist.pipe';

@NgModule({
  declarations: [
    FiltroPipe, 
    FiltroTipoCircuitoPipe, 
    FiltroDondeDormirPipe, 
    FiltroDondeComerPipe, 
    FiltroInformacionPipe, 
    FiltroMasOpcionesPipe,
    FormatDistancia,
    FilterEventsPipe,
    FilterPlacesPipe,
    FilterEvents1Pipe,
    FilterArtistPipe,
  ],
  exports: [
    FiltroPipe, 
    FiltroTipoCircuitoPipe, 
    FiltroDondeDormirPipe, 
    FiltroDondeComerPipe, 
    FiltroInformacionPipe, 
    FiltroMasOpcionesPipe,
    FormatDistancia,
    FilterEventsPipe,
    FilterPlacesPipe,
    FilterEvents1Pipe,
    FilterArtistPipe
  ]
})

export class PipesModule { }
