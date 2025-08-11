import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormTemplateComponent } from '../../../shared/components/form-template/form-template.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ProductService } from '../../../core/services/product.service';
import { Product } from './../../../shared/models/product';
import { ActivatedRoute, Router } from '@angular/router';
import { JsonPipe } from '@angular/common';
@Component({
  selector: 'app-edit-products',
  imports: [FormTemplateComponent, ReactiveFormsModule, InputComponent],
  templateUrl: './edit-products.component.html',
  styleUrl: './edit-products.component.css'
})
export class EditProductsComponent {
  
  form: FormGroup;
  id: string = '';
  // Construtor para Inicializar e Carregar os Dados de Produtos
    constructor(private fb: FormBuilder, private productService: ProductService, private router: Router, private route: ActivatedRoute) {
      this.id = this.route.snapshot.paramMap.get('id') ?? '';
      this.form = this.fb.group({
        name: this.fb.control('', Validators.required),
        description: this.fb.control('', Validators.required),
        price: this.fb.control('', [Validators.required, Validators.min(0)]),
        quantity: this.fb.control('', [Validators.required, Validators.min(1)])
      });
      if (this.id !== '') {
        this.productService.getProductById(Number(this.id)).subscribe({
          next: product => {
            this.form.patchValue({
              name: product.name,
              price: product.price,
              quantity: product.quantity
            });
          },
          error: () => {
            location.href = '/manage/view/products';
            console.error('Erro ao carregar produto para edição');
          }
        });
      }
    }
  
    getControl(field: string): FormControl {
      return this.form.get(field) as FormControl;
    }
  
    onSubmit(): void {
      const idN = Number.parseInt(this.id);
  
      const product: Partial<Product> = {
        id: idN,
        name: this.form.value.name,
        description: this.form.value.description,
        price: this.form.value.price,
        quantity: this.form.value.quantity
      };
      this.productService.updateProduct(idN, product).subscribe({
        next: () => {
          this.form.reset();
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate(['manage/view/products']);
          });
        },
        error: (error) => {
          //Tratando o erro por mensagem
          console.error('Erro ao editar produto:', error);
        }
      });
  };
}

// Nota: O código é de edição de produtos com Angular, utilizando Reactive Forms para manipulação de formulários.


// O código inclui a importação de módulos necessários, a definição do componente, a criação do formulário e a lógica para carregar os dados do produto para edição. Além disso, há tratamento de erros ao carregar e editar produtos.
