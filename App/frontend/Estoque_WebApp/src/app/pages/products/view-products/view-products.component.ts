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
  
  // NOVA PROPRIEDADE: Define a ordenação padrão
  private currentSort: string = 'id,desc'; 

  constructor(
    private productService: ProductService,
    public router: Router,
    private navigationWatcher: NavigationWatcherService
  ) {}

  ngOnInit(): void {
    this.loadProducts(this.pageNumber);

    this.navigationSub = this.navigationWatcher.navigation$.subscribe(() => {
      if (this.router.url.startsWith('/manage/view/products')) {
        this.loadProducts(this.pageNumber);
      }
    });
  }

  ngOnDestroy(): void {
    this.navigationSub?.unsubscribe();
  }

  private loadProducts(page: number = 0, gtin?: string): void {
    this.productService.getAllProducts(page, 20, this.currentSort, gtin).subscribe({
      next: (products) => {        
        products.totalPages > 1 ? this.pagedView = true : this.pagedView = false;
        this.pageNumber = products.number;
        this.totalPages = products.totalPages;
        
        this.products = products.content.map((product: Product) => {
         
          const processedProduct = { ...product };
          processedProduct.createdAt  && (processedProduct.createdAt = new Date(processedProduct.createdAt!));
          processedProduct.updatedAt && (processedProduct.updatedAt = new Date(processedProduct.updatedAt!));
         
       
          return processedProduct;
        });
      },
      error: (error) => {
        console.error('Erro ao buscar products:', error);
      }
    });
  }

  handleSort(sortString: string): void {
    this.currentSort = sortString;
    this.loadProducts(0, this.searchTerm); 
  }

  DeleteProduct(gtin: string): void {
    try {
      this.productService.deleteProduct(gtin).subscribe({
        next: () => {
          // Recarrega mantendo a página e a ordenação atual
          this.loadProducts(this.pageNumber, this.searchTerm);
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
    this.loadProducts(page, this.searchTerm);
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.loadProducts(0, this.searchTerm);
  }
}