import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'formatDistancia'
})
export class FormatDistancia implements PipeTransform {

    transform(texto: string) {
        let espacio = " ";
        var txtSalida = "";

        if( texto != null){

            var arrayTexto = texto.split(espacio);
    
            var txtDistancia = arrayTexto[arrayTexto.length - 1];
            arrayTexto.pop();
    
            var numDistancia = Number(txtDistancia);
            if (numDistancia >= 1000) {
                numDistancia = numDistancia / 1000;
                numDistancia = Math.round(numDistancia * 1000) / 1000;
                txtDistancia = String(numDistancia);
                txtDistancia = txtDistancia.replace(".", ",");
                txtDistancia = txtDistancia + " km";
            } else {
                numDistancia = Math.round(numDistancia);
                txtDistancia = String(numDistancia);
                txtDistancia = txtDistancia + " m";
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