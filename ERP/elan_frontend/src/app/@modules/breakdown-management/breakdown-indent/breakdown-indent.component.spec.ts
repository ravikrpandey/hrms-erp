import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreakdownIndentComponent } from './breakdown-indent.component';

describe('BreakdownIndentComponent', () => {
  let component: BreakdownIndentComponent;
  let fixture: ComponentFixture<BreakdownIndentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BreakdownIndentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BreakdownIndentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
