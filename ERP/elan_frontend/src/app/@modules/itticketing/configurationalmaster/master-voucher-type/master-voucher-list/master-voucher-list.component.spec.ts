import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterVoucherListComponent } from './master-voucher-list.component';

describe('MasterVoucherListComponent', () => {
  let component: MasterVoucherListComponent;
  let fixture: ComponentFixture<MasterVoucherListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterVoucherListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterVoucherListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
