import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnActionComponent } from './on-action.component';

describe('OnActionComponent', () => {
  let component: OnActionComponent;
  let fixture: ComponentFixture<OnActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
