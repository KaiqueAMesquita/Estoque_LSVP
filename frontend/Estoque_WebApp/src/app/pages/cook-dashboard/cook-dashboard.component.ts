import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

// Icons
import {
  faCartPlus,
  faCheckCircle,
  faClipboardList,
  faFileAlt,
  faKitchenSet,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { faClock } from '@fortawesome/free-regular-svg-icons';

// Components & Modules
import { PTableComponent } from '../../shared/components/p-table/p-table.component';
import { DashboardCardsComponent } from '../../shared/components/dashboard/dashboard-cards/dashboard-cards.component';
import { IconModule } from '../../shared/modules/icon/icon.module';
import { NavBarComponent } from '../../shared/components/nav-bar/nav-bar.component';

// Services & Models
import { OrderService } from '../../core/services/order.service';
import { DashboardCookService } from '../../core/services/dashboard-cook.service';
import { Order } from '../../shared/models/order';
import { KitchenUnit } from '../../shared/models/kitchen-unit';

@Component({
  selector: 'app-cook-dashboard',
  templateUrl: './cook-dashboard.component.html',
  styleUrls: ['./cook-dashboard.component.css'],
  standalone: true,
  imports: [PTableComponent, DashboardCardsComponent, IconModule, NavBarComponent, CommonModule],
})
export class CookDashboardComponent implements OnInit {
  // Icons
  faClipboardList = faClipboardList;
  faKitchenSet = faKitchenSet;
  faSpinner = faSpinner;
  faCartPlus = faCartPlus;
  faFileAlt = faFileAlt;
  faCheckCircle = faCheckCircle;
  faClock = faClock;

  totalKitchenProducts: number = 0;
  totalExpiringProducts: number = 0;
  totalPendingOrders: number = 0;

  lastOrders: any[] = [];
  kitchenInventory: Partial<KitchenUnit>[] = [];

  private currentOrderSort: string = 'date,desc';

  constructor(
    private router: Router,
    private orderService: OrderService,
    private dashboardCookService: DashboardCookService
  ) {}

  ngOnInit(): void {
    this.loadCardMetrics();
    this.loadLastOrders();
    this.loadKitchenInventory();
  }

  loadCardMetrics(): void {
    this.dashboardCookService.kitchenUnits(0, 1).subscribe({
      next: (page) => {
        this.totalKitchenProducts = page.totalElements;
      },
      error: (err) => console.error('Error fetching total kitchen products', err)
    });

    this.dashboardCookService.chickenInProductsExpiringSoon(7, 0, 1).subscribe({
      next: (page) => {
        this.totalExpiringProducts = page.totalElements || 0;
      },
      error: (err) => console.error('Error fetching expiring products', err)
    });

    this.orderService.getAllPedingOrders(0, 1).subscribe({
      next: (page) => {
        this.totalPendingOrders = page.totalElements;
      },
      error: (err) => console.error('Error fetching pending orders', err)
    });
  }

  loadLastOrders(): void {
    this.orderService.getAllOrders(0, 5, this.currentOrderSort).subscribe({
      next: (page) => {
        this.lastOrders = page.content.map((order: Order) => {
          const { items, userName, ...rest } = order; 
          
          return {
            ...rest,
            date: order.date ? new Date(order.date) : new Date() 
          };
        });
      },
      error: (err) => console.error('Error fetching orders', err)
    });
  }
  loadKitchenInventory(): void {
    this.dashboardCookService.kitchenUnits(0, 5).subscribe({
      next: (page) => {
        this.kitchenInventory = page.content.map((unit: KitchenUnit) => {
          // Destructuring: removing internal IDs for the table view
          const { unitId, productId, productGtin, ...rest } = unit;
          return rest;
        });
      },
      error: (err) => console.error('Error fetching kitchen inventory', err)
    });
  }

  handleOrderSort(sortString: string): void {
    this.currentOrderSort = sortString;
    this.loadLastOrders();
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}