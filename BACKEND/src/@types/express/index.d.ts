import * as express from 'express';

export {};

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        role: string;
        equipeId?: string | null;
      };
    }
  }
}