import json
import psycopg2

def cleanStr4SQL(s):
    return s.replace("'","`").replace("\n"," ")

def int2BoolStr (value):
    if value == 0:
        return 'False'
    else:
        return 'True'

def insert2BusinessTable():
    #reading the JSON file
    with open('./business.JSON','r') as f:    #TODO: update path for the input file
        #outfile =  open('./yelp_business.SQL', 'w')  #uncomment this line if you are writing the INSERT statements to an output file.
        line = f.readline()
        count_line = 0

        #connect to yelpdb database on postgres server using psycopg2
        #TODO: update the database name, username, and password
        try:
            conn = psycopg2.connect("dbname='yelpdb' user='postgres' host='localhost' password='none'")
        except:
            print('Unable to connect to the database!')
        cur = conn.cursor()

        while line:
            data = json.loads(line)
            # Generate the INSERT statement for the cussent business
            # TODO: The below INSERT statement is based on a simple (and incomplete) businesstable schema. Update the statement based on your own table schema and
            # include values for all businessTable attributes
            sql_str = "INSERT INTO businessTable (business_id, name, address, state, city, zipcode, latitude, longitude, stars, numCheckins, numTips, openStatus) " \
                      "VALUES ('" + data['business_id'] + "','" + cleanStr4SQL(data["name"]) + "','" + cleanStr4SQL(data["address"]) + "','" + \
                      cleanStr4SQL(data["state"]) + "','" + cleanStr4SQL(data["city"]) + "','" + data["postal_code"] + "'," + str(data["latitude"]) + "," + \
                      str(data["longitude"]) + "," + str(data["stars"]) + ", 0 , 0 ,"  +  str(data["is_open"]) + ");"
            try:
                cur.execute(sql_str)
            except:
                print("Insert to businessTABLE failed!")
            conn.commit()
            # optionally you might write the INSERT statement to a file.
            # outfile.write(sql_str)

            line = f.readline()
            count_line +=1

        cur.close()
        conn.close()

    print(count_line)
    #outfile.close()  #uncomment this line if you are writing the INSERT statements to an output file.
    f.close()


insert2BusinessTable()

class PostgresDB:
    TABLES = {

    }
    def __init__(self, dbname="yelpdb", user='postgres', host='localhost', password='none'):
        try:
            connection_str = "dbname='{}' user='{}' host='{}' password='{}'".format(dbname, user, host, password)
            self.db_connection = psycopg2.connect(connection_str)
        except:
            print('Unable to connect to the database!')
        self.cursor = self.db_connection.cursor()

    def insert_into_table(self, values):
        sql_str = 'INSERT INTO {}({}) VALUES {};'.format(self.table_name, ",".join(self.table_columns), values)
        try:
            self.cursor.execute(sql_str)
        except:
            print("Insert to businessTABLE failed!")
        self.db_connection.commit()

    def close_db_connection(self):
        self.cursor.close()
        self.db_connection.close()


