import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseServiceActionComponent } from './purchase-service-action.component';

describe('PurchaseServiceActionComponent', () => {
  let component: PurchaseServiceActionComponent;
  let fixture: ComponentFixture<PurchaseServiceActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseServiceActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseServiceActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
