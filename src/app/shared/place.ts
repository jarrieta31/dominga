export interface Place {
  $key: string;
  id: string;
  departamento: string;
  localidad: string;
  prioridad: number;
  auto: boolean;
  bicicleta: boolean;
  caminar: boolean;
  descripcion: string;
  nombre: string;
  url: string[];
  valoracion: string[];
  tipo: string;
  imagenPrincipal: string;
  distancia?: string;
  distanciaNumber?: number;
  imagenHome: string;
  web?: string;
  facebook?: string;
  instagram?: string;
  whatsapp?: string;
  phone?: string;
  ubicacion: {
    lat: string;
    lng: string;
  };
  latitud: string;
  longitud: string;
}
