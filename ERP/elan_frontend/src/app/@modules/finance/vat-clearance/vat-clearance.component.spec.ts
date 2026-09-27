import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VatClearanceComponent } from './vat-clearance.component';

describe('VatClearanceComponent', () => {
  let component: VatClearanceComponent;
  let fixture: ComponentFixture<VatClearanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VatClearanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VatClearanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
