from user_data import UserParser
from tip_data import TipParser
from checkin_data import CheckinParser
from business_data import BusinessParser
import psycopg2

def drop_tables(cursor, db_connection):
    with open('../SQL/AbracaData_DROP.sql', 'r') as f:
        lines = f.readlines()
        for line in lines:
            sql_str = line[:-1]
            try:
                cursor.execute(sql_str)
            except:
                print("Failed to '%s'" % sql_str)
            db_connection.commit()

def add_tables(cursor, db_connection):
    with open('../SQL/AbracaData_RELATIONS_v2.sql', 'r') as f:
        lines = f.readlines()
        sql_str = "".join(lines)
        #sql_str = sql_str.replace('\n', "")
        try:
            cursor.execute(sql_str)
        except:
            print("Failed to '%s'" % sql_str)
        db_connection.commit()

def close_db_connection(cursor, db_connection):
    cursor.close()
    db_connection.close()

if __name__ == "__main__":
    try:
        connection_str = "dbname='cpts451_termproject' user='noahtaylor' host='localhost' password='none'"
        db_connection = psycopg2.connect(connection_str)
        cursor = db_connection.cursor()
        drop_tables(cursor=cursor, db_connection=db_connection)
        add_tables(cursor=cursor, db_connection=db_connection)
        close_db_connection(cursor=cursor, db_connection=db_connection)
    except:

        print('Unable to connect to the database!')
    parsers = {"UserParser": UserParser(),
               "BusinessParser": BusinessParser(),
               "TipParser": TipParser(),
               "CheckinParser": CheckinParser()
               }
    for name, parser in parsers.items():
        print(name, "Started")
        parser.parse_file()
        print(name, "Finished")
