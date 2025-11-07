import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { IconModule, icons } from '../../modules/icon/icon.module';
// O NgIf e o NgFor precisamm desse módulo para funcionar, o CommonModule

@Component({
  selector: 'app-the404-page',
  imports: [CommonModule, IconModule],
  templateUrl: './the404-page.component.html',
  styleUrl: './the404-page.component.scss'
})
export class The404PageComponent {
    @Input() message: string = 'Sem Conteúdo para Exibir';
  }



