import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WareHouseManagementComponent } from './ware-house-management.component';

describe('WareHouseManagementComponent', () => {
  let component: WareHouseManagementComponent;
  let fixture: ComponentFixture<WareHouseManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WareHouseManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WareHouseManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
