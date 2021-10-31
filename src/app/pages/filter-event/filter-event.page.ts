import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModalController } from "@ionic/angular";
import { DatabaseService } from "src/app/services/database.service";
import { Departament } from "src/app/shared/departament";
import { Eventos } from "src/app/shared/eventos";

@Component({
  selector: "app-filter-event",
  templateUrl: "./filter-event.page.html",
  styleUrls: ["./filter-event.page.scss"],
})
export class FilterEventPage implements OnInit {
  dataForm: string = "";
  departamentosActivos: Departament[] = [];
  localidadesActivas: string[];
  localidadesUnicas: string[];

  filterForm: FormGroup = this.fb.group({
    departamento: ["", Validators.required],
    general: ["", Validators.required],
    localidad: ["", Validators.required],
    fecha: ["", Validators.required],
  });

  eventos: Eventos[] = [];

  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private dbService: DatabaseService
  ) {}

  ngOnInit() {
    this.getAll();
  }

  /**
   * Personalización del select de ubicación
   */
  selectCustom: any = {
    header: "Departamento",
  };

  /**
   * Personalización del select de localidad
   */
  selectCustomLocation: any = {
    header: "Localidad",
  };

  /**
   * Cierra el modal del detalle del evento
   */
  salir() {
    this.dataForm = this.filterForm.value;

    this.modalCtrl.dismiss({
      formulario: this.dataForm,
    });
  }

  /**
   * Obtengo todos los departamentos activos de la base (departamentos activos son aquellos que habilitados para tener eventos)
   */
  getDepartamentosActivos() {
    this.dbService.getCollection("departamento", (ref) =>
      ref.where("status", "==", true)
    ).subscribe((response) => {
      this.departamentosActivos = response
    });
  }

  /**
   * Obtengo todas las localidades del departamento pasado por parametro que tienen eventos activos
   * @param departament - Departamento de filtro
   */
  getLocalidadesActivas(departament: string) {
    this.localidadesActivas = [];
    this.eventos.forEach((res) => {
      if (res.departamento == departament)
        this.localidadesActivas.push(res.localidad);
    });

    this.localidadesUnicas = [... new Set(this.localidadesActivas)];
  }

  /**
   * Obtengo todos los eventos para conocer las localidades con eventos
   */
  getEventos() {
    this.dbService
      .getCollection("evento", (ref) => ref)
      .subscribe((res) => {
        this.eventos = res;
      });
  }

  /**
   * Se obtienen los departamentos activos y las localidades activas por evento
   */
  getAll(){
    this.getDepartamentosActivos();
    this.getEventos();
  }
}
