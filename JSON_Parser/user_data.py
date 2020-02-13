import json
from yelp_data import YelpParser


class UserParser(YelpParser):

    def __init__(self):
        super().__init__()
        self.in_path += "yelp_user.JSON"
        self.out_path += "user.txt"
        self.outfile = open(self.out_path, 'w')
        self.entity_name = "User"

    def get_dict(self) -> dict:
        return {
            # string, 22 character unique user id, maps to the user in user.json
            'user_id': self.cleanStr4SQL,
            # string, the user's first name
            'name': self.cleanStr4SQL,
            # string, when the user joined Yelp, formatted like YYYY-MM-DD HH:mm:SS
            'yelping_since': str,
            # array of strings, an array of the user's friend as user_ids
            'friends': self.get_friends,
            # integer, number of useful votes sent by the user
            'useful': str,
            # integer, number of funny votes sent by the user
            'funny': str,
            # integer, number of cool votes sent by the user
            'cool': str,
            # integer, number of fans the user has
            'fans': str,
            # float, average rating of all reviews
            'average_stars': str,
            # integer, number of tips the user has posted
            'tipcount': str
            }

    def get_friends(self, friends) -> str:
        friends_str = "\n\tfriends: %s" % str(friends)
        return friends_str


"""
{
    // string, 22 character unique user id, maps to the user in user.json
    "user_id": "Ha3iJu77CxlrFm-vQRs_8g",

    // string, the user's first name
    "name": "Sebastien",

    // string, when the user joined Yelp, formatted like YYYY-MM-DD HH:mm:SS
    "yelping_since": "2013-02-21 22:29:06",

    // array of strings, an array of the user's friend as user_ids
    "friends": [
        "wqoXYLWmpkEH0YvTmHBsJQ",
        "KUXLLiJGrjtSsapmxmpvTA",
        "6e9rJKQC3n0RSKyHLViL-Q"
    ],

    // integer, number of useful votes sent by the user
    "useful": 21,

    // integer, number of funny votes sent by the user
    "funny": 88,

    // integer, number of cool votes sent by the user
    "cool": 15,

    // integer, number of fans the user has
    "fans": 1032,

    // float, average rating of all reviews
    "average_stars": 4.31

    // integer, number of tips the user has posted
    "tipcount": 0
}
"""