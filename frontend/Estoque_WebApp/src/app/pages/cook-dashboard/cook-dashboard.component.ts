import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  faBoxOpen,
  faCartPlus,
  faCheckCircle,
  faClipboardList,
  faFileAlt,
  faKitchenSet,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { PTableComponent } from '../../shared/components/p-table/p-table.component';
import { DashboardCardsComponent } from '../../shared/components/dashboard/dashboard-cards/dashboard-cards.component';
import { IconModule } from '../../shared/modules/icon/icon.module';
import { NavBarComponent } from '../../shared/components/nav-bar/nav-bar.component';
import { faClock } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-cook-dashboard',
  templateUrl: './cook-dashboard.component.html',
  imports: [PTableComponent, DashboardCardsComponent, IconModule, NavBarComponent],
styleUrls: ['./cook-dashboard.component.css'],
  standalone: true,
})
export class CookDashboardComponent implements OnInit {
  // Ícones para os cards
  faClipboardList = faClipboardList;
  faKitchenSet = faKitchenSet;
  faSpinner = faSpinner;

  // Ícones para as ações
  faCartPlus = faCartPlus;
  faFileAlt = faFileAlt;
  faCheckCircle = faCheckCircle;
  faClock = faClock;

  constructor(private router: Router) {}

  // Dados mocados para as tabelas
  ultimosPedidos: any[] = [];
  produtosNaCozinha: any[] = [];

  // Colunas para as tabelas
  colunasUltimosPedidos = ['id', 'solicitante', 'data', 'status'];
  colunasProdutosNaCozinha = ['produto', 'quantidade', 'status'];

  ngOnInit(): void {
    // Mock de dados para a tabela de "Últimos Pedidos"
    this.ultimosPedidos = [
      { id: 101, solicitante: 'Chef Ana', data: new Date(), status: 'Pendente' },
      { id: 102, solicitante: 'Chef Bruno', data: new Date(), status: 'Em andamento' },
      { id: 103, solicitante: 'Chef Carla', data: new Date(), status: 'Concluído' },
      { id: 104, solicitante: 'Chef Daniel', data: new Date(), status: 'Pendente' },
    ];

    // Mock de dados para a tabela de "Produtos na Cozinha"
    this.produtosNaCozinha = [
      {
        produto: 'Tomate',
        quantidade: '10 kg',
        status: 'Disponível',
      },
      {
        produto: 'Arroz',
        quantidade: '25 kg',
        status: 'Disponível',
      },
      {
        produto: 'Carne Bovina',
        quantidade: '15 kg',
        status: 'Abaixo do estoque',
      },
      {
        produto: 'Farinha de Trigo',
        quantidade: '5 kg',
        status: 'Crítico',
      },
    ];
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}