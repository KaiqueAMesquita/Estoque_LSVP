import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormTemplateComponent } from '../../form-template/form-template.component';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '../../input/input.component';
@Component({
  selector: 'app-base-create',
  imports: [FormTemplateComponent,ReactiveFormsModule, InputComponent],
  templateUrl: './base-create.component.html',
  styleUrl: './base-create.component.css'
})
export abstract class BaseCreateComponent {
  abstract form: any;
  abstract onSubmit(): void;

  getControl(field: string): FormControl {
    return this.form.get(field) as FormControl;
  }

  constructor(public router: Router, public fb: FormBuilder){

  }

}
