import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectRemarkComponent } from './reject-remark.component';

describe('RejectRemarkComponent', () => {
  let component: RejectRemarkComponent;
  let fixture: ComponentFixture<RejectRemarkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectRemarkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectRemarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
