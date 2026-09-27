import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevenueForcastComponent } from './revenue-forcast.component';

describe('RevenueForcastComponent', () => {
  let component: RevenueForcastComponent;
  let fixture: ComponentFixture<RevenueForcastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RevenueForcastComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RevenueForcastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
