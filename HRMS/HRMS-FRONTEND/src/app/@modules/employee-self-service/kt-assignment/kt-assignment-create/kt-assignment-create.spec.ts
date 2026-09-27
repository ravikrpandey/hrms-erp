import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KtAssignmentCreate } from './kt-assignment-create';

describe('KtAssignmentCreate', () => {
  let component: KtAssignmentCreate;
  let fixture: ComponentFixture<KtAssignmentCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KtAssignmentCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KtAssignmentCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
