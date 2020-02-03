import json


class YelpParser:
    def __init__(self, in_path="../Yelp_Data/JSON/", out_path="../Yelp_Data/TEXT/"):
        self.delim = '\t'
        self.in_path = in_path
        self.out_path = out_path
        self.outfile = None

    def cleanStr4SQL(self, string):
        return string.replace("'", "`").replace("\n", " ")

    def splitStr(self, string, split_on=', ') -> str:
        arr = string.split(split_on)
        return str(arr)

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
        print(count_line)
        self.outfile.close()
        file.close()

    def get_dict(self) -> dict:
        print("This is supposed to be implemented by inheriting classes")
        return None

    def parse_line(self, line):
        data = json.loads(line)
        for key, func in self.get_dict().items():
            val = func(data[key])
            self.outfile.write(val + self.delim)
        self.outfile.write('\n')

