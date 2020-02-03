import json
from yelp_data import YelpParser


class TipParser(YelpParser):

    def __init__(self):
        super().__init__()
        self.in_path += "yelp_tip.JSON"
        self.out_path += "tip.txt"
        self.outfile = open(self.out_path, 'w')

    def get_dict(self) -> dict:
        return {
            # string, text of the tip
            'text': self.cleanStr4SQL,
            # string, when the tip was written, formatted like YYYY-MM-DD HH:mm:SS
            'date': str,
            # string, 22 character business id, maps to business in business.json
            'business_id': self.cleanStr4SQL,
            # string, 22 character unique user id, maps to the user in user.json
            'user_id': self.cleanStr4SQL,
            # integer, how many likes it has
            'likes': str,
        }

"""
{
    // string, text of the tip
    "text": "Secret menu - fried chicken sando is da bombbbbbb Their zapatos are good too.",

    // string, when the tip was written, formatted like YYYY-MM-DD
    "date": "2013-09-20",

    // integer, how many likes it has
    "likes": 172,

    // string, 22 character business id, maps to business in business.json
    "business_id": "tnhfDv5Il8EaGSXZGiuQGg",

    // string, 22 character unique user id, maps to the user in user.json
    "user_id": "49JhAJh8vSQ-vM4Aourl0g"
}
"""