import { Component, OnDestroy, OnInit } from '@angular/core';
import { PTableComponent } from '../../../shared/components/p-table/p-table.component';
import { MovementService } from '../../../core/services/movement.service';
import { Movement } from '../../../shared/models/movement';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavigationWatcherService } from '../../../core/services/navigation-watcher.service';
import { ViewTemplateComponent } from '../../../shared/components/view-template/view-template.component';

@Component({
  selector: 'app-view-Movements',
  imports: [PTableComponent, CommonModule, ViewTemplateComponent],
  standalone: true,
  templateUrl: './view-movements.component.html',
  styleUrl: './view-movements.component.css'
})
export class ViewMovementsComponent implements OnInit, OnDestroy {
  movements: Movement[] = [];
  private navigationSub?: Subscription;
  
  // Variáveis para paginação e busca
  pagedView: boolean = false;
  pageNumber: number = 0;
  totalPages: number = 0;
  private searchTerm: string = '';

  // Variável para ordenação (Padrão: id decrescente)
  private currentSort: string = 'id,desc';

  constructor(
    private movementService: MovementService, // Corrigido casing para camelCase
    public router: Router,
    private navigationWatcher: NavigationWatcherService
  ) {}

  ngOnInit(): void {
    this.loadMovements(this.pageNumber);

    this.navigationSub = this.navigationWatcher.navigation$.subscribe(() => {
      if (this.router.url.startsWith('/Movements')) {
        this.loadMovements(this.pageNumber);
      }
    });
  }

  ngOnDestroy(): void {
    this.navigationSub?.unsubscribe();
  }

  private loadMovements(page: number = 0): void {
    // Agora passamos page, limit, sort e search para o service
    this.movementService.getAllMovements(page, 20, this.currentSort).subscribe({ 
      next: (pageData) => {
        // Configura paginação
        pageData.totalPages > 1 ? this.pagedView = true : this.pagedView = false;
        this.pageNumber = pageData.number;
        this.totalPages = pageData.totalPages;

        // Mapeia os dados
        this.movements = pageData.content.map((movement: Movement) => {
          const { unitId, userId, ...rest } = movement;
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

  // Método que recebe o evento da tabela para ordenar
  handleSort(sortString: string): void {
    this.currentSort = sortString;
    this.loadMovements(0); // Reinicia na primeira página com a nova ordem
  }

  
  // Método de paginação
  onPageChange(page: number): void {
    this.pageNumber = page;
    this.loadMovements(page);
  }

  EditMovement(id: number): void {
    this.router.navigate(['manage/edit/Movements', id]);
  }
}