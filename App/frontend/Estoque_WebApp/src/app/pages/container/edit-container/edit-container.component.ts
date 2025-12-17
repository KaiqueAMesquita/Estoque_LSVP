import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormTemplateComponent } from '../../../shared/components/form-template/form-template.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ContainerService } from '../../../core/services/container.service';
import { Container } from '../../../shared/models/container';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseCreateComponent } from '../../../shared/components/crud/base-create/base-create.component';

@Component({
  selector: 'app-edit-container',
  imports: [FormTemplateComponent, ReactiveFormsModule, InputComponent],
  templateUrl: './edit-container.component.html',
  styleUrl: './edit-container.component.css'
})
export class EditContainerComponent extends BaseCreateComponent {
  form: FormGroup;
  id: string = '';

   typeOptions = [
    { label: 'Estoque', value: 0 },
    { label: 'Preparação', value: 1 },
    { label: 'Descarte', value: 2 }
  ];


  constructor(fb: FormBuilder,
    private containerService: ContainerService,
    router: Router,
    private route: ActivatedRoute
  ) {
    super(router, fb);
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    this.form = this.fb.group({
      code: this.fb.control('', Validators.required),
      description: this.fb.control('', [Validators.required, Validators.maxLength(100)]),
      type: this.fb.control('', [Validators.required])
    });

    if (this.id !== '') {
      this.containerService.getContainerById(Number(this.id)).subscribe({
        next: container => {
          this.form.patchValue({
            code: container.code,
            description: container.description,
            type: container.type
          });
        },
        error: () => {
          location.href = '/manage/view/containers';
          console.error('Erro ao carregar container para edição');
        }
      });
    }
  }

  onSubmit(): void {
    const idN = Number.parseInt(this.id);

    const container: Container = {
      code: this.form.value.code,
      description: this.form.value.description,
      type: this.form.value.type
    };
    this.containerService.updateContainer(idN, container).subscribe({
      next: () => {
        this.form.reset();
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['manage/view/containers']);
        });
      },
      error: (error) => {
        // Trate o erro se necessário
        console.error('Erro ao editar container:', error);
      }
    });
  }
}