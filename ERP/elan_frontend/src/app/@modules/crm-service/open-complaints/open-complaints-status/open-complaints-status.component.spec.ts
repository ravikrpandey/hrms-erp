import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenComplaintsStatusComponent } from './open-complaints-status.component';

describe('OpenComplaintsStatusComponent', () => {
  let component: OpenComplaintsStatusComponent;
  let fixture: ComponentFixture<OpenComplaintsStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenComplaintsStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenComplaintsStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
