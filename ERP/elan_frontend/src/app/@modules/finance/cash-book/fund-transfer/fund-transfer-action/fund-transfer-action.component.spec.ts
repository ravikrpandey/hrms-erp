import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundTransferActionComponent } from './fund-transfer-action.component';

describe('FundTransferActionComponent', () => {
  let component: FundTransferActionComponent;
  let fixture: ComponentFixture<FundTransferActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FundTransferActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FundTransferActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
