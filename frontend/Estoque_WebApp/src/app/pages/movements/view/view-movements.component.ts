import { Component, OnDestroy, OnInit } from '@angular/core';
import { PTableComponent } from '../../../shared/components/p-table/p-table.component';
import { MovementService } from '../../../core/services/movement.service';
import { Movement } from '../../../shared/models/movement';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription, first } from 'rxjs';
import { NavigationWatcherService } from '../../../core/services/navigation-watcher.service';
import { ViewTemplateComponent } from '../../../shared/components/view-template/view-template.component';

@Component({
  selector: 'app-view-Movements',
  imports: [PTableComponent, CommonModule, ViewTemplateComponent],
  standalone: true,
  templateUrl: './view-Movements.component.html',
  styleUrl: './view-Movements.component.css'
})
export class ViewMovementsComponent implements OnInit, OnDestroy {
  Movements: Movement[] = [];
  private navigationSub?: Subscription;

  constructor(
    private MovementService: MovementService,
    public router: Router,
    private navigationWatcher: NavigationWatcherService
  ) {}

  ngOnInit(): void {
    this.loadMovements();

    this.navigationSub = this.navigationWatcher.navigation$.subscribe(() => {
      if (this.router.url.startsWith('/Movements')) {
        this.loadMovements();
      }
    });
  }

  ngOnDestroy(): void {
    this.navigationSub?.unsubscribe();
  }

  private loadMovements(): void {
    this.MovementService.getAllMovements(1, 20).subscribe({ // Exemplo: buscando a primeira página com 20 itens
      next: (page) => {
        this.Movements = page.content;
      },
      error: (error) => {
        console.error('Erro ao buscar Movimentações:', error);
      }
    });
  }

  DeleteMovement(id: number): void {
    try {
      this.MovementService.deleteMovement(id).pipe(first()).subscribe({
        next: () => {
          this.Movements = this.Movements.filter(movement => movement.id !== id);
          console.log('Movimentação deletada com sucesso');
        },
        error: (error) => {
          console.error('Erro ao deletar essa Movimentação!', error);
        }
      });
    } catch (error) {
      console.error('Erro ao deletar essa Movimentação!', error);
    }
  }

  EditMovement(id: number): void {
    this.router.navigate(['manage/edit/movements', id]);
  }
}
