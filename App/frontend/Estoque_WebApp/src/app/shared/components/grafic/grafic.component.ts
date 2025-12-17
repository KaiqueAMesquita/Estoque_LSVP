import { Component, Input } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
@Component({
  selector: 'app-grafic',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './grafic.component.html',
  styleUrl: './grafic.component.css'
})
export class GraficComponent {

  @Input() type!: 'BARRA' | 'LINHA';
  @Input() data: any[] = [];

  @Input() title: string = 'Gráfico';

  /* se true  gráfico abre/fecha com flecha */
  @Input() collapsible: boolean = false;

  /*inicia aberto */
  isOpen: boolean = true;

  /* cores personalizadas */
  @Input() colors: string[] = [];

  defaultColors = ['#4f46e5', '#0ea5e9', '#10b981', '#f59e0b'];

  get colorScheme(): any {
  return {
    name: 'custom',
    selectable: true,
    group: 'Ordinal',
    domain: this.colors.length > 0 ? this.colors : this.defaultColors
  };
}


  toggle() {
    if (this.collapsible) {
      this.isOpen = !this.isOpen;
    }
  }
}
