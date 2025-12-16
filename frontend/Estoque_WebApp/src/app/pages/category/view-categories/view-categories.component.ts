import { Component, OnDestroy, OnInit } from '@angular/core';
import { PTableComponent } from '../../../shared/components/p-table/p-table.component';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../shared/models/category';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from './../../../core/authentication/authentication.service';
import { NavigationWatcherService } from '../../../core/services/navigation-watcher.service';
import { ViewTemplateComponent } from '../../../shared/components/view-template/view-template.component';

@Component({
  selector: 'app-view-categories',
  imports: [PTableComponent, CommonModule, ViewTemplateComponent],
  templateUrl: './view-categories.component.html',
  styleUrl: './view-categories.component.css',
  standalone: true
})
export class ViewCategoriesComponent implements OnInit, OnDestroy {
  categories: Category[] = [];
  private navigationSub?: Subscription;
  pagedView: boolean = false;
  pageNumber: number = 0;
  totalPages: number = 0;
  
  private searchTerm: string = '';
  // NOVA PROPRIEDADE: Define a ordenação padrão inicial
  private currentSort: string = 'id,desc'; 

  constructor(
    private categoryService: CategoryService,
    private auth: AuthenticationService,
    public router: Router,
    private navigationWatcher: NavigationWatcherService
  ) {}

  ngOnInit(): void {
    this.loadCategories(this.pageNumber);

    this.navigationSub = this.navigationWatcher.navigation$.subscribe(() => {
      if (this.router.url.startsWith('/manage/view/categories')) {
        // Ao recarregar via navegação, mantemos a página e sort atuais ou resetamos? 
        // Aqui mantive resetando apenas se necessário, mas usando o estado atual.
        this.loadCategories(this.pageNumber);
      }
    });
  }

  ngOnDestroy(): void {
    this.navigationSub?.unsubscribe();
  }

  public getToken(): string | null {
    return this.auth.getToken();
  }

  private loadCategories(page: number = 0, description?: string): void {
  this.categoryService.getAllCategories(page, 20, this.currentSort, description).subscribe({
    next: (categories) => {
      categories.totalPages > 1 ? this.pagedView = true : this.pagedView = false;
      this.totalPages = categories.totalPages;
      this.pageNumber = categories.number;

      this.categories = categories.content.map((cat: Category) => {
        const processedCat = { ...cat };
               
        delete processedCat.created_at;
        delete processedCat.updated_at;

        return processedCat;
      });
    },
    error: (error) => {
      console.error('Erro carregando categorias:', error);
    }
  });
}

  // NOVO MÉTODO PARA LHE DAR COM O CLIQUE NA TABELA
  handleSort(sortString: string): void {
    this.currentSort = sortString;
    // Quando mudamos a ordenação, é boa prática voltar para a página 0
    this.onPageChange(0);
  }

  DeleteCategory(id: number): void {
    try {
      this.categoryService.deleteCategory(id);
      this.categories = this.categories.filter(category => category.id !== id);
    } catch (error) {
      console.error('Erro ao deletar Categorias:', error);
    }
  }

  EditCategory(id: number): void {
    this.router.navigate(['/manage/edit/category', id]);
  }
  
  ViewCategory(id: number): void {
    this.router.navigate(['manage/view/category', id])
  }

  onPageChange(page: number): void {
    this.pageNumber = page;
    // Passamos o searchTerm atual para não perder o filtro ao mudar de página
    this.loadCategories(page, this.searchTerm);
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.loadCategories(0, this.searchTerm);
  }
}