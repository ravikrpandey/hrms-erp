import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuspenceAccountActionComponent } from './suspence-account-action.component';

describe('SuspenceAccountActionComponent', () => {
  let component: SuspenceAccountActionComponent;
  let fixture: ComponentFixture<SuspenceAccountActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuspenceAccountActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuspenceAccountActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
