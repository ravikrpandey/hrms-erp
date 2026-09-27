import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceMasterCreateComponent } from './service-master-create.component';

describe('ServiceMasterCreateComponent', () => {
  let component: ServiceMasterCreateComponent;
  let fixture: ComponentFixture<ServiceMasterCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceMasterCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceMasterCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
