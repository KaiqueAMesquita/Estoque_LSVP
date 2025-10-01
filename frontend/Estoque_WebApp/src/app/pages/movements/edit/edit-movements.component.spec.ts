import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMovementsComponent } from './edit-movements.component';

describe('EditMovementsComponent', () => {
  let component: EditMovementsComponent;
  let fixture: ComponentFixture<EditMovementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditMovementsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditMovementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
