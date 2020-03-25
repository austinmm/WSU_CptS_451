import json
from yelp_data import YelpParser


class UserParser(YelpParser):

    def __init__(self):
        super().__init__()
        self.in_path += "yelp_user.JSON"
        self.table_name = "Yelper"
        self.weak_entity_pfk: tuple = ("user_id", )
        self.json_to_attr = {
            'user_id': 'user_id',
            'name': 'user_name',
            'yelping_since': 'yelping_since',
            'friends': 'Friendship',
            'useful': 'useful',
            'funny': 'funny',
            'cool': 'cool',
            'fans': 'fans',
            'average_stars': 'average_stars',
            'tipcount': 'tip_count'
        }

    def get_dict(self) -> dict:
        return {
            # string, 22 character unique user id, maps to the user in user.json
            'user_id': self.cleanStr4SQL,
            # string, the user's first name
            'name': self.cleanStr4SQL,
            # string, when the user joined Yelp, formatted like YYYY-MM-DD HH:mm:SS
            'yelping_since': self.cleanStr4SQL,
            # array of strings, an array of the user's friend as user_ids
            'friends': self.get_friends,
            # integer, number of useful votes sent by the user
            'useful': self.cleanStr4SQL,
            # integer, number of funny votes sent by the user
            'funny': self.cleanStr4SQL,
            # integer, number of cool votes sent by the user
            'cool': self.cleanStr4SQL,
            # integer, number of fans the user has
            'fans': self.cleanStr4SQL,
            # float, average rating of all reviews
            'average_stars': self.cleanStr4SQL,
            # integer, number of tips the user has posted
            'tipcount': self.cleanStr4SQL
            }

    def get_friends(self, friends) -> list:
        yelper_friends = []
        for friend in friends:
            friend_id = self.cleanStr4SQL(friend)
            friend_info = {'friend_id': friend_id}
            yelper_friends.append(friend_info)
        return yelper_friends
