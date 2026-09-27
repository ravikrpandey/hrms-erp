import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsmActionComponent } from './ism-action.component';

describe('IsmActionComponent', () => {
  let component: IsmActionComponent;
  let fixture: ComponentFixture<IsmActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IsmActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IsmActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
