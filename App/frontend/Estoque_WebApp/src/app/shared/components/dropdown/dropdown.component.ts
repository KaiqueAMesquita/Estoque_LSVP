import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule for *ngIf and *ngFor

@Component({
  selector: 'app-dropdown',
  standalone: true, // Mark the component as standalone
  imports: [CommonModule],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.css'
})
export class DropdownComponent {
  showDropdown: boolean = false; 
  // A visibilidade agora é controlada por CSS, então não precisamos mais de uma variável
  @Input() label: string = 'Menu';
  @Input() option: { 
    label: string; 
    route?: string; 
    action?: () => void; 
  }[] = [];

  // Método para alternar a visibilidade do dropdown
  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
    console.log(this.showDropdown);
  }

}