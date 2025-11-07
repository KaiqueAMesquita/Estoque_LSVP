import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormTemplateComponent } from '../../../shared/components/form-template/form-template.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../shared/models/product';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseCreateComponent } from '../../../shared/components/crud/base-create/base-create.component';
import { CategoryService } from '../../../core/services/category.service';
import { PTableComponent } from '../../../shared/components/p-table/p-table.component';
import { Category } from '../../../shared/models/category';
import { forkJoin } from 'rxjs';
import { onlyNumbersValidator } from '../../../core/validators/custom-validators';
import { IconModule, icons } from '../../../shared/modules/icon/icon.module';

@Component({
  selector: 'app-edit-product',
  imports: [FormTemplateComponent, ReactiveFormsModule, InputComponent, PTableComponent, IconModule],
  templateUrl: './edit-products.component.html',
  styleUrl: './edit-products.component.css'
})
export class EditProductsComponent extends BaseCreateComponent implements OnInit {
  form: FormGroup;
  id: string = '';
  icons = icons;
  isCategoryPaged: boolean = false;
  categoryPageNumber: number = 0;
  categoryTotalPages: number = 0;
  categorySearchTerm: string = '';
  categories: any[] = [];
  @ViewChild('categoryTable') categoryTable!: PTableComponent<any>;

  measureOption = [
    { label: 'Quilo(s)', value: 0 },
    { label: 'Grama(s)', value: 1 },
    { label: 'Litro(s)', value: 2 },
    { label: 'Mililitro(s)', value: 3 }
  ];

  constructor(fb: FormBuilder,
    private productService: ProductService,
    router: Router,
    private route: ActivatedRoute,
    private categoryService: CategoryService
  ) {
    super(router, fb);
    this.id = this.route.snapshot.paramMap.get('id') ?? '';

    this.form = this.fb.group({
      gtin: this.fb.control('', [Validators.required, onlyNumbersValidator()]),
      measure: this.fb.control('', [Validators.required, onlyNumbersValidator()]),
      measureType: this.fb.control('', Validators.required),
      category_id: this.fb.control('', Validators.required)
    });

  }

  ngOnInit(): void {
    if (this.id !== '') {
      const product$ = this.productService.getProductById(Number(this.id));
      const categories$ = this.categoryService.getAllCategories(0, 8, 'id,desc');

      forkJoin([product$, categories$]).subscribe({
        next: ([product, categories]) => {
          this.categories = categories.content.map((cat: Category) => ({
            id: cat.id,
            Descrição: cat.description,
            Tipo: cat.foodType
          }));

          this.isCategoryPaged = categories.totalPages > 1;
          this.categoryPageNumber = categories.number;
          this.categoryTotalPages = categories.totalPages;

          // Encontra a categoria e a seleciona na tabela após a view ser inicializada
          const categoryToSelect = this.categories.find(c => c.id === product.category_id);
          if (categoryToSelect) {
            // Usamos setTimeout para garantir que a tabela (ViewChild) esteja pronta
            this.handleCategorySelection(categoryToSelect);
            setTimeout(() => this.categoryTable.toggleSelected(categoryToSelect));
          }

          // Popula o formulário com os dados do produto
          this.form.patchValue({
            gtin: product.gtin,
            measure: product.measure,
            measureType: product.measure_type,
            category_id: product.category_id
          });
        },
        error: (error) => {
          console.error('Erro ao carregar dados para edição do produto:', error);
          this.router.navigate(['/manage/view/products']);
        }
      });
    }
  }

  handleCategorySelection(selectedCategory: any): void {
    if (selectedCategory && selectedCategory.id) {
      this.form.get('category_id')?.setValue(selectedCategory.id);
    } else {
      this.form.get('category_id')?.setValue(null);
    }
  }

  private loadCategories(page: number = 0, description?: string): void {
    this.categoryService.getAllCategories(page, 8, 'id,desc', description).subscribe({
      next: (categories) => {
        this.isCategoryPaged = categories.totalPages > 1;
        this.categoryPageNumber = categories.number;
        this.categoryTotalPages = categories.totalPages;
        this.categories = categories.content.map((cat: Category) => ({
          id: cat.id,
          Descrição: cat.description,
          Tipo: cat.foodType
        }));
      },
      error: (error) => console.error('Erro ao carregar categorias:', error)
    });
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
    const idN = Number.parseInt(this.id);

    const product: Partial<Product> = {
      gtin: this.form.value.gtin,
      measure: this.form.value.measure,
      measure_type: this.form.value.measureType,
      category_id: this.form.value.category_id
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
