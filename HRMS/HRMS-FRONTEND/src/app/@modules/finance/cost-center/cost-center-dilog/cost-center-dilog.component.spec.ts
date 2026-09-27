import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostCenterDilogComponent } from './cost-center-dilog.component';

describe('PrItemDilogComponent', () => {
  let component: CostCenterDilogComponent;
  let fixture: ComponentFixture<CostCenterDilogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CostCenterDilogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CostCenterDilogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
