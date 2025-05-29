import { Component } from '@angular/core';
@Component({
  selector: 'app-modal',
  standalone: false,
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {
  show: boolean = false;

  toggle () {
    this.show = !this.show;
  }
}
