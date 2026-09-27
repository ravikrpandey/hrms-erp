import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllIndentComponent } from './all-indent.component';

describe('AllIndentComponent', () => {
  let component: AllIndentComponent;
  let fixture: ComponentFixture<AllIndentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllIndentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllIndentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
