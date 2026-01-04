-- Example SQL Queries for Healthcare Database
-- Use these queries in DB Browser for SQLite or SQLite command line

-- ============================================
-- BASIC QUERIES
-- ============================================

-- View all users
SELECT * FROM user;

-- View all connections
SELECT * FROM connection;

-- View all activities
SELECT * FROM group_activity;

-- View all activity invites
SELECT * FROM activity_invite;

-- ============================================
-- FORMATTED QUERIES (with headers)
-- ============================================

-- View users with readable format
SELECT 
    id,
    name,
    email,
    role,
    created_at
FROM user
ORDER BY created_at DESC;

-- View connections with status
SELECT 
    id,
    professional_id AS 'Pro ID',
    client_id AS 'Client ID',
    status,
    initiated_by AS 'Initiated By',
    created_at AS 'Created At'
FROM connection
ORDER BY created_at DESC;

-- ============================================
-- JOIN QUERIES (combining tables)
-- ============================================

-- View connections with user names
SELECT 
    c.id AS 'Connection ID',
    p.name AS 'Professional',
    p.email AS 'Pro Email',
    cl.name AS 'Client',
    cl.email AS 'Client Email',
    c.status AS 'Status',
    c.created_at AS 'Created At'
FROM connection c
JOIN user p ON c.professional_id = p.id
JOIN user cl ON c.client_id = cl.id
ORDER BY c.created_at DESC;

-- View activities with creator name
SELECT 
    a.id AS 'Activity ID',
    a.title AS 'Title',
    a.description AS 'Description',
    u.name AS 'Created By',
    u.email AS 'Creator Email',
    a.created_at AS 'Created At'
FROM group_activity a
JOIN user u ON a.created_by = u.id
ORDER BY a.created_at DESC;

-- View activity invites with details
SELECT 
    ai.id AS 'Invite ID',
    a.title AS 'Activity Title',
    u.name AS 'Client Name',
    u.email AS 'Client Email',
    ai.status AS 'Status'
FROM activity_invite ai
JOIN group_activity a ON ai.activity_id = a.id
JOIN user u ON ai.client_id = u.id
ORDER BY ai.id DESC;

-- ============================================
-- STATISTICS QUERIES
-- ============================================

-- Count all records
SELECT 
    'Users' AS 'Table',
    COUNT(*) AS 'Count'
FROM user
UNION ALL
SELECT 
    'Connections',
    COUNT(*)
FROM connection
UNION ALL
SELECT 
    'Activities',
    COUNT(*)
FROM group_activity
UNION ALL
SELECT 
    'Invites',
    COUNT(*)
FROM activity_invite;

-- Count users by role
SELECT 
    role,
    COUNT(*) AS count
FROM user
GROUP BY role;

-- Count connections by status
SELECT 
    status,
    COUNT(*) AS count
FROM connection
GROUP BY status;

-- Count activity invites by status
SELECT 
    status,
    COUNT(*) AS count
FROM activity_invite
GROUP BY status;

-- ============================================
-- FILTERED QUERIES
-- ============================================

-- View only accepted connections
SELECT * FROM connection WHERE status = 'accepted';

-- View only pending connections
SELECT * FROM connection WHERE status = 'pending';

-- View only professionals
SELECT * FROM user WHERE role = 'professional';

-- View only clients
SELECT * FROM user WHERE role = 'client';

-- View activities created by a specific user (replace 3 with user ID)
SELECT * FROM group_activity WHERE created_by = 3;

-- View invites for a specific client (replace 8 with client ID)
SELECT * FROM activity_invite WHERE client_id = 8;

-- ============================================
-- SEARCH QUERIES
-- ============================================

-- Search users by name (replace 'Akshat' with search term)
SELECT * FROM user WHERE name LIKE '%Akshat%';

-- Search users by email (replace 'gmail' with search term)
SELECT * FROM user WHERE email LIKE '%gmail%';

-- Search activities by title (replace 'gym' with search term)
SELECT * FROM group_activity WHERE title LIKE '%gym%';

