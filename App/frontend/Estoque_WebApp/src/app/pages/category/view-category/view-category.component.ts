import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../../core/services/category.service';
import { ReportService } from '../../../core/services/report.service'; // <--- Importe o Service
import { Category } from './../../../shared/models/category';
import { ViewTemplateComponent } from '../../../shared/components/view-template/view-template.component';
import { GraficComponent } from '../../../shared/components/grafic/grafic.component';
import { CommonModule } from '@angular/common'; 
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AveragePrice } from './../../../shared/models/average-price';
import { StockFlow } from './../../../shared/models/stock-flow'; // <--- Importe a Model

@Component({
  selector: 'app-view-category',
  standalone: true, 
  imports: [ViewTemplateComponent, GraficComponent, CommonModule],
  templateUrl: './view-category.component.html',
  styleUrl: './view-category.component.css'
})
export class ViewCategoryComponent implements OnInit {

  category: Category | undefined;
  
  chartDataPrice: any[] = []; 
  
  chartDataFlow: any[] = []; 
  
  flowDetails: { label: string, netChange: number }[] = [];

  currentStock: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private reportService: ReportService, 
    public router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.categoryService.getCategoryById(id).subscribe({
      next: (data) => {
        this.category = data;
        if (this.category && this.category.id) {
            this.loadHistoryPrice(12);
            this.loadStockFlowHistory(12); 
            this.loadCurrentStock(this.category.id);
        }
      },
      error: (err) => console.error('Erro ao carregar categoria:', err)
    });
  }

  loadCurrentStock(id: number) {
    this.categoryService.getTotalQuantityByCategory(id).subscribe({
      next: (res: any) => {
        if (Array.isArray(res) && res.length > 0) {
            this.currentStock = res[0].totalQuantity;
        } else if (res && res.totalQuantity !== undefined) {
            this.currentStock = res.totalQuantity;
        } else {
            this.currentStock = 0;
        }
      },
      error: (err) => {
        console.error('Erro ao buscar total:', err);
        this.currentStock = 0; 
      }
    });
  }

  get stockStatus(): { label: string, cssClass: string } {
    if (!this.category || this.currentStock === null) {
      return { label: 'Carregando...', cssClass: 'status-loading' };
    }

    const current = this.currentStock;
    const min = this.category.min_quantity || 0;
    const max = this.category.max_quantity || 999999;

    if (current < min) {
      return { label: 'Crítico (Baixo)', cssClass: 'status-critical' };
    } else if (current > max) {
      return { label: 'Acima do Máximo', cssClass: 'status-warning' };
    } else {
      return { label: 'Bom (Ideal)', cssClass: 'status-good' };
    }
  }

  loadHistoryPrice(quantity: number): void {
    if (!this.category?.id) return;

    const requests: Observable<any>[] = [];
    const today = new Date();

    for (let i = quantity - 1; i >= 0; i--) {
      const dateTarget = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const month = dateTarget.getMonth() + 1;
      const year = dateTarget.getFullYear();
      const labelName = `${month.toString().padStart(2, '0')}/${year}`;

      const req = this.categoryService.getAveragePriceByCategory(
        this.category.id, month, year, month, year
      ).pipe(
        map((res: any) => {
          let val = 0;
          if (Array.isArray(res) && res.length > 0) val = res[0].averagePrice;
          else if (res && !Array.isArray(res)) val = res.averagePrice;
          
          return { name: labelName, value: val };
        }),
        catchError(() => of({ name: labelName, value: 0 }))
      );
      requests.push(req);
    }

    forkJoin(requests).subscribe({
      next: (results) => {
        this.chartDataPrice = [{ name: 'Preço Médio', series: results }];
      },
      error: (err) => console.error('Erro gráfico preço', err)
    });
  }

  loadStockFlowHistory(quantity: number): void {
    if (!this.category?.id) return;

    const requests: Observable<any>[] = [];
    const today = new Date();

    for (let i = quantity - 1; i >= 0; i--) {
        const dateTarget = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const month = dateTarget.getMonth() + 1;
        const year = dateTarget.getFullYear();
        const labelName = `${month.toString().padStart(2, '0')}/${year}`;

        const req = this.reportService.getStockFlow(
            this.category.id, month, year, month, year
        ).pipe(
            map((res: any) => {
                let item: StockFlow = { 
                    categoryId: this.category!.id!, 
                    categoryDescription: '', 
                    year, month, 
                    totalQuantityIn: 0, 
                    totalQuantityOut: 0, 
                    netChange: 0 
                };

                if (Array.isArray(res) && res.length > 0) item = res[0];
                else if (res && !Array.isArray(res) && res.categoryId) item = res;

                return {
                    label: labelName,
                    in: item.totalQuantityIn || 0,
                    out: item.totalQuantityOut || 0,
                    net: item.netChange || 0
                };
            }),
            catchError(() => {
                return of({ label: labelName, in: 0, out: 0, net: 0 });
            })
        );
        requests.push(req);
    }

    forkJoin(requests).subscribe({
        next: (results) => {
            const seriesIn = results.map(r => ({ name: r.label, value: r.in }));
            const seriesOut = results.map(r => ({ name: r.label, value: r.out }));

            this.chartDataFlow = [
                { name: 'Entradas', series: seriesIn },
                { name: 'Saídas', series: seriesOut }
            ];

            this.flowDetails = results.map(r => ({
                label: r.label,
                netChange: r.net
            }));
        },
        error: (err) => console.error('Erro gráfico fluxo', err)
    });
  }
}