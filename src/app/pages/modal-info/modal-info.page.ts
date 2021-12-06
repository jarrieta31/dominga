import { Component, OnInit, OnDestroy } from '@angular/core';

import { DatabaseService } from '../../services/database.service';

import { Router, ActivatedRoute, NavigationStart, NavigationEnd } from '@angular/router';

import { CallNumber } from '@ionic-native/call-number/ngx';

import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { filter  } from 'rxjs/operators';
import { Subscription } from 'rxjs'


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
    currentUrl: string;
    urlSuscription : Subscription;
    spSynt = window.speechSynthesis;

    constructor(
        private database: DatabaseService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private callNumber: CallNumber,
        private browser: InAppBrowser
    ) {}

    ngOnInit() {
        this.getInfoLugar();
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

    limpiarTexto( text : string) : string{
        let _txt : string;
        if(text.search('<p>') == -1){
            let aux1 = text.replace(/<\/b>/g, '');
            _txt = aux1.replace(/<b>/g, '')
        }else{
            let aux1 = text.replace(/<\/p>/g, '');
            _txt = aux1.replace(/<p>/g, '')
        }

        return _txt;
    }

    getVoces(){

        let spSyntVoices = window.speechSynthesis;
        
        let esVoice : SpeechSynthesisVoice;
        spSyntVoices.addEventListener('voiceschanged', () => {
            let voces = spSyntVoices.getVoices()
            if( voces.length > 0 ){
                voces.forEach((v) => {
                    if(v.lang == 'es-ES' || v.lang == 'es-419') esVoice = v;
                    })
            }    
        })
        
        spSyntVoices.getVoices();

        return esVoice;
    }

    urlSuscribe(){
        this.urlSuscription = this.router.events.subscribe((event : NavigationEnd) => {
            this.currentUrl = event.url;
            console.log(this.currentUrl);
            if( this.spSynt.speaking && event.url.search('descripcion') == -1) 
                this.spSynt.cancel();
            
            
        })

    }
    
    escucharDescripcion( text : string ){
        let esVoices  = this.spSynt.getVoices();
        
        let txt = this.limpiarTexto(text);
        console.log(txt);
        
        let spUttr = new SpeechSynthesisUtterance(txt);
        
        
        if(esVoices){
            esVoices.forEach((v) => {
            if(v.lang == 'es-ES' || v.lang == 'es-419') spUttr.voice = v;
            })
        }

        spUttr.pitch = 1;
        spUttr.rate = 1;
        spUttr.volume = 0.5;

        if(!this.spSynt.speaking) this.spSynt.speak(spUttr);

        console.log('soy escruchar descripcion    '+this.currentUrl);
        
    console.log(
        this.urlSuscription
    );
    

    }
}