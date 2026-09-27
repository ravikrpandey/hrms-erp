import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExitFormList } from './exit-form-list';

describe('ExitFormList', () => {
  let component: ExitFormList;
  let fixture: ComponentFixture<ExitFormList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExitFormList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExitFormList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
