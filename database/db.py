import mysql.connector
from mysql.connector import Error

DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': '123456789',
    'database': 'vsr',
    'port': 3306
}

class DatabaseConnection:
    def __init__(self):
        self.connection = None
        try:
            self.connection = mysql.connector.connect(**DB_CONFIG)
            if self.connection.is_connected():
                print("Kết nối thành công")
        except Error as e:
            print("Kết nối thất bại:", e)

def main():
    db_connection = DatabaseConnection()

if __name__ == "__main__":
    main()