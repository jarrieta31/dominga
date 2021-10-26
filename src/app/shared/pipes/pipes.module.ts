import { NgModule } from '@angular/core';
import { FiltroPipe } from './filtro.pipe';
import { FiltroTipoCircuitoPipe } from './filtro-tipo-circuito.pipe';
import { FiltroDondeDormirPipe } from './filtro-donde-dormir.pipe';
import { FiltroDondeComerPipe } from './filtro-donde-comer.pipe';
import { FiltroInformacionPipe } from './filtro-informacion.pipe';
import { FiltroMasOpcionesPipe } from './filtro-mas-opciones.pipe';
import { FormatDistancia } from './format-distancia.pipe';
import { FilterEventsPipe } from './filter-events.pipe';

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
  ],
  exports: [
    FiltroPipe, 
    FiltroTipoCircuitoPipe, 
    FiltroDondeDormirPipe, 
    FiltroDondeComerPipe, 
    FiltroInformacionPipe, 
    FiltroMasOpcionesPipe,
    FormatDistancia,
    FilterEventsPipe
  ]
})

export class PipesModule { }
