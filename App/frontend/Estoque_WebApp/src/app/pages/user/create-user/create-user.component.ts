import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormTemplateComponent } from '../../../shared/components/form-template/form-template.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { JsonPipe } from '@angular/common';
import { UserService } from '../../../core/services/user.service';
import { User } from './../../../shared/models/user';
import { Router } from '@angular/router';
import { onlyLettersAndSpacesValidator } from '../../../core/validators/custom-validators';
import { BaseCreateComponent } from '../../../shared/components/crud/base-create/base-create.component';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css'],
  standalone: true,
  imports: [FormTemplateComponent, ReactiveFormsModule, InputComponent, JsonPipe]
})

export class CreateUserComponent extends BaseCreateComponent{
  form: FormGroup;

  roleOptions = [
    { label: 'Administrador', value: 0 },
    { label: 'Gestor de Estoque', value: 1 },
    { label: 'Cozinha', value: 2 },
  ];

  
    constructor(router: Router, private userService: UserService, fb: FormBuilder) {
    super(router,fb, );
      this.form = this.fb.group({
      name: this.fb.control('', [Validators.required, onlyLettersAndSpacesValidator()]),
      password: this.fb.control('', [Validators.required, Validators.minLength(6)]),
      role: this.fb.control(null, Validators.required)
    });
  }

  onSubmit(): void {
    const user: User = {
      id: 0,
      name: this.form.value.name,
      password: this.form.value.password,
      role: this.form.value.role
    };
    this.userService.registerUser(user).subscribe({
      next: () => {
        this.form.reset();
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['manage/view/users']);
        });
      },
      error: (error) => {
        // Trate o erro se necessário
        console.error('Erro ao criar usuário:', error);
      }
    });
  }
}
