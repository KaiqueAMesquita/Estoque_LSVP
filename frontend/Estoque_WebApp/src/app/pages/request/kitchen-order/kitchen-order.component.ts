import { Component, OnInit, ViewChild } from '@angular/core';
import { NavBarComponent } from '../../../shared/components/nav-bar/nav-bar.component';
import { PTableComponent } from '../../../shared/components/p-table/p-table.component';
import { FormTemplateComponent } from '../../../shared/components/form-template/form-template.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { IconModule, icons } from '../../../shared/modules/icon/icon.module';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { OrderItem } from '../../../shared/models/order';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../core/services/order.service';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../shared/models/category';
import { OrderItemRequest, OrderRequest } from '../../../shared/models/order-request';
import { AuthenticationService } from '../../../core/authentication/authentication.service';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../shared/models/user';
import { ModalModule } from '../../../shared/modules/modal/modal.module';
import { ModalComponent } from '../../../shared/components/modal/modal.component';

@Component({
  selector: 'app-kitchen-order',
  standalone: true,
  imports: [
    NavBarComponent, 
    PTableComponent, 
    FormTemplateComponent, 
    InputComponent, 
    IconModule, 
    CommonModule,
    ReactiveFormsModule,
    ModalModule 
  ],
  templateUrl: './kitchen-order.component.html',
  styleUrl: './kitchen-order.component.css'
})
export class KitchenOrderComponent implements OnInit {
  icons = icons;
  form: FormGroup;

  categories: Category[] = []; 
  orderItems: OrderItemRequest[] = [];
  orderView: OrderItem[] = [];

  pageNumber: number = 0;
  limit: number = 10; 
  totalPages: number = 0;
  searchTerm: string = '';
  loading: boolean = false;
  isSubmitting: boolean = false;

  @ViewChild(ModalComponent) modal!: ModalComponent;
  modalMessage: string = '';
  isConfirmation: boolean = false; 
  pendingAction: Function | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private orderService: OrderService,
    private auth: AuthenticationService,
    private userService: UserService
  ) {
    this.form = this.fb.group({
      categoryId: this.fb.control('', Validators.required),
      categoryName: this.fb.control('', Validators.required),
      quantityRequested: this.fb.control('', [Validators.required, Validators.min(1)])
    });
  }

  ngOnInit(): void {
    this.loadCategories(0);
  }


  loadCategories(page: number = 0, search?: string): void {
    this.loading = true;
    this.categoryService.getAllCategories(page, this.limit, 'id,asc', search).subscribe({
      next: (data) => {
        this.pageNumber = data.number;
        this.totalPages = data.totalPages;
        this.categories = data.content.map(cat => ({ 
            id: cat.id, 
            description: cat.description, 
            foodType: cat.foodType 
          } as Category));
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
  }
  
  onSearch(term: string): void {
    this.searchTerm = term;
    this.loadCategories(0, this.searchTerm); 
  }

  changePage(newPage: number): void {
    if (newPage >= 0 && newPage < this.totalPages) {
      this.loadCategories(newPage, this.searchTerm);
    }
  }

  getControl(field: string): FormControl {
    return this.form.get(field) as FormControl;
  }

  handleCategorySelection(category: Category | undefined): void {
    if (category) {
      this.form.patchValue({
        categoryId: category.id,
        categoryName: category.description,
      });
    }
  }

  addItem() {
    if (this.form.valid) {
      const viewItem: OrderItem = {
        categoryId: this.form.get('categoryId')?.value,
        categoryName: this.form.get('categoryName')?.value,
        quantityRequested: parseInt(this.form.get('quantityRequested')?.value),
        quantityFulfilled: 0,
        id: 0
      };

      const requestItem: OrderItemRequest = {
        categoryId: this.form.get('categoryId')?.value,
        quantityRequested: parseInt(this.form.get('quantityRequested')?.value)
      };

      this.orderView.push(viewItem);
      this.orderItems.push(requestItem); 
      this.form.get('quantityRequested')?.reset();
    } else {
        this.showModal("Selecione uma categoria e informe a quantidade.");
    }
  }

  removeItem(item: OrderItem) {
    const index = this.orderView.indexOf(item);
    if (index !== -1) {
      this.orderView.splice(index, 1); 
      this.orderItems.splice(index, 1);
    }
  }



  showModal(message: string) {
    this.modalMessage = message;
    this.isConfirmation = false;
    this.modal.toggle();
  }

  
  showConfirmation(message: string, action: Function) {
    this.modalMessage = message;
    this.isConfirmation = true;
    this.pendingAction = action; 
    this.modal.toggle();
  }


  onModalConfirm() {
    if (this.pendingAction) {
        this.pendingAction();
    }
    this.modal.toggle(); 
    this.isConfirmation = false;
    this.pendingAction = null;
  }


  resetOrder() {
    this.showConfirmation(
        'Tem certeza que deseja limpar todo o pedido? Essa ação não pode ser desfeita.',
        () => this.executeReset() 
    );
  }

  private executeReset() {
    this.orderItems = [];
    this.orderView = [];
    this.form.reset();
  }

  submitOrder() {
    if (this.orderItems.length === 0) return;

    this.isSubmitting = true;
    const userName = this.auth.getUserName();

    this.userService.getUserByName(userName).subscribe({
      next: (user: User) => {
        const orderRequest: OrderRequest = {
          requesterName: userName,
          userId: user.id ?? 0,
          items: this.orderItems
        };
        //log orderRequest data
        console.log('Order Request:', orderRequest);
        this.createOrderCall(orderRequest);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.showModal('Erro ao obter informações do usuário. Tente novamente.');
      }
    });
  }

  private createOrderCall(orderRequest: OrderRequest) {
    this.orderService.createOrder(orderRequest).subscribe({
      next: (response) => {
        this.showModal('Pedido realizado com sucesso! Enviado para a cozinha.');
        
        setTimeout(() => {
            this.router.navigate(['/dashboard/cook']);
        }, 1500);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.showModal('Ocorreu um erro ao enviar o pedido. Tente novamente.');
      }
    });
  }
}