import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-template',
  standalone: true,
  templateUrl: './form-template.component.html',
  styleUrls: ['./form-template.component.css'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class FormTemplateComponent implements AfterViewInit {
  @Input() formTitle = '';
  @Input() formGroup!: FormGroup;
  @Input() isSubmitting = false;
  @Input() submitText = 'Confirmar';
  @Input() cancelText = 'Cancelar';

  @Output() formSubmit = new EventEmitter<void>();
  @Output() formCancel = new EventEmitter<void>();

  @ViewChild('firstField') firstField?: ElementRef;

  constructor(private location: Location) {}

  ngAfterViewInit(): void {
    this.focusFirstField();
  }

  focusFirstField(): void {
    this.firstField?.nativeElement.focus();
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      this.formSubmit.emit();
    }
  }

  onCancel(): void {
    this.formGroup.reset(this.formGroup.getRawValue());
    this.location.back();
    this.formCancel.emit();
  }
}
