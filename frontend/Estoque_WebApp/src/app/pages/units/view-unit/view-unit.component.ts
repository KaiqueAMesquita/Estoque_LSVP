import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PTableComponent } from '../../../shared/components/p-table/p-table.component';
import { UnitService } from '../../../core/services/unit.service';
import { Unit } from '../../../shared/models/unit';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../../core/authentication/authentication.service';
import { NavigationWatcherService } from '../../../core/services/navigation-watcher.service';
import { ViewTemplateComponent } from '../../../shared/components/view-template/view-template.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { ModalModule } from '../../../shared/modules/modal/modal.module';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContainerService } from '../../../core/services/container.service';
import { Container } from '../../../shared/models/container';

@Component({
  selector: 'app-view-unit',
  imports: [PTableComponent, CommonModule, ViewTemplateComponent, ModalModule, ReactiveFormsModule],
  templateUrl: './view-unit.component.html',
  styleUrl: './view-unit.component.css',
  standalone: true
})
export class ViewUnitComponent implements OnInit, OnDestroy {
  units: Unit[] = [];
  private navigationSub?: Subscription;
  pagedView: boolean = false;
  pageNumber: number = 0;
  totalPages: number = 0;
  private searchTerm: string = '';
  // Transfer
  transferForm: FormGroup;
  containers: Container[] = [];
  selectedUnit: any | null = null;
  @ViewChild('transferModal') transferModal!: ModalComponent;
  @ViewChild('successTransferModal') successTransferModal!: ModalComponent;

  constructor(
    private unitService: UnitService,
    private auth: AuthenticationService,
    public router: Router,
    private navigationWatcher: NavigationWatcherService,
    private fb: FormBuilder,
    private containerService: ContainerService
  ) {
    this.transferForm = this.fb.group({
      destinyContainerId: [null, [Validators.required]],
      quantity: [null, [Validators.required, Validators.min(0.01)]]
    });
  }

  ngOnInit(): void {
    this.loadUnits(this.pageNumber);

    // carrega containers para o select
    this.loadContainers();

    this.navigationSub = this.navigationWatcher.navigation$.subscribe(() => {
      if (this.router.url.startsWith('/manage/view/units')) {
        this.loadUnits(this.pageNumber);
      }
    });
  }

  ngOnDestroy(): void {
    this.navigationSub?.unsubscribe();
  }

  private loadUnits(page: number = 0, batch?: string): void {
    this.unitService.getAllUnits(page, 20, 'id,desc', undefined, batch).subscribe({
      next: (response) => {
        // Configurações de paginação
        this.pagedView = response.totalPages > 1;
        this.totalPages = response.totalPages;
        this.pageNumber = response.number;

        // Mapeamento e Limpeza de dados (Tudo dentro do next)
        this.units = response.content.map((unit: Unit) => {
          // 1. Cria uma cópia do objeto para não mutar a referência original inesperadamente
          const newUnit = {
            ...unit,
            expiration_date: unit.expiration_date ? new Date(unit.expiration_date) : new Date(),
          };

      
          return newUnit;
        });
      },
      error: (error) => console.error('Erro ao carregar unidades:', error)
    });
  }

  EditUnit(id: number): void {
    console.log('Tentando editar ID:', id); 
    if (id) {
      this.router.navigate(['/manage/edit/unit', id]);
    } else {
      console.error('ID inválido para edição');
    }
  }

  private loadContainers(page: number = 0): void {
    this.containerService.getAllContainers(page, 50).subscribe({
      next: (response) => {
        this.containers = response.content || [];
      },
      error: (err) => console.error('Erro ao carregar containers:', err)
    });
  }

  openTransferAction(unit: any): void {
    console.log('openTransferAction called with unit:', unit);
    this.selectedUnit = unit;

    const currentStock = unit.quantity || 0;

    this.transferForm.reset();
    this.transferForm.controls['quantity'].setValidators([
      Validators.required,
      Validators.min(0.01),
      Validators.max(currentStock)
    ]);
    this.transferForm.controls['quantity'].updateValueAndValidity();

    if (!this.transferModal) {
      console.error('transferModal ViewChild not found');
      return;
    }

    try {
      this.transferModal.toggle();
    } catch (e) {
      console.error('Erro ao abrir modal de transferência', e);
    }
  }

  confirmTransfer(): void {
    if (this.transferForm.invalid || !this.selectedUnit) {
      this.transferForm.markAllAsTouched();
      return;
    }

    const qtd = this.transferForm.value.quantity;
    const destinyContainerId = this.transferForm.value.destinyContainerId;
    const id = this.selectedUnit.unitId || this.selectedUnit.id;

    const transfer = {
      unitId: id,
      quantity: qtd,
      destinyContainerId: destinyContainerId,
      userId: 1 // TODO: obter userId real via AuthenticationService
    };

    this.unitService.transferUnit(transfer).subscribe({
      next: (res) => {
        this.transferModal.toggle();
        this.successTransferModal.toggle();
        this.loadUnits(this.pageNumber);
      },
      error: (err) => {
        console.error('Erro na transferência', err);
        alert('Ocorreu um erro ao realizar a transferência.');
      }
    });
  }

  onPageChange(page: number): void {
    this.pageNumber = page;
    this.loadUnits(page, this.searchTerm);
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.loadUnits(0, this.searchTerm);
  }
}