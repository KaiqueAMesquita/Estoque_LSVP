import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormTemplateComponent } from '../../../shared/components/form-template/form-template.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../shared/models/category';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-category',
  imports: [FormTemplateComponent, ReactiveFormsModule, InputComponent],
  templateUrl: './edit-category.component.html',
  styleUrl: './edit-category.component.css'
})
export class EditCategoryComponent {
  form: FormGroup;
  id: string = '';

  typeOptions = [
    { label: 'Perecível', value: 0 },
    { label: 'Não-Perecível', value: 1 },
  ];

  constructor(private fb: FormBuilder, private categoryService: CategoryService, private router: Router, private route: ActivatedRoute) {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    this.form = this.fb.group({
      description: this.fb.control('', Validators.required),
      type: this.fb.control('', Validators.required),
    });
    if (this.id !== '') {
      this.categoryService.getCategoryById(Number(this.id)).subscribe({
        next: category => {
          this.form.patchValue({
            description: category.description,
            type: category.food_type
          });
        },
        error: () => {
          location.href = '/manage/view/categories';
          console.error('Erro ao carregar categoria para edição');
        }
      });
    }
  }

  getControl(field: string): FormControl {
    return this.form.get(field) as FormControl;
  }

  onSubmit(): void {
    const idN = Number.parseInt(this.id);

    const category = {
      id: idN,
      description: this.form.value.description,
      updated_at: new Date(),
      food_type: this.form.value.type,
    };

    this.categoryService.updateCategory(idN, category).subscribe({
      next: () => {
        this.router.navigate(['/manage/view/categories']);
      },
      error: () => {
        console.error('Erro ao atualizar categoria');
      }
    });
  }
}
