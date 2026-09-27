import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxSlabToggleComponent } from './tax-slab-toggle.component';

describe('TaxSlabToggleComponent', () => {
  let component: TaxSlabToggleComponent;
  let fixture: ComponentFixture<TaxSlabToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaxSlabToggleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaxSlabToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
