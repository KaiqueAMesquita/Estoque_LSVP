import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormTemplateComponent } from '../../../shared/components/form-template/form-template.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../shared/models/product';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-delete-product-by-id',
  imports: [FormBuilder, ReactiveFormsModule],
  templateUrl: './delete-product-by-id.component.html',
  styleUrl: './delete-product-by-id.component.css'
})
export class DeleteProductByIdComponent {
  // Este componente é responsável por deletar um produto específico pelo ID.
  // Ele pode conter um formulário para confirmação de exclusão e métodos para enviar a solicitação ao serviço de produtos.
  form: FormGroup;
  productId: number;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.productId = this.route.snapshot.paramMap.get('id') ? Number(this.route.snapshot.paramMap.get('id')) : 0;
    // Inicialização do componente
    this.form = this.fb.group({
      confirm: this.fb.control('', Validators.requiredTrue) // Campo para confirmação de exclusão
    });
    // Obtendo o ID do produto da rota
    if (this.productId !== 0) {
      this.productService.getProductById(this.productId).subscribe((product: Product) => {
        // Preenchendo o formulário com os dados do produto para confirmação
        this.form.patchValue({
          confirm: false // Inicialmente, a confirmação está desmarcada
        });
      });
    }
  }

  getControl(field: string): FormControl {
    return this.form.get(field) as FormControl;
  }

  onSubmit(): void {
    const idN = this.productId;
    // Método chamado ao submeter o formulário de exclusão
    const product: Partial<Product> = {
      id: idN,
    };
    this.productService.deleteProduct(idN);
    this.form.reset();
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['manage/view/products']);
    });
  }

}
