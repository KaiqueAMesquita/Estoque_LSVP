import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UTableComponent } from './u-table.component';

describe('UTableComponent', () => {
  let component: UTableComponent;
  let fixture: ComponentFixture<UTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
