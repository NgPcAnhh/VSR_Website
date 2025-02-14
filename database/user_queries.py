from .db import DatabaseConnection
import mysql.connector
from mysql.connector import Error
import time

db = DatabaseConnection()

def execute_query(query, params):
    cursor = db.connection.cursor(dictionary=True)
    try:
        cursor.execute(query, params)
        if cursor.with_rows:
            result = cursor.fetchall()
        else:
            result = cursor.rowcount  # Return the number of affected rows for insert/update
        db.connection.commit()  # Commit the transaction
        return result
    except Error as e:
        print("Lỗi khi thực thi truy vấn:", e)
        return None
    finally:
        cursor.close()

def get_user_by_login_name(login_name):
    query = "SELECT id, login_name, password FROM user WHERE login_name = %s"
    result = execute_query(query, (login_name,))
    return result


def get_user_by_phone_number(phone_number):
    query = "SELECT id FROM user WHERE phone_number = %s"
    result = execute_query(query, (phone_number,))
    return result


def get_max_feedback_id():
    query = "SELECT MAX(id) as max_id FROM feedbacks"
    result = execute_query(query, ())
    if result and result[0]['max_id'] is not None:
        return result[0]['max_id']
    else:
        return 0
