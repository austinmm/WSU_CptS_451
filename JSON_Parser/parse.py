import json

def cleanStr4SQL(s):
    return s.replace("'", "`").replace("\n", " ")


def parseBusinessData():
    # read the JSON file
    with open('../Yelp_Data/JSON/yelp_business.JSON', 'r') as f:
        outfile = open('../Yelp_Data/Text/business.txt', 'w')
        line = f.readline()
        count_line = 0
        # read each JSON abject and extract data
        while line:
            data = json.loads(line)
            outfile.write(cleanStr4SQL(data['business_id']) + '\t')  # business id
            outfile.write(cleanStr4SQL(data['name']) + '\t')  # name
            outfile.write(cleanStr4SQL(data['address']) + '\t')  # full_address
            outfile.write(cleanStr4SQL(data['state']) + '\t')  # state
            outfile.write(cleanStr4SQL(data['city']) + '\t')  # city
            outfile.write(cleanStr4SQL(data['postal_code']) + '\t')  # zipcode
            outfile.write(str(data['latitude']) + '\t')  # latitude
            outfile.write(str(data['longitude']) + '\t')  # longitude
            outfile.write(str(data['stars']) + '\t')  # stars
            outfile.write(str(data['review_count']) + '\t')  # reviewcount
            outfile.write(str(data['is_open']) + '\t')  # openstatus

            categories = data["categories"].split(', ')
            outfile.write(str(categories) + '\t')  # category list

            outfile.write(str([]))  # write your own code to process attributes
            outfile.write(str([]))  # write your own code to process hours
            outfile.write('\n')

            line = f.readline()
            count_line += 1
    print(count_line)
    outfile.close()
    f.close()


def parseUserData():
    # write code to parse yelp_user.JSON
    pass


def parseCheckinData():
    # write code to parse yelp_checkin.JSON
    pass


def parseTipData():
    # write code to parse yelp_tip.JSON
    pass


parseBusinessData()
parseUserData()
parseCheckinData()
parseTipData()
