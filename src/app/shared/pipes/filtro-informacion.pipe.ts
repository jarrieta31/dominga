import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filtroInformacion'
})
export class FiltroInformacionPipe implements PipeTransform {

    // children: any[] = [];

    transform(information: any[], texto: string): any[] {

        if (texto.length === 0) {
            return information;
        }

        // let largo = information.length - 1;
        // let cont = 0;

        texto = texto.toLowerCase();
        //     this.children = [];
        //     for (let key in information) {
        //     		this.children.push(information[key].children)
        //   console.log(this.children[key][key].number);
        //   //console.log(item.children[key].number);
        // }

        return information.filter(item => {
            return item.name.toLowerCase().includes(texto)
        })
    }

}