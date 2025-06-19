import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { InputComponent } from '../input/input.component';
import { FormTemplateComponent } from '../form-template/form-template.component';

interface Categoria {
  label: string;
  value: string;
}

@Component({
  selector: 'app-form2',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, FormTemplateComponent],
  templateUrl: './form2.component.html',
  styleUrls: ['./form2.component.css']
})
export class Form2Component {
  formulario: FormGroup;

  categorias: Categoria[] = [
    { label: 'Alimentos', value: 'alimentos' },
    { label: 'Bebidas', value: 'bebidas' },
    { label: 'Outros', value: 'outros' },
  ];

  constructor(private fb: FormBuilder, private location: Location) {
    this.formulario = this.fb.group({
      nome: ['', Validators.required],
      preco: ['', Validators.required],
      categoria: ['', Validators.required],
    });
  }

    get nomeControl(): FormControl {
      return this.formulario.get('nome') as FormControl;
    }

    get precoControl(): FormControl {
      return this.formulario.get('preco') as FormControl;
    }

    get categoriaControl(): FormControl {
      return this.formulario.get('categoria') as FormControl;
    }

  enviarFormulario() {
    if (this.formulario.valid) {
      console.log('Formulário válido:', this.formulario.value);
      // Aqui você faria a chamada para a API
      // this.usuarioService.cadastrar(this.formulario.value).subscribe(...)
    } else {
      // Marca todos os campos como tocados para exibir os erros
      Object.keys(this.formulario.controls).forEach(key => {
        this.formulario.get(key)?.markAsTouched();
      });
    }
  }

  onCancel() {
    console.log('Formulário cancelado');
    this.formulario.reset();
    this.location.back();
  }
}