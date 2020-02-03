from user_data import UserParser
from tip_data import TipParser
from checkin_data import CheckinParser
from business_data import BusinessParser


def main():
    parsers = {"UserParser": UserParser(),
               "TipParser": TipParser(),
               "CheckinParser": CheckinParser(),
               "BusinessParser": BusinessParser()}
    for name, parser in parsers.items():
        print(name, "Started")
        parser.parse_file()
        print(name, "Finished")


main()
