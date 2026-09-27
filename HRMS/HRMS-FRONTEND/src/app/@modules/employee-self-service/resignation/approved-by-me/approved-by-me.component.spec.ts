import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedByMeComponent } from './approved-by-me.component';

describe('ApprovedByMeComponent', () => {
  let component: ApprovedByMeComponent;
  let fixture: ComponentFixture<ApprovedByMeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovedByMeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovedByMeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
