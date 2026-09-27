import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExitFormCreate } from './exit-form-create';

describe('ExitFormCreate', () => {
  let component: ExitFormCreate;
  let fixture: ComponentFixture<ExitFormCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExitFormCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExitFormCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
