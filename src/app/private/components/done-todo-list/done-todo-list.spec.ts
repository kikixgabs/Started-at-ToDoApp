import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoneTodoList } from './done-todo-list';

describe('DoneTodoList', () => {
  let component: DoneTodoList;
  let fixture: ComponentFixture<DoneTodoList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoneTodoList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoneTodoList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
