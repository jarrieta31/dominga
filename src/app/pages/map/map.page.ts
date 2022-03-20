import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Place } from "../../shared/place";
import { Point } from "../../shared/point";
import { environment } from "../../../environments/environment";
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import { GeolocationService } from "../../services/geolocation.service";
import { Observable, Subject, Subscription } from "rxjs";
import * as Mapboxgl from "mapbox-gl";
import { takeUntil, tap } from "rxjs/operators";
import { ActionSheetController, LoadingController } from "@ionic/angular";

@Component({
  selector: "app-map",
  templateUrl: "./map.page.html",
  styleUrls: ["./map.page.scss"],
})
export class MapPage implements OnInit, OnDestroy {
  posicion$: Observable<Point>;
  subscripcionPosition: Subscription;
  distancia: number;
  longitud: number = null;
  latitud: number = null;
  nombre: string = null;
  tipo: string = null;
  place: Place;
  points: Point[] = [];
  myPositionMarker: Mapboxgl.Marker = null;
  id: string;
  mapa: Mapboxgl.Map; //Mapa para mostrar
  directions: MapboxDirections = null; //Buscador de direcciones para indicar recorrido
  profile: string = "mapbox/walking";
  posicion: Point;
  icon: string;

  private uns$ = new Subject<void>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private geolocationService: GeolocationService,
    private router: Router,
    private loadingController: LoadingController,
    public actionSheetController: ActionSheetController
  ) {
    if (this.geolocationService.posicion$.getValue() != null) {
      this.posicion = this.geolocationService.posicion$.getValue();
    } 
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: "my-custom-class",
      message: "Actualizando ...",
      duration: 2000,
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
  }

  regresar() {
    this.router.navigate(["/place-selected", this.id]);
  }

  ngOnInit() {
    //Obtiene el observable con la posicion del usuario
    this.posicion$ = this.geolocationService.getObsPosicion$();
    Mapboxgl.accessToken = environment.mapBoxToken;

    //Datos recibidos desde places
    this.nombre = this.activatedRoute.snapshot.paramMap.get("nombre");
    this.longitud = Number(
      this.activatedRoute.snapshot.paramMap.get("longitud")
    );
    this.latitud = Number(this.activatedRoute.snapshot.paramMap.get("latitud"));
    this.id = this.activatedRoute.snapshot.paramMap.get("id");
    this.profile = this.activatedRoute.snapshot.paramMap.get("profile");
    this.tipo = this.activatedRoute.snapshot.paramMap.get("tipo");

    switch (this.profile) {
      case "mapbox/driving-traffic":
        this.icon = "car-sport";
        break;
      case "mapbox/walking":
        this.icon = "walk";
        break;
      case "mapbox/driving":
        this.icon = "bicycle";
        break;
      default:
        this.icon = "walk";
    }

    let lugar: Point = { longitud: this.longitud, latitud: this.latitud };
    this.points.push(lugar);
    //Crea un mapa para indicar el camino al usuario
    this.mapa = new Mapboxgl.Map({
      container: "mapaIndicador",
      style: "mapbox://styles/casadominga/ck9m4w6x10dd61iql4bh7jinz",
      antialias: true,
      center: [this.longitud, this.latitud],
      zoom: 13,
    });

    // Agrega el control de navegación
    this.mapa.addControl(new Mapboxgl.NavigationControl());

    //Crea el objeto direction para agregarlo al mapa
    this.directions = new MapboxDirections({
      accessToken: environment.mapBoxToken,
      unit: "metric",
      profile: this.profile,
      interactive: false,
      controls: {
        inputs: false,
        instructions: false,
      },
      zoom: 16,
      flyTo: false,
      placeholderOrigin: "Tu",
      placeholderDestination: this.nombre,
    });

    this.mapa.on("load", () => {
      this.directions.setOrigin([
        this.posicion.longitud,
        this.posicion.latitud,
      ]);
      this.directions.setDestination([this.longitud, this.latitud]);
      this.presentLoading();
      this.mapa.resize();
    });

    this.mapa.addControl(
      new MapboxDirections({ accessToken: Mapboxgl.accessToken }),
      "top-left"
    );

    //Crea e marcador del lugar
    const marker = new Mapboxgl.Marker({
      draggable: false,
      color: "#ea4335",
    })
      .setLngLat([this.longitud, this.latitud])
      .addTo(this.mapa);

    this.posicion$
      .pipe(
        tap((posicionUser) => {
          if (posicionUser != null) {
            this.posicion = posicionUser;
          }

          if (this.myPositionMarker == null && posicionUser != null) {
            this.createMarker(posicionUser.longitud, posicionUser.latitud);
          }
          if (posicionUser != null && this.directions != null) {
            //this.presentLoading();
            this.actualizarMarcador(
              posicionUser.longitud,
              posicionUser.latitud
            );
            this.actualizarRuta(posicionUser.longitud, posicionUser.latitud);
            this.centrarMapa(posicionUser.longitud, posicionUser.latitud);
          }
        })
      ).pipe(takeUntil(this.uns$))
      .subscribe();

    //Subscripcion para ver la ruta
    this.directions.on("route", (e) => {
      let routes = e.route;
      this.distancia = Number(routes.map((r) => r.distance / 1000));
    });
  }

  ngOnDestroy() {
    this.uns$.next();
    this.uns$.complete();
  }

  actualizarMarcador(longitud: number, latitud: number) {
    if (this.myPositionMarker != null) {
      this.myPositionMarker.remove();
      this.myPositionMarker.setLngLat([longitud, latitud]).addTo(this.mapa);
    }
  }

  createMarker(longitud: number, latitud: number) {
    //Crea html para el marcador
    var el = document.createElement("div");
    el.className = "marker";
    el.style.backgroundImage = 'url("/assets/icon/marcador_celeste.svg")';
    el.style.width = "30px";
    el.style.height = "30px";
    el.style.borderRadius = "50%";
    el.style.boxShadow = "1px 1px 40px #81bdda";
    //Agrega el marcador al mapa
    this.myPositionMarker = new Mapboxgl.Marker(el, { draggable: false })
      .setLngLat([longitud, latitud])
      .addTo(this.mapa);
  }

  centrarMapa(longitud: number, latitud: number) {
    this.mapa.setCenter([longitud, latitud]);
  }

  actualizarRuta(longUser: number, latUser: number) {
    if (this.directions.getOrigin() == null) {
      this.mapa.on("load", () => {
        this.directions.setOrigin([longUser, latUser]);
        this.directions.setDestination([this.longitud, this.latitud]);
      });
    }
    if (this.directions.getOrigin != null) {
      this.directions.removeRoutes();
      this.directions.setOrigin([longUser, latUser]);
      this.directions.setDestination([this.longitud, this.latitud]);
    }
  }
}

