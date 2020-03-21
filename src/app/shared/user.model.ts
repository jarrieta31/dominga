export class User {
    constructor(
        public id:string, 
        public email: string,
        private _token: string,
        private tonkenExpirationDate: Date
    ){}

    get token(){
        //Si la fecha de caducación es menor o igual a la fecha actual
        if (!this.tonkenExpirationDate || this.tonkenExpirationDate <= new Date()){
            return null;
        }
        return this._token;
    }
}