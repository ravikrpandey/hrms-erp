import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectedFrComponent } from './rejected-fr.component';

describe('RejectedFrComponent', () => {
  let component: RejectedFrComponent;
  let fixture: ComponentFixture<RejectedFrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectedFrComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectedFrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
