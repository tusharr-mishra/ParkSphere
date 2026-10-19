import { ENV } from '../config/env.js';

export const logger = {
  info: (message, meta = {}) => {
    console.log(JSON.stringify({ level: 'INFO', timestamp: new Date().toISOString(), message, ...meta }));
  },
  warn: (message, meta = {}) => {
    console.warn(JSON.stringify({ level: 'WARN', timestamp: new Date().toISOString(), message, ...meta }));
  },
  error: (message, meta = {}) => {
    // Avoid leaking stack traces or sensitive data in production
    const payload = {
      level: 'ERROR',
      timestamp: new Date().toISOString(),
      message,
      ...(ENV.NODE_ENV !== 'production' && meta.stack ? { stack: meta.stack } : {}),
      ...meta,
    };
    console.error(JSON.stringify(payload));
  },
  audit: (action, actorId, entityType, entityId, metadata = {}) => {
    console.log(
      JSON.stringify({
        level: 'AUDIT',
        timestamp: new Date().toISOString(),
        action,
        actorId,
        entityType,
        entityId,
        metadata,
      })
    );
  },
};
