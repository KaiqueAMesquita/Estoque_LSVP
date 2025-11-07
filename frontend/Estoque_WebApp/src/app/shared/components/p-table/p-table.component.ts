import { ChangeDetectionStrategy, SimpleChanges, Component, Input, OnChanges, OnInit, Output, ViewChild, AfterViewInit, EventEmitter } from '@angular/core'; // <-- MUDANÇA: Adicionado EventEmitter
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
  @Output() onSelect = new EventEmitter<T | undefined>(); // <-- MUDANÇA: Novo EventEmitter para a seleção
  @Output() searchEvent = new EventEmitter<string>();

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
      debounceTime(300), // espera 300ms após a última emissão
      distinctUntilChanged() // só emite se o valor mudou
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
    this.onSelect.emit(this.rowSelected); // <-- MUDANÇA: Emite o evento com a linha selecionada ou undefined
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

  public orderBy(column: string): void {
    this.sortDirection[column] = this.sortDirection[column] === 'asc' ? 'desc' : 'asc';
    const direction = this.sortDirection[column];

    this.data.sort((a, b) => {
      const valueA = a[column];
      const valueB = b[column];

      if (valueA == null && valueB == null) return 0;
      if (valueA == null) return direction === 'asc' ? -1 : 1;
      if (valueB == null) return direction === 'asc' ? 1 : -1;

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return direction === 'asc' ? valueA - valueB : valueB - valueA;
      }

      const strA = valueA.toString().toLowerCase();
      const strB = valueB.toString().toLowerCase();
      if (strA < strB) return direction === 'asc' ? -1 : 1;
      if (strA > strB) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }
}