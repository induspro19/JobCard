-- Create Workers Table
CREATE TABLE IF NOT EXISTS jc_workers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    pin TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Projects Table
CREATE TABLE IF NOT EXISTS jc_projects (
    id BIGSERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Activities Table (Includes sub-activities for fabrication)
CREATE TABLE IF NOT EXISTS jc_activities (
    id BIGSERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    locked BOOLEAN DEFAULT FALSE,
    locked_projects TEXT[] DEFAULT '{}',
    sub_activities TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Main Entries Table (Approved job card records)
CREATE TABLE IF NOT EXISTS jc_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entry_date DATE NOT NULL,
    worker_name TEXT NOT NULL REFERENCES jc_workers(name) ON UPDATE CASCADE,
    project_name TEXT NOT NULL,
    activity_name TEXT NOT NULL,
    sub_activity TEXT,
    hours NUMERIC(4,2) NOT NULL,
    remark TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Pending Entries Table (Approval Queue)
CREATE TABLE IF NOT EXISTS jc_pending_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entry_date DATE NOT NULL,
    worker_name TEXT NOT NULL,
    project_name TEXT NOT NULL,
    activity_name TEXT NOT NULL,
    sub_activity TEXT,
    hours NUMERIC(4,2) NOT NULL,
    remark TEXT,
    status TEXT DEFAULT 'pending',
    submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Attendance Table
CREATE TABLE IF NOT EXISTS jc_attendance (
    id BIGSERIAL PRIMARY KEY,
    log_date DATE NOT NULL,
    worker_name TEXT NOT NULL REFERENCES jc_workers(name) ON UPDATE CASCADE,
    present BOOLEAN DEFAULT FALSE,
    ot_allowed BOOLEAN DEFAULT FALSE,
    sunday_approved BOOLEAN DEFAULT FALSE,
    UNIQUE(log_date, worker_name)
);