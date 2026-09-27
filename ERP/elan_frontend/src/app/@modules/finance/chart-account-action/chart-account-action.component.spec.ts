import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartAccountActionComponent } from './chart-account-action.component';

describe('ChartAccountActionComponent', () => {
  let component: ChartAccountActionComponent;
  let fixture: ComponentFixture<ChartAccountActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartAccountActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartAccountActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
