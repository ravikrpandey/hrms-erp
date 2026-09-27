import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectMaintenanceComponent } from './reject-maintenance.component';

describe('RejectMaintenanceComponent', () => {
  let component: RejectMaintenanceComponent;
  let fixture: ComponentFixture<RejectMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectMaintenanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
