import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';


@Component({
  selector: 'app-event-modal',
  templateUrl: './event-modal.component.html',
  styleUrls: ['./event-modal.component.scss'],
})
export class EventModalComponent implements OnInit {

  formDateModal: FormGroup = this.fb.group({
    fechaIn : ['',,],
    fechaFin: ['',,]
  })

  constructor( 
      private modalCtrl    : ModalController,
      private fb           : FormBuilder
      ) { }

  ngOnInit() {}

  ionViewWillEnter(){
 
  }
  salirDataModal(){
    console.log(this.formDateModal.value);
    
    this.modalCtrl.dismiss({
      data: this.formDateModal
    })
  }

}
