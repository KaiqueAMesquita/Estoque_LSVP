import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { FormTemplateComponent } from '../../../shared/components/form-template/form-template.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { InputMovement } from '../../../shared/models/inputMovement';
import { PTableComponent } from '../../../shared/components/p-table/p-table.component';
import { MovementService } from '../../../core/services/movement.service';
import { Router } from '@angular/router';
import { IconModule, icons } from '../../../shared/modules/icon/icon.module';

@Component({
  selector: 'app-movement-input',
  imports: [InputComponent, ReactiveFormsModule, FormTemplateComponent, PTableComponent, IconModule],
  standalone: true,

  templateUrl: './movement-input.component.html',
  styleUrl: './movement-input.component.css'
})
export class MovementInputComponent {
  icons = icons;
  form: FormGroup;

  sourceOptions = [
    { label: 'Doação', value: 0 },
    { label: 'Compra', value: 1 },
  
  ];

  constructor(private fb: FormBuilder, private movementService: MovementService, private router: Router) {
    this.form = this.fb.group({
      productId: this.fb.control('', Validators.required),
      batch: this.fb.control('', Validators.required),
      quantity: this.fb.control('', Validators.required),
      containerId: this.fb.control('', Validators.required),
      sourceType: this.fb.control('', Validators.required),
      sourceDetails: this.fb.control('', Validators.required),
      expiration_date: this.fb.control('', Validators.required),
      price: this.fb.control('', Validators.required),
      userId: this.fb.control('', Validators.required)
   
    });

    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { [key: string]: any };

    if (state) {
      this.form.patchValue(state);
    }
  }

  getControl(field: string): FormControl {
    return this.form.get(field) as FormControl;
  }

 onSubmit(): void {
  const input: InputMovement = {
    productId: this.form.value.productId,
    batch: this.form.value.batch,
    quantity: this.form.value.quantity,
    containerId: this.form.value.containerId,
    sourceType: this.form.value.sourceType,
    sourceDetails: this.form.value.sourceDetails,
    expiration_date: this.form.value.expiration_date,
    price: this.form.value.price,
    userId: this.form.value.userId
  };
  
  this.movementService.createInputMovement(input).subscribe({
    next: (response) => {
      console.log('Movimento de entrada criado com sucesso:', response);
      this.router.navigate(['manage/view/movements']);
    },
    error: (error) => {
      console.error('Erro ao criar movimento de entrada:', error);
    }
  });
   
  

}
}