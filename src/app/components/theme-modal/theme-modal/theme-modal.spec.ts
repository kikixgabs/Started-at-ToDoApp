import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeModal } from './theme-modal';

describe('ThemeModal', () => {
  let component: ThemeModal;
  let fixture: ComponentFixture<ThemeModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemeModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThemeModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
