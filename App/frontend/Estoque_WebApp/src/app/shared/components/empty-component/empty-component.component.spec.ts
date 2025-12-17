import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyComponentComponent } from './empty-component.component';

describe('EmptyComponentComponent', () => {
  let component: EmptyComponentComponent;
  let fixture: ComponentFixture<EmptyComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmptyComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
