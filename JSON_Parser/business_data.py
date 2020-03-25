import time
from yelp_data import YelpParser


class BusinessParser(YelpParser):

    def __init__(self):
        super().__init__()
        self.in_path += "yelp_business.JSON"
        self.table_name = "Business"
        self.weak_entity_pfk: tuple = ("business_id", )
        self.json_to_attr = {
            'business_id': 'business_id',
            'name': 'business_name',
            'address': 'address',
            'state': 'state',
            'city': 'city',
            'postal_code': 'postal_code',
            'latitude': 'latitude',
            'longitude': 'longitude',
            'stars': 'stars',
            'review_count': 'review_count',
            'is_open': 'is_open',
            'categories': 'Business_Category',
            'attributes': 'Business_Attribute',
            'hours': 'Business_Hours'
        }

    def get_dict(self) -> dict:
        return {
            # string, 22 character unique string business id
            'business_id': self.cleanStr4SQL,
            # string, the business's name
            'name': self.cleanStr4SQL,
            # string, the full address of the business
            'address': self.cleanStr4SQL,
            # string, 2 character state code, if applicable
            'state': self.cleanStr4SQL,
            # string, the city
            'city': self.cleanStr4SQL,
            # string, the postal code
            'postal_code': self.cleanStr4SQL,
            # float, latitude
            'latitude': self.cleanStr4SQL,
            # float, longitude
            'longitude': self.cleanStr4SQL,
            # float, star rating, rounded to half-stars
            'stars': self.cleanStr4SQL,
            # integer, number of reviews
            'review_count': self.cleanStr4SQL,
            # integer, 0 or 1 for closed or open, respectively
            'is_open': self.cleanStr4SQL,
            # an array of strings of business categories
            'categories': self.get_categories,
            # object, business attributes to values. note: some attribute values might be objects
            'attributes': self.get_attributes,
            # an object of key day to value hours, hours are using a 24hr clock
            'hours': self.get_hours
        }

    def get_categories(self, categories) -> list:
        category_array = self.string_to_array(categories, split_on=',')
        category_array = [{'category': self.cleanStr4SQL(category)} for category in category_array]
        return category_array

    def get_attributes(self, attributes_dict) -> list:
        unwraped_dict = self.unwrap_dict(attributes_dict)
        attributes_list: list = [{'property': self.cleanStr4SQL(key), 'val': self.cleanStr4SQL(val)} for key, val in unwraped_dict.items()]
        return attributes_list

    def get_hours(self, hours_dict) -> list:
        business_hours: [dict] = []
        for day, times in hours_dict.items():
            time_array = self.string_to_array(times, split_on='-')
            hours = dict()
            hours['day_of_week'] = self.cleanStr4SQL(day)
            hours['opens_at'] = self.cleanStr4SQL(time_array[0])
            hours['closes_at'] = self.cleanStr4SQL(time_array[1])
            business_hours.append(hours)
        return business_hours
