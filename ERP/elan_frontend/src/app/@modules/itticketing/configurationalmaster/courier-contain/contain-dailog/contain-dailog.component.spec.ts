import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainDailogComponent } from './contain-dailog.component';

describe('ContainDailogComponent', () => {
  let component: ContainDailogComponent;
  let fixture: ComponentFixture<ContainDailogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContainDailogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContainDailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
