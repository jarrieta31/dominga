import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-artist',
  templateUrl: './artist.page.html',
  styleUrls: ['./artist.page.scss'],
})
export class ArtistPage implements OnInit {

  constructor() { }

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

  ngOnInit() {
  }

}
