import json
import psycopg2
import sys

class YelpParser:
    def __init__(self, in_path="../yelp_CptS451_2020/", dbname="CptS451_TermProject",
                 user='postgres', host='localhost', password='v4sNzfzyE2qLcb6mqo7v7BXT'):
        try:
            connection_str = "dbname='{}' user='{}' host='{}' password='{}'".format(dbname, user, host, password)
            self.db_connection = psycopg2.connect(connection_str)
        except:
            print('Unable to connect to the database!')
            sys.exit()
        self.cursor = self.db_connection.cursor()
        self.table_name = ""
        self.in_path = in_path
        self.weak_entity_pfk = tuple()
        self.json_to_attr = dict()
        self.failed_sql: [()] = []

    def close_db_connection(self):
        self.cursor.close()
        self.db_connection.close()

    def cleanStr4SQL(self, value) -> str:
        sql_str = str(value).strip()
        sql_str = sql_str.replace("'", "`")
        sql_str = "'{}'".format(sql_str)
        return sql_str

    def string_to_array(self, string, split_on=', ') -> list:
        array = string.split(split_on)
        return array

    def unwrap_dict(self, dictionary) -> dict:
        unwraped_dict: dict = {}
        for key, value in dictionary.items():
            if type(value) is dict:
                unwraped_dict.update(self.unwrap_dict(value))
            else:
                unwraped_dict[key] = value
        return unwraped_dict

    def array_to_str(self, array, form) -> str:
        string = ""
        last_item = array[len(array)-1]
        for item in array:
            if item == last_item:
                string += self.cleanStr4SQL(item)
            else:
                string += form % self.cleanStr4SQL(item)
        return string

    def parse_file(self):
        # read the JSON file
        with open(self.in_path, 'r') as file:
            line = file.readline()
            count_line = 0
            # read each JSON abject and extract data
            while line:
                self.parse_line(line)
                line = file.readline()
                count_line += 1
        # sql that must be executed after dependent entries have been entered into database
        self.dependent_sql()
        self.close_db_connection()
        print(count_line)

    def get_dict(self) -> dict:
        print("This is supposed to be implemented by inheriting classes")
        return dict()

    def parse_line(self, line):
        data = json.loads(line)
        sql_values: {str: {}} = {self.table_name: {}}
        for key, func in self.get_dict().items():
            val = func(data[key])
            attr = self.json_to_attr[key]
            if type(val) is list:
                sql_values[attr] = val
            else:
                sql_values[self.table_name].update({attr: val})
        self.sql_handler(sql_values=sql_values)

    def sql_handler(self, sql_values: {str: {}}):
        pfk_dict = {key: sql_values[self.table_name][key] for key in self.weak_entity_pfk}
        for table, attributes in sql_values.items():
            if table == self.table_name:
                self.insert_into_table(table=table, attributes=attributes)
            else:
                for attr in attributes:
                    attr.update(pfk_dict)
                    self.insert_into_table(table=table, attributes=attr)

    def insert_into_table(self, table: str, attributes: dict):
        keys = ",".join(attributes.keys())
        values = ",".join(attributes.values())
        sql_str = 'INSERT INTO {}({}) VALUES ({});'.format(table, keys, values)
        try:
            self.cursor.execute(sql_str)
        except psycopg2.DatabaseError as error:
            # ForeignKeyViolation
            if error.pgcode == '23503':
                self.failed_sql.append((table, attributes))
            else:
                print("Failed to 'INSERT into '%s' table with...\n\t* %s" % (self.table_name, sql_str))
        self.db_connection.commit()

    def dependent_sql(self):
        for table, attributes in self.failed_sql:
            self.insert_into_table(table=table, attributes=attributes)
