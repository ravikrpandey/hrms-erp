import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetMaintenanceComponent } from './asset-maintenance.component';

describe('AssetMaintenanceComponent', () => {
  let component: AssetMaintenanceComponent;
  let fixture: ComponentFixture<AssetMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetMaintenanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
