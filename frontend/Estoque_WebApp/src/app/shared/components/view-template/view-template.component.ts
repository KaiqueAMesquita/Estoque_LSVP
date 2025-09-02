import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-view-template',
  imports: [CommonModule],
  templateUrl: './view-template.component.html',
  styleUrl: './view-template.component.css'
})
export class ViewTemplateComponent {
  @Input() createText: string = 'Criar Novo';
  @Output() createNewEvent = new EventEmitter<void>();
  
  comeBack() {
    window.history.back();
  }
  createNew() {
    this.createNewEvent.emit();
  }

}
