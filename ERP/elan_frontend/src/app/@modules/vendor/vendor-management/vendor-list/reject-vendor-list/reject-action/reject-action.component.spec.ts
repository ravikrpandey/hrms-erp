import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectActionComponent } from './reject-action.component';

describe('RejectActionComponent', () => {
  let component: RejectActionComponent;
  let fixture: ComponentFixture<RejectActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
