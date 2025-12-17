import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconModule, icons } from '../../modules/icon/icon.module';

@Component({
  selector: 'app-view-template',
  imports: [CommonModule, IconModule],
  templateUrl: './view-template.component.html',
  styleUrl: './view-template.component.css'
})
export class ViewTemplateComponent {
  icons = icons;
  @Input() createText: string = 'Criar Novo';
  @Output() createNewEvent = new EventEmitter<void>();
  @Output() pageChangeEvent = new EventEmitter<number>();
  @Input() isPagedView: boolean = false;
  @Input() pageNumber: number = 0;
  @Input() totalPages: number = 0;
  
  comeBack() {
    window.history.back();
  }
  createNew() {
    this.createNewEvent.emit();
  }
  togglePage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.pageChangeEvent.emit(page);
    }
  }

}
