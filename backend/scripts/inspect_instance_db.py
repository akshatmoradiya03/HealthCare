import sqlite3, os
p='instance/healthcare.db'
print('path', p, 'exists', os.path.exists(p))
conn=sqlite3.connect(p)
cur=conn.cursor()
cur.execute("SELECT name FROM sqlite_master WHERE type='table'")
print('tables:', cur.fetchall())
cur.execute("PRAGMA table_info('connection')")
print('connection cols:', cur.fetchall())
try:
    cur.execute("SELECT version_num FROM alembic_version")
    print('alembic_version:', cur.fetchone())
except Exception as e:
    print('alembic_version query error', e)
cur.close()
conn.close()
