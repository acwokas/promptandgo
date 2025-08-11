-- Conflict-safe merge: move Health* packs into canonical Wellness & Lifestyle Coach Pack
DO $$
DECLARE
  canonical_id uuid;
BEGIN
  -- 1) Locate canonical pack
  SELECT id INTO canonical_id
  FROM packs
  WHERE name = 'Wellness & Lifestyle Coach Pack'
  ORDER BY created_at ASC
  LIMIT 1;

  IF canonical_id IS NULL THEN
    SELECT id INTO canonical_id
    FROM packs
    WHERE lower(name) LIKE '%wellness%'
      AND lower(name) LIKE '%lifestyle%'
      AND lower(name) LIKE '%coach%'
      AND lower(name) LIKE '%pack%'
    ORDER BY created_at ASC
    LIMIT 1;
  END IF;

  IF canonical_id IS NULL THEN
    SELECT id INTO canonical_id
    FROM packs
    WHERE lower(name) LIKE 'health%'
    ORDER BY created_at ASC
    LIMIT 1;
    IF canonical_id IS NOT NULL THEN
      UPDATE packs
      SET name = 'Wellness & Lifestyle Coach Pack', slug = 'wellness-lifestyle-coach-pack'
      WHERE id = canonical_id;
    END IF;
  END IF;

  IF canonical_id IS NOT NULL THEN
    -- Identify duplicates (Health* packs excluding canonical)
    WITH dups AS (
      SELECT id FROM packs WHERE id <> canonical_id AND lower(name) LIKE 'health%'
    )
    -- 2) Pre-delete pack_prompts rows in duplicates that would conflict after reassignment
    DELETE FROM pack_prompts dp
    USING pack_prompts cp, dups
    WHERE dp.pack_id = dups.id
      AND cp.pack_id = canonical_id
      AND dp.prompt_id = cp.prompt_id;

    -- 3) Reassign remaining prompts to canonical
    UPDATE pack_prompts pp
    SET pack_id = canonical_id
    WHERE pp.pack_id IN (SELECT id FROM packs WHERE id <> canonical_id AND lower(name) LIKE 'health%');

    -- 4) Move pack access
    UPDATE pack_access pa
    SET pack_id = canonical_id
    WHERE pa.pack_id IN (SELECT id FROM packs WHERE id <> canonical_id AND lower(name) LIKE 'health%');

    -- 5) Delete duplicate packs
    DELETE FROM packs p
    WHERE p.id IN (SELECT id FROM packs WHERE id <> canonical_id AND lower(name) LIKE 'health%');
  END IF;
END $$;