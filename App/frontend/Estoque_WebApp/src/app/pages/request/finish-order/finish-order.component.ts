import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { finalize } from 'rxjs';

// Services & Auth
import { OrderService } from '../../../core/services/order.service';
import { ContainerService } from '../../../core/services/container.service';
import { AuthenticationService } from '../../../core/authentication/authentication.service';
import { UserService } from '../../../core/services/user.service';

// Models
import { Order } from '../../../shared/models/order';
import { FulfillSuggestion, SuggestedUnit } from '../../../shared/models/fulfill-suggestions';
import { FulfillRequest, Fulfillment } from '../../../shared/models/fulfill';
import { Container, ContainerType } from '../../../shared/models/container';

// UI Components
import { NavBarComponent } from '../../../shared/components/nav-bar/nav-bar.component';
import { ManageLayoutComponent } from '../../../shared/layouts/manage-layout/manage-layout.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { IconModule, icons } from '../../../shared/modules/icon/icon.module';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { ModalModule } from '../../../shared/modules/modal/modal.module';
import { PTableComponent } from '../../../shared/components/p-table/p-table.component'; // Import P-Table

@Component({
  selector: 'app-finish-order',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NavBarComponent,
    ManageLayoutComponent,
    InputComponent,
    IconModule,
    ModalModule,
    PTableComponent // Adicionado aos imports
  ],
  templateUrl: './finish-order.component.html',
  styleUrl: './finish-order.component.css'
})
export class FinishOrderComponent implements OnInit {
  icons = icons;
  orderId: number = 0;
  order: Order | null = null;
  
  // --- Dados para o P-Table de Containers ---
  containersData: any[] = []; // Dados formatados para a tabela
  containerPage: number = 0;
  containerLimit: number = 10; // Limit solicitado
  containerTotalPages: number = 0;
  containerSearch: string = '';
  selectedContainerDescription: string = ''; // Para mostrar no input visual
  
  // Controle Geral
  isLoading: boolean = false;
  isSubmitting: boolean = false;
  form: FormGroup;

