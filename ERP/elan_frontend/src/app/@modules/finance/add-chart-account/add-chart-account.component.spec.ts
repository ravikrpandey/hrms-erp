import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddChartAccountComponent } from './add-chart-account.component';

describe('AddChartAccountComponent', () => {
  let component: AddChartAccountComponent;
  let fixture: ComponentFixture<AddChartAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddChartAccountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddChartAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
