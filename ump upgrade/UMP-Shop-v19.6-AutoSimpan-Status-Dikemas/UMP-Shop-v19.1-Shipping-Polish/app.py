from flask import Flask, request, jsonify, session, send_from_directory, redirect, url_for
from pathlib import Path
import sqlite3, os
from werkzeug.security import generate_password_hash, check_password_hash

BASE = Path(__file__).resolve().parent
SITE = BASE / "static" / "site"
DB = BASE / "ump_shop.db"
app = Flask(__name__, static_folder="static")
app.secret_key = os.environ.get("UMP_SECRET_KEY", "ganti-kunci-rahasia-ump-shop-sebelum-online")
app.config.update(SESSION_COOKIE_HTTPONLY=True, SESSION_COOKIE_SAMESITE="Lax")

def db():
    con = sqlite3.connect(DB)
    con.row_factory = sqlite3.Row
    return con

def init_db():
    with db() as con:
        con.execute("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, role TEXT NOT NULL)")
        # Demo accounts; change passwords before any public deployment.
        for username, password, role in [("admin", "admin123", "admin"), ("owner", "owner123", "owner"), ("customer", "customer123", "customer")]:
            if not con.execute("SELECT id FROM users WHERE username=?", (username,)).fetchone():
                con.execute("INSERT INTO users(username,password_hash,role) VALUES(?,?,?)", (username, generate_password_hash(password), role))

@app.get("/")
def home(): return send_from_directory(SITE, "index.html")

@app.get("/<path:filename>")
def site_file(filename):
    # Serve only files inside the existing website folder.
    return send_from_directory(SITE, filename)

@app.post("/api/login")
def login():
    data = request.get_json(silent=True) or request.form
    username = str(data.get("username", "")).strip()
    password = str(data.get("password", ""))
    requested_role = str(data.get("role", "customer"))
    with db() as con:
        user = con.execute("SELECT * FROM users WHERE username=?", (username,)).fetchone()
    if not user or not check_password_hash(user["password_hash"], password) or user["role"] != requested_role:
        return jsonify(ok=False, message="Login gagal. Periksa jenis akun, username, dan password."), 401
    session.clear(); session["user_id"] = user["id"]; session["username"] = user["username"]; session["role"] = user["role"]
    redirect_page = "dashboard.html" if user["role"] == "admin" else ("owner.html" if user["role"] == "owner" else "customer.html")
    return jsonify(ok=True, role=user["role"], redirect=redirect_page)

@app.post("/api/logout")
def logout():
    session.clear()
    return jsonify(ok=True, redirect="index.html")

@app.get("/api/session")
def session_info():
    if "user_id" not in session: return jsonify(authenticated=False), 401
    return jsonify(authenticated=True, username=session["username"], role=session["role"])

@app.post("/api/messages/delete")
def delete_message():
    # Endpoint guard for future server-backed chat storage; current chat history remains in browser localStorage.
    if "user_id" not in session: return jsonify(ok=False, message="Silakan login kembali."), 401
    data = request.get_json(silent=True) or {}
    if data.get("message_id") is None: return jsonify(ok=False, message="ID pesan wajib diisi."), 400
    return jsonify(ok=True, message="Permintaan hapus diterima. Untuk chat lintas perangkat, riwayat pesan perlu dipindahkan ke database server." )


# --- UMP Shop v21.3 shared realtime state ---
import json

def init_realtime_db():
    with db() as con:
        con.execute("CREATE TABLE IF NOT EXISTS app_state (key TEXT PRIMARY KEY, value TEXT NOT NULL, updated_at TEXT DEFAULT CURRENT_TIMESTAMP)")

@app.get('/api/state')
def get_state():
    init_realtime_db()
    with db() as con:
        rows=con.execute("SELECT key,value,updated_at FROM app_state").fetchall()
    out={}
    for r in rows:
        try: out[r['key']]=json.loads(r['value'])
        except Exception: out[r['key']]=r['value']
    return jsonify(ok=True,state=out)

@app.post('/api/state/<key>')
def put_state(key):
    allowed={'ump_products','ump_transactions','ump_customer_orders','ump_attendance','attendance','ump_employees','ump_wholesale_catalog','ump_customers','ump_chats'}
    if key not in allowed: return jsonify(ok=False,message='Key tidak diizinkan'),400
    payload=request.get_json(silent=True) or {}
    value=payload.get('value',[])
    init_realtime_db()
    with db() as con:
        con.execute("INSERT INTO app_state(key,value,updated_at) VALUES(?,?,CURRENT_TIMESTAMP) ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=CURRENT_TIMESTAMP",(key,json.dumps(value,ensure_ascii=False),))
    return jsonify(ok=True)

if __name__ == "__main__":
    init_db()
    init_realtime_db()
    print("UMP Shop v21.3 berjalan di http://127.0.0.1:5000")
    app.run(host="127.0.0.1", port=5000, debug=True)
