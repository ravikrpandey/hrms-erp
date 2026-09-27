import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocatedActionComponent } from './allocated-action.component';

describe('AllocatedActionComponent', () => {
  let component: AllocatedActionComponent;
  let fixture: ComponentFixture<AllocatedActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllocatedActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllocatedActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
