import { Component, OnInit, OnDestroy } from '@angular/core';

import { DatabaseService } from '../../services/database.service';

import { Router, ActivatedRoute, NavigationStart, NavigationEnd } from '@angular/router';

import { CallNumber } from '@ionic-native/call-number/ngx';

import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { filter  } from 'rxjs/operators';
import { Subscription } from 'rxjs'
import { TextToSpeechService } from 'src/app/services/text-to-speech.service';
import { TipoSputtr } from 'src/app/shared/tipo-sputtr';


@Component({
    selector: 'app-modal-info',
    templateUrl: './modal-info.page.html',
    styleUrls: ['./modal-info.page.scss'],
})
export class ModalInfoPage implements OnInit, OnDestroy {

    nombre: string;
    descripcion: string;
    tipo: string;
    web: string;
    facebook: string;
    instagram: string;
    whatsapp: string;
    phone: string;
    id: string;
/**
 * Funcionalidad: Texto a Audio (TextToSpeech)
 * Variables globales
 */
    currentUrl: string;
    urlSuscription : Subscription;
    speaking : boolean = false;
    paused   : boolean = false;
    escuchar : boolean = false;
    vr : string[] = ['1', '1.5', '2']; //representa las velocidades de reproduccion
    spUttData : TipoSputtr = {
        rate   : '1', //  Velocidad de Reproduccion: Rango 0.1 - 10, xDefecto 1
        text   : '', // Texto a convertir a audio
    }

    constructor(
        private database: DatabaseService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private callNumber: CallNumber,
        private browser: InAppBrowser, 
        private tts : TextToSpeechService,
    ) {}

    ngOnInit() {
        this.getInfoLugar()
        this.urlSuscribe();
    }

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.urlSuscription.unsubscribe();
    
    }

    async getInfoLugar() {
        this.activatedRoute.paramMap.subscribe(params => {
            // Dentro de la variable s colocamos el método database y hacemos llamado al 
            // método getPlaces() que se encuentra en el servicio 'DataService'

            let par = params.get("id");
            this.id = par;

            let s = this.database.getPlaces();
            // Llamamos los datos desde Firebase e iteramos los datos con data.ForEach y por
            // último pasamos los datos a JSON
            s.snapshotChanges().subscribe(data => {

                    data.forEach(item => {
                        if (par == item.key) {
                            let a = item.payload.toJSON();
                            a['$key'] = item.key;
                            this.nombre = a['nombre'];
                            this.descripcion = a['descripcion'];
                            this.tipo = a['tipo'];

                            if (a['web'] != undefined && a['web'] != null) {
                                this.web = a['web'];
                            }

                            if (a['facebook'] != undefined && a['facebook'] != null) {
                                this.facebook = a['facebook'];
                            }

                            if (a['instagram'] != undefined && a['instagram'] != null) {
                                this.instagram = a['instagram'];
                            }

                            if (a['whatsapp'] != undefined && a['whatsapp'] != null) {
                                this.whatsapp = a['whatsapp'];
                            }

                            if (a['phone'] != undefined && a['phone'] != null) {
                                this.phone = a['phone'];
                            }
                        }
                    })
                 
                    if (this.web == undefined) {
                        let elem: HTMLElement = document.getElementById('web');
                        elem.setAttribute("style", "display:none");
                    }

                    if (this.facebook == undefined) {
                        let elem: HTMLElement = document.getElementById('facebook');
                        elem.setAttribute("style", "display:none");
                    }

                    if (this.instagram == undefined) {
                        let elem: HTMLElement = document.getElementById('instagram');
                        elem.setAttribute("style", "display:none");
                    }

                    if (this.whatsapp == undefined) {
                        let elem: HTMLElement = document.getElementById('whatsapp');
                        elem.setAttribute("style", "display:none");
                    }

                    if (this.phone == undefined) {
                        let elem: HTMLElement = document.getElementById('phone');
                        elem.setAttribute("style", "display:none");
                    }
                }),
                err => console.log(err)
        });
    }

    callPhone(){
        this.callNumber.callNumber(this.phone, true)
          .then(res => console.log('Llamando!', res))
          .catch(err => console.log('Error en llamada', err));
    }

    openWeb(){
        this.browser.create(this.web, "_system")
    }

    openFacebook(){
        this.browser.create(this.facebook, "_system")
    }


//  >>>>>> Texto a Audio <<<<<<<<








    urlSuscribe(){
        this.urlSuscription = this.router.events.subscribe((event : NavigationEnd) => {
            this.currentUrl = event.url;
            if( this.tts.reproduciendo && event.url.search('descripcion') == -1) 
                this.tts.detener();
        })
    }

    limpiarTexto( text : string) : string{
        let _txt : string;
        _txt = text.replace(/<[^>]*>?/g, '');
        return _txt;
    }

    pausarReproduccion(){this.tts.pausar();
        console.log(`estoy pausando`);
        
    }
    reanudarReproduccion(){this.tts.reanudar();
        console.log(`estoy reanudando`);
        
    }
    detenerReproduccion(){this.tts.detener()
        console.log(`estoy cancelando`);
        
    }

    reproducirDescripcion( texto : string ){
        this.spUttData.text = this.limpiarTexto( texto );
        this.tts.reproducir(this.spUttData);
    }

    velocidadReproduccion( v : string ){
        let largo = this.vr.length;
        let idx = this.vr.indexOf(v);
        if(idx === largo-1)
            this.spUttData.rate = this.vr[0];
        else this.spUttData.rate = this.vr[idx+1];
    }
}