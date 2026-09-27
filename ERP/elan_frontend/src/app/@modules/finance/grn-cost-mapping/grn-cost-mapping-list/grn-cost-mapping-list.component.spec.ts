import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrnCostMappingListComponent } from './grn-cost-mapping-list.component';

describe('GrnCostMappingListComponent', () => {
  let component: GrnCostMappingListComponent;
  let fixture: ComponentFixture<GrnCostMappingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrnCostMappingListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrnCostMappingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
