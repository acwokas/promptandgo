-- TODO 7 backfill — migrate subscribers.subscription_tier from the
-- legacy bucket vocab ('Basic'/'Premium'/'Enterprise') to the product-
-- ID-derived vocab ('pro_monthly'/'pro_annual'/'team_monthly'/'team_annual').
--
-- Conservative mapping:
--   'Basic' → 'pro_monthly'  (was the $12.99/mo bucket; matches the new
--                              pro_monthly product)
--   'Premium', 'Enterprise' → NULL (the buckets didn't cleanly map to
--                              annual vs team; check-subscription will
--                              repopulate on the user's next API call,
--                              now reading the product ID directly)
--   'lifetime' → kept as-is (TODO 5 pending — Adrian decides whether
--                              Lifetime stays as a tier or gets dropped)
--   anything else → kept as-is (already-migrated rows or unknown labels)
--
-- After this migration, check-subscription writes will use the new vocab
-- via tierFromProductId() in _shared/stripe-prices.ts.

BEGIN;

-- Surface counts pre-migration for the audit trail
DO $$
DECLARE
  basic_n int;
  premium_n int;
  enterprise_n int;
  lifetime_n int;
  other_n int;
BEGIN
  SELECT COUNT(*) INTO basic_n FROM subscribers WHERE subscription_tier = 'Basic';
  SELECT COUNT(*) INTO premium_n FROM subscribers WHERE subscription_tier = 'Premium';
  SELECT COUNT(*) INTO enterprise_n FROM subscribers WHERE subscription_tier = 'Enterprise';
  SELECT COUNT(*) INTO lifetime_n FROM subscribers WHERE subscription_tier = 'lifetime';
  SELECT COUNT(*) INTO other_n FROM subscribers
    WHERE subscription_tier IS NOT NULL
      AND subscription_tier NOT IN ('Basic','Premium','Enterprise','lifetime');
  RAISE NOTICE 'TODO7 pre-migration counts: Basic=%, Premium=%, Enterprise=%, lifetime=%, other=%',
    basic_n, premium_n, enterprise_n, lifetime_n, other_n;
END $$;

-- Apply mapping
UPDATE subscribers SET subscription_tier = 'pro_monthly' WHERE subscription_tier = 'Basic';
UPDATE subscribers SET subscription_tier = NULL          WHERE subscription_tier IN ('Premium','Enterprise');
-- 'lifetime' deliberately untouched

-- Surface counts post-migration
DO $$
DECLARE
  pro_monthly_n int;
  null_n int;
  lifetime_n int;
BEGIN
  SELECT COUNT(*) INTO pro_monthly_n FROM subscribers WHERE subscription_tier = 'pro_monthly';
  SELECT COUNT(*) INTO null_n        FROM subscribers WHERE subscription_tier IS NULL AND subscribed = true;
  SELECT COUNT(*) INTO lifetime_n    FROM subscribers WHERE subscription_tier = 'lifetime';
  RAISE NOTICE 'TODO7 post-migration counts: pro_monthly=%, NULL-but-subscribed=%, lifetime=%',
    pro_monthly_n, null_n, lifetime_n;
END $$;

COMMIT;
