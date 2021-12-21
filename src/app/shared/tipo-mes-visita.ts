import { TipoDiaVisita } from "./tipo-dia-visita";

export interface TipoMesVisita {
    mes           :      string;
    cant_vta_xmes :      number;
    visita_xdia   : TipoDiaVisita[];    
}
