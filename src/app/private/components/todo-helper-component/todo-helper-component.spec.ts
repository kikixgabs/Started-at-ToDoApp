import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoHelperComponent } from './todo-helper-component';

describe('TodoHelperComponent', () => {
  let component: TodoHelperComponent;
  let fixture: ComponentFixture<TodoHelperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoHelperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodoHelperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
