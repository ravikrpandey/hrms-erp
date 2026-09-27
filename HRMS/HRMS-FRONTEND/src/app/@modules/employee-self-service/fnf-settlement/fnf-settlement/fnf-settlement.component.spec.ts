import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FnfSettlementComponent } from './fnf-settlement.component';

describe('FnfSettlementComponent', () => {
  let component: FnfSettlementComponent;
  let fixture: ComponentFixture<FnfSettlementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FnfSettlementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FnfSettlementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
