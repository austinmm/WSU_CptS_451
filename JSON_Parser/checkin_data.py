import json
from yelp_data import YelpParser


class CheckinParser(YelpParser):

    def __init__(self):
        super().__init__()
        self.in_path += "yelp_checkin.JSON"
        self.table_name = "CheckIn"
        self.weak_entity_pfk: tuple = ("business_id", )
        self.json_to_attr = {
            'business_id': 'business_id',
            'date': 'checkin_date'
        }

    def get_dict(self) -> dict:
        return {
            # string, 22 character business id, maps to business in business.json
            'business_id': self.cleanStr4SQL,
            # string which is a comma-separated list of timestamps for each checkin, each with format YYYY-MM-DD HH:MM:SS
            'date': self.get_date_info
        }

    def get_date_info(self, date_info) -> list:
        checkins = self.string_to_array(date_info, split_on=',')
        checkin_list: [{}] = []
        for checkin in checkins:
            checkin_list.append({'checkin_date': self.cleanStr4SQL(checkin)})
        return checkin_list

    def sql_handler(self, sql_values: {str: {}}):
        pfk_dict = {key: sql_values[self.table_name][key] for key in self.weak_entity_pfk}
        for checkin in sql_values['checkin_date']:
            checkin.update(pfk_dict)
            self.insert_into_table(table=self.table_name, attributes=checkin)
