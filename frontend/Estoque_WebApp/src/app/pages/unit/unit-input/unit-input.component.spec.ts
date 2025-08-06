import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitInputComponent } from './unit-input.component';

describe('UnitInputComponent', () => {
  let component: UnitInputComponent;
  let fixture: ComponentFixture<UnitInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnitInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnitInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
