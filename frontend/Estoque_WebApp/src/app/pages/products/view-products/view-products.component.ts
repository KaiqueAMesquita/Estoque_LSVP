import { Component, OnDestroy, OnInit } from '@angular/core';
import { PTableComponent } from '../../../shared/components/p-table/p-table.component';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../shared/models/product';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavigationWatcherService } from '../../../core/services/navigation-watcher.service';
import { ViewTemplateComponent } from '../../../shared/components/view-template/view-template.component';
import { Page } from '../../../shared/models/page';
@Component({
  selector: 'app-view-products',
  imports: [PTableComponent, CommonModule, ViewTemplateComponent],
  standalone: true,
  templateUrl: './view-products.component.html',
  styleUrl: './view-products.component.css'
})
export class ViewProductsComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  private navigationSub?: Subscription;
  pagedView: boolean = false;
  pageNumber: number = 0;
  totalPages: number = 0;
  private searchTerm: string = '';

  constructor(
    private productService: ProductService,
    public router: Router,
    private navigationWatcher: NavigationWatcherService
  ) {}

  ngOnInit(): void {
    this.loadProducts(this.pageNumber);

    this.navigationSub = this.navigationWatcher.navigation$.subscribe(() => {
      if (this.router.url.startsWith('/products')) { // ajuste conforme sua rota
        this.loadProducts(this.pageNumber);
      }
    });
  }

  ngOnDestroy(): void {
    this.navigationSub?.unsubscribe();
  }

  private loadProducts(page: number = 0, gtin?: string): void {
    this.productService.getAllProducts(page, 20, 'id,desc', gtin).subscribe({
      next: (data: Page<Product> ) => {
        data.totalPages > 1 ? this.pagedView = true : this.pagedView = false;
        this.pageNumber = data.number;
        this.totalPages = data.totalPages;
        this.products = data.content;
        //delete filed createdAt and updatedAt from products
      this.products?.forEach(product => {
        delete product.created_at;
        delete product.updated_at;
        });
      },
      error: (error) => {
        console.error('Erro ao buscar products:', error);
      }
    });
  }

  DeleteProduct(gtin: string): void {
    try {
      this.productService.deleteProduct(gtin).subscribe({
        next: () => {
          this.products = this.products.filter(product => product.gtin !== gtin);
        },
        error: (error) => console.error('Erro ao deletar product:', error)
      });
    } catch (error) {
      console.error('Erro inesperado ao iniciar a deleção do produto:', error);
    }
  }

  EditProduct(id: number): void {
    this.router.navigate(['manage/edit/products', id]);
  }

  onPageChange(page: number): void {
    this.pageNumber = page;
    this.loadProducts(page);
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.loadProducts(0, this.searchTerm);
  }
}