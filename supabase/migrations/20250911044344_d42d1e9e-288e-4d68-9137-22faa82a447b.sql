-- Ensure pgcrypto extension is available for encryption functions used by secure_upsert_subscriber
CREATE EXTENSION IF NOT EXISTS pgcrypto;