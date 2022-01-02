    export interface Place {
    id: string;
    distancia?: string | number,
    nombre: string,
    prioridad: number,
    publicado: boolean,
    departamento: string
    localidad: string,
    auto: boolean,
    bicicleta: boolean,
    caminar: boolean,
    patrimonial: boolean,
    accesibilidad: boolean,
    descripcion: string,
    imagenHome: {
        name: string,
        url: string,
    },
    imagenPrincipal: {
        name: string,
        url: string,
    },
    ubicacion: {
        lng: number,
        lat: number,
    },
    tipo: string,
    imagenes: [],
    facebook?: string,
    instagram?: string,
    web?: string,
    whatsapp?: string,
    telefonos?: [],
    valoraciones?: [],
    videos?: [],
    carpeta: string,
}
