import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBreakdownIndentComponent } from './create-breakdown-indent.component';

describe('CreateBreakdownIndentComponent', () => {
  let component: CreateBreakdownIndentComponent;
  let fixture: ComponentFixture<CreateBreakdownIndentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateBreakdownIndentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateBreakdownIndentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
