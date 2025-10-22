import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormTemplateComponent } from '../../../shared/components/form-template/form-template.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { MovementService } from '../../../core/services/movement.service';
import { Movement } from '../../../shared/models/movement';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-movement',
  imports: [FormTemplateComponent, ReactiveFormsModule, InputComponent],
  templateUrl: './edit-movements.component.html',
  styleUrl: './edit-movements.component.css'
})
export class EditMovementsComponent {
  form: FormGroup;
  id: string = '';

  constructor(
    private fb: FormBuilder,
    private MovementService: MovementService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';

    // Agora mapeando para os campos do DTO MovementUpdateDTO
    this.form = this.fb.group({
      unitId: this.fb.control('', Validators.required),
      SourceType: this.fb.control('', Validators.required),
      sourceDetails: this.fb.control('', Validators.required),
      userId: this.fb.control('', Validators.required)
    });

    if (this.id !== '') {
      this.MovementService.getMovementById(Number(this.id)).subscribe({
        next: (Movement: { unitId: any; sourceType: any; sourceDetails: any; userId: any; }) => {
          this.form.patchValue({
            unitId: Movement.unitId,
            sourceType: Movement.sourceType,
            sourceDetails: Movement.sourceDetails,
            userId: Movement.userId,
            
          });
        },
        error: () => {
          location.href = '/manage/view/Movement';
          console.error('Erro ao carregar Movement para edição');
        }
      });
    }
  }

  getControl(field: string): FormControl {
    return this.form.get(field) as FormControl;
  }

  onSubmit(): void {
    const idN = Number.parseInt(this.id);

    const Movement: Partial<Movement> = {
      unitId: this.form.value.unitId,
      sourceType: this.form.value.sourceType,
      sourceDetails: this.form.value.sourceDetails,
      userId: this.form.value.userId
    };

    this.MovementService.updateMovement(idN, Movement).subscribe({
      next: () => {
        this.form.reset();
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['manage/view/Movements']);
        });
      },
      error: (error: any) => {
        console.error('Erro ao editar Movement:', error);
      }
    });
  }
}
