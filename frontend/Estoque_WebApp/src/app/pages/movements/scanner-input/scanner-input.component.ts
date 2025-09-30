import { AfterViewInit, Component, ViewChild, ElementRef, HostListener } from '@angular/core';
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
@Component({
  selector: 'app-scanner-input',
  imports: [IconModule,FormsModule,NavBarComponent, FormsModule, InputComponent, FormTemplateComponent],
  standalone: true,
  providers: [AuthenticationService],
  templateUrl: './scanner-input.component.html',
  styleUrl: './scanner-input.component.css'
})
export class ScannerInputComponent implements AfterViewInit{
  private buffer: string = '';
  private timeout: any;
  private batchView: boolean = false;
  form: FormGroup;
  private product: Product | undefined;


  @ViewChild('input') input!: ElementRef<HTMLInputElement>;

  icons = icons;
  barcode: string = '';

  sourceOptions = [
    { label: 'Doação', value: 0 },
    { label: 'Compra', value: 1 },
  
  ];

  constructor(private auth: AuthenticationService, private fb: FormBuilder, private router: Router, private unitService: UnitService, private movementService: MovementService, private productService: ProductService) {
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
    let product = this.productService.getProductByGtin(code).subscribe({next: (data) => {
      if(data){
        this.product = data;
        this.batchView = true;
      }else{
        alert("Produto não cadastrado");
        this.router.navigate(['/manage/create/product']);
      }
    }})
}
  onSubmit(){
     
    if(this.form.valid){
      let unit: Unit;
      let batch = this.form.value.batch;
      let quantity = this.form.value.quantity;
      this.unitService.getUnitByBatch(batch).subscribe({next: (data) => {
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
            userId: this.auth.decodeToken().sub // substituir pelo id do usuário logado

          };
          this.movementService.createInputMovement(inputMovement).subscribe({next: (data) => {
            if(data){
              alert("Movimento de entrada criado com sucesso");
              this.router.navigate(['/movments']);
            }else{
              alert("Erro ao criar movimento de entrada");
              this.router.navigate(['/movments']);
            }
          }})
        } else {
          this.router.navigate(['/manage/create/product']);
          alert("Produto não cadastrado");
        }
      },
      error: (err) => {
            this.router.navigate(['/manage/movements/input']);

      }
    })
    }
  }
}



        
                   
        
         
 
