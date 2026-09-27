import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignCompOffComponent } from './assign-comp-off.component';

describe('AssignCompOffComponent', () => {
  let component: AssignCompOffComponent;
  let fixture: ComponentFixture<AssignCompOffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignCompOffComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignCompOffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
