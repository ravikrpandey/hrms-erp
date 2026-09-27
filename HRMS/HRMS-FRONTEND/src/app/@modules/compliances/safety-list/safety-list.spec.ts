import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafetyList } from './safety-list';

describe('SafetyList', () => {
  let component: SafetyList;
  let fixture: ComponentFixture<SafetyList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SafetyList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SafetyList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
