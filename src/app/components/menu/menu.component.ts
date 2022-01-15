import { Component, OnInit } from "@angular/core";
import { MenuController } from "@ionic/angular";
import { Router } from "@angular/router";

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.scss"],
})
export class MenuComponent implements OnInit {
  darkMode: string;
  dyslexicMode: string;
  modoOscuro: string = localStorage.getItem("modoOscuro");
  dyslexic: string = localStorage.getItem("dyslexic");
  labelCheck: boolean = false;
  dyslexicCheck: boolean = false;

  constructor(private menuCtrl: MenuController, private router: Router) {}

  ngOnInit() {}

  toggleMenu() {
    this.menuCtrl.toggle();
  }

  changeTheme() {
    this.darkMode = localStorage.getItem("modoOscuro");

    if (this.darkMode == "true") {
      localStorage.removeItem("modoOscuro");
      document.body.classList.toggle("dark");
      this.modoOscuro = localStorage.getItem("modoOscuro");
      this.labelCheck = false;
    } else {
      localStorage.setItem("modoOscuro", JSON.stringify(true));
      document.body.classList.toggle("dark");
      this.labelCheck = true;
    }
  }

  dyslexicFont() {
    this.dyslexicMode = localStorage.getItem("dyslexic");

    if (this.dyslexicMode == "true") {
      localStorage.removeItem("dyslexic");
      document.body.classList.toggle("dyslexic");
      this.dyslexic = localStorage.getItem("dyslexic");
      this.dyslexicCheck = false;
    } else {
      localStorage.setItem("dyslexic", JSON.stringify(true));
      document.body.classList.toggle("dyslexic");
      this.dyslexicCheck = true;
      this;
    }
  }

  sleep() {
    this.router.navigate(["tabs/sleep"]);
    this.menuCtrl.toggle();
  }

  artist() {
    this.router.navigate(["tabs/artist"]);
    this.menuCtrl.toggle();
  }

  info() {
    this.router.navigate(["tabs/info"]);
    this.menuCtrl.toggle();
  }
}
