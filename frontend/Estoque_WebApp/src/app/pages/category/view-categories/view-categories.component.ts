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
  categories: Category[] = []; // Mesmo esquema de usuários, Array para armazenar as categorias.
  private navigationSub?: Subscription;

  constructor(
    private categoryService: CategoryService,
    private auth: AuthenticationService,
    public router: Router,
    private navigationWatcher: NavigationWatcherService
  ) {}

  ngOnInit(): void {
    this.loadCategories();

    this.navigationSub = this.navigationWatcher.navigation$.subscribe(() => {
      if (this.router.url.startsWith('/manage/view/categories')) {
        this.loadCategories();
      }
    });
  }

  ngOnDestroy(): void {
    this.navigationSub?.unsubscribe();
  }

  public getToken(): string | null {
    return this.auth.getToken();
  }

  private loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories.map((cat: Category) => ({
          ...cat,
          created_at: new Date(cat.created_at),
          updated_at: cat.updated_at ? new Date(cat.updated_at) : undefined
         
        
        }));
      },
      error: (error) => {
        console.error('Erro carregando categorias:', error);
      }
    });
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
}
