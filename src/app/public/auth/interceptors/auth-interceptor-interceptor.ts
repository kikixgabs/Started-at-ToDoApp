import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthLocalManager, LocalKeys } from '../services';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  
  const localManager = inject(AuthLocalManager);

  const token = localManager.getElement(LocalKeys.token);

  let headers = req.headers.set('Content-Type', 'application/json');

  if(token){
    headers = headers.set('Authorization', `Bearer ${token}`);
  }

  const authReq = req.clone({headers});

  return next(authReq);
};
