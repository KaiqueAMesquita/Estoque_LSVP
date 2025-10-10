import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMovementsComponent } from './view-movements.component';

describe('ViewMovementsComponent', () => {
  let component: ViewMovementsComponent;
  let fixture: ComponentFixture<ViewMovementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewMovementsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewMovementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
