import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveRfpComponent } from './live-rfp.component';

describe('LiveRfpComponent', () => {
  let component: LiveRfpComponent;
  let fixture: ComponentFixture<LiveRfpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiveRfpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiveRfpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
