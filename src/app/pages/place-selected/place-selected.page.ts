import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { PlaceService } from 'src/app/services/database/place.service';
import { Place } from 'src/app/shared/place';
import { environment } from 'src/environments/environment';
import { VideoPage } from '../video/video.page';
import * as Mapboxgl from "mapbox-gl";
import { Router } from "@angular/router";

declare var $: any;

@Component({
  selector: 'app-place-selected',
  templateUrl: './place-selected.page.html',
  styleUrls: ['./place-selected.page.scss'],
})
export class PlaceSelectedPage implements OnInit, OnDestroy {

  place: Place = null;
  place_suscription: Subscription;
  mapa: Mapboxgl.Map;
  near: any[] = [];
  near_places: Subscription;

  slideOpts = {
    initialSlide: 0,
    speed: 400,
    slidesPerView: 3,
    spaceBetween: 1,
    autoplay: true,
  };

  constructor(
    private placeSvc: PlaceService,
    private modalCtrl: ModalController,
    private router: Router, 
    private actionSheetController: ActionSheetController,
  ) { }

  ngOnInit() {
    this.place_suscription = this.placeSvc.place_selected.subscribe( res => {
      this.place = res; 
      this.placeSvc.getPlaceNear();
      
      this.near_places = this.placeSvc.near_places.subscribe( res => {
        console.log(this.near)
        this.near = [];
        this.near = res;
      })

      Mapboxgl.accessToken = environment.mapBoxToken;
          this.mapa = new Mapboxgl.Map({
            container: "mapaBox",
            style: "mapbox://styles/casadominga/ck9m4w6x10dd61iql4bh7jinz",
            center: [res.ubicacion.lng, res.ubicacion.lat],
            zoom: 13,
          });

          const marker = new Mapboxgl.Marker({
            draggable: false,
            color: "#ea4335",
          })
            .setLngLat([res.ubicacion.lng, res.ubicacion.lat])
            .addTo(this.mapa);

          if (res.tipo == "Rural" && res.nombre != "Mal Abrigo") {
            const markerMalAbrigo = new Mapboxgl.Marker({
              draggable: false,
              color: "#006400",
            })
              .setLngLat([-56.952087, -34.147616])
              .addTo(this.mapa);
          }

          this.mapa.on("load", () => {
            this.mapa.resize();
          });

          //Abre una nueva pagina con el mapa
          this.mapa.on("click", () => {
            this.abrirMapaActionSheet();
          });
    });
  }

  ngOnDestroy() {
    this.place_suscription.unsubscribe();
    this.near_places.unsubscribe();
  }

  /**
   * Al seleccionar una imagen de la mini galería modifica la imagen principal
   */
   async cambiarImagen() {
    $(".imgGaleria").click(function () {
      var src = $(this).attr("src");
      $("#foto").attr("src", src);
    });
  }

  /**
   * Abre modal para reproducir video
   * @param url - URL del video que se va a ejecutar
   */
   async verVideo(url: string) {
    const video = await this.modalCtrl.create({
      component: VideoPage,
      cssClass: "modal-video",
      backdropDismiss: false,
      showBackdrop: true,
      componentProps: {
        url: url,
      },
    });

    await video.present();
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
