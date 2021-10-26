import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-filter-event',
  templateUrl: './filter-event.page.html',
  styleUrls: ['./filter-event.page.scss'],
})
export class FilterEventPage implements OnInit {

  dataForm: string = '';

  filterForm: FormGroup = this.fb.group({
    departamento: ['', Validators.required],
    general: ['', Validators.required],
  });

  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
  }

  /**
   * Personalización del select de ubicación
   */
   selectCustom: any = {
    header: "Departamento",
  };

   /**
   * Cierra el modal del detalle del evento
   */
    salir() {
      this.dataForm = this.filterForm.value

      this.modalCtrl.dismiss({
        formulario: this.dataForm
      });
    }
}
