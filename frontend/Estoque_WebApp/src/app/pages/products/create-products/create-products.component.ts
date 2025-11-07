import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormTemplateComponent } from '../../../shared/components/form-template/form-template.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { JsonPipe } from '@angular/common';
import { ProductService } from '../../../core/services/product.service';
import { Router } from '@angular/router';
import { PTableComponent } from '../../../shared/components/p-table/p-table.component';
import { ProductCreate } from '../../../shared/models/product-create';
import { exactLengthValidator, onlyNumbersValidator } from '../../../core/validators/custom-validators';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../shared/models/category';
import { BaseCreateComponent } from '../../../shared/components/crud/base-create/base-create.component';
import { IconModule, icons } from '../../../shared/modules/icon/icon.module';

@Component({
  selector: 'app-create-products',
  imports: [FormTemplateComponent, ReactiveFormsModule, InputComponent, JsonPipe, PTableComponent, IconModule],
  templateUrl: './create-products.component.html',
  styleUrl: './create-products.component.css'
})
export class CreateProductsComponent extends BaseCreateComponent implements OnInit {
  form: FormGroup;
  icons = icons;

  isCategoryPaged: boolean = false;
  categoryPageNumber: number = 0;
  categoryTotalPages: number = 0;
  categorySearchTerm: string = '';
  categories: any[] = [];

  measureOption = [
    { label: 'Quilo(s)', value: 0 },
    { label: 'Grama(s)', value: 1 },
    { label: 'Litro(s)', value: 2 },
    { label: 'Mililitro(s)', value: 3 }
  ];

  constructor(
    fb: FormBuilder,
    private productService: ProductService,
    router: Router,
    private categoryService: CategoryService
  ) {
    super(router, fb);
    this.form = fb.group({
      gtin: this.fb.control('', [Validators.required, onlyNumbersValidator(), exactLengthValidator(13)]),
      measure: this.fb.control('', [Validators.required, onlyNumbersValidator()]),
      measureType: this.fb.control('', Validators.required),
      categoryId: this.fb.control('', Validators.required)
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  private loadCategories(page: number = 0, description?: string): void {
    this.categoryService.getAllCategories(page, 8, 'id,desc', description).subscribe({
      next: (categories) => {

        this.categories = categories.content.map((cat: Category) => ({
          id: cat.id,
          Descrição: cat.description,
          Tipo: cat.foodType
        }));
      },
      error: (error) => {
        console.error('Erro ao carregar categorias:', error);
      }
    });
  }

  handleCategorySelection(selectedCategory: any): void {
    if (selectedCategory && selectedCategory.id) {
      this.form.get('categoryId')?.setValue(selectedCategory.id);
    } else {
      this.form.get('categoryId')?.setValue(null); 
    }
  }

  onCategorySearch(term: string): void {
    this.categorySearchTerm = term;
    this.loadCategories(0, this.categorySearchTerm);
  }

  onCategoryPageChange(page: number): void {
    if (page >= 0 && page < this.categoryTotalPages)
      this.loadCategories(page, this.categorySearchTerm);
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