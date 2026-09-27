import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainActionComponent } from './contain-action.component';

describe('ContainActionComponent', () => {
  let component: ContainActionComponent;
  let fixture: ComponentFixture<ContainActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContainActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContainActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
