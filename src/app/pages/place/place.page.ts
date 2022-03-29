import { Component } from "@angular/core";
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";
import { forkJoin, Observable, of, Subject } from "rxjs";
import { map, switchMap, takeUntil, tap } from "rxjs/operators";
import { PlaceService } from "src/app/services/database/place.service";
import { GeolocationService } from "src/app/services/geolocation.service";
import { Place } from "src/app/shared/place";
//import distance from "@turf/distance";
import { Point } from "src/app/shared/point";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { DatabaseService } from "src/app/services/database.service";
import { VisitPlaceService } from "src/app/services/database/visit-place.service";
import { Slider } from "src/app/shared/slider";
import { SlidesService } from "src/app/services/database/slides.service";
import { environment } from "src/environments/environment";

export interface Papa {
  type: string;
  query: string[];
  features: Texto[];
  attribution: string;
}

export interface Texto {
  text: string;
}

export interface RequestDist {
  weight_name: string;
  weight: number;
  duration: number;
  distance: number;
}

export interface DataDist {
  distance: number;
  hora: number;
  minuto: number;
}

@Component({
  selector: "app-place",
  templateUrl: "./place.page.html",
  styleUrls: ["./place.page.scss"],
})
export class PlacePage {
  constructor(
    private geolocationSvc: GeolocationService,
    private visitPlaceSvc: VisitPlaceService,
    private databaseSvc: DatabaseService,
    private placeSvc: PlaceService,
    private browser: InAppBrowser,
    private http: HttpClient,
    private fb: FormBuilder,
    private sliderSvc: SlidesService
  ) {}

  /**se utiliza para eliminar todas las subscripciones al salir de la pantalla */
  private unsubscribe$: Subject<void>;

  /**Configuración de slider mini galeria */
  slideOpts = {
    initialSlide: 0,
    speed: 2000,
    slidesPerView: 1,
    spaceBetween: 0,
    autoplay: true,
  };

  departamento: string;
  posicion: Point;
  /**guarda los lugares activos en la subscription del servicio */
  places: Place[] = [];
  /**guarda las localidades con lugares publicados */
  location: any[] = [];
  /**guarda los tipos de lugares */
  category: any[] = [];
  /**guarda la distancia del usuario a cada lugar en tiempo real */
  distancia: string | number;
  /**cantidad de horas para llegar a cada lugar */
  hora: string | number;
  /**cantidad de minutos para llegar a cada lugar */
  minuto: string | number;
  /**guarda la posición actual del usuario */
  posicion$: Observable<Point>;
  /**departamente seleccionado actualmente */
  currentDepto: string = this.databaseSvc.selectionDepto;
  /**captura los datos del formulario de filtros */
  dataForm: any = "";
  /**se guardan los sliders de la pantalla lugares */
  sliderPlace: Slider[] = [];
  /**filtro seleccionado, distancia o departamento */
  dist: number = null;
  dep: string = null;
  /**formulario que obtiene datos para filtrar */
  filterForm: FormGroup = this.fb.group({
    localidad: ["", Validators.required],
    tipo: ["", Validators.required],
  });
  /**control la apertura de filtros */
  isFilterLocation: boolean = false;
  isFilterType: boolean = false;
  /**guardan filtos seleccionados */
  optionLocation: string = null;
  optionType: string = null;
  /**url load  */
  preloadImage: string = "/assets/load.gif";
  /** clase para lista de preload */
  preload_card: string = "img_card_place"

  filterPlace() {
    this.dataForm = this.filterForm.value;

    if (this.isFilterLocation) this.isFilterLocation = false;
    if (this.isFilterType) this.isFilterType = false;

    this.optionLocation = this.dataForm.localidad;
    this.optionType = this.dataForm.tipo;

    if (this.dataForm.localidad === "") this.optionLocation = "localidad";
    if (this.dataForm.tipo === "") this.optionType = "tipo";
  }

  pageDominga() {
    this.browser.create("https://casadominga.com.uy", "_system");
  }

  getPlace(id: string) {
    this.placeSvc.getPlaceId(id);
  }

  changeFilterLocation() {
    this.isFilterLocation = !this.isFilterLocation;
    if (this.isFilterType) this.isFilterType = false;
  }

