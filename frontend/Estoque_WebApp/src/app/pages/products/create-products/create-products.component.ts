import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormTemplateComponent } from '../../../shared/components/form-template/form-template.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { JsonPipe } from '@angular/common';
import { ProductService } from '../../../core/services/product.service';
import { Router } from '@angular/router';
import { Product } from '../../../shared/models/product';
import { ProductCreate } from '../../../shared/models/product-create';

@Component({
  selector: 'app-create-products',
  imports: [FormTemplateComponent, ReactiveFormsModule, InputComponent, JsonPipe],
  templateUrl: './create-products.component.html',
  styleUrl: './create-products.component.css'
})
export class CreateProductsComponent {
  form: FormGroup;
 measureOption = [
    { label: 'Quilo(s)', value: 0 },
    { label: 'Grama(s)', value: 1 },
    { label: 'Litro(s)', value: 2 },
    { label: 'Mililitro(s)', value: 3 }
  ];

   
  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router
  ) {
    // Agora baseado no ProductCreateDTO
    this.form = this.fb.group({
      gtin: this.fb.control('', Validators.required),
      measure: this.fb.control('', Validators.required),
      measureType: this.fb.control(null, Validators.required),
      categoryId: this.fb.control('', Validators.required)
    });
  }

  getControl(field: string): FormControl {
    return this.form.get(field) as FormControl;
  }

  onSubmit(): void {
    const product: ProductCreate = {
      gtin: this.form.value.gtin,
      measure: this.form.value.measure,
      measureType: this.form.value.measureType,
      categoryId: this.form.value.categoryId
    };

    this.productService.registerProduct(product).subscribe({
      next: () => {
        this.form.reset();
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['manage/view/products']);
        });
      },
      error: (error) => {
        console.error('Erro ao criar produto:', error);
      }
    });
  }
}
