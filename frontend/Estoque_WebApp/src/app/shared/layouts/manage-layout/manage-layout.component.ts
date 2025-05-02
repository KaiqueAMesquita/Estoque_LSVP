import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet,ActivatedRoute } from '@angular/router';
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';
@Component({
  selector: 'app-manage-layout',
  imports: [RouterOutlet,CommonModule, NavBarComponent],
  templateUrl: './manage-layout.component.html',
  styleUrl: './manage-layout.component.css'
})
export class ManageLayoutComponent {
  paths: string[] = [];
  breadcrumb: string = '';
    
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    let currentRoute: ActivatedRoute | null = this.route;

    // Percorre todos os filhos da rota ativada
    while (currentRoute) {
      if (currentRoute.snapshot.url.length) {
        const segments = currentRoute.snapshot.url.map(segment => segment.path);
        this.paths.push(...segments);
      }
      currentRoute = currentRoute.firstChild;
    }
    this.breadcrumb = this.paths.join(' > ');
  }
    
}
