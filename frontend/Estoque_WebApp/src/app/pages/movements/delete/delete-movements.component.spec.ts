import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteMovementsComponent } from './delete-movements.component';

describe('DeleteMovementsComponent', () => {
  let component: DeleteMovementsComponent;
  let fixture: ComponentFixture<DeleteMovementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteMovementsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteMovementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
