import { ComponentFixture, TestBed } from '@angular/core/testing';

import { The404PageComponent } from './the404-page.component';

describe('The404PageComponent', () => {
  let component: The404PageComponent;
  let fixture: ComponentFixture<The404PageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [The404PageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(The404PageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
