import { AfterViewInit, Component, ViewChild, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconModule, icons } from '../../../shared/modules/icon/icon.module';
import { FormBuilder, FormsModule, Validators } from '@angular/forms';
import { NavBarComponent } from '../../../shared/components/nav-bar/nav-bar.component';
import { Router } from '@angular/router';
import { UnitService } from '../../../core/services/unit.service';
import { ProductService } from './../../../core/services/product.service';
import { FormControl, FormGroup } from '@angular/forms';
import { MovementService } from '../../../core/services/movement.service';
import { InputMovement } from '../../../shared/models/inputMovement';
import { Product } from '../../../shared/models/product';
import { Unit } from '../../../shared/models/unit';
import { AuthenticationService } from '../../../core/authentication/authentication.service';
import { InputComponent } from '../../../shared/components/input/input.component';
import { FormTemplateComponent } from '../../../shared/components/form-template/form-template.component';
import { Subject, switchMap, takeUntil, of, catchError } from 'rxjs';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../shared/models/user';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { ModalModule } from '../../../shared/modules/modal/modal.module';
@Component({
  selector: 'app-scanner-input',
  imports: [IconModule, FormsModule, NavBarComponent, InputComponent, FormTemplateComponent, CommonModule, ModalModule],
  standalone: true,
  providers: [AuthenticationService],
  templateUrl: './scanner-input.component.html',
  styleUrl: './scanner-input.component.css'
})
export class ScannerInputComponent implements AfterViewInit, OnDestroy, OnInit {
  private buffer: string = '';
  private timeout: any;
  batchView: boolean = false;
  form: FormGroup;
  private product: Product | undefined;
  private destroy$ = new Subject<void>();
  public manualControl: boolean = false;
  private currentUser: User | null = null;

  // Modal
  @ViewChild(ModalComponent) modal!: ModalComponent;
  modalMessage: string = '';

  @ViewChild('input') input!: ElementRef<HTMLInputElement>;


  icons = icons;
  barcode: string = '';

  sourceOptions = [
    { label: 'Doação', value: 0 },
    { label: 'Compra', value: 1 },
  
  ];

  constructor(private userService: UserService, private auth: AuthenticationService, private fb: FormBuilder, private router: Router, private unitService: UnitService, private movementService: MovementService, private productService: ProductService) {
  this.form = this.fb.group({
      batch: this.fb.control('', Validators.required),
      price: this.fb.control('', Validators.required),
      sourceType: this.fb.control('', Validators.required),
      quantity: this.fb.control('', Validators.required),
      sourceDetails: this.fb.control('', Validators.required),
    });


   }

  ngOnInit(): void {
    const userName = this.auth.getUserName();
    if (userName) {
      this.userService.getUserByName(userName)
        .pipe(takeUntil(this.destroy$))
        .subscribe(user => {
          this.currentUser = user;
        });
    }
  }

  ngAfterViewInit(): void {
     this.input.nativeElement.focus();
    }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.timeout) clearTimeout(this.timeout);
  }
  
  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.manualControl) {
      return;
    }
    // scanner envia rápido, então juntamos caracteres
    if (this.timeout) clearTimeout(this.timeout);

    if (event.key === 'Enter') {
      // código finalizado
      this.onBarcodeScanned(this.buffer);
      this.buffer = '';
    } else {
      this.buffer += event.key;
    }

    // se parar de digitar por 300ms, limpa (para diferenciar do teclado humano)
    this.timeout = setTimeout(() => {
      this.buffer = '';
    }, 300);
  }
  getControl(field: string): FormControl {
    return this.form.get(field) as FormControl;
  }
  onBarcodeScanned(code: string) {
    this.productService.getProductByGtin(code)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data) => {
        if (data) {
          this.product = data;
          this.batchView = true;
        } else {
          this.batchView = false;
          this.showModal("Produto não encontrado para o código de barras informado.");
        }
      },
      error: () => {
        this.batchView = false;
        this.showModal("Produto não encontrado. Verifique o código e tente novamente.");
      }
    });
  }

  onSubmit() {
    if (!this.form.valid || !this.product || !this.currentUser) {
      this.showModal("Formulário inválido ou dados de produto/usuário ausentes.");
      return;
    }

    const formValue = this.form.value;

    this.unitService.getUnitByBatch(formValue.batch).pipe(
      // Se getUnitByBatch falhar (404), o catchError redireciona para a criação completa.
      catchError(error => {
        if (error.status === 404) {
          this.showModal('Lote não encontrado. Redirecionando para cadastro completo...');
          const navigationData = {
            state: {
              productId: this.product?.id,
              gtin: this.product?.gtin,
              batch: formValue.batch,
              quantity: formValue.quantity,
              sourceType: formValue.sourceType,
              price: formValue.price,
              userId: this.currentUser?.id
            }
          };
          // A pequena espera é para o usuário conseguir ler o modal.
          setTimeout(() => this.router.navigate(['manage/movements/input'], navigationData), 2000);
        } else {
          this.showModal(`Erro ao buscar lote: ${error.message}`);
        }
        return of(null); // Retorna um observable nulo para parar a cadeia.
      }),
      // Se getUnitByBatch tiver sucesso, continua para criar o movimento.
      switchMap(unit => {
        if (!unit) return of(null); // Para a execução se o catchError foi acionado.

        if (unit.gtin !== this.product?.gtin) {
          this.showModal("O lote informado pertence a outro produto. Verifique os dados.");
          return of(null);
        }

        const inputMovement: InputMovement = {
          productId: this.product!.id!,
          batch: formValue.batch,
          quantity: formValue.quantity,
          containerId: unit.containerId!, // O backend espera o containerId
          sourceType: formValue.sourceType,
          sourceDetails: formValue.sourceDetails,
          expiration_date: unit.expiration_date,
          price: formValue.price,
          userId: this.currentUser!.id!,
        };
        return this.movementService.createInputMovement(inputMovement);
      }),
      takeUntil(this.destroy$)
    ).subscribe(response => {
      if (response) {
        this.showModal("Movimento de entrada criado com sucesso!");
        setTimeout(() => this.router.navigate(['/manage/view/movements']), 2000);
      }
      // Se response for nulo, o erro já foi tratado e o modal exibido.
    });
  }

  showModal(message: string) {
    this.modalMessage = message;
    this.modal.toggle();
  }

  handleManualSearch() {
    const code = this.input.nativeElement.value;
    if (code) {
      this.onBarcodeScanned(code);
    }
  }

  manualController(): void{
    this.manualControl = !this.manualControl;
    if (this.manualControl) {
      setTimeout(() => this.input.nativeElement.focus(), 0);
    } else {
      this.input.nativeElement.value = '';
      this.batchView = false; // Esconde o formulário ao voltar para o modo scanner
      this.input.nativeElement.blur(); // Remove o foco ao voltar para o modo scanner
    }
  
  }
}



        
                   
        
         
 
