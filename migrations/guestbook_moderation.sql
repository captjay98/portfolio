-- Guest book moderation: add an approval status column.
-- Existing rows keep working because they default to 'approved'.
ALTER TABLE guest_book ADD COLUMN status TEXT DEFAULT 'approved';
