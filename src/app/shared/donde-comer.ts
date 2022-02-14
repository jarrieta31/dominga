export interface DondeComer {
  id?: string;
  nombre: string;
  departamento: string;
  localidad: string;
  direccion: string;
  telefonos: Telefono;
  imagen: Imagen;
  publicado: boolean;
  ubicacion: Posicion;
  distancia?: string | number;
  distanciaNumber: number;
  hora: string | number;
  minuto: string | number;
  mostrar?: boolean;
}

export interface Imagen {
  name: string;
  url: string;
}

export interface Telefono {
  numero: string;
}

export interface Posicion {
  lng: number;
  lat: number;
}
