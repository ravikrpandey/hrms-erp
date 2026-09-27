import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllFrComponent } from './all-fr.component';

describe('AllFrComponent', () => {
  let component: AllFrComponent;
  let fixture: ComponentFixture<AllFrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllFrComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllFrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
