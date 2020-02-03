import json
from yelp_data import YelpParser


class CheckinParser(YelpParser):

    def __init__(self):
        super().__init__()
        self.in_path += "yelp_checkin.JSON"
        self.out_path += "checkin.txt"
        self.outfile = open(self.out_path, 'w')

    def get_dict(self) -> dict:
        return {
            # string, 22 character business id, maps to business in business.json
            'business_id': self.cleanStr4SQL,
            # string which is a comma-separated list of timestamps for each checkin, each with format YYYY-MM-DD HH:MM:SS
            'date': str
        }

"""
{
    // string, 22 character business id, maps to business in business.json
    "business_id": "tnhfDv5Il8EaGSXZGiuQGg"

    // string which is a comma-separated list of timestamps for each checkin, each with format YYYY-MM-DD HH:MM:SS
    "date": "2016-04-26 19:49:16, 2016-08-30 18:36:57, 2016-10-15 02:45:18, 2016-11-18 01:54:50, 2017-04-20 18:39:06, 2017-05-03 17:58:02"
}
"""