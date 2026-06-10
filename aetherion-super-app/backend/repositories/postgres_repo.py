import psycopg2

class PostgresRepo:
    def __init__(self):
        self.conn = psycopg2.connect(
            dbname="supersonic",
            user="supersonic_user",
            password="Mv@20217$", # <-- Matches the YAML-escaped password!
            host="localhost",
            port=5432,
        )
        self.conn.autocommit = True

    def get_user_permissions(self, username: str):
        with self.conn.cursor() as cur:
            cur.execute(
                """
                SELECT permission
                FROM user_effective_permissions
                WHERE username = %s
                ORDER BY permission
                """,
                (username,),
            )
            return [row[0] for row in cur.fetchall()]
