import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceCenterCreateComponent } from './service-center-create.component';

describe('ServiceCenterCreateComponent', () => {
  let component: ServiceCenterCreateComponent;
  let fixture: ComponentFixture<ServiceCenterCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceCenterCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceCenterCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
