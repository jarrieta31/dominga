import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inclusive-modal',
  templateUrl: './inclusive-modal.page.html',
  styleUrls: ['./inclusive-modal.page.scss'],
})
export class InclusiveModalPage implements OnInit {

  darkMode: string;
  dyslexicMode: string;
  modoOscuro: string = localStorage.getItem("modoOscuro");
  dyslexic: string = localStorage.getItem("dyslexic");

  constructor() { }

  ngOnInit() {
  }

  /**
     * Cambiar de modo (clásico/oscuro)
     */
   changeTheme(){
    this.darkMode = localStorage.getItem("modoOscuro");

    if(this.darkMode == 'true'){
        localStorage.removeItem("modoOscuro")            
        document.body.classList.toggle('dark');
        this.modoOscuro = localStorage.getItem("modoOscuro");  
    }
    else {
        localStorage.setItem("modoOscuro", JSON.stringify(true))
        document.body.classList.toggle('dark');
    }   
}

dyslexicFont(){
    this.dyslexicMode = localStorage.getItem("dyslexic");

    if(this.dyslexicMode == 'true'){
        localStorage.removeItem("dyslexic");         
        document.body.classList.toggle('dyslexic');
        this.dyslexic = localStorage.getItem("dyslexic");  
    }
    else {
        localStorage.setItem("dyslexic", JSON.stringify(true))
        document.body.classList.toggle('dyslexic');
    }   
}

}
