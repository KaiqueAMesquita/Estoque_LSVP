import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="form-group" [class.has-error]="control.invalid && (control.touched || control.dirty)">
      <label *ngIf="label">{{ label }}</label>
      
      <!-- Input normal -->
      <input 
        *ngIf="type !== 'select'"
        [type]="type"
        [formControl]="control"
        [placeholder]="placeholder || ''"
      >
      
      <!-- Select -->
      <select 
        *ngIf="type === 'select'"
        [formControl]="control"
        [class.is-invalid]="control.invalid && (control.touched || control.dirty)"
      >
        <option [value]="''" disabled selected>{{ placeholder || 'Selecione...' }}</option>
        <option *ngFor="let option of options" [value]="option.value">
          {{ option.label }}
        </option>
      </select>
      
      <div class="error-message" *ngIf="control.invalid && (control.touched || control.dirty)">
        <div *ngIf="control.hasError('required')">Campo obrigatório</div>
        <div *ngIf="control.hasError('email')">Email inválido</div>
        <div *ngIf="control.hasError('minlength')">
          Mínimo de {{ control.getError('minlength')?.requiredLength }} caracteres
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./input.component.css']
})
export class InputComponent {
  @Input() control: FormControl = new FormControl();
  @Input() type: string = 'text';
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() options: { label: string; value: any }[] = [];
}