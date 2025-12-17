import { Component } from '@angular/core';
@Component({
  selector: 'app-modal',
  standalone: false,
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {
  show: boolean = false;

  // Método para abrir o modal
  toggle () {
    this.show = !this.show;
  }
}
