import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormTemplateComponent } from '../../../shared/components/form-template/form-template.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { UserService } from '../../../core/services/user.service';
import { User } from './../../../shared/models/user';
import { ActivatedRoute, Router } from '@angular/router';
import { onlyLettersAndSpacesValidator } from '../../../core/validators/custom-validators';

@Component({
  selector: 'app-edit-user',
  imports: [FormTemplateComponent, ReactiveFormsModule, InputComponent, ],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css'
})
export class EditUserComponent {
 form: FormGroup;
 id: string = '';
  
  roleOptions = [
    { label: 'Administrador', value: 0 },
    { label: 'Gestor de Estoque', value: 1 },
    { label: 'Cozinha', value: 2 }
  ];

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router, private route: ActivatedRoute) {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
     this.form = this.fb.group({
      name: this.fb.control('', [Validators.required, onlyLettersAndSpacesValidator()]),
      role: this.fb.control('', Validators.required)
    });
    if (this.id !== '') {
      this.userService.getUserById(Number(this.id)).subscribe({
        next: user => {
          this.form.patchValue({
        name: user.name,
        role: user.role
          });
        },
        error: () => {
          location.href = '/manage/view/users';
          console.error('Erro ao carregar usuário para edição');
        }
      });
    }
  
   
  }

  getControl(field: string): FormControl {
    return this.form.get(field) as FormControl;
  }

  onSubmit(): void {
    const idN = Number.parseInt(this.id);

    const user: Partial<User> = {
    id: idN,
    name: this.form.value.name,
    role: this.form.value.role
  };
    this.userService.updateUser(idN, user).subscribe({
    next: () => {
      this.form.reset();
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['manage/view/users'])
      });
    },
    error: (error) => {
      // Trate o erro se necessário
      console.error('Erro ao editar usuário:', error);
    }
  });
};
}
 