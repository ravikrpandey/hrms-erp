import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StateMasterStatusComponent } from './state-master-status.component';

describe('StateMasterStatusComponent', () => {
  let component: StateMasterStatusComponent;
  let fixture: ComponentFixture<StateMasterStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StateMasterStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StateMasterStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
