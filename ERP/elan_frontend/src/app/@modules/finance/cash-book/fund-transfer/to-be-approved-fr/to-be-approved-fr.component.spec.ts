import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToBeApprovedFrComponent } from './to-be-approved-fr.component';

describe('ToBeApprovedFrComponent', () => {
  let component: ToBeApprovedFrComponent;
  let fixture: ComponentFixture<ToBeApprovedFrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToBeApprovedFrComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToBeApprovedFrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
