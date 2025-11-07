import { Injectable } from '@angular/core';
import { Product } from '../../shared/models/product';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { ProductCreate } from '../../shared/models/product-create';
import { Category } from './../../shared/models/category';
import { Page } from '../../shared/models/page';
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  productLink: string = '';
  constructor(private http: HttpClient) { 
    this.productLink = environment.API_URL+"/product"
  }
  
  //Método para registrar um Produto
  public registerProduct(product: ProductCreate): Observable<ProductCreate> {
    return this.http.post<ProductCreate>(this.productLink, product);

}

    //Método para pegar todos Produtos
  public getAllProducts(page: number = 1, limit: number = 20, sort: string = 'id,desc', gtin?: String, category?: String): Observable<Page<Product>> {
    const pageNumber = page + 1; // O backend espera a página começando em 1
    let params = new HttpParams()
      .set('page', pageNumber.toString())
      .set('limit', limit.toString())
      .set('sort', sort.toString());
    if (gtin && gtin.trim() !== '') {
      params = params.set('gtin', gtin.toString());
    }
    if (category && category.trim() !== '') {
      params = params.set('category', category.toString());
    }
    
    
    return this.http.get<Page<Product>>(this.productLink, { params });
  }

  //Método para pegar um Produto pelo id
  public getProductById(productId: number): Observable<Product> {
    return this.http.get<Product>(this.productLink+"/"+productId);
  }

  //Método para pegar um produto pelo gtin
  public getProductByGtin(gtin: string): Observable<Product> {
    return this.http.get<Product>(this.productLink+"/gtin/"+gtin);
  }

  //Método para atualizar um Produto
  public updateProduct(productId: number, product: Partial<Product>): Observable<Partial<Product>> { 
     return this.http.put<Product>(this.productLink + "/" + productId, product);
  }
    //Método para deletar um Produto
  public deleteProduct(productId: string): Observable<void> {	
    return this.http.delete<void>(`${this.productLink}/${productId}`);
  }


}
