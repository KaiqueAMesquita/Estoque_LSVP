import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormTemplateComponent } from '../../../shared/components/form-template/form-template.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../shared/models/category';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseCreateComponent } from '../../../shared/components/crud/base-create/base-create.component';

@Component({
  selector: 'app-edit-category',
  imports: [FormTemplateComponent, ReactiveFormsModule, InputComponent],
  templateUrl: './edit-category.component.html',
  styleUrl: './edit-category.component.css'
})
export class EditCategoryComponent extends BaseCreateComponent {
  form: FormGroup;
  id: string = '';

  typeOptions = [
    { label: 'Perecível', value: 'PERECIVEL' },
    { label: 'Não-Perecível', value: 'NAO_PERECIVEL' },
  ];

  constructor(fb: FormBuilder, private categoryService: CategoryService, router: Router, private route: ActivatedRoute) {
    super(router, fb);
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    this.form = this.fb.group({
      description: this.fb.control('', Validators.required),
      type: this.fb.control('', Validators.required),
      min_quantity: this.fb.control(0, [Validators.required, Validators.min(0), Validators.max(1000000)]),
      max_quantity: this.fb.control(0, [Validators.required, Validators.min(0), Validators.max(1000000)])
    });
    if (this.id !== '') {
      this.categoryService.getCategoryById(Number(this.id)).subscribe({
        next: category => {
          this.form.patchValue({
            description: category.description,
            type: category.foodType,
            min_quantity: category.min_quantity,
            max_quantity: category.max_quantity
          });
        },
        error: () => {
          location.href = '/manage/view/categories';
          console.error('Erro ao carregar categoria para edição');
        }
      });
    }
  }

  onSubmit(): void {
    const idN = Number.parseInt(this.id);

    const categoryPayload = {
      description: this.form.value.description,
      foodType: this.form.value.type,
      min_quantity: this.form.value.min_quantity,
      max_quantity: this.form.value.max_quantity
    };
    this.categoryService.updateCategory(idN, categoryPayload).subscribe({
      next: () => {
        this.router.navigate(['/manage/view/categories']);
      },
      error: () => {
        console.error('Erro ao atualizar categoria');
      }
    });
  }
}
