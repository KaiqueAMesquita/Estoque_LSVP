import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormTemplateComponent } from '../../../shared/components/form-template/form-template.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { MovementService } from '../../../core/services/movement.service';
import { Movement } from '../../../shared/models/movement';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseCreateComponent } from '../../../shared/components/crud/base-create/base-create.component';

@Component({
  selector: 'app-edit-movement',
  imports: [FormTemplateComponent, ReactiveFormsModule, InputComponent],
  templateUrl: './edit-movements.component.html',
  styleUrl: './edit-movements.component.css'
})
export class EditMovementsComponent extends BaseCreateComponent {
  form: FormGroup;
  id: string = '';

  constructor(fb: FormBuilder,
    private MovementService: MovementService,
    router: Router,
    private route: ActivatedRoute
  ) {
    super(router, fb);
    this.id = this.route.snapshot.paramMap.get('id') ?? '';

    // Agora mapeando os campos do DTO MovementUpdateDTO I
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
          console.error('Erro ao carregar Movimentação para edição');
        }
      });
    }
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
        console.error('Erro ao editar Movimentação:', error);
      }
    });
  }
}
