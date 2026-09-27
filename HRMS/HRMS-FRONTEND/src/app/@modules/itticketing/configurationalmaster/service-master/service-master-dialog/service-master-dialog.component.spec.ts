import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceMasterDialogComponent } from './service-master-dialog.component';

describe('ServiceMasterDialogComponent', () => {
  let component: ServiceMasterDialogComponent;
  let fixture: ComponentFixture<ServiceMasterDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceMasterDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceMasterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
