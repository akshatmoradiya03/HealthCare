# How to Use SQLite Tools - Complete Guide

## Method 1: DB Browser for SQLite (GUI - Easiest for Beginners)

### Installation

1. **Download DB Browser for SQLite**
   - Visit: https://sqlitebrowser.org/
   - Click "Download" and choose Windows version
   - Install the downloaded file

### Using DB Browser

1. **Open the application**
   - Launch "DB Browser for SQLite" from Start Menu

2. **Open your database**
   - Click "Open Database" button
   - Navigate to: `backend/instance/healthcare.db`
   - Click "Open"

3. **Browse your data**
   - **Browse Data Tab**: Click this tab at the top
   - **Select Table**: Use the dropdown to select a table (user, connection, etc.)
   - **View Records**: See all data in a spreadsheet-like view
   - **Filter/Search**: Use the search box to filter records

4. **Execute SQL**
   - Click "Execute SQL" tab
   - Type SQL queries, for example:
     ```sql
     SELECT * FROM user;
     SELECT * FROM connection WHERE status = 'accepted';
     ```
   - Click "Execute SQL" button (F5)

5. **Edit Data**
   - Go to "Browse Data" tab
   - Double-click any cell to edit
   - Click "Write Changes" to save

---

## Method 2: SQLite Command Line Tool

### Installation (Windows)

**Option A: Download SQLite Command Line Tool**
1. Visit: https://www.sqlite.org/download.html
2. Under "Precompiled Binaries for Windows"
3. Download: `sqlite-tools-win-x64-*.zip` (or win-x86 for 32-bit)
4. Extract the zip file
5. Copy `sqlite3.exe` to a folder in your PATH (or use full path)

**Option B: Using Chocolatey (if installed)**
```bash
choco install sqlite
```

**Option C: Using Windows Package Manager**
```bash
winget install SQLite.SQLite
```

### Using SQLite Command Line

1. **Open Command Prompt or PowerShell**
   - Navigate to your project directory:
     ```bash
     cd C:\Users\INDIA\Desktop\Akshat\PROJECTS\HealthCare\backend\instance
     ```

2. **Open the database**
   ```bash
   sqlite3 healthcare.db
   ```

3. **Useful SQLite Commands**

   **List all tables:**
   ```sql
   .tables
   ```

   **View table structure:**
   ```sql
   .schema user
   .schema connection
   ```

   **View all users:**
   ```sql
   SELECT * FROM user;
   ```

   **View with formatting:**
   ```sql
   .mode column
   .headers on
   SELECT * FROM user;
   ```

   **Export to CSV:**
   ```sql
   .mode csv
   .headers on
   .output users.csv
   SELECT * FROM user;
   .output stdout
   ```

   **Show all connections:**
   ```sql
   SELECT * FROM connection;
   ```

   **Count records:**
   ```sql
   SELECT COUNT(*) FROM user;
   SELECT COUNT(*) FROM connection;
   ```

   **Exit SQLite:**
   ```sql
   .exit
   ```
   or
   ```sql
   .quit
   ```

4. **One-line commands (without entering SQLite)**
   ```bash
   # View all tables
   sqlite3 healthcare.db ".tables"
   
   # View all users
   sqlite3 healthcare.db "SELECT * FROM user;"
   
   # View with headers
   sqlite3 healthcare.db -header -column "SELECT * FROM user;"
   
   # Execute SQL file
   sqlite3 healthcare.db < query.sql
   ```

---

## Method 3: VS Code Extension (If using VS Code)

1. **Install Extension**
   - Open VS Code
   - Go to Extensions (Ctrl+Shift+X)
   - Search for "SQLite Viewer" or "SQLite"
   - Install one of these:
     - "SQLite Viewer" by qwtel
     - "SQLite" by alexcvzz

2. **Open Database**
   - Right-click on `backend/instance/healthcare.db`
   - Select "Open Database" or "Open with SQLite Viewer"
   - View tables and data in VS Code sidebar

---

## Method 4: Online SQLite Viewer

1. Visit: https://sqliteviewer.app/ or https://inloop.github.io/sqlite-viewer/
2. Click "Open Database"
3. Upload your `healthcare.db` file
4. Browse tables and run queries

---

## Quick Reference: Common SQL Queries for Your Database

### View All Users
```sql
SELECT id, name, email, role, created_at FROM user;
```

### View All Connections
```sql
SELECT 
    c.id, 
    c.professional_id, 
    c.client_id, 
    c.status, 
    c.created_at 
FROM connection c;
```

### View Connections with User Names
```sql
SELECT 
    c.id,
    p.name AS professional_name,
    cl.name AS client_name,
    c.status
FROM connection c
JOIN user p ON c.professional_id = p.id
JOIN user cl ON c.client_id = cl.id;
```

### View All Activities
```sql
SELECT 
    a.id,
    a.title,
    a.description,
    u.name AS created_by_name,
    a.created_at
FROM group_activity a
JOIN user u ON a.created_by = u.id;
```

### View Activity Invites
```sql
SELECT 
    ai.id,
    a.title AS activity_title,
    u.name AS client_name,
    ai.status
FROM activity_invite ai
JOIN group_activity a ON ai.activity_id = a.id
JOIN user u ON ai.client_id = u.id;
```

### Count Records
```sql
SELECT 
    (SELECT COUNT(*) FROM user) AS total_users,
    (SELECT COUNT(*) FROM connection) AS total_connections,
    (SELECT COUNT(*) FROM group_activity) AS total_activities,
    (SELECT COUNT(*) FROM activity_invite) AS total_invites;
```

### View Users by Role
```sql
SELECT role, COUNT(*) as count 
FROM user 
GROUP BY role;
```

---

## Recommended: DB Browser for SQLite

**For beginners**, I recommend **DB Browser for SQLite** because:
- ✅ Free and easy to use
- ✅ Graphical interface (no command line needed)
- ✅ Visual table browser
- ✅ Built-in SQL editor
- ✅ Can edit data directly
- ✅ Export to CSV/JSON
- ✅ Works on Windows/Mac/Linux

**Download:** https://sqlitebrowser.org/

---

## Quick Start Example

1. Download and install DB Browser for SQLite
2. Open the application
3. Click "Open Database"
4. Navigate to: `C:\Users\INDIA\Desktop\Akshat\PROJECTS\HealthCare\backend\instance\healthcare.db`
5. Click "Browse Data" tab
6. Select "user" from the table dropdown
7. View all your users! 🎉

---

## Your Database Location

**Main Database (with all your data):**
```
backend/instance/healthcare.db
```

**Full Path:**
```
C:\Users\INDIA\Desktop\Akshat\PROJECTS\HealthCare\backend\instance\healthcare.db
```

