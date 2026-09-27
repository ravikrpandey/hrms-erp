import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToBeApprovedComponent } from './to-be-approved.component';

describe('ToBeApprovedComponent', () => {
  let component: ToBeApprovedComponent;
  let fixture: ComponentFixture<ToBeApprovedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToBeApprovedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToBeApprovedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
