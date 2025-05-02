-- Add current_version column to scripts table
ALTER TABLE scripts ADD COLUMN current_version INTEGER DEFAULT 1;

-- Update existing scripts to have version 1
UPDATE scripts SET current_version = 1 WHERE current_version IS NULL; 