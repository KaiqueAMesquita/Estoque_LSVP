import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormTemplateComponent } from '../../../shared/components/form-template/form-template.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { JsonPipe } from '@angular/common';
import { ContainerService } from '../../../core/services/container.service';
import { User } from './../../../shared/models/user';
import { Router } from '@angular/router';
import { Container } from '../../../shared/models/container';
import { BaseCreateComponent } from '../../../shared/components/crud/base-create/base-create.component';

@Component({
  selector: 'app-create-container',
  imports: [FormTemplateComponent, ReactiveFormsModule, InputComponent, JsonPipe],
templateUrl: './create-container.component.html',
  styleUrl: './create-container.component.css',
  
})
export class CreateContainerComponent extends BaseCreateComponent {
 form: FormGroup;

  typeOptions = [
    { label: 'Estoque', value: 0 },
    { label: 'Preparação', value: 1 },
    { label: 'Descarte', value: 2 }
  ];

  constructor(fb: FormBuilder, private containerService: ContainerService, router: Router) {
    super(router, fb);
    this.form = fb.group({
      code: this.fb.control('', [Validators.required, Validators.maxLength(20)]),
      description: this.fb.control('', [Validators.required, Validators.maxLength(100)]),
      type: this.fb.control('', [Validators.required])
    });
  }

  onSubmit(): void {
    const container: Container = {
    id: 0,
    code: this.form.value.code,
    description: this.form.value.description,
    type: this.form.value.type,
 
  };
    this.containerService.registerContainer(container).subscribe({
      next: () => {
      this.form.reset();
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['manage/view/containers'])
      
    });
  },
  error: (error) => {
    // Trate o erro se necessário
    console.error('Erro ao criar container:', error);
  }
    });
  }
}
