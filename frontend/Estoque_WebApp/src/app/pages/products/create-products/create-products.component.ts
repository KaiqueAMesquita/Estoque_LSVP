import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormTemplateComponent } from '../../../shared/components/form-template/form-template.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { JsonPipe } from '@angular/common';
import { ProductService } from '../../../core/services/product.service';
import { Product } from './../../../shared/models/product';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-products',
  imports: [FormBuilder, FormTemplateComponent, ReactiveFormsModule, InputComponent, JsonPipe],
  templateUrl: './create-products.component.html',
  styleUrl: './create-products.component.css'
})
export class CreateProductsComponent {
  // Este componente é responsável por criar novos produtos.
  // Ele pode conter um formulário para entrada de dados do produto
  // e métodos para enviar esses dados ao serviço de produtos.
  // A lógica de criação de produtos será implementada aqui.
  form: FormGroup;
  constructor(private fb: FormBuilder, private productService: ProductService, private router: Router) {
    // Inicialização do componente
    this.form = this.fb.group({
      name: this.fb.control('', Validators.required),
      price: this.fb.control('', [Validators.required, Validators.min(0)]),
      quantity: this.fb.control('', [Validators.required, Validators.min(1)])
    });
  }
  getControl(field: string): FormControl {
    return this.form.get(field) as FormControl;
  }
  onSubmit(): void {
    // Método chamado ao submeter o formulário
    const product: Product = {
      id: 0, // ID será gerado pelo backend
      //Campo obrigatório do produto
      name: this.form.value.name,
      description: '', // Descrição pode ser opcional ou preenchida posteriormente
      createdAt: new Date(), // Data de criação do produto
      updatedAt: new Date(), // Data de atualização do produto
      categoryId: 0, // Categoria pode ser selecionada posteriormente
      // Preenchendo os campos obrigatórios do produto
      price: this.form.value.price,
      quantity: this.form.value.quantity
    };
    // Chamada ao serviço para registrar o produto
    this.productService.registerProduct(product);
    // Resetando o formulário após o envio
    this.form.reset();
    // Redirecionando para a página de visualização de produtos
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['manage/view/products']);
    });
  }
}
