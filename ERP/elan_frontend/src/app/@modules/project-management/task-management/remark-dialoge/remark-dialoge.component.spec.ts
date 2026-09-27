import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemarkDialogeComponent } from './remark-dialoge.component';

describe('RemarkDialogeComponent', () => {
  let component: RemarkDialogeComponent;
  let fixture: ComponentFixture<RemarkDialogeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemarkDialogeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemarkDialogeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
