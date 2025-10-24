'use client';

    // Ré-exporte tout depuis firebase.ts, auth.ts, etc.
export { app, auth, firestore, storage } from './firebase'; // Exportation explicite des instances, including storage
export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
