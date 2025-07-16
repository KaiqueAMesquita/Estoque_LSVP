import { Component, OnInit, OnDestroy } from '@angular/core';
import { PTableComponent } from '../../../shared/components/p-table/p-table.component';
import { ProductService } from './../../../core/services/product.service';
import { Product } from './../../../shared/models/product';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { AuthenticationService } from './../../../core/authentication/authentication.service';
@Component({
  selector: 'app-view-products',
  imports: [PTableComponent, CommonModule],
  standalone: true,
  templateUrl: './view-products.component.html',
  styleUrl: './view-products.component.css'
})
export class ViewProductsComponent implements OnInit, OnDestroy {
  products: Product[] = []; // Array para armazenar os produtos
  private routerSubscription!: Subscription; // Assinatura para monitorar eventos de navegação do roteador
  constructor(private productService: ProductService, private auth: AuthenticationService, private router: Router) {}
  ngOnInit(): void {
    // Atualiza ao iniciar
    this.loadProducts();

    // Ouve eventos de navegação e recarrega se a rota atual for a deste componente
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.loadProducts();
      });
  }

  /**
   * Método para obter o token de autenticação do usuário.
   * @returns O token de autenticação ou null se não estiver autenticado.
  **/
  public getToken(): string | null {
    return this.auth.getToken();
  }

  ngOnDestroy(): void {
    // limpar subscription para evitar memory leak
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    } 
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
  this.router.navigate(['/products/edit', productId]);
}

// Método para adicionar um novo produto e redirecionar para a página de adição
AddProduct(): void { 
  // Redireciona para a página de adição de produto
  this.router.navigate(['/products/add']);
}
// Método para visualizar os detalhes de um produto
ViewProduct(productId: number): void {
  // Redireciona para a página de visualização do produto com o ID do produto
  this.router.navigate(['/products/view', productId]);
}


}
