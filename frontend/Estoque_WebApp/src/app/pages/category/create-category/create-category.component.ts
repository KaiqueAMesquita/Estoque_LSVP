import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormTemplateComponent } from '../../../shared/components/form-template/form-template.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../shared/models/category';
import { Router } from '@angular/router';
import { BaseCreateComponent } from '../../../shared/components/crud/base-create/base-create.component';
import { max } from 'rxjs';

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrl: './create-category.component.css',
  standalone: true,
  imports: [FormTemplateComponent, ReactiveFormsModule, InputComponent]
})

export class CreateCategoryComponent extends BaseCreateComponent {
  form: FormGroup;

  typeOptions = [
    { label: 'Perecível', value: 'PERECIVEL' },
    { label: 'Não-Perecível', value: 'NAO_PERECIVEL' }
  ];

  constructor(fb: FormBuilder, private categoryService: CategoryService, router: Router) {
    super(router, fb);
    this.form = fb.group({
      description: this.fb.control('', Validators.required),
      type: this.fb.control(null, Validators.required),
      max_quantity: this.fb.control(0, [Validators.required, Validators.min(0), Validators.max(1000000)]),
      min_quantity: this.fb.control(0, [Validators.required, Validators.min(0), Validators.max(1000000)])
    });
  }
  
  onSubmit(): void {
    const categoryPayload = {
      description: this.form.value.description,
      foodType: this.form.value.type,
      min_quantity: this.form.value.min_quantity,
      max_quantity: this.form.value.max_quantity
      };
      this.categoryService.registerCategory(categoryPayload).subscribe({
        next: () => {
          this.form.reset();
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate(['manage/view/categories']);
          });
        },
        error: (error) => {
          console.error('Erro ao criar categoria:', error);
        }
      });
  }
}