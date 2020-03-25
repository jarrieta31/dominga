export class User {
	id: number;
	correo: string;
	password: string;
	arrayValoracion: {
		idLugar: number;
		valoracion: number;
	};
	arrayFavoritos: {
		idLugar: number;
	}
}
