import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormTemplateComponent } from '../../../shared/components/form-template/form-template.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { JsonPipe } from '@angular/common';
import { ContainerService } from '../../../core/services/container.service';
import { User } from './../../../shared/models/user';
import { Router } from '@angular/router';
import { Container } from '../../../shared/models/container';

@Component({
  selector: 'app-create-container',
  imports: [FormTemplateComponent, ReactiveFormsModule, InputComponent, JsonPipe],
templateUrl: './create-container.component.html',
  styleUrl: './create-container.component.css',
  
})
export class CreateContainerComponent {
 form: FormGroup;

  roleOptions = [
    { label: 'Administrador', value: 0 },
    { label: 'Gestor de Estoque', value: 1 },
    { label: 'Cozinha', value: 2 }
  ];

  constructor(private fb: FormBuilder, private containerService: ContainerService, private router: Router) {
    this.form = this.fb.group({
      code: this.fb.control('', [Validators.required, Validators.maxLength(20)]),
    });
  }

  getControl(field: string): FormControl {
    return this.form.get(field) as FormControl;
  }

  onSubmit(): void {
    const container: Container = {
    id: 0,
    code: this.form.value.code,
 
  };
    this.containerService.registerContainer(container);
    this.form.reset();
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['manage/view/users'])
    });
  }
}
