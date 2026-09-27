import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxSlabActionComponent } from './tax-slab-action.component';

describe('TaxSlabActionComponent', () => {
  let component: TaxSlabActionComponent;
  let fixture: ComponentFixture<TaxSlabActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaxSlabActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaxSlabActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
