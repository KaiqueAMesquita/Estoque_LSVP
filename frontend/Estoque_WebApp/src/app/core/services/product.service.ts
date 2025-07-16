import { Injectable } from '@angular/core';
import { Product } from '../../shared/models/product';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
    // Lógica de Inicialização do serviço
    // Definindo a URL base para as requisições de produtos
    // A URL é construída a partir do ambiente de desenvolvimento
    // e o endpoint específico para produtos.
    // A URL é armazenada na variável productLink
    // que será utilizada nos métodos do serviço.
    productLink: string = '';
    constructor(private http: HttpClient) {
      this.productLink = environment.API_URL + "/products";  
    }

    // Método para registrar um produto
    public registerProduct(product: Product): void {
      this.http.post<Product>(this.productLink, product).subscribe(
        (response) => {
          console.log('Produto registrado com sucesso:', response);
        },
        (error) => {
          console.error('Erro ao registrar produto:', error);
        }
      );
    }
    // Método para pegar todos os produtos
    public getAllProducts(): Observable<Product[]> {
      return this.http.get<Product[]>(this.productLink);
    }
    // Método para pegar um produto pelo id
    public getProductById(productId: number): Observable<Product> {
      return this.http.get<Product>(this.productLink + "/" + productId);
    }
    // Método para atualizar um produto
    public updateProduct(productId: number, product: Partial<Product>): void {   
      this.http.put<Product>(this.productLink + "/" + productId, product).subscribe(
        (response) => {
          console.log('Produto atualizado com sucesso:', response);
        },
        (error) => {
          console.error('Erro ao atualizar produto:', error);
        }
      );
    }
    // Método para deletar um produto
    public deleteProduct(productId: number): void {
      this.http.delete<Product>(this.productLink + "/" + productId).subscribe(
        (response) => {
          console.log('Produto deletado com sucesso:', response);
        },
        (error) => {
          console.error('Erro ao deletar produto:', error);
        }
      );
    }
    // Método para buscar produtos por nome
    public searchProductsByName(name: string): Observable<Product[]> {
      return this.http.get<Product[]>(`${this.productLink}/search?name=${name}`);
    }
    // Método para buscar produtos por categoria
    public searchProductsByCategory(category: string): Observable<Product[]> {
      return this.http.get<Product[]>(`${this.productLink}/search?category=${category}`);
    }
    // Método para buscar produtos por preço
    public searchProductsByPriceRange(minPrice: number, maxPrice: number): Observable<Product[]> {
      return this.http.get<Product[]>(`${this.productLink}/search?minPrice=${minPrice}&maxPrice=${maxPrice}`);
    }
    // Método para buscar produtos por disponibilidade
    public searchProductsByAvailability(isAvailable: boolean): Observable<Product[]> {
      return this.http.get<Product[]>(`${this.productLink}/search?isAvailable=${isAvailable}`);
    }
    // Método para buscar produtos por fornecedor
    public searchProductsBySupplier(supplierId: number): Observable<Product[]> {
      return this.http.get<Product[]>(`${this.productLink}/search?supplierId=${supplierId}`);
    }
    // Método para buscar produtos por data de criação
    public searchProductsByCreationDate(creationDate: string): Observable<Product[]> {
      return this.http.get<Product[]>(`${this.productLink}/search?creationDate=${creationDate}`);
    }
    // Método para buscar produtos por data de atualização
    public searchProductsByUpdateDate(updateDate: string): Observable<Product[]> {
      return this.http.get<Product[]>(`${this.productLink}/search?updateDate=${updateDate}`);
    }
    // Método para buscar produtos por status
    public searchProductsByStatus(status: string): Observable<Product[]> {
      return this.http.get<Product[]>(`${this.productLink}/search?status=${status}`);
    }
    // Método para buscar produtos por tags
    public searchProductsByTags(tags: string[]): Observable<Product[]> {
      const tagsParam = tags.join(',');
      return this.http.get<Product[]>(`${this.productLink}/search?tags=${tagsParam}`);
    }
    // Método para buscar produtos por descrição
    public searchProductsByDescription(description: string): Observable<Product[]> {
      return this.http.get<Product[]>(`${this.productLink}/search?description=${description}`);
    }
    // Método para buscar produtos por código de barras
    public searchProductsByBarcode(barcode: string): Observable<Product[]> {
      return this.http.get<Product[]>(`${this.productLink}/search?barcode=${barcode}`);
    }
    // Método para buscar produtos por SKU
    public searchProductsBySKU(sku: string): Observable<Product[]> {
      return this.http.get<Product[]>(`${this.productLink}/search?sku=${sku}`);
    }
    // Método para buscar produtos por fabricante
    public searchProductsByManufacturer(manufacturer: string): Observable<Product[]> {
      return this.http.get<Product[]>(`${this.productLink}/search?manufacturer=${manufacturer}`);
    }
    // Método para buscar produtos por quantidade em estoque
    public searchProductsByStockQuantity(minQuantity: number, maxQuantity: number): Observable<Product[]> {
      return this.http.get<Product[]>(`${this.productLink}/search?minQuantity=${minQuantity}&maxQuantity=${maxQuantity}`);
    }
    // Método para buscar produtos por localização no estoque
    public searchProductsByLocation(location: string): Observable<Product[]> {
      return this.http.get<Product[]>(`${this.productLink}/search?location=${location}`);
    }
}
