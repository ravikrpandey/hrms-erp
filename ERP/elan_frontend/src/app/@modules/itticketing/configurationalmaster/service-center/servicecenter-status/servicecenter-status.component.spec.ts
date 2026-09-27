import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicecenterStatusComponent } from './servicecenter-status.component';

describe('ServicecenterStatusComponent', () => {
  let component: ServicecenterStatusComponent;
  let fixture: ComponentFixture<ServicecenterStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServicecenterStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicecenterStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
