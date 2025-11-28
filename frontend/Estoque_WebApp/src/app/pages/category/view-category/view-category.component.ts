import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from './../../../shared/models/category';
import { ViewTemplateComponent } from '../../../shared/components/view-template/view-template.component';
import { AveragePrice } from './../../../shared/models/average-price';
import { GraficComponent } from '../../../shared/components/grafic/grafic.component';


@Component({
  selector: 'app-view-category',
  standalone: true, 
  imports: [ViewTemplateComponent, GraficComponent],
  templateUrl: './view-category.component.html',
  styleUrl: './view-category.component.css'
})
export class ViewCategoryComponent implements OnInit {

  category!: Category;
  averagePrices: AveragePrice[] = [];
  
  chartData: any[] = []; 

  constructor(
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    public router: Router
  
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.categoryService.getCategoryById(id).subscribe({
      next: (data) => (this.category = data),
      error: (err) => console.error('Erro ao carregar categoria:', err)
    });
    
    this.getAveragePrices('monthly', 12);
  }

  getAveragePrices(filter: 'monthly' | 'annual', quantity: number): void {
    this.averagePrices = [];
    this.chartData = []; // Limpa o gráfico

    let currentDate = new Date();

    if (filter === 'monthly') {
      let baseDate = new Date(currentDate);
      baseDate.setDate(1);
      baseDate.setMonth((baseDate.getMonth()+1) - quantity);

      for (let i = 0; i < quantity; i++) {
        let tempDate = new Date(baseDate);
        tempDate.setMonth(baseDate.getMonth() + i + 1);
        let m = tempDate.getMonth();
        let y = tempDate.getFullYear();
        this.fetchData(m, y);
      }
    } else {
      // Lógica anual omitida para brevidade, mas segue o mesmo princípio
      // ...
    }
  }

  fetchData(month: number, year: number) {
    this.categoryService.getAveragePriceByCategory(
      this.category.id || 0,
      month,
      year,
      month,
      year
    ).subscribe({
      next: (data) => {
        // Adiciona ao array original
        this.averagePrices.push(data);
        
        this.updateChartData();
      },
      error: (err) => console.error(`Erro ${month}/${year}:`, err)
    });
  }

  updateChartData() {
    // Primeiro: Ordenar cronologicamente (Ano -> Mês)
    const sortedData = [...this.averagePrices].sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.month - b.month;
    });


    this.chartData = sortedData.map(item => ({
      name: `${item.month + 1}/${item.year}`,
      value: item.averagePrice          
    }));


  }
}