import { Component, OnDestroy, OnInit } from '@angular/core';
import { PTableComponent } from '../../../shared/components/p-table/p-table.component';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../shared/models/product';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavigationWatcherService } from '../../../core/services/navigation-watcher.service';

@Component({
  selector: 'app-view-products',
  imports: [PTableComponent, CommonModule],
  standalone: true,
  templateUrl: './view-products.component.html',
  styleUrl: './view-products.component.css'
})
export class ViewProductsComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  private navigationSub?: Subscription;

  constructor(
    private productService: ProductService,
    private router: Router,
    private navigationWatcher: NavigationWatcherService
  ) {}

  ngOnInit(): void {
    this.loadProducts();

    this.navigationSub = this.navigationWatcher.navigation$.subscribe(() => {
      if (this.router.url.startsWith('/products')) { // ajuste conforme sua rota
        this.loadProducts();
      }
    });
  }

  ngOnDestroy(): void {
    this.navigationSub?.unsubscribe();
  }

  private loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (data: Product[]) => {
        this.products = data;
      },
      error: (error) => {
        console.error('Erro ao buscar products:', error);
      }
    });
  }

  DeleteProduct(gtin: string): void {
    try {
      this.productService.deleteProduct(gtin);
      this.products = this.products.filter(product => product.gtin !== gtin);
    } catch (error) {
      console.error('Erro ao deletar product:', error);
    }
  }

  EditProduct(id: number): void {
    this.router.navigate(['manage/edit/products', id]);
  }
}