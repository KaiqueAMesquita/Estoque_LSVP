import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUnitComponent } from './edit-unit.component';

describe('EditUnitComponent', () => {
  let component: EditUnitComponent;
  let fixture: ComponentFixture<EditUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditUnitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
