import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsurranceActionComponent } from './insurrance-action.component';

describe('InsurranceActionComponent', () => {
  let component: InsurranceActionComponent;
  let fixture: ComponentFixture<InsurranceActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsurranceActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsurranceActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
