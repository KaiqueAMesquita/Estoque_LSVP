import { Component, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventEmitter } from '@angular/core';
import { IconModule, icons } from '../../modules/icon/icon.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
@Component({
  selector: 'app-p-table',
  imports: [CommonModule, IconModule],
  templateUrl: './p-table.component.html',
  styleUrl: './p-table.component.css'
})

export class PTableComponent<T>  implements OnInit {
  icons = icons
 /*Estrutura de Uma Tabela Utilizando any*/
  @Input() data: any[] = []; //Array da tabela de tipo any
  columns: string[] = []; //Definir Colunas  
  @Input() edit:boolean = false; //Habilitar Edição
  @Input() delete:boolean = false; //Habilitar Deleção
  @Input() view:boolean = false; //Habilitar Visualização
  @Output() onEdit = new EventEmitter<T>();
  @Output() onDelete = new EventEmitter<T>();
  @Output() onView = new EventEmitter<T>();

  constructor(private icon: IconModule) { }

  ngOnInit(): void {
    if (this.data.length > 0) {
      this.columns = Object.keys(this.data[0] as object);
    } else {
      this.columns = [];
    }
  }
 
 
}
