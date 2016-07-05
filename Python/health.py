#This is a test python program for the -
#appending of health information to the mongodb health collection.

import json

with open("../env.json") as json_file:
	json_data = json.load(json_file)


from bson.objectid import ObjectId
#Make the connection
from pymongo import MongoClient
connection = MongoClient(json_data["MONGODB_URI"])
#Call a collection
db = connection.heroku_czw9k6mx.health

#itrate DB and update health kit according to a user_id
go_over_db = db.find()
for doc in go_over_db:
	print(doc["totalStepsForEachDayOfYear"])	
	print type(doc["totalStepsForEachDayOfYear"])
	print(len(doc["totalStepsForEachDayOfYear"]))
	list_x = ["Jun 29, 2016: 13243", "Jun 30, 2016: 34534"]
	for x in list_x:
		db.update({"_id": ObjectId(doc["_id"])}, {"$push": {"totalStepsForEachDayOfYear": x}})

connection.close()
