-- Priority Items Schema
CREATE TABLE IF NOT EXISTS priority_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  item_number INTEGER NOT NULL,
  recommendation TEXT NOT NULL,
  pillar TEXT NOT NULL,
  effort TEXT NOT NULL,
  cost_impact TEXT NOT NULL,
  business_value TEXT NOT NULL,
  priority_level TEXT NOT NULL,
  category TEXT NOT NULL,
  technical_category TEXT DEFAULT 'Infrastructure',
  description TEXT,
  implementation_steps TEXT,
  dependencies TEXT,
  technical_notes TEXT,
  related_services TEXT,
  compliance_notes TEXT,
  is_checked INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create index on priority_level and category for faster queries
CREATE INDEX IF NOT EXISTS idx_priority_category ON priority_items(priority_level, category);

-- Create index on technical_category for filtering
CREATE INDEX IF NOT EXISTS idx_technical_category ON priority_items(technical_category);
