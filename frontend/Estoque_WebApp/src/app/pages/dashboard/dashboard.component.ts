import { Component, OnInit } from '@angular/core';
import { NavBarComponent } from '../../shared/components/nav-bar/nav-bar.component';
import { DashboardCardsComponent } from '../../shared/components/dashboard/dashboard-cards/dashboard-cards.component';
import { PTableComponent } from '../../shared/components/p-table/p-table.component';
import { ExpirationBatches } from '../../shared/models/expiration-batches';
import { LastMovements } from '../../shared/models/last-movements';
import { IconModule, icons } from '../../shared/modules/icon/icon.module';
import { Router } from '@angular/router';
import { DashboardService } from '../../core/services/dashboard.service';
import { ExpiringProducts } from '../../shared/models/expiring-products';
import { TotalSpent } from '../../shared/models/total-spent';
import { CurrencyPipe } from '@angular/common';
import { ExpiringBatchs } from '../../shared/models/expiring-batchs';
import { Movement } from '../../shared/models/movement';
import { MovementService } from '../../core/services/movement.service';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NavBarComponent, DashboardCardsComponent, IconModule, PTableComponent, CurrencyPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  icons = icons;
  expiringProducts: ExpiringProducts | undefined;
  totalSpentMonth: TotalSpent | undefined;
  stockTotalQuantity: number | undefined;
  expiringBatches: Partial<ExpiringBatchs>[] = []
  lastMovements: Partial<Movement>[] = []

  constructor(private router: Router, private dashboardService: DashboardService, private movementService: MovementService) {}
  
  ngOnInit(): void {
    let date = new Date();
    this.productsExpiration(7);
    this.totalSpent(date.getMonth()+1, date.getFullYear());
    this.totalStock();
    this.getExpiringBatchs(7, 0,10);
    this.getLastMovements(1, 10);

  }

     
   
  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  productsExpiration(days: number): void {
    this.dashboardService.getTotalExpiringProducts(days).subscribe({
      next: (data) => {
        this.expiringProducts = data;
      },
      error: (err) => console.error('Erro ao buscar dados', err)
    });
  }

  totalSpent(month: number, year: number): void{
    this.dashboardService.getTotalSpent(month, year).subscribe({
      next: (data) => {
        this.totalSpentMonth = data;

      },
      error: (err) => 
        console.error("Erro ao buscar dados", err)
    })
  }
  totalStock(): void{
    this.dashboardService.getStockTotal().subscribe({
      next: (data) => {
        this.stockTotalQuantity = data.totalQuantity;
      },
      error: (err) =>
        console.error("Erro ao buscar por dado", err)
    })
  }

  getExpiringBatchs(days: number, page: number, limit: number): void {
  this.dashboardService.getExpringBatchs(days, page, limit).subscribe({
    next: (data) => {
      this.expiringBatches = data.content.map((exp: ExpiringBatchs) => {
        const { unitId, productId, productGtin, expirationDate, ...rest } = exp;
        return rest; // retorna o objeto sem esses campos
      });
    },
    error: (error) => {
      console.error('Erro ao buscar Movimentações:', error);
    }
  });
}
  getLastMovements(page: number, limit: number){
   this.movementService.getAllMovements(page, limit).subscribe({
      next: (page) => {
        this.lastMovements = page.content.map((movement: Movement) => {
          const { unitId, userId, userName, id, sourceDetails, quantity,  ...rest } = movement;
          return {
            ...rest,
            date: movement.date ? new Date(movement.date) : new Date()
          };
        });
      },
      error: (error) => {
        console.error('Erro ao buscar Movimentações:', error);
      }
    });
  }


}
