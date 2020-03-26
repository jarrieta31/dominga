import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

import { DatabaseService } from '../../services/database.service';

import { CircuitsModel } from '../../models/circuits'

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  items : CircuitsModel[] = [];
  //items: any[] = [];


  constructor(public database: DatabaseService) { 
    // this.items = [
    //   {
    //     name: "Intendencia",
    //     description: "",
    //     coordinates: [
    //         -56.713244,
    //         -34.341157
    //     ],
    //     image: "/assets/img/intendencia2.jpg"
    //   },
    //   {
    //     name: "Capilla Nuestra Sra. del Huerto",
    //     description: "",
    //     coordinates: [
    //         -56.710823,
    //         -34.337895
    //     ],
    //     image: "/assets/img/capilla.jpg"
    //   },
    //   {
    //     name: "Casa Dominga",
    //     description: "",
    //     coordinates: [
    //         -56.714517,
    //         -34.339999
    //     ],
    //     image: "/assets/img/casa_01.png"
    //   },
    //   {
    //     name: "Catedral Basílica de San José",
    //     description: "",
    //     coordinates: [
    //         -56.713524,
    //         -34.340187
    //     ],
    //     image: "/assets/img/basilica-catedral.jpg"
    //   },
    //   {
    //     name: "Antigua Estación de AFE",
    //     description: "",
    //     coordinates: [
    //         -56.712935,
    //         -34.332543
    //     ],
    //     image: "/assets/img/afe.JPG"
    //   },
    //   {
    //     name: "Teatro Macció",
    //     description: "",
    //     coordinates: [
    //         -56.71354,
    //         -34.338858
    //     ],
    //     image: "/assets/img/teatro.jpg"
    //   }

        
    // ];
  }

  ngOnInit() {
    this.getCircuitos();
  }

   async getCircuitos(){
    this.database.getCircuits().subscribe((resultado: any) => {
          this.items = [];
        //console.log(resultado);

        resultado.forEach((circuito: any) => {
           circuito.descripcion = circuito.descripcion.substr(0, 40) + " ...";
         });
        this.items = resultado;
    });
  }

  cerrarSesion() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

}
