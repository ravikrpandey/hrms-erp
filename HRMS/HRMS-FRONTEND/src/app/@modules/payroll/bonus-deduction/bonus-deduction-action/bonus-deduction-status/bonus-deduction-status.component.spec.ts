import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceMasterStatusComponent } from './service-master-status.component';

describe('ServiceMasterStatusComponent', () => {
  let component: ServiceMasterStatusComponent;
  let fixture: ComponentFixture<ServiceMasterStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceMasterStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceMasterStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
