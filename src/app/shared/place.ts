export interface Place {
    $key: string;
    auto: boolean;
    bicicleta: boolean;
    caminar: boolean;
    descripcion: string;
    nombre: string;
    url: string[];
    valoracion: string[];
    tipo: string;
    latitud: string;
    longitud: string;
    imagenPrincipal: string;
    distancia?: string;
    distanciaNumber?: number;
}
