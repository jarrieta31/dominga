export interface Artistas {
    id: string,
    carpeta: string,
    categoria: string,
    departamento: string,
    instagram?: string,
    localidad: string,
    nombre: string,
    publicado: boolean,
    spotify?: string,
    youtube?: string,
    imagen: Imagen
}

export interface Imagen {
    name: string;
    url: string;
    } 

