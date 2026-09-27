import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceMasterActionComponent } from './service-master-action.component';

describe('ServiceMasterActionComponent', () => {
  let component: ServiceMasterActionComponent;
  let fixture: ComponentFixture<ServiceMasterActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceMasterActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceMasterActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
