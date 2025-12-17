import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewUnitComponent } from './view-unit.component';

describe('ViewUnitComponent', () => {
  let component: ViewUnitComponent;
  let fixture: ComponentFixture<ViewUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewUnitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
