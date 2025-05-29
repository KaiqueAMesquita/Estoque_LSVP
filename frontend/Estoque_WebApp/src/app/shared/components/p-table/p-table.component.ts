import { Component, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventEmitter } from '@angular/core';
@Component({
  selector: 'app-p-table',
  imports: [CommonModule],
  templateUrl: './p-table.component.html',
  styleUrl: './p-table.component.css'
})
export class PTableComponent<T> {
  @Input() data: T[] = []; //Array da tabela de tipo T
  @Input() column: { key: keyof T, label: string, }[] = []; //Definir Colunas  
  @Input() edit:boolean = false; //Habilitar Edição
  @Input() delete:boolean = false; //Habilitar Deleção
  @Output() onEdit = new EventEmitter<T>();
  @Output() onDelete = new EventEmitter<T>();

}