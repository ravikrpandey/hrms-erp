import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceCenterActionComponent } from './service-center-action.component';

describe('ServiceCenterActionComponent', () => {
  let component: ServiceCenterActionComponent;
  let fixture: ComponentFixture<ServiceCenterActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceCenterActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceCenterActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
