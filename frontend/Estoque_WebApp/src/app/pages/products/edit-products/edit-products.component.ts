import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormTemplateComponent } from '../../../shared/components/form-template/form-template.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../shared/models/product';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-product',
  imports: [FormTemplateComponent, ReactiveFormsModule, InputComponent],
  templateUrl: './edit-products.component.html',
  styleUrl: './edit-products.component.css'
})
export class EditProductsComponent {
  form: FormGroup;
  id: string = '';

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';

    // Agora mapeando para os campos do DTO ProductUpdateDTO
    this.form = this.fb.group({
      gtin: this.fb.control('', Validators.required),
      measure: this.fb.control('', Validators.required),
      measureType: this.fb.control('', Validators.required),
      categoryId: this.fb.control('', Validators.required)
    });

    if (this.id !== '') {
      this.productService.getProductById(Number(this.id)).subscribe({
        next: product => {
          this.form.patchValue({
            gtin: product.gtin,
            measure: product.measure,
            measureType: product.measureType,
            categoryId: product.categoryId
          });
        },
        error: () => {
          location.href = '/manage/view/product';
          console.error('Erro ao carregar product para edição');
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
      gtin: this.form.value.gtin,
      measure: this.form.value.measure,
      measureType: this.form.value.measureType,
      categoryId: this.form.value.categoryId
    };

    this.productService.updateProduct(idN, product).subscribe({
      next: () => {
        this.form.reset();
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['manage/view/products']);
        });
      },
      error: (error) => {
        console.error('Erro ao editar product:', error);
      }
    });
  }
}
