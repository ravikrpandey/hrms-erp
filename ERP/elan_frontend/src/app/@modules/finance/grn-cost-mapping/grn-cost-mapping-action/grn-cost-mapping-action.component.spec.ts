import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrnCostMappingActionComponent } from './grn-cost-mapping-action.component';

describe('GrnCostMappingActionComponent', () => {
  let component: GrnCostMappingActionComponent;
  let fixture: ComponentFixture<GrnCostMappingActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrnCostMappingActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrnCostMappingActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
