import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faHome, 
  faList, 
  faListOl, 
  faFish, 
  faFileAlt,
  faBuilding, 
  faBox, 
  faChartLine,
  faUser,
  faBriefcase,
  faKey,
  faLock,
  faEye,
  faEyeSlash,
  faTrash,
  faPenToSquare
} from '@fortawesome/free-solid-svg-icons';

// Exporta os ícones para uso em outros módulos
export const icons = {
  faHome,
  faList,
  faListOl,
  faFish,
  faFileAlt,
  faBuilding,
  faBox,
  faChartLine,
  faUser,
  faBriefcase,
  faKey,
  faLock,
  faEye,
  faEyeSlash,
  faTrash,
  faPenToSquare
};

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FontAwesomeModule
  ],
  exports: [
    FontAwesomeModule
  ]
})
// Basicamente, se a gente precisar usar algum dos ícones da lista em outro lugar, 
// a gente importa o IconModule e usa o método getIcons() para pegar os ícones.
// Mas, se for apenas alguns ícones, a gente chama pelo "icons" mesmo.
export class IconModule { 
  static getIcons() {
    return Object.values(icons);
  }
}
// Talvez seja tirado, talvez seja deixado, tem que ver com o Kaique ainda... 
// Por enquanto só chama pelo icons e pronto.