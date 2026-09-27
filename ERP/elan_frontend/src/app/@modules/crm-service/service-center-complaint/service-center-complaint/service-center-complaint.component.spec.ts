import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceCenterComplaintComponent } from './service-center-complaint.component';

describe('ServiceCenterComplaintComponent', () => {
  let component: ServiceCenterComplaintComponent;
  let fixture: ComponentFixture<ServiceCenterComplaintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceCenterComplaintComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceCenterComplaintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
