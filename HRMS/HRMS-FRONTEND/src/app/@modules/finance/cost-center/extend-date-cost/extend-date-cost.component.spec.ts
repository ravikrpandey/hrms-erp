import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendDateCostComponent } from './extend-date-cost.component';

describe('ExtendDateCostComponent', () => {
  let component: ExtendDateCostComponent;
  let fixture: ComponentFixture<ExtendDateCostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtendDateCostComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExtendDateCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
