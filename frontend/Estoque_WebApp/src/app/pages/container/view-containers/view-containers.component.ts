import { Component, OnDestroy, OnInit } from '@angular/core';
import { PTableComponent } from '../../../shared/components/p-table/p-table.component';
import { ContainerService } from '../../../core/services/container.service';
import { Container } from '../../../shared/models/container';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavigationWatcherService } from '../../../core/services/navigation-watcher.service';
import { ViewTemplateComponent } from '../../../shared/components/view-template/view-template.component';
import { Page } from '../../../shared/models/page';
@Component({
  selector: 'app-view-containers',
  imports: [PTableComponent, CommonModule, ViewTemplateComponent],
  standalone: true,
  templateUrl: './view-containers.component.html',
  styleUrl: './view-containers.component.css'
})
export class ViewContainersComponent implements OnInit, OnDestroy {
  containers: Container[] = [];
  private navigationSub?: Subscription;
  pagedView: boolean = false;
  pageNumber: number = 0;
  totalPages: number = 0;
  private searchTerm: string = '';

  constructor(
    private containerService: ContainerService,
    public router: Router,
    private navigationWatcher: NavigationWatcherService
  ) {}

  ngOnInit(): void {
    this.loadContainers(this.pageNumber);

    this.navigationSub = this.navigationWatcher.navigation$.subscribe(() => {
      if (this.router.url.startsWith('/containers')) { // ajuste conforme sua rota
        this.loadContainers(this.pageNumber);
      }
    });
  }

  ngOnDestroy(): void {
    this.navigationSub?.unsubscribe();
  }

  private loadContainers(page: number = 0, code?: string): void {
    this.containerService.getAllContainers(page, 20, 'id,desc', code).subscribe({
      next: (data: Page<Container>) => {
        data.totalPages > 1 ? this.pagedView = true : this.pagedView = false;
        this.pageNumber = data.number;
        this.totalPages = data.totalPages;
        this.containers = data.content;       
      },
      error: (error) => {
        console.error('Erro ao buscar containers:', error);
      }
    });
  }

  DeleteContainer(containerId: number): void {
    try {
      this.containerService.deleteContainer(containerId);
      this.containers = this.containers.filter(container => container.id !== containerId);
    } catch (error) {
      console.error('Erro ao deletar container:', error);
    }
  }

  EditContainer(id: number): void {
    this.router.navigate(['/manage/edit/container', id]);
  }

  onPageChange(page: number): void {
    this.pageNumber = page;
    this.loadContainers(page);
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.loadContainers(0, this.searchTerm);
  }
}
