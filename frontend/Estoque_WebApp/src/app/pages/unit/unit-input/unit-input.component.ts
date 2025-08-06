import { Component } from '@angular/core';
import { NavBarComponent } from '../../../shared/components/nav-bar/nav-bar.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { IconModule, icons } from '../../../shared/modules/icon/icon.module';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormTemplateComponent } from '../../../shared/components/form-template/form-template.component';

@Component({
  selector: 'app-unit-input',
  imports: [FormTemplateComponent, ReactiveFormsModule,NavBarComponent, InputComponent, IconModule, FormTemplateComponent],
  templateUrl: './unit-input.component.html',
  styleUrl: './unit-input.component.css'
})
export class UnitInputComponent {
  icons = icons;
  form: FormGroup;
  measures = [
    { label: 'Unidade', value: 1 },
    { label: 'Caixa', value: 2 },
    { label: 'Pacote', value: 3 },
    { label: 'Saco', value: 4 },
    { label: 'Litro', value: 5 },
    { label: 'Quilo', value: 6 }
  ];

   getControl(field: string): FormControl {
    return this.form.get(field) as FormControl;
  }

  constructor(private fb: FormBuilder,) {
    this.form = this.fb.group({
      batch: this.fb.control('', [Validators.required, Validators.maxLength(6)]),
      measure: this.fb.control(null, [Validators.required]),
      quantity: this.fb.control(null, [Validators.required]),
      expirationDate: this.fb.control('', [Validators.required]),
      price: this.fb.control(null),
      gtin: this.fb.control(null, [Validators.required])
    });
  }


  onSubmit(): void {
    console.log(this.form.value);
    this.form.reset();
    }



}
