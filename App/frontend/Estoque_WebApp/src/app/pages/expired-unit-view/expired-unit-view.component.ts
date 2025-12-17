import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { lastValueFrom } from 'rxjs';

import { PTableComponent } from '../../shared/components/p-table/p-table.component';
import { ViewTemplateComponent } from '../../shared/components/view-template/view-template.component';
import { ModalModule } from '../../shared/modules/modal/modal.module';
import { ModalComponent } from '../../shared/components/modal/modal.component';

import { UnitService } from '../../core/services/unit.service';
import { ContainerService } from '../../core/services/container.service';
import { ExpiredUnit } from '../../shared/models/expired-unit';
import { Container, ContainerType } from '../../shared/models/container';
import { icons } from '../../shared/modules/icon/icon.module';
import { NavBarComponent } from '../../shared/components/nav-bar/nav-bar.component';
import { ManageLayoutComponent } from '../../shared/layouts/manage-layout/manage-layout.component';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-expired-unit-view',
  standalone: true,
  imports: [CommonModule, PTableComponent, ViewTemplateComponent, ModalModule, ReactiveFormsModule, NavBarComponent,ManageLayoutComponent],
  templateUrl: './expired-unit-view.component.html',
  styleUrl: './expired-unit-view.component.css'
})
export class ExpiredUnitViewComponent implements OnInit {
  icons = icons;
  expiredUnits: ExpiredUnit[] = [];
  containers: Container[] = [];
  transferForm: FormGroup;
  selectedUnit: ExpiredUnit | null = null;

  @ViewChild('transferModal') transferModal!: ModalComponent;
  @ViewChild('successTransferModal') successTransferModal!: ModalComponent;

  unitActions: Array<{ key: string; icon: keyof typeof icons; color?: string; title?: string }> = [
    { key: 'transfer', icon: 'faRightLeft', color: '#007bff', title: 'Transferir para Descarte' }
  ];

  constructor(
    private unitService: UnitService,
    private containerService: ContainerService,
    private fb: FormBuilder,
    public router: Router
  ) {
    this.transferForm = this.fb.group({
      destinyContainerId: [null, [Validators.required]],
      quantity: [null, [Validators.required, Validators.min(0.01)]]
    });
  }

  ngOnInit(): void {
    this.loadExpiredUnits();
  }

  private loadExpiredUnits(): void {
    // Busca unidades expiradas na rota dedicada do serviço
    this.unitService.getExpiredUnits(0, 100, 'expirationDate,desc').subscribe({
      next: (response: any) => {
        const list = response.content || [];
        this.expiredUnits = list.map((u: any) => ({
          ...u,
          id: u.unitId || u.id,
          expiration_date: u.expirationDate ? new Date(u.expirationDate) : null
        })).filter((u: any) => u.quantity > 0);
      },
      error: (err) => console.error('Erro ao carregar unidades expiradas:', err)
    });
  }

  async loadDiscardContainers(): Promise<void> {
    try {
      const response: any = await lastValueFrom(this.containerService.getAllContainers(0, 500));
      const all = response.content || [];
      
      // FILTRO CRÍTICO: Apenas containers do tipo DESCARTE
      this.containers = all.filter((c: Container) => 
        c.type === ContainerType.DESCARTE || 
        c.type?.toString() === 'DESCARTE'
      );
    } catch (err) {
      console.error('Erro ao carregar locais de descarte:', err);
    }
  }

  onTableAction(event: { key: string; row: any }): void {
    if (event.key === 'transfer') {
      this.openTransferAction(event.row);
    }
  }

  async openTransferAction(unit: ExpiredUnit): Promise<void> {
    this.selectedUnit = unit;
    this.transferForm.reset();
    
    // Configura validação dinâmica baseada no estoque atual da unidade
    this.transferForm.controls['quantity'].setValidators([
      Validators.required,
      Validators.min(0.01),
      Validators.max(unit.quantity)
    ]);
    
    await this.loadDiscardContainers();
    this.transferModal.toggle();
  }

  async confirmTransfer(): Promise<void> {
  // 1. Verificação de segurança: Se não houver unidade ou o formulário for inválido, para aqui.
  if (this.transferForm.invalid || !this.selectedUnit) {
    return;
  }

  // 2. Extraímos o ID e garantimos que ele existe
  const id = this.selectedUnit.id;

  if (id === undefined || id === null) {
    console.error('ID da unidade não encontrado.');
    return;
  }

  // 3. Agora o TypeScript sabe que 'id' é um 'number' (não undefined)
  const transferData: any = {
    unitId: id, // Aqui o erro desaparece
    quantity: this.transferForm.value.quantity,
    destinyContainerId: Number(this.transferForm.value.destinyContainerId),
    userId: 1 
  };

  try {
    await lastValueFrom(this.unitService.transferUnit(transferData));
    this.transferModal.toggle();
    this.successTransferModal.toggle();
    this.loadExpiredUnits();
  } catch (err) {
    console.error('Erro na transferência:', err);
    alert('Ocorreu um erro ao realizar a transferência.');
  }
}
}