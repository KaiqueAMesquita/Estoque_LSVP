import { Injectable } from '@angular/core';
import { Container } from '../../shared/models/container';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContainerService {
  containerLink: string = '';

  constructor(private http: HttpClient) {
    this.containerLink = environment.API_URL + "/container";
  }

  // Método para registrar um container
  public registerContainer(container: Container): void {
    this.http.post<Container>(this.containerLink, container).subscribe(
      (response) => {
        console.log('Container registrado com sucesso:', response);
      },
      (error) => {
        console.error('Erro ao registrar container:', error);
      }
    );
  }

  // Método para pegar todos containers
  public getAllContainers(): Observable<Container[]> {
    return this.http.get<Container[]>(this.containerLink);
  }

  // Método para pegar um container pelo id
  public getContainerById(containerId: number): Observable<Container> {
    return this.http.get<Container>(`${this.containerLink}/${containerId}`);
  }

  // Método para atualizar um container
  public updateContainer(containerId: number, container: Partial<Container>): void {
    this.http.put<Container>(`${this.containerLink}/${containerId}`, container).subscribe(
      (response) => {
        console.log('Container atualizado com sucesso:', response);
      },
      (error) => {
        console.error('Erro ao atualizar container:', error);
      }
    );
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