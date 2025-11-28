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

  // MÉTODO ATUALIZADO
  private loadProducts(page: number = 0, gtin?: string): void {
    // Passamos this.currentSort dinamicamente
    this.productService.getAllProducts(page, 20, this.currentSort, gtin).subscribe({
      next: (products) => {        
        products.totalPages > 1 ? this.pagedView = true : this.pagedView = false;
        this.pageNumber = products.number;
        this.totalPages = products.totalPages;
        
        this.products = products.content.map((product: Product) => {
          // NOTA: Se você deletar o ID aqui, os botões de Editar e Deletar 
          // podem parar de funcionar, pois eles dependem de product.id.
          // Mantive conforme seu padrão, mas removendo apenas datas se necessário.
          
          /* Se precisar remover campos visuais, faça aqui dentro do map 
             usando destructuring para não afetar o objeto original se necessário 
          */
          const processedProduct = { ...product };
          delete processedProduct.created_at;
          delete processedProduct.updated_at;
          // delete processedProduct.id; // Cuidado: Se deletar o ID, o evento (onDelete) não saberá qual ID enviar.
          
          return processedProduct;
        });
      },
      error: (error) => {
        console.error('Erro ao buscar products:', error);
      }
    });
  }

  // NOVO MÉTODO PARA LHE DAR COM O CLIQUE NA TABELA
  handleSort(sortString: string): void {
    this.currentSort = sortString;
    // Reinicia na página 0 para evitar inconsistências visuais
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