import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewReasonsComponent } from './view-reasons.component';

describe('ViewReasonsComponent', () => {
  let component: ViewReasonsComponent;
  let fixture: ComponentFixture<ViewReasonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewReasonsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewReasonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
