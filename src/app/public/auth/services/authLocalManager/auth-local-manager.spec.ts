import { TestBed } from '@angular/core/testing';

import { AuthLocalManager } from './auth-local-manager';

describe('AuthLocalManager', () => {
  let service: AuthLocalManager;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthLocalManager);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
