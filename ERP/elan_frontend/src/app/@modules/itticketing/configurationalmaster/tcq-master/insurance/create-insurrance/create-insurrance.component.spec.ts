import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateInsurranceComponent } from './create-insurrance.component';

describe('CreateInsurranceComponent', () => {
  let component: CreateInsurranceComponent;
  let fixture: ComponentFixture<CreateInsurranceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateInsurranceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateInsurranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
