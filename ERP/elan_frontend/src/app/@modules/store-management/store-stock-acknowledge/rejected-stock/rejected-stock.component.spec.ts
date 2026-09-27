import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectedStockComponent } from './rejected-stock.component';

describe('RejectedStockComponent', () => {
  let component: RejectedStockComponent;
  let fixture: ComponentFixture<RejectedStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectedStockComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectedStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
