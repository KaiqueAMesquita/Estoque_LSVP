import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormTemplateComponent } from '../../../shared/components/form-template/form-template.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { NavBarComponent } from '../../../shared/components/nav-bar/nav-bar.component';
import { IconModule, icons } from '../../../shared/modules/icon/icon.module';
import { ActivatedRoute, Router } from '@angular/router';
import { UnitService } from '../../../core/services/unit.service';
import { Unit } from '../../../shared/models/unit';

@Component({
  selector: 'app-edit-unit',
  imports: [FormTemplateComponent, ReactiveFormsModule,NavBarComponent, InputComponent, IconModule, FormTemplateComponent],
  templateUrl: './edit-unit.component.html',
  styleUrl: './edit-unit.component.css'
})

export class EditUnitComponent {
  icons = icons;

  form: FormGroup;
  batch: string = '';

  measures = [
    { label: 'Unidade', value: 1 },
    { label: 'Caixa', value: 2 },
    { label: 'Pacote', value: 3 },
    { label: 'Saco', value: 4 },
    { label: 'Litro', value: 5 },
    { label: 'Quilo', value: 6 }
  ];

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private unitService: UnitService, private router: Router ) {
    this.batch = this.route.snapshot.paramMap.get('batch') ?? '';
    this.form = this.fb.group({
      batch: this.fb.control('', [Validators.required, Validators.maxLength(6)]),
      measure: this.fb.control(null, [Validators.required]),
      quantity: this.fb.control(null, [Validators.required]),
      expirationDate: this.fb.control('', [Validators.required]),
      price: this.fb.control(null),
      gtin: this.fb.control(null, [Validators.required])
    });

    if (this.batch !== '') {
      this.unitService.getUnitByBatch(this.batch).subscribe({
        next: unit => {
          this.form.patchValue({
            batch: unit.batch,
            measure: unit.measure,
            quantity: unit.quantity,
            expirationDate: unit.expirationDate,
            price: unit.price,
            gtin: unit.gtin
          });
        },
        error: () => {
          location.href = '/manage/view/unit';
          console.error('Erro ao carregar unidade para edição');
        }
      });
    }
  }

  getControl(field: string): FormControl {
    return this.form.get(field) as FormControl;
  }

  onSubmit(): void {
    const batchValue = this.form.value.batch;

    const unit: Partial<Unit> = {
      batch: batchValue,
      measure: this.form.value.measure,
      quantity: this.form.value.quantity,
      expirationDate: this.form.value.expirationDate,
      price: this.form.value.price,
      gtin: this.form.value.gtin
    };

    this.unitService.updateUnit(batchValue, unit).subscribe({
      next: () => {
        this.form.reset();
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['manage/view/unit']);
        });
      },
      error: (error) => {
        console.error('Erro ao editar unidade:', error);
      }
    });
  }
}