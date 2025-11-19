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
        response.totalPages > 1 ? this.pagedView = true : this.pagedView = false;
        this.totalPages = response.totalPages;
        this.pageNumber = response.number;
        this.units = response.content.map((unit: Unit) => ({
          ...unit,
          //delete 

          expiration_date: unit.expiration_date ? new Date(unit.expiration_date) : new Date(),
          
        }));
      },
      error: (error) => console.error('Erro ao carregar unidades:', error)
    });
     this.units?.forEach(unit => {
          delete unit.containerId;
          delete unit.id;
        });
  }



  EditUnit(id: number): void {
    this.router.navigate(['/manage/edit/unit', id]);
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
