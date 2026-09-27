import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FnfActionComponent } from './fnf-action.component';

describe('FnfActionComponent', () => {
  let component: FnfActionComponent;
  let fixture: ComponentFixture<FnfActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FnfActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FnfActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
