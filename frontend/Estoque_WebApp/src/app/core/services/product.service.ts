import { Injectable } from '@angular/core';
import { Product } from '../../shared/models/product';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { ProductCreate } from '../../shared/models/product-create';
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  productLink: string = '';
  constructor(private http: HttpClient) { 
    this.productLink = environment.API_URL+"/product"
  }
  
  //Método para registrar um usuário
  public registerProduct(product: ProductCreate): Observable<ProductCreate> {
    return this.http.post<Product>(this.productLink, product);

}

    //Método para pegar todos usuários
  public getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productLink);
  }

  //Método para pegar um usuário pelo id
  public getProductById(productId: number): Observable<Product> {
    return this.http.get<Product>(this.productLink+"/"+productId);
  }

  //Método para atualizar um usuário
  public updateProduct(productId: number, product: Partial<Product>): Observable<Partial<Product>> { 
     return this.http.put<Product>(this.productLink + "/" + productId, product);
  }
    //Método para deletar um usuário
  public deleteProduct(productId: string): void {	
    this.http.delete<Product>(this.productLink+"/"+productId).subscribe(
      (response) => {
        console.log('Usuário deletado com sucesso:', response);
      },
      (error) => {
        console.error('Erro ao deletar usuário:', error);
      } 
    );
  
  }


}
