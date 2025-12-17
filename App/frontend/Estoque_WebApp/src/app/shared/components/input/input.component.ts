import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective } from "ngx-mask";
// NgxMaskPipe é para formatação de dados já prontos (ex: mostrar na tabela um CPF) 
// NgxMaskDirective é para aplicar a máscara no input, enquanto o usuário digita

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxMaskDirective],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent {
  @Input() control!: FormControl;
  @Input() type: string = 'text';
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() options: { label: string; value: any }[] = [];
  @Input() disable: boolean = false;
  @Input() maskUse: string = '';
}
