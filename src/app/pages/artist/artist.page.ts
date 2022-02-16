import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ArtistService } from "src/app/services/database/artist.service"; 
import { Artistas } from "src/app/shared/artistas";
import { LoadingController, ModalController } from "@ionic/angular";
import { SlidesService } from "src/app/services/database/slides.service";
import { Slider } from "src/app/shared/slider";
import { VideoPage } from "../video/video.page";
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";

@Component({
  selector: "app-artist",
  templateUrl: "./artist.page.html",
  styleUrls: ["./artist.page.scss"],
})
export class ArtistPage {
  constructor(
    private fb: FormBuilder,
    private artistSvc: ArtistService,
    private loadingCtrl: LoadingController,
    private sliderSvc: SlidesService,
    private modalCtrl: ModalController,
    private browser: InAppBrowser,
  ) {}

  /**se utiliza para eliminar todas las subscripciones al salir de la pantalla */
  private unsubscribe$: Subject<void>;

  /**guarda los lugares activos en la subscription del servicio */
  artists: Artistas[] = [];

  /**
   * Slide
   */
  slideOpts = {
    initialSlide: 0,
    speed: 600,
    slidesPerView: 1,
    spaceBetween: 0,
    autoplay: true,
  };

  locationActive: any[] = [];

  loading: any;

  /**controla si se muestra o no el filtro general de lugares */
  isFilterLocation = false;
  isFilterType = false;
  /**captura los datos del formulario de filtros */
  dataForm: any = "";
  /**control de acordeon de filtros */
  isOpenLocation: boolean = false;
  isOpenType: boolean = false;
  /**se guardan los sliders de la pantalla artistas */
  sliderArtist: Slider[] = [];

  filterForm: FormGroup = this.fb.group({
    localidad: ["", Validators.required],
    categoria: ["", Validators.required],
  });

  filterArtist() {
    this.dataForm = this.filterForm.value;
  }

  changeFilterLocation() {
    this.isFilterLocation = !this.isFilterLocation;
    this.isOpenLocation = !this.isOpenLocation;
    if (this.isFilterType) {
      this.isFilterType = false;
      this.isOpenType = false;
    }

    if(this.isOpenType) this.isOpenType = false;
  }

  changeFilterType() {
    this.isFilterType = !this.isFilterType;
    this.isOpenType = !this.isOpenType;
    if (this.isFilterLocation) {
      this.isFilterLocation = false;
      this.isOpenLocation = false;
    }

    if(this.isOpenLocation) this.isOpenLocation = false;
  }

  changeLocation() {  
    this.isOpenLocation = !this.isOpenLocation;
    this.isFilterLocation = !this.isFilterLocation;
    if (this.isOpenType) {
      this.isOpenType = false;
      this.isFilterType = false;
    }
  }

  changeType() {
    this.isOpenType = !this.isOpenType;
    this.isFilterType = !this.isFilterType;
    if (this.isOpenLocation) {
      this.isOpenLocation = false;
      this.isFilterLocation = false;
    }
  }

  async show(message: string) {
    this.loading = await this.loadingCtrl.create({
      message,
      spinner: "bubbles",
    });

    this.loading.present().then(() => {
      this.loading.dismiss();
    });
  }

  get lista_localidad_artis() {
    const artisList = this.artists;
    let artistlocalidadlist: String[] = [];
    artisList.forEach((ar) => {
      if (artistlocalidadlist.indexOf(ar.localidad) == -1) {
        artistlocalidadlist.push(ar.localidad);
      }
    });
    return artistlocalidadlist;
  }

  get lista_tipo_artis() {
    const artisList = this.artists;
    let artisttipolist: String[] = [];
    artisList.forEach((ar) => {
      if (artisttipolist.indexOf(ar.categoria) == -1) {
        artisttipolist.push(ar.categoria);
      }
    });
    return artisttipolist;
  }

    /**
   * Abre modal para reproducir video
   * @param url - URL del video que se va a ejecutar
   */
     async verVideo(url: string) {
      console.log(url);
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

    openInstagram(url: string) {
      this.browser.create(url, "_system");
    }
  
    openSpotify(url: string) {
      this.browser.create(url, "_system");
    }

  ionViewWillEnter() {
    this.unsubscribe$ = new Subject<void>();

    this.sliderSvc.getSliders();
    this.sliderSvc.slider
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        res.forEach((item) => {
          if (item.pantalla == "artistas") this.sliderArtist.push(item);
        });
      });

    this.artistSvc.getArtist();
    this.artistSvc.artist
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        this.artists = res;
      });
    this.show("Cargando lugares...");
  }

  /**se ejecuta cada vez que se sale de la tab */
  ionViewDidLeave() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
