import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewContainersComponent } from './view-containers.component';

describe('ViewContainersComponent', () => {
  let component: ViewContainersComponent;
  let fixture: ComponentFixture<ViewContainersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewContainersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewContainersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
