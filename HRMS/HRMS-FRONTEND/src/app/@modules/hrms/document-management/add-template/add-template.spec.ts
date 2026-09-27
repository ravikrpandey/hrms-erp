import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTemplate } from './add-template';

describe('AddTemplate', () => {
  let component: AddTemplate;
  let fixture: ComponentFixture<AddTemplate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTemplate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTemplate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
