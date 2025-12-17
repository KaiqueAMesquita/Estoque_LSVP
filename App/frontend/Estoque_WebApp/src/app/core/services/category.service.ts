import { Injectable } from '@angular/core';
import { Category } from '../../shared/models/category';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Page } from '../../shared/models/page';
import { AveragePrice } from '../../shared/models/average-price';
import { CategoryTotal } from '../../shared/models/category-total';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  categoryLink: string = '';
  constructor(private http: HttpClient) { 
    this.categoryLink = environment.api_url + "/category";
  }

  // Método para registrar uma categoria
  public registerCategory(category: any): Observable<Category> {
    return this.http.post<Category>(this.categoryLink, category);
  }

  // Método para pegar todas as categorias
  public getAllCategories(page: number = 1, limit: number = 20, sort: string = 'id,desc', description?: string): Observable<Page<Category>> {
    const pageNumber = page + 1; // O backend espera a página começando em 1
    let params = new HttpParams()
      .set('page', pageNumber.toString())
      .set('limit', limit.toString())
      .set('sort', sort.toString());
    if (description && description.trim() !== '') {
      params = params.set('description', description.toString());
    }
    return this.http.get<Page<Category>>(this.categoryLink, { params });
  }

  // Método para pegar uma categoria pelo id
  public getCategoryById(categoryId: number): Observable<Category> {
    return this.http.get<Category>(`${this.categoryLink}/${categoryId}`);
  }

  // Método para atualizar uma categoria
  public updateCategory(categoryId: number, categoryPayload: any): Observable<Category> {
    const params = new HttpParams()
      .set('description', categoryPayload.description)
      .set('foodType', categoryPayload.foodType)
      .set('min_quantity', categoryPayload.min_quantity)
      .set('max_quantity', categoryPayload.max_quantity);

    // Envia o PUT com o corpo nulo e os dados como parâmetros de URL
    return this.http.put<Category>(`${this.categoryLink}/${categoryId}`, null, { params });
  }

  // Método para deletar uma categoria
  public deleteCategory(categoryId: number): void {
    this.http.delete<void>(`${this.categoryLink}/${categoryId}`).subscribe(
      (response) => {
        console.log('Categoria deletada com sucesso');
      },
      (error) => {
        console.error('Erro ao deletar categoria:', error);
      }
    );
  }
public getAveragePriceByCategory(categoryId: number, startMonth: number, startYear: number, endMonth: number, endYear: number): Observable<AveragePrice>{
    let params = new HttpParams()
    .set('categoryId', categoryId)
    .set('startMonth', startMonth)
    .set('startYear', startYear)
    .set('endMonth', endMonth)
    .set('endYear', endYear)
  
    return this.http.get<AveragePrice>(`${environment.api_url}/reports/average-price`, {params})

  }
  public getTotalQuantityByCategory(categoryId: number): Observable<CategoryTotal>{
    let params = new HttpParams()
    .set('categoryId', categoryId.toString())
    return this.http.get<CategoryTotal>(`${environment.api_url}/reports/category-total`, {params});
  }
}
