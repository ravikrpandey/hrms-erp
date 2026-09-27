import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreManagementStatusComponent } from './store-management-status.component';

describe('StoreManagementStatusComponent', () => {
  let component: StoreManagementStatusComponent;
  let fixture: ComponentFixture<StoreManagementStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreManagementStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreManagementStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
