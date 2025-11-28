import { Component, OnDestroy, OnInit } from '@angular/core';
import { PTableComponent } from '../../../shared/components/p-table/p-table.component';
import { UnitService } from '../../../core/services/unit.service';
import { Unit } from '../../../shared/models/unit';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../../core/authentication/authentication.service';
import { NavigationWatcherService } from '../../../core/services/navigation-watcher.service';
import { ViewTemplateComponent } from '../../../shared/components/view-template/view-template.component';

@Component({
  selector: 'app-view-unit',
  imports: [PTableComponent, CommonModule, ViewTemplateComponent],
  templateUrl: './view-unit.component.html',
  styleUrl: './view-unit.component.css',
  standalone: true
})
export class ViewUnitComponent implements OnInit, OnDestroy {
  units: Unit[] = [];
  private navigationSub?: Subscription;
  pagedView: boolean = false;
  pageNumber: number = 0;
  totalPages: number = 0;
  private searchTerm: string = '';

  constructor(
    private unitService: UnitService,
    private auth: AuthenticationService,
    public router: Router,
    private navigationWatcher: NavigationWatcherService
  ) {}

  ngOnInit(): void {
    this.loadUnits(this.pageNumber);

    this.navigationSub = this.navigationWatcher.navigation$.subscribe(() => {
      if (this.router.url.startsWith('/manage/view/units')) {
        this.loadUnits(this.pageNumber);
      }
    });
  }

  ngOnDestroy(): void {
    this.navigationSub?.unsubscribe();
  }

  private loadUnits(page: number = 0, batch?: string): void {
    this.unitService.getAllUnits(page, 20, 'id,desc', undefined, batch).subscribe({
      next: (response) => {
        // Configurações de paginação
        this.pagedView = response.totalPages > 1;
        this.totalPages = response.totalPages;
        this.pageNumber = response.number;

        // Mapeamento e Limpeza de dados (Tudo dentro do next)
        this.units = response.content.map((unit: Unit) => {
          // 1. Cria uma cópia do objeto para não mutar a referência original inesperadamente
          const newUnit = {
            ...unit,
            expiration_date: unit.expiration_date ? new Date(unit.expiration_date) : new Date(),
          };

      
          return newUnit;
        });
      },
      error: (error) => console.error('Erro ao carregar unidades:', error)
    });
  }

  EditUnit(id: number): void {
    console.log('Tentando editar ID:', id); 
    if (id) {
      this.router.navigate(['/manage/edit/unit', id]);
    } else {
      console.error('ID inválido para edição');
    }
  }

  onPageChange(page: number): void {
    this.pageNumber = page;
    this.loadUnits(page, this.searchTerm);
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.loadUnits(0, this.searchTerm);
  }
}