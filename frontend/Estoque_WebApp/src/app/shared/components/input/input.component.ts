import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent {
  @Input() control!: FormControl;
  @Input() type: string = 'text';
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() options: { label: string; value: any }[] = [];
}
