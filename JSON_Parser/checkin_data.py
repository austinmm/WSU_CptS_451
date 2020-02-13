import json
from yelp_data import YelpParser


class CheckinParser(YelpParser):

    def __init__(self):
        super().__init__()
        self.in_path += "yelp_checkin.JSON"
        self.out_path += "checkin.txt"
        self.outfile = open(self.out_path, 'w')
        self.entity_name = "Checkin"

    def get_dict(self) -> dict:
        return {
            # string, 22 character business id, maps to business in business.json
            'business_id': self.cleanStr4SQL,
            # string which is a comma-separated list of timestamps for each checkin, each with format YYYY-MM-DD HH:MM:SS
            'date': self.get_date_info
        }

    def get_date_info(self, date_info) -> str:
        all_date_info = self.string_to_array(date_info, split_on=',')
        string = ""
        for date_time in all_date_info:
            date_time_array = self.string_to_array(date_time, split_on=' ')
            date_info = date_time_array[0]
            date_info = self.string_to_array(date_info, split_on='-')
            date_str = ""
            for di in date_info:
                date_str += "'%s'," % di
            time_info = date_time_array[1]
            string += '(%s%s)' %(date_str, self.cleanStr4SQL(time_info))
        return string


"""
{
    // string, 22 character business id, maps to business in business.json
    "business_id": "tnhfDv5Il8EaGSXZGiuQGg"

    // string which is a comma-separated list of timestamps for each checkin, each with format YYYY-MM-DD HH:MM:SS
    "date": "2016-04-26 19:49:16, 2016-08-30 18:36:57, 2016-10-15 02:45:18, 2016-11-18 01:54:50, 2017-04-20 18:39:06, 2017-05-03 17:58:02"
}
"""