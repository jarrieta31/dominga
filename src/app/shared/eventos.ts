export interface Eventos{
    carpeta:string;
    departamento: string;
    descripcion: string;
    direccion?: string;
    facebook?: string;
    fechaFin?: any;
    fechaInicio: any;
    id?: string;
    imagen: Imagen;
    instagram: string;
    localidad: string;
    lugar: string;
    moneda: string;
    nombre: string; 
    precio: number;
    precioUnico: boolean;
    publicado: boolean;
    ticktAntel?: string;
    tipo:string;
    ubicacion: Posicion;
    whatsapp?: string; 
    distancia: string;
    distanciaNumber: number;
    hora: string;
    minuto: string
    } 

    export interface Posicion{
        lng: number;
        lat: number;
        } 

        export interface Imagen {
            name: string;
            url: string;
            } 