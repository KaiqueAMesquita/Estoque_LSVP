import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PTableComponent } from '../../../shared/components/p-table/p-table.component';
import { ViewTemplateComponent } from '../../../shared/components/view-template/view-template.component';
import { DashboardCookService } from '../../../core/services/dashboard-cook.service'; 
import { KitchenUnit } from './../../../shared/models/kitchen-unit';
import { ManageLayoutComponent } from '../../../shared/layouts/manage-layout/manage-layout.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component'; 
import { ModalModule } from '../../../shared/modules/modal/modal.module';
import { MovementService } from '../../../core/services/movement.service';
import { Consumption } from '../../../shared/models/consumption';
import { lastValueFrom } from 'rxjs';
import { UnitService } from '../../../core/services/unit.service';
import { ContainerService } from '../../../core/services/container.service';
import { icons } from '../../../shared/modules/icon/icon.module';
import { Container } from '../../../shared/models/container';
@Component({
  selector: 'app-view-kitchen-units',
  imports: [
    PTableComponent, 
    ViewTemplateComponent, 
    CommonModule, 
    ManageLayoutComponent,
    ModalModule,
    ReactiveFormsModule 
  ],
  templateUrl: './view-kitchen-units.component.html',
  styleUrl: './view-kitchen-units.component.css',
  standalone: true
})
export class ViewKitchenUnitsComponent implements OnInit {
  
  units: KitchenUnit[] = [];
  
  pagedView: boolean = false;
  pageNumber: number = 0;
  totalPages: number = 0;

  // Controle do Formulário e Modal
  consumptionForm: FormGroup;
  selectedUnit: any | null = null; // Tipo any para flexibilidade com as propriedades da tabela
  
  @ViewChild('consumptionModal') consumptionModal!: ModalComponent;
  @ViewChild('successModal') successModal!: ModalComponent;
  @ViewChild('transferModal') transferModal!: ModalComponent;
  @ViewChild('successTransferModal') successTransferModal!: ModalComponent;

  transferForm: FormGroup;
  containers: Container[] = [];

  unitActions: Array<{ key: string; icon: keyof typeof icons; color?: string; title?: string }> = [
    { key: 'transfer', icon: 'faRightLeft', color: '#007bff', title: 'Transferência' },
    { key: 'consume', icon: 'faUtensils', color: '#dc3545', title: 'Registrar Baixa' }
  ];

  constructor(
    private cookService: DashboardCookService,
    private movementService: MovementService,
    private fb: FormBuilder,
    private unitService: UnitService,
    private containerService: ContainerService
  ) {
    // Inicializa formulário com validação básica
    this.consumptionForm = this.fb.group({
      quantity: [null, [Validators.required, Validators.min(0.01)]]
    });

    this.transferForm = this.fb.group({
      destinyContainerId: [null, [Validators.required]],
      quantity: [null, [Validators.required, Validators.min(0.01)]]
    });
  }

  ngOnInit(): void {
    this.loadUnits(this.pageNumber);
  }

  loadUnits(page: number = 0): void {
    this.cookService.kitchenUnits(page, 20).subscribe({
      next: (response) => {
        this.pagedView = response.totalPages > 1;
        this.totalPages = response.totalPages;
        this.pageNumber = typeof response.number === 'number' ? response.number : page;

        this.units = response.content.map((unit: KitchenUnit) => ({
          ...unit,
          expirationDate: unit.expirationDate ? new Date(unit.expirationDate) : new Date() 
        }));
      },
      error: (error) => console.error('Erro ao carregar unidades da cozinha:', error)
    });
  }

  private loadContainers(page: number = 0): void {
    this.containerService.getAllContainers(page, 50).subscribe({
      next: (response) => {
        this.containers = response.content || [];
      },
      error: (err) => console.error('Erro ao carregar containers:', err)
    });
  }

  onPageChange(page: number): void {
    this.pageNumber = page;
    this.loadUnits(page);
  }

  // --- Lógica de Consumo ---

  /**
   * Acionado pelo evento (onView) da P-Table.
   * Prepara o modal e define a validação de máximo baseada no estoque atual.
   */
  openConsumeAction(unit: any): void {
    this.selectedUnit = unit;
    
    // Identifica a quantidade atual (assumindo que o campo na tabela/objeto seja 'quantity' ou 'amount')
    const currentStock = unit.quantity || 0; 

    // Reinicia o form e define os validadores dinamicamente
    this.consumptionForm.reset();
    this.consumptionForm.controls['quantity'].setValidators([
      Validators.required,
      Validators.min(0.01),
      Validators.max(currentStock) // O PULO DO GATO: Impede consumir mais que o estoque
    ]);
    this.consumptionForm.controls['quantity'].updateValueAndValidity();

    this.consumptionModal.toggle();
  }

  onTableAction(event: { key: string; row: any }): void {
    if (event.key === 'transfer') {
      this.openTransferAction(event.row);
    } else if (event.key === 'consume') {
      this.openConsumeAction(event.row);
    } else {
      console.warn('Ação desconhecida:', event.key);
    }
  }

  openTransferAction(unit: any): void {
    this.selectedUnit = unit;

    const currentStock = unit.quantity || 0;

    this.transferForm.reset();
    this.transferForm.controls['quantity'].setValidators([
      Validators.required,
      Validators.min(0.01),
      Validators.max(currentStock)
    ]);
    this.transferForm.controls['quantity'].updateValueAndValidity();

    this.loadContainers();

    try {
      this.transferModal.toggle();
    } catch (e) {
      console.error('Erro ao abrir modal de transferência', e);
    }
  }

  async confirmTransfer(): Promise<void> {
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

    try {
      await lastValueFrom(this.unitService.transferUnit(transfer));
      try { this.transferModal.toggle(); } catch {}
      try { this.successTransferModal.toggle(); } catch {}
      this.loadUnits(this.pageNumber);
    } catch (err) {
      console.error('Erro na transferência', err);
      alert('Ocorreu um erro ao realizar a transferência.');
    }
  }

  confirmConsumption(): void {
    if (this.consumptionForm.invalid || !this.selectedUnit) {
      this.consumptionForm.markAllAsTouched();
      return;
    }

    const qtdToConsume = this.consumptionForm.value.quantity;
    
    // Tenta pegar o ID correto (unitId ou id)
    const id = this.selectedUnit.unitId || this.selectedUnit.id;

    const consumptionData: Consumption = {
      unitId: id,
      quantityConsumed: qtdToConsume,
      userId: 1 // TODO: Obter userId dinamicamente via serviço de autenticação
    };

    this.movementService.consumptionMovement(consumptionData).subscribe({
      next: (res) => {
        this.consumptionModal.toggle(); // Fecha modal de consumo
        this.successModal.toggle();     // Abre modal de sucesso
        this.loadUnits(this.pageNumber); // Atualiza a tabela
      },
      error: (err) => {
        console.error('Erro ao processar consumo', err);
        alert('Ocorreu um erro ao processar o consumo.');
      }
    });
  }
}