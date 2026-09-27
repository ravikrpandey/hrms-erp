import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllEmployessListComponent } from './all-employess-list.component';

describe('AllEmployessListComponent', () => {
  let component: AllEmployessListComponent;
  let fixture: ComponentFixture<AllEmployessListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllEmployessListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllEmployessListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
