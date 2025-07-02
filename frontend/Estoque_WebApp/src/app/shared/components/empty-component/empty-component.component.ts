import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { IconModule, icons } from '../../modules/icon/icon.module';
// O NgIf e o NgFor precisamm desse módulo para funcionar, o CommonModule

@Component({
  selector: 'app-empty-component',
  standalone: true,
  // O Standalone é para não precisar importar o módulo no app.module.ts
  imports: [CommonModule, IconModule],
  templateUrl: './empty-component.component.html',
  styleUrl: './empty-component.component.scss'
})
export class EmptyComponentComponent {
    @Input() message: string = 'Sem Conteúdo para Exibir';
    //@Input() icon: string = 'pi pi-exclamation-triangle'; 
    //@Input() icon?: IconDefinition;
    icon: IconDefinition = icons.faPassport; // Ícone padrão
    @Input() showButton: boolean = false;
    //@Input() Elbutton: string = 'Voltar';
    Elbutton: string = 'Retorne a Tela Inicial';

    @Input() onButtonClick: () => void = () => {};
    //Clique do Botão
  }
