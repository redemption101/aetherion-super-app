CREATE TABLE IF NOT EXISTS user_effective_permissions (
    username TEXT, 
    permission TEXT
); 
INSERT INTO user_effective_permissions (username, permission) VALUES ('mandlenkosi', 'GLOBAL_MESH_ARCHITECT');

CREATE TABLE IF NOT EXISTS honeypot_forensics (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP,
    ip TEXT,
    path TEXT,
    method TEXT,
    payload TEXT,
    headers TEXT,
    score INTEGER
);
