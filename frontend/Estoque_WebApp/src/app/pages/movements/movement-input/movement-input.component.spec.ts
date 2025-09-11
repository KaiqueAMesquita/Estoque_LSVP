import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovementInputComponent } from './movement-input.component';

describe('MovementInputComponent', () => {
  let component: MovementInputComponent;
  let fixture: ComponentFixture<MovementInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovementInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovementInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
