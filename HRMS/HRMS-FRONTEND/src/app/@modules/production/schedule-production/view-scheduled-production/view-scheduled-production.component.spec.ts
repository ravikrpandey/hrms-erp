import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewScheduledProductionComponent } from './view-scheduled-production.component';

describe('ViewScheduledProductionComponent', () => {
  let component: ViewScheduledProductionComponent;
  let fixture: ComponentFixture<ViewScheduledProductionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewScheduledProductionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewScheduledProductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
