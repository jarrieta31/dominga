import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { Eventos } from "../../shared/eventos";
import { EventDetailPage } from "../event-detail/event-detail.page";
import { FilterEventPage } from "../filter-event/filter-event.page";
import { async } from "@angular/core/testing";

@Component({
  selector: "app-events",
  templateUrl: "./events.page.html",
  styleUrls: ["./events.page.scss"],
})
export class EventsPage implements OnInit {
  now = new Date();
  textoBuscar = '';

  eventos: Eventos[] = [
    {
      id: 1,
      departamento: "San Jose",
      dia: "10/23/2021 3:00",
      fecha: "Sáb, Set 18",
      hora: "15:00 hs",
      titulo: "Las Pelotas",
      descripcion:
        "La primera semana después de la mayor crisis política del gobierno nacional comenzó el lunes por la tarde. Fue tras la jura de los flamantes funcionarios y se extendió hasta ayer durante buena parte del día. Esa hiperactividad atípica buscó erigirse en una suerte de “lavada de cara” de la imagen de la gestión, con jornadas que empiezan a primera hora y terminan con anuncios en el ocaso del día.Todo ello, junto a actos y reuniones varias, compuso la puesta en escena con la que el oficialismo busca relanzar la gestión rumbo a los comicios generales de noviembre. En ese escenario, el principal cambio en la gestión se dio con la llegada de Juan Manzur a la Jefatura de Gabinete. “Es más volumen y músculo político”, coincidieron las distintas voces consultadas por La Nación. Todos usaron ambas expresiones -repetidas casi hasta el hartazgo esta semana- para referirse a lo que consideran el principal aporte del tucumano, al que le resaltan su experiencia en gestión y que aporta una cuota de federalismo.",
      imagen:
        "https://firebasestorage.googleapis.com/v0/b/appdominga.appspot.com/o/lugares%2Ffincapiedra-01.jpg?alt=media&token=7cbc502b-13fc-4b19-b1b5-6bf30aea69c3",
    },
    {
      id: 2,
      departamento: "San Jose",
      dia: "10/30/2021 15:00",
      fecha: "Dom, Oct 31",
      hora: "15:00 hs",
      titulo: "Agarrate Catalina",
      descripcion:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      imagen:
        "https://tickantel.cdn.antel.net.uy/media/Espectaculo/40009923/700_x_390.jpg",
    },
    {
      id: 3,
      departamento: "Colonia",
      dia: "10/30/2021 15:00",
      fecha: "Mié, Nov 10",
      hora: "15:00 hs",
      titulo: "El Cuarteto de Nos",
      descripcion: "Lorem colonis ipsum dolor, sit amet consectetur adipisicing elit.",
      imagen:
        "https://tickantel.cdn.antel.net.uy/media/Espectaculo/40009899/Cuarteto_2021_Tickantel_Grilla_700x390.png",
    },
    {
      id: 4,
      departamento: "Colonia",
      dia: "10/30/2021 15:00",
      fecha: "Jue, Oct 28",
      hora: "15:00 hs",
      titulo: "Carlos Malo",
      descripcion: "Lorem ipsum dolor, sit amet consectetur adipisicing elit.",
      imagen:
        "https://tickantel.cdn.antel.net.uy/media/Espectaculo/40009869/bannerweb700x390.png",
    },
    {
      id: 5,
      departamento: "San Jose",
      dia: "10/30/2021 15:00",
      fecha: "Sáb, Set 18",
      hora: "15:00 hs",
      titulo: "Lautréamont",
      descripcion: "Lorem ipsum dolor, sit amet consectetur adipisicing elit.",
      imagen:
        "https://tickantel.cdn.antel.net.uy/media/Espectaculo/40009677/bannner_web1.jpg",
    },
  ];

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

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

  /**
   * Muestra el modal con descripción más detallada del evento seleccionado
   * @param id - id del evento
   * @param fecha - fecha del evento
   * @param hora - hora del evento
   * @param titulo - titulo del evento
   * @param descripcion - descripcion del evento
   * @param imagen - imagen del evento
   */
  async openModalDetailEvent(
    id: number,
    dia: string,
    fecha: string,
    hora: string,
    titulo: string,
    descripcion: string,
    imagen: string
  ) {
    if (descripcion.length > 250) {
      var desc = descripcion.substr(0, 250) + " ...";
    } else {
      desc = descripcion;
    }

    const modal = await this.modalCtrl.create({
      component: EventDetailPage,
      cssClass: "modal-event",
      backdropDismiss: false,
      showBackdrop: true,
      componentProps: {
        id: id,
        dia: dia,
        fecha: fecha,
        hora: hora,
        titulo: titulo,
        descripcion: desc,
        descripcion_completa: descripcion,
        imagen: imagen,
      },
    });

    await modal.present();
  }

  async filterEvents() {
    const modalFilter = await this.modalCtrl.create({
      component: FilterEventPage,
      cssClass: "filterModal",
      backdropDismiss: false,
      showBackdrop: true,
      keyboardClose: true
    });

    await modalFilter.present();

    const { data } = await modalFilter.onDidDismiss();

    // console.log('Retorno de hijo ', data)

    this.textoBuscar = data;
  }

}
