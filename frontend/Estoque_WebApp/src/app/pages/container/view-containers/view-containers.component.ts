import { Component, OnDestroy, OnInit } from '@angular/core';
import { PTableComponent } from '../../../shared/components/p-table/p-table.component';
import { ContainerService } from '../../../core/services/container.service';
import { Container } from '../../../shared/models/container';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavigationWatcherService } from '../../../core/services/navigation-watcher.service';

@Component({
  selector: 'app-view-containers',
  imports: [PTableComponent, CommonModule],
  standalone: true,
  templateUrl: './view-containers.component.html',
  styleUrl: './view-containers.component.css'
})
export class ViewContainersComponent implements OnInit, OnDestroy {
  containers: Container[] = [];
  private navigationSub?: Subscription;

  constructor(
    private containerService: ContainerService,
    private router: Router,
    private navigationWatcher: NavigationWatcherService
  ) {}

  ngOnInit(): void {
    this.loadContainers();

    this.navigationSub = this.navigationWatcher.navigation$.subscribe(() => {
      if (this.router.url.startsWith('/containers')) { // ajuste conforme sua rota
        this.loadContainers();
      }
    });
  }

  ngOnDestroy(): void {
    this.navigationSub?.unsubscribe();
  }

  private loadContainers(): void {
    this.containerService.getAllContainers().subscribe({
      next: (data: Container[]) => {
        this.containers = data;
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
    this.router.navigate(['manage/edit/container', id]);
  }
}
