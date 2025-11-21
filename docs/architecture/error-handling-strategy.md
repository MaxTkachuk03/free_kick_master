# Error Handling Strategy

## General Approach

- **Error Model:** Try-catch blocks with user-friendly error messages
- **Exception Hierarchy:** Custom error classes for game-specific errors
- **Error Propagation:** Errors logged to console in development, silent failures with fallbacks in production

## Logging Standards

- **Library:** Native `console` API (development), silent in production
- **Format:** `[Component] Message: Details`
- **Levels:** `error`, `warn`, `info`, `debug`
- **Required Context:**
  - Component name
  - Error message
  - Stack trace (development only)

## Error Handling Patterns

### External API Errors
- **Retry Policy:** N/A - No external APIs
- **Circuit Breaker:** N/A
- **Timeout Configuration:** N/A
- **Error Translation:** N/A

### Business Logic Errors
- **Custom Exceptions:** `InsufficientCoinsError`, `LevelLockedError`, `InvalidKickError`
- **User-Facing Errors:** Friendly messages displayed in UI
- **Error Codes:** String-based error codes for UI display

### Data Consistency
- **Transaction Strategy:** localStorage operations are atomic
- **Compensation Logic:** Validate before save, rollback on failure
- **Idempotency:** Save operations are idempotent (overwrite existing data)
