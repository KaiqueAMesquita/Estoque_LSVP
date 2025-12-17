import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { FormTemplateComponent } from '../../../shared/components/form-template/form-template.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { InputMovement } from '../../../shared/models/inputMovement';
import { PTableComponent } from '../../../shared/components/p-table/p-table.component';
import { MovementService } from '../../../core/services/movement.service';
import { Router } from '@angular/router';
import { IconModule, icons } from '../../../shared/modules/icon/icon.module';
import { ContainerService } from '../../../core/services/container.service';
import { Container } from '../../../shared/models/container';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-movement-input',
  imports: [InputComponent, ReactiveFormsModule, FormTemplateComponent, PTableComponent, IconModule, CommonModule],
  standalone: true,

  templateUrl: './movement-input.component.html',
  styleUrl: './movement-input.component.css'
})
export class MovementInputComponent implements OnInit {
  icons = icons;
  form: FormGroup;

  containers: any[] = [];
  isContainerPaged: boolean = false;
  containerPageNumber: number = 0;
  containerTotalPages: number = 0;
  containerSearchTerm: string = '';

  sourceOptions = [
    { label: 'Doação', value: 0 },
    { label: 'Compra', value: 1 },
  
  ];

  constructor(private fb: FormBuilder, private movementService: MovementService, private router: Router, private containerService: ContainerService) {
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

  ngOnInit(): void {
    this.loadContainers();
  }

  private loadContainers(page: number = 0, code?: string): void {
    this.containerService.getAllContainers(page, 5, 'id,desc', code).subscribe({
      next: (response) => {
        this.containers = response.content.map((container: Container) => ({
          id: container.id,
          Código: container.code,
          Categoria: container.description
        }));
        this.containerPageNumber = response.number;
        this.containerTotalPages = response.totalPages;
        this.isContainerPaged = response.totalPages > 1;
      },
      error: (error) => console.error('Erro ao carregar contêineres:', error)
    });
  }

  handleContainerSelection(selectedContainer: any): void {
    if (selectedContainer && selectedContainer.id) {
      this.form.get('containerId')?.setValue(selectedContainer.id);
    } else {
      this.form.get('containerId')?.setValue(null);
    }
  }

  onContainerSearch(term: string): void {
    this.containerSearchTerm = term;
    this.loadContainers(0, this.containerSearchTerm);
  }

  getControl(field: string): FormControl {
    return this.form.get(field) as FormControl;
  }

 onSubmit(): void {
  const input: InputMovement = this.form.value;

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

onContainerPageChange(page: number): void {
  if (page >= 0 && page < this.containerTotalPages)
    this.loadContainers(page, this.containerSearchTerm);
}
}