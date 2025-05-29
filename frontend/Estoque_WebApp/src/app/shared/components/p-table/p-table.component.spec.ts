import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PTableComponent } from './p-table.component';

describe('PTableComponent', () => {
  let component: PTableComponent<any>;
  let fixture: ComponentFixture<PTableComponent<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
