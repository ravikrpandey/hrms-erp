import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockInTransitComponent } from './stock-in-transit.component';

describe('StockInTransitComponent', () => {
  let component: StockInTransitComponent;
  let fixture: ComponentFixture<StockInTransitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockInTransitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockInTransitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
