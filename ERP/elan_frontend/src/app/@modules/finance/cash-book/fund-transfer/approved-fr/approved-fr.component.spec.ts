import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedFrComponent } from './approved-fr.component';

describe('ApprovedFrComponent', () => {
  let component: ApprovedFrComponent;
  let fixture: ComponentFixture<ApprovedFrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovedFrComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovedFrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
