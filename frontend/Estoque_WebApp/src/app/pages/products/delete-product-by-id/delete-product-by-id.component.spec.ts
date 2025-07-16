import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteProductByIdComponent } from './delete-product-by-id.component';

describe('DeleteProductByIdComponent', () => {
  let component: DeleteProductByIdComponent;
  let fixture: ComponentFixture<DeleteProductByIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteProductByIdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteProductByIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
