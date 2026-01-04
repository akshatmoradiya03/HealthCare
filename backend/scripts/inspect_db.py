import sqlite3
import os
p = 'healthcare.db'
print('exists', os.path.exists(p))
conn = sqlite3.connect(p)
cur = conn.cursor()
cur.execute("PRAGMA table_info('connection')")
cols = cur.fetchall()
print('columns:', cols)
cur.execute("SELECT name FROM sqlite_master WHERE type='table'")
print('tables:', cur.fetchall())
try:
    cur.execute("SELECT version_num FROM alembic_version")
    print('alembic_version:', cur.fetchone())
except Exception as e:
    print('alembic_version query error', e)
cur.close()
conn.close()
