import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostCenterCreateComponent } from './cost-center-create.component';

describe('CostCenterCreateComponent', () => {
  let component: CostCenterCreateComponent;
  let fixture: ComponentFixture<CostCenterCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CostCenterCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CostCenterCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
