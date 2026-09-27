import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebinarSessionComponent } from './webinar-session.component';

describe('WebinarSessionComponent', () => {
  let component: WebinarSessionComponent;
  let fixture: ComponentFixture<WebinarSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebinarSessionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebinarSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
