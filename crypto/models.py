import sqlite3

from config import DB_PATH


class DBManager:

    def __init__(self):
        self.path = DB_PATH

    def exec_with_params(self, query, params):
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

    def run_query(self, query):
        connection = sqlite3.connect(self.path)
        cursor = connection.cursor()

        try:
            cursor.execute(query)

            data = cursor.fetchall()

            transactions = []
            columns_names = []

            for column in cursor.description:
                columns_names.append(column[0])

            for row in data:
                index = 0
                transaction = {}
                for name in columns_names:
                    transaction[name] = row[index]
                    index += 1

                transactions.append(transaction)

        except Exception as ex:
            print(ex)

        connection.close()

        return transactions
