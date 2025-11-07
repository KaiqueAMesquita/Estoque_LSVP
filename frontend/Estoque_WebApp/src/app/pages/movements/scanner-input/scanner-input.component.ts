import { AfterViewInit, Component, ViewChild, ElementRef, HostListener, OnDestroy } from '@angular/core';
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
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../shared/models/user';
@Component({
  selector: 'app-scanner-input',
  imports: [IconModule, FormsModule, NavBarComponent, InputComponent, FormTemplateComponent, CommonModule],
  standalone: true,
  providers: [AuthenticationService],
  templateUrl: './scanner-input.component.html',
  styleUrl: './scanner-input.component.css'
})
export class ScannerInputComponent implements AfterViewInit, OnDestroy {
  private buffer: string = '';
  private timeout: any;
  batchView: boolean = false;
  form: FormGroup;
  private product: Product | undefined;
  private destroy$ = new Subject<void>();
  public manualControl: boolean = false;

  @ViewChild('input') input!: ElementRef<HTMLInputElement>;
  @ViewChild('buttons') button!: ElementRef<HTMLInputElement>;


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
    });


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
      if(data){
        this.product = data;
        this.batchView = true;
      }else{
        this.batchView = false;
        window.alert("Produto não encontrado");
      }

      }
    });
}
  onSubmit(){
     
    if(this.form.valid){
      let unit: Unit;
      let batch = this.form.value.batch;
      let quantity = this.form.value.quantity;
      let name = this.auth.getUserName();
      let user: User;

      this.userService.getUserByName(name).subscribe({next: (data) => {
      
        user = data;
        }});
      this.unitService.getUnitByBatch(batch)
      .pipe(takeUntil(this.destroy$))
      .subscribe({next: (data) => {
        unit = data;
        
        
        if (this.product && data.gtin === this.product.gtin) {
          let inputMovement: InputMovement = {
            productId: this.product?.id ?? 0,
            batch: batch,
            quantity: quantity,
            containerId: unit.id,
            sourceType: this.form.value.sourceType,
            sourceDetails: 'Adicionado via Scanner',
            expiration_date: unit.expirationDate,
            price: this.form.value.price,
            userId: user.id ?? 0,

          };
          this.movementService.createInputMovement(inputMovement)
          .pipe(takeUntil(this.destroy$))
          .subscribe({next: (response) => {
            const message = response ? "Movimento de entrada criado com sucesso" : "Erro ao criar movimento de entrada";
            alert(message);
            this.router.navigate(['/movements']);
          }});
        } else {
          alert("O lote informado não corresponde ao produto escaneado.");
          this.router.navigate(['/manage/create/product']);
        }
      },
      error: (err) => {
            alert('Lote não encontrado. Verifique o lote e tente novamente.');

            const navigationData = {
              state: {
                productId: this.product?.id,
                batch: this.form.value.batch,
                quantity: this.form.value.quantity,
                sourceType: this.form.value.sourceType,
                price: this.form.value.price,
                userId: this.auth.decodeToken().sub
              }
            };
            this.router.navigate(['manage/movements/input'], navigationData);

      }
    })
    }
  }

  manualController(): void{
    this.manualControl = !this.manualControl;
    if(this.manualControl == true){
      this.input.nativeElement.style.opacity = '1';
      this.input.nativeElement.focus();
      this.button.nativeElement.style.background = 'none'
    }else{
      this.input.nativeElement.style.opacity = '0';
      this.input.nativeElement.value = '';
      this.button.nativeElement.style.backgroundColor = '#1976d2'

    }
  
  }
}



        
                   
        
         
 
