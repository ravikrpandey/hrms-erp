import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEwayChallanComponent } from './view-eway-challan.component';

describe('ViewEwayChallanComponent', () => {
  let component: ViewEwayChallanComponent;
  let fixture: ComponentFixture<ViewEwayChallanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewEwayChallanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewEwayChallanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
