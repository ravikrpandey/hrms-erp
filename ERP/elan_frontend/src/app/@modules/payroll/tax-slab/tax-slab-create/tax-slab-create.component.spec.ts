import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxSlabCreateComponent } from './tax-slab-create.component';

describe('TaxSlabCreateComponent', () => {
  let component: TaxSlabCreateComponent;
  let fixture: ComponentFixture<TaxSlabCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaxSlabCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaxSlabCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
