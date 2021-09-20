import { Component, OnInit } from '@angular/core';
import { Eventos } from '../../shared/eventos';

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
})
export class EventsPage implements OnInit {

  eventos: Eventos[] = [
    {fecha: 'Sáb, Set 18',  titulo: 'Cuatro Pesos de Propina', descripcion: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit.', imagen: 'https://tickantel.cdn.antel.net.uy/media/Espectaculo/40009840/Banner.png'}, 
    {fecha: 'Dom, Oct 31',  titulo: 'Copla Alta', descripcion: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit.', imagen: 'https://tickantel.cdn.antel.net.uy/media/Espectaculo/40009958/Banner.png'}, 
    {fecha: 'Mié, Nov 10',  titulo: 'Facundo Arana - En el Aire', descripcion: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit.', imagen: 'https://tickantel.cdn.antel.net.uy/media/Espectaculo/40009769/TickantelBanner.png'}, 
    {fecha: 'Jue, Oct 28',  titulo: 'Marcel Keoroglian', descripcion: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit.', imagen: 'https://tickantel.cdn.antel.net.uy/media/Espectaculo/40009960/Banner.png'}, 
    {fecha: 'Sáb, Set 18',  titulo: 'Cuatro Pesos de Propina', descripcion: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit.', imagen: 'https://tickantel.cdn.antel.net.uy/media/Espectaculo/40009840/Banner.png'}, 
  ];

  constructor() { }

  ngOnInit() {
  }

  selectCustom: any = {
    header: 'Departamento',
  };

}
