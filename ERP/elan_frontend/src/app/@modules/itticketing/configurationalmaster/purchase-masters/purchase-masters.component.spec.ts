import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseMastersComponent } from './purchase-masters.component';

describe('PurchaseMastersComponent', () => {
  let component: PurchaseMastersComponent;
  let fixture: ComponentFixture<PurchaseMastersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseMastersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseMastersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
