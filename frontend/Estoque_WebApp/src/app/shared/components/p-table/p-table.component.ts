import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-p-table',
  imports: [CommonModule],
  templateUrl: './p-table.component.html',
  styleUrl: './p-table.component.css'
})
export class PTableComponent<T> {
  @Input() data: T[] = []; //Array da tabela de tipo T
  @Input() column: { key: keyof T, label: string, }[] = []; //Definir Colunas  
}
