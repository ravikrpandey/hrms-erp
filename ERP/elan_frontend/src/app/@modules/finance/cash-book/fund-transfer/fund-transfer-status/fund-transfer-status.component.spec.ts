import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundTransferStatusComponent } from './fund-transfer-status.component';

describe('FundTransferStatusComponent', () => {
  let component: FundTransferStatusComponent;
  let fixture: ComponentFixture<FundTransferStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FundTransferStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FundTransferStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
