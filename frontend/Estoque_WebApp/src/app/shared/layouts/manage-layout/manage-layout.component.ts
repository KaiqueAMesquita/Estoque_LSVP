import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core'; 
import { RouterOutlet, ActivatedRoute, NavigationEnd, Router } from '@angular/router'; 
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';
import { Subscription } from 'rxjs'; 
import { filter } from 'rxjs/operators';
import { TranslationPipe } from '../../../core/pipes/translation.pipe';
import { TranslationService } from '../../../core/translation/translation.service';
@Component({
  selector: 'app-manage-layout',
  standalone: true, 
  imports: [RouterOutlet, CommonModule, NavBarComponent, TranslationPipe],
  templateUrl: './manage-layout.component.html',
  styleUrl: './manage-layout.component.css'
})
export class ManageLayoutComponent implements OnInit, OnDestroy {
  paths: string[] = [];
  breadcrumb: string = '';
  private routerSubscription: Subscription | undefined; // Propriedade para armazenar a inscrição

  constructor(private route: ActivatedRoute, private router: Router, private translationService: TranslationService) {
  }

  ngOnInit(): void {

    // Inicializa o breadcrumb ao carregar o componente
    this.generateBreadcrumb();

    // Inscreve-se nos eventos do Router para detectar mudanças de rota
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd) // Filtra o NavigationEnd
    ).subscribe(() => {
      this.generateBreadcrumb(); // Regenera o breadcrumb a cada navegação
    });
  }

  ngOnDestroy(): void {
    // Garante que a inscrição seja desfeita para evitar vazamentos de memória
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  generateBreadcrumb(): void {
    this.breadcrumb = '';
    this.paths = [];
    let currentRoute: ActivatedRoute | null = this.route;

    // Percorre todos os filhos da rota ativada
    while (currentRoute) {
      if (currentRoute.snapshot.url.length) {
        // Extrai os segmentos da URL e os adiciona ao array paths
        const segments = currentRoute.snapshot.url.map(segment => segment.path);
        this.paths.push(...segments);
      }
      // Move para o próximo filho da rota
      currentRoute = currentRoute.firstChild;
    }
    // Traduz cada segmento do caminho
    this.paths = this.paths.map(path => this.translationService.translate(path));
    // Junta os segmentos do caminho com ' > ' para formar o breadcrumb
    this.breadcrumb = this.paths.join(' > ');
  }
}