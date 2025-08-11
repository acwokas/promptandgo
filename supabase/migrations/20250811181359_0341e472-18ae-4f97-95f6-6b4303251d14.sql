-- Merge "Health" pack into canonical "Wellness & Lifestyle Coach Pack" and delete duplicates
DO $$
DECLARE
  canonical_id uuid;
BEGIN
  -- 1) Find canonical pack (exact name first)
  SELECT id INTO canonical_id
  FROM packs
  WHERE name = 'Wellness & Lifestyle Coach Pack'
  ORDER BY created_at ASC
  LIMIT 1;

  -- 2) Fallback to fuzzy match if exact not found
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

  -- 3) If still not found, repurpose the oldest Health* pack as canonical by renaming it
  IF canonical_id IS NULL THEN
    SELECT id INTO canonical_id
    FROM packs
    WHERE lower(name) LIKE 'health%'
    ORDER BY created_at ASC
    LIMIT 1;

    IF canonical_id IS NOT NULL THEN
      UPDATE packs
      SET name = 'Wellness & Lifestyle Coach Pack',
          slug = 'wellness-lifestyle-coach-pack'
      WHERE id = canonical_id;
    END IF;
  END IF;

  -- 4) If we have a canonical pack, merge and delete Health* duplicates
  IF canonical_id IS NOT NULL THEN
    -- Reassign contents
    UPDATE pack_prompts
    SET pack_id = canonical_id
    WHERE pack_id IN (
      SELECT id FROM packs
      WHERE id <> canonical_id AND lower(name) LIKE 'health%'
    );

    -- Reassign access
    UPDATE pack_access
    SET pack_id = canonical_id
    WHERE pack_id IN (
      SELECT id FROM packs
      WHERE id <> canonical_id AND lower(name) LIKE 'health%'
    );

    -- Remove any duplicate rows created by reassignment
    DELETE FROM pack_prompts a
    USING pack_prompts b
    WHERE a.ctid < b.ctid
      AND a.pack_id = b.pack_id
      AND a.prompt_id = b.prompt_id;

    -- Delete the duplicate Health* packs
    DELETE FROM packs
    WHERE id IN (
      SELECT id FROM packs
      WHERE id <> canonical_id AND lower(name) LIKE 'health%'
    );
  END IF;
END $$;