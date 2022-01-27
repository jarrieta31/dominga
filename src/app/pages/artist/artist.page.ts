import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-artist',
  templateUrl: './artist.page.html',
  styleUrls: ['./artist.page.scss'],
})
export class ArtistPage implements OnInit {

  constructor( private fb : FormBuilder ) { }

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
  
  /**controla si se muestra o no el filtro general de lugares */
  isFilterLocation = false;
  isFilterType = false;
  /**captura los datos del formulario de filtros */
  dataForm: any = "";
  /**control de acordeon de filtros */
  isOpenLocation: boolean = false;
  isOpenType: boolean = false;

  filterForm: FormGroup = this.fb.group({
    localidad: ["", Validators.required],
    tipo     : ["", Validators.required],
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
  }

  changeFilterType() {
    this.isFilterType = !this.isFilterType;
    this.isOpenType = !this.isOpenType;
    if (this.isFilterLocation) {
      this.isFilterLocation = false;
      this.isOpenLocation = false;
    }
  }

  changeLocation() {
    this.isOpenLocation = !this.isOpenLocation;
    if (this.isOpenType) {
      this.isOpenType = false;
    }
  }

  changeType() {
    this.isOpenType = !this.isOpenType;
    if (this.isOpenLocation) {
      this.isOpenLocation = false;
    }
  }

  artist: any[] = [
    {
      nombre: "Juana Agustina",
      tipo: "Artista Plástica",
      imagen: "https://pbs.twimg.com/profile_images/3126853679/e3934db663898e16c42d6e4c04e150eb.jpeg"
    },
    {
      nombre: "Cuerda La Explanada",
      tipo: "Música",
      imagen: "https://pbs.twimg.com/profile_images/3126853679/e3934db663898e16c42d6e4c04e150eb.jpeg"
    },
    {
      nombre: "Niña Lobo",
      tipo: "Banda",
      imagen: "https://pbs.twimg.com/profile_images/3126853679/e3934db663898e16c42d6e4c04e150eb.jpeg"
    },
    {
      nombre: "Juana Agustina",
      tipo: "Artista Plástica",
      imagen: "https://pbs.twimg.com/profile_images/3126853679/e3934db663898e16c42d6e4c04e150eb.jpeg"
    },
    {
      nombre: "Cuerda La Explanada",
      tipo: "Música",
      imagen: "https://pbs.twimg.com/profile_images/3126853679/e3934db663898e16c42d6e4c04e150eb.jpeg"
    },
    {
      nombre: "Niña Lobo",
      tipo: "Banda",
      imagen: "https://pbs.twimg.com/profile_images/3126853679/e3934db663898e16c42d6e4c04e150eb.jpeg"
    },
    {
      nombre: "Juana Agustina",
      tipo: "Artista Plástica",
      imagen: "https://pbs.twimg.com/profile_images/3126853679/e3934db663898e16c42d6e4c04e150eb.jpeg"
    },
    {
      nombre: "Cuerda La Explanada",
      tipo: "Música",
      imagen: "https://pbs.twimg.com/profile_images/3126853679/e3934db663898e16c42d6e4c04e150eb.jpeg"
    },
    {
      nombre: "Niña Lobo",
      tipo: "Banda",
      imagen: "https://pbs.twimg.com/profile_images/3126853679/e3934db663898e16c42d6e4c04e150eb.jpeg"
    },
    {
      nombre: "Juana Agustina",
      tipo: "Artista Plástica",
      imagen: "https://pbs.twimg.com/profile_images/3126853679/e3934db663898e16c42d6e4c04e150eb.jpeg"
    },
    {
      nombre: "Cuerda La Explanada",
      tipo: "Música",
      imagen: "https://pbs.twimg.com/profile_images/3126853679/e3934db663898e16c42d6e4c04e150eb.jpeg"
    },
    {
      nombre: "Niña Lobo",
      tipo: "Banda",
      imagen: "https://pbs.twimg.com/profile_images/3126853679/e3934db663898e16c42d6e4c04e150eb.jpeg"
    },
  ];



  ngOnInit() {
  }

}
