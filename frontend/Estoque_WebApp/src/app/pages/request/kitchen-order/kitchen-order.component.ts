import { Component } from '@angular/core';
import { NavBarComponent } from '../../../shared/components/nav-bar/nav-bar.component';
import { PTableComponent } from '../../../shared/components/p-table/p-table.component';
import { FormTemplateComponent } from '../../../shared/components/form-template/form-template.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { IconModule } from '../../../shared/modules/icon/icon.module';
import { icons } from '../../../shared/modules/icon/icon.module';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../shared/models/product';
import { OnInit } from '@angular/core';
import { OrderItem } from '../../../shared/models/order';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../core/services/order.service';
@Component({
  selector: 'app-kitchen-order',
  standalone: true,
  imports: [NavBarComponent, PTableComponent, FormTemplateComponent, InputComponent, IconModule,CommonModule],
templateUrl: './kitchen-order.component.html',
  styleUrl: './kitchen-order.component.css'
})
export class KitchenOrderComponent implements OnInit {
  icons = icons;
  form: FormGroup;

  products: Product[] = [];

  orderItems: OrderItem[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private productService: ProductService,
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {
    this.form = this.fb.group({
      productId: this.fb.control('', Validators.required),
      productName:this.fb.control('', Validators.required),
      productGtin:this.fb.control('', Validators.required),
      quantityRequested:this.fb.control('', Validators.required)
    });
  }

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products.map(product => {
          
          return { id: product.id, description: product.description, gtin: product.gtin } as Product;
        });
      },
      error: (err) => console.error('Erro ao carregar produtos', err),
    });
  }

   getControl(field: string): FormControl {
    return this.form.get(field) as FormControl;
  }

  handleProductSelection(product: Product | undefined): void {
    if (product) {
      this.form.patchValue({
        productId: product.id,
        productName: product.description,
        productGtin: product.gtin,
      });
    }
  }
  addItem(){
    if(this.form.valid){
      const orderItem: OrderItem = {
        productId: this.form.get('productId')?.value,
        productName: this.form.get('productName')?.value,
        productGtin: this.form.get('productGtin')?.value,
        quantityRequested: this.form.get('quantityRequested')?.value,
        quantityFulfilled: 0,
        id: 0
      };
      this.orderItems.push(orderItem);
      this.form.reset();
    }
    
  }
  removeItem(item: OrderItem){
    const index = this.orderItems.indexOf(item);
    if(index !== -1){
      this.orderItems.splice(index, 1);

  }
  
}
}
