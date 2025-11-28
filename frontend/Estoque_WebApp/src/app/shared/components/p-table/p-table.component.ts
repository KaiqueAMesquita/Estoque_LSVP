import { ChangeDetectionStrategy, SimpleChanges, Component, Input, OnChanges, OnInit, Output, ViewChild, AfterViewInit, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconModule, icons } from '../../modules/icon/icon.module';
import { ModalModule } from '../../modules/modal/modal.module';
import { ModalComponent } from '../modal/modal.component';
import { EmptyComponentComponent } from '../empty-component/empty-component.component';
import { TranslationPipe } from './../../../core/pipes/translation.pipe';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-p-table',
  imports: [CommonModule, IconModule, ModalModule, EmptyComponentComponent, TranslationPipe],
  standalone: true,
  templateUrl: './p-table.component.html',
  styleUrl: './p-table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PTableComponent<T> implements OnInit, OnChanges, AfterViewInit {
  icons = icons;
  @Input() title: string = '';
  @Input() data: any[] = [];
  @Input() showSearch: boolean = false;
  @Input() edit: boolean = false;
  @Input() delete: boolean = false;
  @Input() view: boolean = false;
  @Input() select: boolean = false;

  @Output() onEdit = new EventEmitter<T>();
  @Output() onDelete = new EventEmitter<T>();
  @Output() onView = new EventEmitter<T>();
  @Output() onSelect = new EventEmitter<T | undefined>();
  @Output() searchEvent = new EventEmitter<string>();
  
  // NOVA SAÍDA: Emite o padrão "campo,direcao"
  @Output() onSort = new EventEmitter<string>(); 

  rowSelected?: T;
  sortDirection: { [key: string]: 'asc' | 'desc' } = {};
  columns: string[] = [];
  initialData: any[] = [];
  attemptedDeleteId?: any;
  @ViewChild('excluido') wasDeleteModal!: ModalComponent;
  private searchSubject = new Subject<string>();

  constructor(private icon: IconModule) {}

  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.initialData = [...this.data];
    this.updateColumns();

    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.searchEvent.emit(searchTerm);
    });
  }

  toggleSelected(row: T): void {
    if (this.select === false) return;

    if (this.rowSelected === row) {
      this.rowSelected = undefined;
    } else {
      this.rowSelected = row;
    }
    this.onSelect.emit(this.rowSelected);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.attemptedDeleteId != null) {
      const aindaExiste = this.data.some(
        item => (item as any).id === this.attemptedDeleteId
      );
      if (!aindaExiste) {
        this.wasDeleteModal.toggle();
      }
      this.attemptedDeleteId = undefined;
    }

    if (changes['data'] && changes['data'].currentValue) {
      this.initialData = [...changes['data'].currentValue];
      this.updateColumns();
    }
  }

  private updateColumns(): void {
    if (this.data.length > 0) {
      this.columns = Object.keys(this.data[0]);
    } else {
      this.columns = [];
    }
  }

  onSearchInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchSubject.next(input.value);
  }

  deleteItem(row: T): void {
    this.attemptedDeleteId = (row as any).id;
    this.onDelete.emit(row);
  }

  // MÉTODO TOTALMENTE MODIFICADO PARA SERVER-SIDE SORT
  public orderBy(column: string): void {
    // 1. Inverte a direção atual ou define como 'asc' se for o primeiro clique
    this.sortDirection[column] = this.sortDirection[column] === 'asc' ? 'desc' : 'asc';
    
    // 2. Cria a string no formato que o Spring Boot (pageable) geralmente aceita
    const direction = this.sortDirection[column];
    const sortPayload = `${column},${direction}`;

    // 3. Emite o evento para o componente pai buscar os dados novos
    this.onSort.emit(sortPayload);

    // NOTA: Removemos a lógica antiga de this.data.sort(). 
    // Agora a tabela espera que o pai atualize o Input [data].
  }
}