import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseRegisterListComponent } from './purchase-register-list.component';

describe('PurchaseRegisterListComponent', () => {
  let component: PurchaseRegisterListComponent;
  let fixture: ComponentFixture<PurchaseRegisterListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseRegisterListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseRegisterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
