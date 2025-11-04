import { TestBed } from '@angular/core/testing';

import { PrivateAuthService } from './private-auth-service';

describe('PrivateAuthService', () => {
  let service: PrivateAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrivateAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
