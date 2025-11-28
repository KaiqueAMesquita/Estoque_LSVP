import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';
import { Observable } from 'rxjs';
import { Order } from '../../shared/models/order';
import { Page } from '../../shared/models/page';
import { OrderRequest } from '../../shared/models/order-request';

@Injectable({
  providedIn: 'root'
})

export class OrderService {
 orderLink: string = '';
  constructor(private http: HttpClient) { 
    this.orderLink = environment.API_URL+"/orders"
  
}

  getAllOrders(page: number = 1, limit: number = 20, sort: string = 'date,desc'): Observable<Page<Order>> {
    let pageNumber = page + 1;
    let params = new HttpParams()
    .set('page', pageNumber.toString())
    .set('limit', limit.toString())
    .set('sort', sort);

    return this.http.get<Page<Order>>(`${this.orderLink}`, { params });
  }

  getAllPedingOrders(page: number = 1, limit: number = 20): Observable<Page<Order>> {
    let pageNumber = page + 1;
    let params = new HttpParams()
      .set('page', pageNumber.toString())
      .set('limit', limit.toString());

    return this.http.get<Page<Order>>(`${this.orderLink}/pending`, { params });
  
  } 

  createOrder(order: OrderRequest): Observable<OrderRequest> {
    return this.http.post<OrderRequest>(`${this.orderLink}`, order);
  }
}
