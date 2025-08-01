import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormTemplateComponent } from '../../../shared/components/form-template/form-template.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ContainerService } from '../../../core/services/container.service';
import { Container } from '../../../shared/models/container';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-container',
  imports: [FormTemplateComponent, ReactiveFormsModule, InputComponent],
  templateUrl: './edit-container.component.html',
  styleUrl: './edit-container.component.css'
})
export class EditContainerComponent {
  form: FormGroup;
  id: string = '';

  constructor(
    private fb: FormBuilder,
    private containerService: ContainerService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    this.form = this.fb.group({
      code: this.fb.control('', Validators.required)
    });

    if (this.id !== '') {
      this.containerService.getContainerById(Number(this.id)).subscribe(container => {
        this.form.patchValue({
          code: container.code
        });
      });
    }
  }

  getControl(field: string): FormControl {
    return this.form.get(field) as FormControl;
  }

  onSubmit(): void {
    const idN = Number.parseInt(this.id);

    const container: Partial<Container> = {
      id: idN,
      code: this.form.value.code
    };
    this.containerService.updateContainer(idN, container);
    this.form.reset();
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['manage/view/container']);
    });
  }
}