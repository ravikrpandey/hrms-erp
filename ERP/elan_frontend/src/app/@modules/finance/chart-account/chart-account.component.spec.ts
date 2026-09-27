import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartAccountComponent } from './chart-account.component';

describe('ChartAccountComponent', () => {
  let component: ChartAccountComponent;
  let fixture: ComponentFixture<ChartAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartAccountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
