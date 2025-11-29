import { Component, inject, Injector } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import {ModalService} from '../../../services/Modal-service/modal-service';

@Component({
  selector: 'app-modal-container',
  standalone: true,
  imports: [],
  template: './modal-container-component.html',
  styles: []
})
export class ModalContainerComponent {
  modal = inject(ModalService);

  close() {
    this.modal.close();
  }

  createInjector() {
    return Injector.create({
      providers: [
        { provide: 'MODAL_DATA', useValue: this.modal.data() }
      ]
    });
  }
}
