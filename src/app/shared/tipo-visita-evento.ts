import { TipoDiaVisita as DiaVisita} from "./tipo-dia-visita";

export interface TipoVisitaEvento {
    id?           :      string;
    total_visitas :      number;
    id_evento     :      string;
    visita_xdia   : DiaVisita[];
}
