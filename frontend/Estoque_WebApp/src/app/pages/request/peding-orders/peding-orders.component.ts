import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { OrderService } from '../../../core/services/order.service';
import { NavigationWatcherService } from '../../../core/services/navigation-watcher.service';

// Models
import { Order } from '../../../shared/models/order';

// Components - Adjusted to ../../ to match the new file depth
import { ViewTemplateComponent } from '../../../shared/components/view-template/view-template.component';
import { PTableComponent } from '../../../shared/components/p-table/p-table.component';
import { NavBarComponent } from "../../../shared/components/nav-bar/nav-bar.component";
import { ManageLayoutComponent } from '../../../shared/layouts/manage-layout/manage-layout.component';

@Component({
  selector: 'app-peding-orders',
  standalone: true,
  imports: [ViewTemplateComponent, PTableComponent, CommonModule, NavBarComponent, ManageLayoutComponent],
  templateUrl: './peding-orders.component.html',
  styleUrl: './peding-orders.component.css'
})
export class PedingOrdersComponent implements OnInit, OnDestroy {
  orders: Order[] = [];
  private navigationSub?: Subscription;
  
  pagedView: boolean = false;
  pageNumber: number = 0;
  totalPages: number = 0;

  constructor(
    private orderService: OrderService,
    public router: Router,
    private navigationWatcher: NavigationWatcherService
  ) {}

  ngOnInit(): void {
    this.loadOrders(this.pageNumber);

    this.navigationSub = this.navigationWatcher.navigation$.subscribe(() => {
      if (this.router.url.startsWith('/manage/peding-orders')) {
        this.loadOrders(this.pageNumber);
      }
    });
  }

  ngOnDestroy(): void {
    this.navigationSub?.unsubscribe();
  }

  private loadOrders(page: number = 0): void {
    this.orderService.getAllPedingOrders(page, 20).subscribe({
      next: (ordersPage) => {        
        ordersPage.totalPages > 1 ? this.pagedView = true : this.pagedView = false;
        this.pageNumber = ordersPage.number;
        this.totalPages = ordersPage.totalPages;
        
        this.orders = ordersPage.content.map((order: Order) => {
          const processedOrder = { ...order };
          
          // @ts-ignore
          delete processedOrder.items; 
          delete processedOrder.userName;
          processedOrder.date = new Date(order.date).toLocaleDateString();

          return processedOrder;
        });
      },
      error: (error) => {
        console.error('Erro ao buscar pedidos pendentes:', error);
      }
    });
  }

  ViewOrder(id: number): void {
    this.router.navigate(['fullfill/order', id]);
  }

  onPageChange(page: number): void {
    this.pageNumber = page;
    this.loadOrders(page);
  }

  refresh(): void {
    this.loadOrders(this.pageNumber);
  }
}