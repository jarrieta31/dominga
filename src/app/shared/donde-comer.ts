

export interface DondeComer {
	id?: string;
	nombre: string;
	departamento: string;
	localidad: string;
	direccion: string;
	telefonos: Telefono;
	imagen: Imagen;
	publicado: boolean;
	} 

	export interface Imagen {
		name: string;
		url: string;
		} 

		export interface Telefono {
			numero: string;
			} 