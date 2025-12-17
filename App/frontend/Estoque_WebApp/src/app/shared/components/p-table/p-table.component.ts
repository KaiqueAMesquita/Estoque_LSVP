import { ChangeDetectionStrategy, SimpleChanges, Component, Input, OnChanges, OnInit, Output, ViewChild, AfterViewInit, EventEmitter, DoCheck, ElementRef } from '@angular/core';
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
export class PTableComponent<T> implements OnInit, OnChanges, AfterViewInit, DoCheck {
  icons = icons;
  @Input() title: string = '';
  @Input() data: any[] = [];
  @Input() showSearch: boolean = false;
  @Input() edit: boolean = false;
  @Input() delete: boolean = false;
  @Input() view: boolean = false;
  @Input() actions: Array<{ key: string; icon: keyof typeof icons; color?: string; title?: string }> = [];
  @Input() select: boolean = false;
  @Output() onEdit = new EventEmitter<T>();
  @Output() onDelete = new EventEmitter<T>();
  @Output() onView = new EventEmitter<T>();
  @Output() onAction = new EventEmitter<{ key: string; row: any }>();
  @Output() onSelect = new EventEmitter<T | undefined>();
  @Output() searchEvent = new EventEmitter<string>();
  
  @Output() onSort = new EventEmitter<string>(); 
  rowSelected?: T;
  sortDirection: { [key: string]: 'asc' | 'desc' } = {};
  columns: string[] = [];
  initialData: any[] = [];
  attemptedDeleteId?: any;
  @ViewChild('excluido') wasDeleteModal!: ModalComponent;
  private searchSubject = new Subject<string>();

  public scale: number = 1;
  private lastDataLength: number = -1;
  private readonly scaleStart: number = 5;
  private readonly minScale: number = 0.75; 

  @ViewChild('tableContainer', { static: true }) tableContainer!: ElementRef<HTMLDivElement>;

  constructor(private icon: IconModule) {}

  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.initialData = [...this.data];
    this.updateColumns();
    this.updateScale();
    this.lastDataLength = this.data?.length || 0;

    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.searchEvent.emit(searchTerm);
    });
  }

  ngDoCheck(): void {
    const len = this.data?.length || 0;
    if (len !== this.lastDataLength) {
      this.lastDataLength = len;
      this.updateScale();
    }
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
      this.updateScale();
    }
  }

  private updateColumns(): void {
    if (this.data.length > 0) {
      this.columns = Object.keys(this.data[0]);
    } else {
      this.columns = [];
    }
  }

  private updateScale(): void {
    const len = this.data?.length || 0;
    if (len <= this.scaleStart) {
      this.scale = 1;
    } else {
      this.scale = Math.max(this.minScale, this.scaleStart / len);
    }

    // Ensure the CSS var is applied immediately to the container (handles mutated arrays)
    try {
      if (this.tableContainer && this.tableContainer.nativeElement) {
        this.tableContainer.nativeElement.style.setProperty('--scale-factor', String(this.scale));
      }
    } catch (e) {
      // ignore if view not ready
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
    const sortPayload = `${column},${direction}`;

    this.onSort.emit(sortPayload);

  }
}