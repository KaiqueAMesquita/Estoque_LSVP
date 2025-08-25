import { Component, HostBinding, Input } from '@angular/core';
import { IconDefinition, faBox } from '@fortawesome/free-solid-svg-icons';
import { IconModule } from '../../../modules/icon/icon.module';
@Component({
  selector: 'app-dashboard-cards',
  templateUrl: './dashboard-cards.component.html',
  styleUrls: ['./dashboard-cards.component.css'],
  imports: [IconModule],

})
export class DashboardCardsComponent {
  @Input() color = '#333';
  @Input() background = '#fff';
  @Input() hoverColor = '#fff';
  @Input() hoverBackground = '#007bff';
  @Input() headerValue: string | number = '0';
  @Input() bodyText = 'Card Body Text';
  @Input() icon: IconDefinition = faBox;

  @HostBinding('style.--main-color')
  get mainColor(): string { return this.color; }

  @HostBinding('style.--main-bg')
  get mainBg(): string { return this.background; }

  @HostBinding('style.--hover-color')
  get hoverColorStyle(): string { return this.hoverColor; }

  @HostBinding('style.--hover-bg')
  get hoverBgStyle(): string { return this.hoverBackground; }
}