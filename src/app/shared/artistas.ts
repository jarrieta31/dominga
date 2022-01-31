export interface Artistas {
    id: String,
    carpeta: String,
    categoria: String,
    departamento: String,
    instagram?: String,
    localidad: String,
    nombre: String,
    publicado: boolean,
    spotify?: String,
    youtube?: String,
    imagen: Imagen
}

export interface Imagen {
    name: string;
    url: string;
    } 

