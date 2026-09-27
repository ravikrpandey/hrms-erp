import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EWayList } from './e-way-do-list.component';

describe('EWayList', () => {
  let component: EWayList;
  let fixture: ComponentFixture<EWayList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EWayList ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EWayList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
