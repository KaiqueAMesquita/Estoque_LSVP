import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormTemplateComponent } from '../../../shared/components/form-template/form-template.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../shared/models/category';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrl: './create-category.component.css',
  standalone: true,
  imports: [FormTemplateComponent, ReactiveFormsModule, InputComponent]
})

export class CreateCategoryComponent {
  form: FormGroup;

  typeOptions = [
    { label: 'Perecível', value: 0 },
    { label: 'Não-Perecível', value: 1 }
  ];

  constructor(private fb: FormBuilder, private categoryService: CategoryService, private router: Router) {
    this.form = this.fb.group({
      description: this.fb.control('', Validators.required),
      type: this.fb.control(null, Validators.required)
    });
  }

  getControl(field: string): FormControl {
    return this.form.get(field) as FormControl;
  }
  
  onSubmit(): void {
    const category: Category = {
      id: 0,
      description: this.form.value.description,
      created_at: new Date(),
      updated_at: new Date(),
      food_type: this.form.value.type
      };
      this.categoryService.registerCategory(category).subscribe({
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