import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelReportsComponent } from './travel-reports.component';

describe('TravelReportsComponent', () => {
  let component: TravelReportsComponent;
  let fixture: ComponentFixture<TravelReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TravelReportsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TravelReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
