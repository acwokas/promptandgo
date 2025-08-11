-- Merge and delete duplicate Health/Wellness pack, keep canonical name
DO $$
DECLARE
  canonical_id uuid;
BEGIN
  -- Prefer the correctly titled pack if present
  SELECT id INTO canonical_id
  FROM packs 
  WHERE name = 'Health, Wellness & Lifestyle Coach Pack'
  ORDER BY created_at ASC
  LIMIT 1;

  IF canonical_id IS NULL THEN
    -- Fallback: pick the oldest matching pack by fuzzy name
    SELECT id INTO canonical_id
    FROM packs
    WHERE lower(name) LIKE '%health%'
      AND lower(name) LIKE '%wellness%'
      AND lower(name) LIKE '%lifestyle%'
      AND lower(name) LIKE '%coach%'
      AND lower(name) LIKE '%pack%'
    ORDER BY created_at ASC
    LIMIT 1;
  END IF;

  IF canonical_id IS NOT NULL THEN
    -- Reassign pack_prompts from other duplicates to the canonical pack
    UPDATE pack_prompts
    SET pack_id = canonical_id
    WHERE pack_id IN (
      SELECT id FROM packs
      WHERE lower(name) LIKE '%health%'
        AND lower(name) LIKE '%wellness%'
        AND lower(name) LIKE '%lifestyle%'
        AND lower(name) LIKE '%coach%'
        AND lower(name) LIKE '%pack%'
        AND id <> canonical_id
    );

    -- Deduplicate pack_prompts rows that might have become duplicates
    DELETE FROM pack_prompts a
    USING pack_prompts b
    WHERE a.ctid < b.ctid
      AND a.pack_id = b.pack_id
      AND a.prompt_id = b.prompt_id;

    -- Delete the duplicate packs themselves
    DELETE FROM packs
    WHERE id IN (
      SELECT id FROM packs
      WHERE lower(name) LIKE '%health%'
        AND lower(name) LIKE '%wellness%'
        AND lower(name) LIKE '%lifestyle%'
        AND lower(name) LIKE '%coach%'
        AND lower(name) LIKE '%pack%'
        AND id <> canonical_id
    );
  END IF;
END $$;