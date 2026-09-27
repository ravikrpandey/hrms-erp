import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedStockComponent } from './approved-stock.component';

describe('ApprovedStockComponent', () => {
  let component: ApprovedStockComponent;
  let fixture: ComponentFixture<ApprovedStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovedStockComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovedStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
