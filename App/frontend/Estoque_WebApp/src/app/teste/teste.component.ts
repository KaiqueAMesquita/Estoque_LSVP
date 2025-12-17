import { Component } from '@angular/core';
import { PTableComponent } from '../shared/components/p-table/p-table.component';

@Component({
  selector: 'app-teste',
  imports: [PTableComponent],
  standalone: true,
  templateUrl: './teste.component.html',
  styleUrl: './teste.component.css'
})
export class TesteComponent {
  data: any[] = [
    { id: 1, name: 'Notebook Dell Inspiron', description: 'Notebook 15.6", Intel i5, 8GB RAM, 256GB SSD', quantity: 12, price: 3500.00, category: 'Informática', location: 'Estoque A' },
    { id: 2, name: 'Mouse Logitech M170', description: 'Mouse sem fio, USB, preto', quantity: 50, price: 65.90, category: 'Acessórios', location: 'Estoque B' },
    { id: 3, name: 'Monitor LG 24"', description: 'Monitor LED Full HD, HDMI/VGA', quantity: 8, price: 899.99, category: 'Informática', location: 'Estoque A' },
    { id: 4, name: 'Cadeira Escritório', description: 'Cadeira ergonômica com ajuste de altura', quantity: 20, price: 420.00, category: 'Mobiliário', location: 'Estoque C' },
    { id: 5, name: 'Teclado Mecânico Redragon', description: 'Teclado gamer RGB, ABNT2', quantity: 15, price: 230.50, category: 'Acessórios', location: 'Estoque B' },
    { id: 6, name: 'Projetor Epson', description: 'Projetor XGA 3600 lumens', quantity: 3, price: 2100.00, category: 'Audiovisual', location: 'Estoque D' }
  ];
  title: string = 'My Table';



}
