import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplaintActionComponent } from './complaint-action.component';

describe('ComplaintActionComponent', () => {
  let component: ComplaintActionComponent;
  let fixture: ComponentFixture<ComplaintActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplaintActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComplaintActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
