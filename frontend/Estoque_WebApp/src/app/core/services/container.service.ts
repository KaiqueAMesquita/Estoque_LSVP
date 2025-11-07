import { Injectable } from '@angular/core';
import { Container } from '../../shared/models/container';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Page } from '../../shared/models/page';


@Injectable({
  providedIn: 'root'
})
export class ContainerService {
  containerLink: string = '';

  constructor(private http: HttpClient) {
    this.containerLink = environment.API_URL + "/container";
  }

  // Método para registrar um container
  public registerContainer(container: Container): Observable<Container> {
    return this.http.post<Container>(this.containerLink, container);
    
  }

  // Método para pegar todos containers
  public getAllContainers(page: number = 1, limit: number = 20, sort: string = 'id,desc', code?: string, category?: string): Observable<Page<Container>> {
    const pageNumber = page + 1; // O backend espera a página começando em 1
    let params = new HttpParams()
      .set('page', pageNumber.toString())
      .set('limit', limit.toString())
      .set('sort', sort.toString());
    if (code && code.trim() !== '') {
      params = params.set('code', code.toString());
    }
    if (category && category.trim() !== '') {
      params = params.set('category', category.toString());
    }
    
    return this.http.get<Page<Container>>(this.containerLink, { params });
  }

  // Método para pegar um container pelo id
  public getContainerById(containerId: number): Observable<Container> {
    return this.http.get<Container>(`${this.containerLink}/${containerId}`);
  }

  // Método para atualizar um container
  public updateContainer(containerId: number, container: Container): Observable<Container> {
    return this.http.put<Container>(`${this.containerLink}/${containerId}`, container);
  }

  // Método para deletar um container
  public deleteContainer(containerId: number): void {
    this.http.delete<Container>(`${this.containerLink}/${containerId}`).subscribe(
      (response) => {
        console.log('Container deletado com sucesso:', response);
      },
      (error) => {
        console.error('Erro ao deletar container:', error);
      }
    );
  }
}