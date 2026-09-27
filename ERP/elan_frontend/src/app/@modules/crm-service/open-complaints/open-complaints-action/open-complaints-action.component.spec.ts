import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenComplaintsActionComponent } from './open-complaints-action.component';

describe('OpenComplaintsActionComponent', () => {
  let component: OpenComplaintsActionComponent;
  let fixture: ComponentFixture<OpenComplaintsActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenComplaintsActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenComplaintsActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
