import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormTemplateComponent } from '../../../shared/components/form-template/form-template.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ProductService } from '../../../core/services/product.service';
import { Product } from './../../../shared/models/product';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-products',
  imports: [FormBuilder, FormTemplateComponent, ReactiveFormsModule, InputComponent],
  templateUrl: './edit-products.component.html',
  styleUrl: './edit-products.component.css'
})
export class EditProductsComponent {
  form: FormGroup;
  
  id: string = '';
  
    constructor(private fb: FormBuilder, private productService: ProductService, private router: Router, private route: ActivatedRoute) {
      this.id = this.route.snapshot.paramMap.get('id') ?? '';
      this.form = this.fb.group({
        name: this.fb.control('', Validators.required),
        price: this.fb.control('', [Validators.required, Validators.min(0)]),
        quantity: this.fb.control('', [Validators.required, Validators.min(0)])
      });
      if (this.id !== '') {
        this.productService.getProductById(Number(this.id)).subscribe(product => {
          this.form.patchValue({
            name: product.name,
            price: product.price,
            quantity: product.quantity
          });
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
        price: this.form.value.price,
        quantity: this.form.value.quantity
      };
      this.productService.updateProduct(idN, product);
      this.form.reset();
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['manage/view/products']);
      });
    }
}
