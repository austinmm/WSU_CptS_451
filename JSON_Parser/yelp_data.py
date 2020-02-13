import json


class YelpParser:
    def __init__(self, in_path="../Yelp_Data/JSON/", out_path="../Yelp_Data/TEXT/"):
        self.delim = ' | '
        self.entity_name = ""
        self.in_path = in_path
        self.out_path = out_path
        self.outfile = None

    def cleanStr4SQL(self, string) -> str:
        return "'%s'" % string.replace("'", "`").replace("\n", " ")

    def string_to_array(self, string, split_on=', ') -> list:
        array = string.split(split_on)
        return array

    def dict_to_str(self, dictionary, form) -> str:
        string = ""
        for key, value in dictionary.items():
            if type(value) is dict:
                string += self.dict_to_str(value, form)
            else:
                string += form % (key, value)
        # removes last delimiter
        string = string[:-1]
        return string

    def array_to_str(self, array, form) -> str:
        string = ""
        last_item = array[len(array)-1]
        for item in array:
            if item == last_item:
                string += self.cleanStr4SQL(item)
            else:
                string += form % self.cleanStr4SQL(item)
        # removes last delimiter
        return string

    def parse_file(self):
        # read the JSON file
        with open(self.in_path, 'r') as file:
            line = file.readline()
            count_line = 0
            header = list(self.get_dict().keys())
            self.outfile.write("HEADER: (%s)\n" % self.array_to_str(header, form="%s, "))
            # read each JSON abject and extract data
            while line:
                self.parse_line(line, count_line)
                line = file.readline()
                count_line += 1
        print(count_line)
        self.outfile.close()
        file.close()

    def get_dict(self) -> dict:
        print("This is supposed to be implemented by inheriting classes")
        return dict()

    def parse_line(self, line, count):
        data = json.loads(line)
        self.outfile.write("%s %d: " % (self.entity_name, count+1))
        for key, func in self.get_dict().items():
            val = func(data[key])
            self.outfile.write(val + self.delim)
        self.outfile.write('\n')

