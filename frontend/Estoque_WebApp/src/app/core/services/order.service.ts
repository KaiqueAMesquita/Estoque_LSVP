import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { Order } from '../../shared/models/order';

@Injectable({
  providedIn: 'root'
})

export class OrderService {
 orderLink: string = '';
  constructor(private http: HttpClient) { 
    this.orderLink = environment.API_URL+"/orders"
  }

  // criar pedido
  createOrder(orderData: any):Observable<Order> {
    return this.http.post<any>(this.orderLink, orderData);
  }
  //pegar todos os pedidos
  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.orderLink);
  }
  //pegar pedido por id
  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(this.orderLink + `/${id}`);
  }

  
 
}
