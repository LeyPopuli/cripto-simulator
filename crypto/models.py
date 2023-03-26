import sqlite3

from config import DB_PATH


class DBManager:

    def __init__(self):
        self.path = DB_PATH

    def run_query_with_params(self, query, params):
        connection = sqlite3.connect(self.path)
        cursor = connection.cursor()

        result = False

        try:
            cursor.execute(query, params)
            connection.commit()
            result = True

        except Exception as ex:
            print(ex)
            connection.rollback()

        connection.close()

        return result