  @ViewChild('feedbackModal') feedbackModal!: ModalComponent;
  modalMessage: string = '';
  modalType: 'success' | 'error' = 'success';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private orderService: OrderService,
    private containerService: ContainerService,
    private authService: AuthenticationService,
    private userService: UserService,
    private location: Location
  ) {
    this.form = this.fb.group({
      destination: ['', Validators.required], // Armazena o CODE do container
      fulfillments: this.fb.array([])
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.orderId = parseInt(id);
      this.loadOrderData();
      this.loadContainers(0);
    }
  }

  get fulfillmentsArray(): FormArray {
    return this.form.get('fulfillments') as FormArray;
  }

  // --- Lógica do P-Table de Containers ---

  loadContainers(page: number = 0, search: string = '') {
    // Sort solicitado: type,desc
    this.containerService.getAllContainers(page, this.containerLimit, 'type,desc', search)
      .subscribe({
        next: (data) => {
          this.containerPage = data.number;
          this.containerTotalPages = data.totalPages;
          
          // Filtra no TS para garantir apenas PREPARAÇÃO (caso o backend mande misturado)
          // E mapeia para um objeto simples que o p-table exiba bonitinho
          const filtered = data.content.filter(c => 
             c.type.toString() === 'PREPARACAO' || c.type === ContainerType.PREPARACAO
          );

          this.containersData = filtered.map(c => ({
            id: c.id,
            'Código': c.code,
            'Descrição': c.description,
            // Ocultamos a coluna Type visualmente ou transformamos em string se quiser exibir
          }));
        },
        error: (err) => console.error('Erro ao carregar containers', err)
      });
  }

  onContainerSearch(term: string) {
    this.containerSearch = term;
    this.loadContainers(0, term);
  }

  changeContainerPage(page: number) {
    if (page >= 0 && page < this.containerTotalPages) {
      this.loadContainers(page, this.containerSearch);
    }
  }

  onContainerSelect(row: any) {
    if (row) {
      // row é o objeto formatado { id, 'Código', 'Descrição' }
      const code = row['Código'];
      const desc = row['Descrição'];

      this.form.patchValue({ destination: code });
      this.selectedContainerDescription = `${code} - ${desc}`;
    } else {
      // Se desmarcar
      this.form.patchValue({ destination: '' });
      this.selectedContainerDescription = '';
    }
  }

  // --- Demais métodos (Order, Submit, etc) permanecem iguais ---

  loadOrderData() {
    this.isLoading = true;
    this.orderService.getOrderById(this.orderId).subscribe({
      next: (order) => this.order = order,
      error: (err) => console.error(err)
    });

    this.orderService.fulFillSuggestion(this.orderId)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (suggestions: any) => { 
          const list = Array.isArray(suggestions) ? suggestions : [suggestions];
          this.populateForm(list);
        },
        error: (err) => this.showModal('Erro ao carregar sugestões.', 'error')
      });
  }

  private populateForm(suggestions: FulfillSuggestion[]) {
    this.fulfillmentsArray.clear();
    suggestions.forEach(suggestion => {
      suggestion.suggestedUnits.forEach(unit => {
        this.addFulfillmentRow(suggestion, unit);
      });
    });
  }

  private addFulfillmentRow(suggestion: FulfillSuggestion, unit: SuggestedUnit) {
    const group = this.fb.group({
      orderItemId: [suggestion.orderItemId],
      unitId: [unit.unitId],
      productName: [suggestion.categoryName || unit.specificProductName],
      batch: [unit.batch],
      expirationDate: [unit.expirationDate],
      available: [unit.availableInUnit],
      quantity: [
        unit.quantityToTake, 
        [Validators.required, Validators.min(0), Validators.max(unit.availableInUnit)]
      ]
    });
    this.fulfillmentsArray.push(group);
  }

  isFormValid(): boolean {
    const hasItems = this.fulfillmentsArray.controls.some(ctrl => (ctrl.get('quantity')?.value || 0) > 0);
    return this.form.valid && hasItems;
  }

  goBack() {
    this.location.back();
  }

  onSubmit() {
    if (!this.isFormValid()) return;
    this.isSubmitting = true;
    
    const formData = this.form.value;
    const userName = this.authService.getUserName();

    this.userService.getUserByName(userName).subscribe({
      next: (user) => {
        const request: FulfillRequest = {
          destination: formData.destination,
          userId: user.id || 0,
          fulfillments: formData.fulfillments
            .filter((f: any) => f.quantity > 0)
            .map((f: any) => ({
              orderItemId: f.orderItemId,
              unitId: f.unitId,
              quantity: f.quantity
            } as Fulfillment))
        };
        this.sendFulfillment(request);
      },
      error: () => {
        this.isSubmitting = false;
        this.showModal('Erro usuário não encontrado.', 'error');
      }
    });
  }

  private sendFulfillment(request: FulfillRequest) {
    this.orderService.fulFillOrder(this.orderId, request).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.showModal('Pedido finalizado com sucesso!', 'success');
      },
      error: () => {
        this.isSubmitting = false;
        this.showModal('Erro ao finalizar pedido.', 'error');
      }
    });
  }

  getExpiryClass(dateStr: string): string {
    const today = new Date();
    const expiry = new Date(dateStr);
    const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 3600 * 24));
    if (diffDays < 30) return 'text-danger fw-bold';
    if (diffDays < 90) return 'text-warning fw-bold';
    return 'text-success';
  }

  showModal(msg: string, type: 'success' | 'error') {
    this.modalMessage = msg;
    this.modalType = type;
    this.feedbackModal.toggle();
  }

  onModalConfirm() {
    this.feedbackModal.toggle();
    if (this.modalType === 'success') this.router.navigate(['/kitchen/pending']);
  }
}