  changeFilterType() {
    this.isFilterType = !this.isFilterType;
    if (this.isFilterLocation) this.isFilterLocation = false;
  }

  getLocation(lng: number, lat: number) {
    return this.http
      .get<any>(
        `${environment.urlMopboxDepto}${lng},${lat}.json?access_token=${environment.mapBoxToken}`
      )
      .pipe(
        map((depto) => depto.features[depto.features.length - 2].text),
        takeUntil(this.unsubscribe$)
      );
  }

  /**endpoint de mapbox para calcular distancia entre dos puntos teniendo en cuenta las calles */
  getDistance(
    lngUser: number,
    latUser: number,
    lngPlace: number,
    latPlace: number
  ) {
    return this.http.get(
      `${environment.urlMapboxDistance}${lngUser},${latUser};${lngPlace},${latPlace}?overview=full&geometries=geojson&access_token=${environment.mapBoxToken}`
    );
  }

  /** Devuelve una lista de localidades */
  get localidades() {
    const placeLoc = this.places;
    let localidades: string[] = [];
    if (placeLoc.length > 0) {
      placeLoc.forEach((pl) => {
        if (localidades.indexOf(pl.localidad) == -1) {
          localidades.push(pl.localidad);
        }
      });
    }

    localidades = localidades.sort();
    return localidades;
  }

  /** Devuelve una lista de tipos */
  get tipos() {
    const placeTipo = this.places;
    let tipos: string[] = [];
    if (placeTipo.length > 0) {
      placeTipo.forEach((pl) => {
        if (tipos.indexOf(pl.tipo) == -1) {
          tipos.push(pl.tipo);
        }
      });
    }

    tipos = tipos.sort();
    return tipos;
  }

  /**retorna true si se selecciono Distancia como filtro principal */
  get selectdistancia() {
    return localStorage.getItem("distanceActivo") ? true : false;
  }

  /**se ejecuta cada vez que se ingresa a la tab */
  ionViewWillEnter() {
    if (
      localStorage.getItem("deptoActivo") !== undefined &&
      localStorage.getItem("deptoActivo") !== null
    ) {
      this.dist = null;
      this.dep = localStorage.getItem("deptoActivo");
    } else if (
      localStorage.getItem("distanceActivo") !== undefined &&
      localStorage.getItem("distanceActivo") !== null
    ) {
      this.dep = null;
      this.dist = parseInt(localStorage.getItem("distanceActivo"));
    }

    if (localStorage.getItem("deptoActivo") !== this.currentDepto) {
      this.currentDepto = localStorage.getItem("deptoActivo");
      this.filterForm.reset();
      this.dataForm = "";
      this.optionLocation = "localidad";
      this.optionType = "tipo";
    }

    this.unsubscribe$ = new Subject<void>();
    this.sliderSvc.getSliders();

    this.sliderSvc.slider
      .pipe(
        map((slider) => slider.filter((s) => s.pantalla === "lugares")),
        takeUntil(this.unsubscribe$),
      )
      .subscribe((res) => {
        this.sliderPlace = res;
      });

    /******** RXJS PARA TRAER LUGARES CON INFO COMPLETA ************************************/
    let posDep = this.geolocationSvc.posicion$.pipe(
      switchMap((pos: Point) => {
        return forkJoin(of(pos), this.getLocation(pos.longitud, pos.latitud));
      }),
      takeUntil(this.unsubscribe$)
    );

    let dto = posDep.pipe(
      switchMap((res) => this.placeSvc.getPlaces(res[1])),
      takeUntil(this.unsubscribe$)
    );

    if (this.geolocationSvc.posicion$.value !== null) {
      dto.pipe(takeUntil(this.unsubscribe$)).subscribe((res) => {
        this.places = [];
        this.places = res;
      });
    } else {
      this.placeSvc.getPlaces(this.dep).pipe(takeUntil(this.unsubscribe$)).subscribe((res) => {
        this.places = [];
        this.places = res;
      });
    }

    /************************************************************************************ */
  }

  /**se ejecuta cada vez que se sale de la tab */
  ionViewDidLeave() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.isFilterLocation = false;
    this.isFilterType = false;
  }

  /**Contador de visitas de Lugares */
  sumaVisitaLugar(lugar_id: string) {
    this.visitPlaceSvc.contadorVistasPlace(lugar_id);
  }
}
