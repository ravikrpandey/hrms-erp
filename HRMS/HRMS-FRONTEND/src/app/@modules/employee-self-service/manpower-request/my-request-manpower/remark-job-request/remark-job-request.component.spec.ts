import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemarkJobRequestComponent } from './remark-job-request.component';

describe('RemarkJobRequestComponent', () => {
  let component: RemarkJobRequestComponent;
  let fixture: ComponentFixture<RemarkJobRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemarkJobRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemarkJobRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
