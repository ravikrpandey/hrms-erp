import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceMasterListComponent } from './service-master-list.component';

describe('ServiceMasterListComponent', () => {
  let component: ServiceMasterListComponent;
  let fixture: ComponentFixture<ServiceMasterListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceMasterListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceMasterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
