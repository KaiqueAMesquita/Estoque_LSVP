import { Component, OnInit, ViewChild } from '@angular/core';
import { NavBarComponent } from '../../shared/components/nav-bar/nav-bar.component';
import { DashboardCardsComponent } from '../../shared/components/dashboard/dashboard-cards/dashboard-cards.component';
import { PTableComponent } from '../../shared/components/p-table/p-table.component';
import { ExpirationBatches } from '../../shared/models/expiration-batches';
import { LastMovements } from '../../shared/models/last-movements';
import { IconModule, icons } from '../../shared/modules/icon/icon.module';
import { Router } from '@angular/router';
import { UnitService } from '../../core/services/unit.service';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { DashboardService } from '../../core/services/dashboard.service';
import { ExpiringProducts } from '../../shared/models/expiring-products';
import { TotalSpent } from '../../shared/models/total-spent';
import { CurrencyPipe } from '@angular/common';
import { ExpiringBatchs } from '../../shared/models/expiring-batchs';
import { Movement } from '../../shared/models/movement';
import { MovementService } from '../../core/services/movement.service';
import { ModalModule } from './../../shared/modules/modal/modal.module';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NavBarComponent, DashboardCardsComponent, IconModule, PTableComponent, CurrencyPipe, ModalModule],

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
  expiredCount: number = 0;
  @ViewChild('expiredModal') expiredModal!: ModalComponent;

  constructor(
    private router: Router,
    private dashboardService: DashboardService,
    private movementService: MovementService,
    private unitService: UnitService
  ) {}
  
  ngOnInit(): void {
    let date = new Date();
    this.productsExpiration(7);
    this.totalSpent(date.getMonth()+1, date.getFullYear());
    this.totalStock();
    this.getExpiringBatchs(7, 0,10);
    this.getLastMovements(1, 10);
    this.checkExpiredUnits();

  }

  private checkExpiredUnits(): void {
    this.unitService.getExpiredUnits(0, 1).subscribe({
      next: (page) => {
        const total = (page && typeof page.totalElements === 'number') ? page.totalElements : 0;
        if (total > 0) {
          this.expiredCount = total;
          // open modal shortly after to ensure ViewChild is available
          setTimeout(() => { try { if (this.expiredModal) this.expiredModal.toggle(); } catch (e) {} }, 50);
        }
      },
      error: (err) => console.error('Erro ao verificar expired units:', err)
    });
  }

  goToExpiredUnits(): void {
    try { this.expiredModal.toggle(); } catch {}
    this.router.navigate(['/expired-units']);
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
