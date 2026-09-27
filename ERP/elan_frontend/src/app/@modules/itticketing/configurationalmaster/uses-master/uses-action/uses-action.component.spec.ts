import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsesActionComponent } from './uses-action.component';

describe('UsesActionComponent', () => {
  let component: UsesActionComponent;
  let fixture: ComponentFixture<UsesActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsesActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsesActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
