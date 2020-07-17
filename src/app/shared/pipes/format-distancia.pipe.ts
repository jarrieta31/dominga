import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'formatDistancia'
})
export class FormatDistancia implements PipeTransform {

    transform(texto: string) {
        let espacio = " ";
        var txtSalida = "";

        if( texto != null){
            //console.log(texto)
            var arrayTexto = texto.split(espacio);
    
            var txtDistancia = arrayTexto[arrayTexto.length - 1];
            arrayTexto.pop();
    
            var numDistancia = Number(txtDistancia);
            if (numDistancia <= 1) {
                numDistancia = numDistancia * 1000;
                txtDistancia = String(Math.round(numDistancia * 1)/1);
                txtDistancia = txtDistancia.replace(".", ",");
                txtDistancia = txtDistancia + " m";
            } else {      
                txtDistancia = String(Math.round(numDistancia * 1000)/1000);
                txtDistancia = txtDistancia.replace(".", ",");
                txtDistancia = txtDistancia + " km";
            }
    
            arrayTexto.push(txtDistancia);
            
            for (let i = 0; i < arrayTexto.length; i++) {
                if (i == 0) {
                    txtSalida = arrayTexto[i];
                } else {
                    txtSalida = txtSalida + espacio + arrayTexto[i]
                }
            }
        }
        return txtSalida;
    }

}