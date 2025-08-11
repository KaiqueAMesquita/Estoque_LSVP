import { Component, OnInit, OnDestroy } from '@angular/core';
import { PTableComponent } from '../../../shared/components/p-table/p-table.component';
import { ProductService } from './../../../core/services/product.service';
import { Product } from './../../../shared/models/product';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { AuthenticationService } from './../../../core/authentication/authentication.service';
import { NavigationWatcherService } from '../../../core/services/navigation-watcher.service';
@Component({
  selector: 'app-view-products',
  imports: [PTableComponent, CommonModule],
  standalone: true,
  templateUrl: './view-products.component.html',
  styleUrl: './view-products.component.css'
})
export class ViewProductsComponent implements OnInit, OnDestroy {
  products: Product[] = []; // Array para armazenar os produtos
  private navigationSub?: Subscription; // Assinatura para monitorar eventos de navegação do roteador
  constructor(private productService: ProductService, private auth: AuthenticationService, private router: Router, private navigationWatcher: NavigationWatcherService) {}
  ngOnInit(): void {
    // Atualiza ao iniciar
    this.loadProducts();

    // Ouve eventos de navegação e recarrega se a rota atual for a deste componente
    this.navigationSub = this.navigationWatcher.navigation$.subscribe(() => {
      // Verificando se é a rota correta deste componente
      if (this.router.url.startsWith('/products')) {
        this.loadProducts();
      }
    });
  }   
   /**
   * Método para obter o token de autenticação do usuário.
   * Retorna O token de autenticação ou null se não estiver autenticado.
  **/
  public getToken(): string | null {
    return this.auth.getToken();
  }

  ngOnDestroy(): void {
    // limpa subscription (inscrição) para evitar vazamento de memória (memory leak)
    this.navigationSub?.unsubscribe();
  }
  // Método que carrega produtos
  private loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (data: Product[]) => {
        this.products = data;
      },
      error: (error) => {
        console.error('Erro ao carregar produtos:', error);
      }
    });
  }



// Método para deletar um produto
DeleteProduct(productId: number): void {
  try{
    this.productService.deleteProduct(productId);
    this.products = this.products.filter(product => product.id !== productId);
  }catch (error) {
    console.error('Erro ao deletar produto:', error);
  }
}
// Método para editar um produto e redirecionar para a página de edição

EditProduct(productId: number): void {
  // Redireciona para a página de edição do produto com o ID do produto
  this.router.navigate(['manage/products/edit', productId]);
}

// Método para adicionar um novo produto e redirecionar para a página de adição
AddProduct(): void { 
  // Redireciona para a página de adição de produto
  this.router.navigate(['manage/products/add']);
}
}


