import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariableCostComponent } from './variable-cost.component';

describe('VariableCostComponent', () => {
  let component: VariableCostComponent;
  let fixture: ComponentFixture<VariableCostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VariableCostComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VariableCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
