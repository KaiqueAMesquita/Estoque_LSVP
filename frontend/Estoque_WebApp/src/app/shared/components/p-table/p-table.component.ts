import { ChangeDetectionStrategy,SimpleChanges, Component, Input, OnChanges, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventEmitter } from '@angular/core';
import { IconModule, icons } from '../../modules/icon/icon.module';
import { ModalModule } from '../../modules/modal/modal.module';

@Component({
  selector: 'app-p-table',
  imports: [CommonModule, IconModule, ModalModule],
  standalone: true, 
  templateUrl: './p-table.component.html',
  styleUrl: './p-table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class PTableComponent<T>  implements OnInit, OnChanges {
  icons = icons //Importa os ícones do módulo de ícones
  @Input() title: string = ''; //Título da Tabela
  
 /*Estrutura de Uma Tabela Utilizando any*/
  @Input() data: any[] = []; //Array da tabela de tipo any
  columns: string[] = []; //Definir Colunas  
  @Input() edit:boolean = false; //Habilitar Edição
  @Input() delete:boolean = false; //Habilitar Deleção
  @Input() view:boolean = false; //Habilitar Visualização
  @Output() onEdit = new EventEmitter<T>();//Evento de Edição
  @Output() onDelete = new EventEmitter<T>();//Evento de Exclusão
  @Output() onView = new EventEmitter<T>();//Evento de Visualização


  constructor(private icon: IconModule) { }

  //Inicializa o componente e define as colunas da tabela
  ngOnInit(): void {
    this.updateColumns();
  }

  //Detecta mudanças nas propriedades de entrada
  ngOnChanges(changes: SimpleChanges): void {
   if (changes['data']) {
    this.updateColumns();
  }
}

  //Método para editar um item
  private updateColumns(): void {
    if (this.data.length > 0) {
      this.columns = Object.keys(this.data[0]);
    } else {
      this.columns = [];
    }
  }
 
 
}
