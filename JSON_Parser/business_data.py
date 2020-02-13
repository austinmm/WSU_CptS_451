import json
from yelp_data import YelpParser


class BusinessParser(YelpParser):

    def __init__(self):
        super().__init__()
        self.in_path += "yelp_business.JSON"
        self.out_path += "business.txt"
        self.outfile = open(self.out_path, 'w')
        self.entity_name = "Business"

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
            'latitude': str,
            # float, longitude
            'longitude': str,
            # float, star rating, rounded to half-stars
            'stars': str,
            # integer, number of reviews
            'review_count': str,
            # integer, 0 or 1 for closed or open, respectively
            'is_open': str,
            # an array of strings of business categories
            'categories': self.get_categories,
            # object, business attributes to values. note: some attribute values might be objects
            'attributes': self.get_attributes,
            # an object of key day to value hours, hours are using a 24hr clock
            'hours': self.get_hours
        }

    def get_categories(self, categories) -> str:
        category_array = self.string_to_array(categories, split_on=',')
        category_str = "\n\tcategories: %s" % str(category_array)
        return category_str

    def get_attributes(self, attributes_dict) -> str:
        attributes_str = "\n\tattributes: {%s}" % (self.dict_to_str(attributes_dict, form='(%s, %s),'))
        return attributes_str

    def get_hours(self, hours_dict) -> str:
        hours = []
        for day, time in hours_dict.items():
            time_array = self.string_to_array(time, split_on='-')
            for t in time_array:
                self.cleanStr4SQL(t)
            day_time = (day, time_array)
            hours.append(day_time)
        hours_str = "\n\thours: %s" % str(hours)
        return hours_str


"""
{
    // string, 22 character unique string business id
    "business_id": "tnhfDv5Il8EaGSXZGiuQGg",

    // string, the business's name
    "name": "Garaje",

    // string, the full address of the business
    "address": "475 3rd St",

    // string, the city
    "city": "San Francisco",

    // string, 2 character state code, if applicable
    "state": "CA",

    // string, the postal code
    "postal code": "94107",

    // float, latitude
    "latitude": 37.7817529521,

    // float, longitude
    "longitude": -122.39612197,

    // float, star rating, rounded to half-stars
    "stars": 4.5,

    // integer, number of reviews
    "review_count": 1198,

    // integer, 0 or 1 for closed or open, respectively
    "is_open": 1,

    // object, business attributes to values. note: some attribute values might be objects
    "attributes": {
        "RestaurantsTakeOut": true,
        "BusinessParking": {
            "garage": false,
            "street": true,
            "validated": false,
            "lot": false,
            "valet": false
        },
    },

    // an array of strings of business categories
    "categories": [
        "Mexican",
        "Burgers",
        "Gastropubs"
    ],

    // an object of key day to value hours, hours are using a 24hr clock
    "hours": {
        "Monday": "10:00-21:00",
        "Tuesday": "10:00-21:00",
        "Friday": "10:00-21:00",
        "Wednesday": "10:00-21:00",
        "Thursday": "10:00-21:00",
        "Sunday": "11:00-18:00",
        "Saturday": "10:00-21:00"
    }
}
"""
"""
    def parse_line(self, line):
        data = json.loads(line)
        self.outfile.write(self.cleanStr4SQL(data['business_id']) + '\t')  # business id
        self.outfile.write(self.cleanStr4SQL(data['name']) + '\t')  # name
        self.outfile.write(self.cleanStr4SQL(data['address']) + '\t')  # full_address
        self.outfile.write(self.cleanStr4SQL(data['state']) + '\t')  # state
        self.outfile.write(self.cleanStr4SQL(data['city']) + '\t')  # city
        self.outfile.write(self.cleanStr4SQL(data['postal_code']) + '\t')  # zipcode
        self.outfile.write(str(data['latitude']) + '\t')  # latitude
        self.outfile.write(str(data['longitude']) + '\t')  # longitude
        self.outfile.write(str(data['stars']) + '\t')  # stars
        self.outfile.write(str(data['review_count']) + '\t')  # reviewcount
        self.outfile.write(str(data['is_open']) + '\t')  # openstatus

        categories = data["categories"].split(', ')
        self.outfile.write(str(categories) + '\t')  # category list

        self.outfile.write(str([]))  # write your own code to process attributes
        self.outfile.write(str([]))  # write your own code to process hours
        self.outfile.write('\n')
"""