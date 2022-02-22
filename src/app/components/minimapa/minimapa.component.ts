import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, ModalController } from "@ionic/angular";

import { environment } from "src/environments/environment";
import * as Mapboxgl from "mapbox-gl";
import { Place } from 'src/app/shared/place';
import { Router } from '@angular/router';

@Component({
    selector: 'app-minimapa',
    templateUrl: './minimapa.component.html',
    styleUrls: ['./minimapa.component.scss'],
})
export class MinimapaComponent implements AfterViewInit {

    @ViewChild('mini_mapa', { static: false }) private divMapa: ElementRef;

    mapa: Mapboxgl.Map;

    @Input('lugarActual') private place: Place;

    constructor(
        private router: Router,
        private actionSheetController: ActionSheetController,
    ) { }

    ngAfterViewInit(): void {

        Mapboxgl.accessToken = environment.mapBoxToken;

        this.mapa = new Mapboxgl.Map({
            container: this.divMapa.nativeElement,
            style: "mapbox://styles/casadominga/ck9m4w6x10dd61iql4bh7jinz",
            center: [this.place.ubicacion.lng, this.place.ubicacion.lat],
            zoom: 15,
            interactive: false
        });

        const marker = new Mapboxgl.Marker({
            draggable: false,
            color: "#ea4335",
        }).setLngLat([this.place.ubicacion.lng, this.place.ubicacion.lat])
            .addTo(this.mapa);


        this.mapa.on("load", () => {
            this.mapa.resize();
        });

        //Abre una nueva pagina con el mapa
        this.mapa.on("click", () => {
            this.abrirMapaActionSheet();
        });
    }

    /**
     * Al seleccionar sobre el mapa de cada lugar, se desplega un action-sheet
     * que brinda opciones de como llegar al mismo ya se en auto, bicicleta o caminando
     */
    async abrirMapaActionSheet() {
        const actionSheet = await this.actionSheetController.create({
            header: "Abrir Mapa",
            cssClass: "my-custom-class",
            buttons: [
                {
                    text: "Ir en auto",
                    icon: "car-sport",
                    handler: () => {
                        //Abre el mapa en modo auto
                        this.router.navigate([
                            "/map",
                            this.place.nombre,
                            {
                                longitud: this.place.ubicacion.lng,
                                latitud: this.place.ubicacion.lat,
                                tipo: this.place.tipo,
                                id: this.place.id,
                                profile: "mapbox/driving-traffic",
                            },
                        ]);
                    },
                },
                {
                    text: "Ir caminando",
                    icon: "walk",
                    handler: () => {
                        this.router.navigate([
                            "/map",
                            this.place.nombre,
                            {
                                longitud: this.place.ubicacion.lng,
                                latitud: this.place.ubicacion.lat,
                                tipo: this.place.tipo,
                                id: this.place.id,
                                profile: "mapbox/walking",
                            },
                        ]);
                        console.log("Ir caminando");
                    },
                },
                {
                    text: "Ir en bicicleta",
                    icon: "bicycle-outline",
                    handler: () => {
                        this.router.navigate([
                            "/map",
                            this.place.nombre,
                            {
                                longitud: this.place.ubicacion.lng,
                                latitud: this.place.ubicacion.lat,
                                tipo: this.place.tipo,
                                id: this.place.id,
                                profile: "mapbox/driving",
                            },
                        ]);
                        console.log("Ir en Bicicleta");
                    },
                },
                {
                    text: "Cancelar",
                    icon: "close",
                    role: "cancel",
                    handler: () => {
                        console.log("Cancel clicked");
                    },
                },
            ],
        });
        await actionSheet.present();
    }

}
