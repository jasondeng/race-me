#This is a test python program for the -
#population of mongodb with user fitness DB.
# analaysis
# match groups.

def give_user_rank(user_s,user_d):
	runner_distance_03 = 1;
	runner_distance_35 = 2;
	runner_distance_510 = 3;
	runner_distance_1015 = 4;
	runner_distance_15 = 5;
	runner_km34 = 1
	runner_km45 = 2
	runner_km56 = 3
	runner_km67 = 4
	runner_km78 = 5
	runner_km89 = 6
	runner_km910 = 7
	runner_km1011 = 8
	runner_km1112 = 9  
	runner_km1213 = 10
	if (user_s <= 4 or user_s > 20):
		return 0
	if (user_d > 0 and user_d < 3000):
		if (user_s > 15 and user_s <= 20):
			return (runner_distance_03 * 10 + runner_km34 - 1)
		if (user_s > 12 and user_s <= 15):
			return (runner_distance_03 * 10 + runner_km45 - 1)
		if (user_s > 10 and user_s <= 12):
			return (runner_distance_03 * 10 + runner_km56 - 1)
		if (user_s > 8.5 and user_s <= 10):
			return (runner_distance_03 * 10 + runner_km67 - 1)
		if (user_s > 7.5 and user_s <= 8.5):
			return (runner_distance_03 * 10 +  runner_km78 - 1)
		if (user_s > 6.5 and user_s <= 7.5):
			return (runner_distance_03 * 10 +  runner_km89 - 1)
		if (user_s > 6 and user_s <= 6.5):
			return (runner_distance_03 * 10 +  runner_km910 - 1)			
		if (user_s > 5.5 and user_s <= 6):
			return (runner_distance_03 * 10 +  runner_km1011 - 1)		
		if (user_s > 5 and user_s <= 5.5):
			return (runner_distance_03 * 10 +  runner_km1112 - 1)
		if (user_s > 4.5 and user_s <= 5):
			return (runner_distance_03 * 10 +  runner_km1213 - 1)
	elif (user_d >= 3000 and user_d < 5000):
		if (user_s > 15 and user_s <= 20):
			return (runner_distance_35 * 10 +  runner_km34 - 1)
		if (user_s > 12 and user_s <= 15):
			return (runner_distance_35 * 10 +  runner_km45 - 1)
		if (user_s > 10 and user_s <= 12):
			return (runner_distance_35 * 10 +  runner_km56 - 1)
		if (user_s > 8.5 and user_s <= 10):
			return (runner_distance_35 * 10 +  runner_km67 - 1)
		if (user_s > 7.5 and user_s <= 8.5):
			return (runner_distance_35 * 10 +  runner_km78 - 1)
		if (user_s > 6.5 and user_s <= 7.5):
			return (runner_distance_35 * 10 +  runner_km89 - 1)
		if (user_s > 6 and user_s <= 6.5):
			return (runner_distance_35 * 10 +  runner_km910 - 1)			
		if (user_s > 5.5 and user_s <= 6):
			return (runner_distance_35 * 10 +  runner_km1011 - 1)		
		if (user_s > 5 and user_s <= 5.5):
			return (runner_distance_35 * 10 +  runner_km1112 - 1)
		if (user_s > 4.5 and user_s <= 5):
			return (runner_distance_35 * 10 +  runner_km1213 - 1)	
	elif (user_d >= 5000 and user_d < 10000):
		if (user_s > 15 and user_s <= 20):
			return (runner_distance_510 * 10 +  runner_km34 - 1)
		if (user_s > 12 and user_s <= 15):
			return (runner_distance_510 * 10 +  runner_km45 - 1)
		if (user_s > 10 and user_s <= 12):
			return (runner_distance_510 * 10 +  runner_km56 - 1)
		if (user_s > 8.5 and user_s <= 10):
			return (runner_distance_510 * 10 +  runner_km67 - 1)
		if (user_s > 7.5 and user_s <= 8.5):
			return (runner_distance_510 * 10 +  runner_km78 - 1)
		if (user_s > 6.5 and user_s <= 7.5):
			return (runner_distance_510 * 10 +  runner_km89 - 1)
		if (user_s > 6 and user_s <= 6.5):
			return (runner_distance_510 * 10 +  runner_km910 - 1)			
		if (user_s > 5.5 and user_s <= 6):
			return (runner_distance_510 * 10 +  runner_km1011 - 1)		
		if (user_s > 5 and user_s <= 5.5):
			return (runner_distance_510 * 10 +  runner_km1112 - 1)
		if (user_s > 4.5 and user_s <= 5):
			return (runner_distance_510 * 10 +  runner_km1213 - 1)
	elif (user_d >= 10000 and user_d < 15000):
		if (user_s > 15 and user_s <= 20):
			return (runner_distance_1015 * 10 +  runner_km34 - 1)
		if (user_s > 12 and user_s <= 15):
			return (runner_distance_1015 * 10 +  runner_km45 - 1)
		if (user_s > 10 and user_s <= 12):
			return (runner_distance_1015 * 10 +  runner_km56 - 1)
		if (user_s > 8.5 and user_s <= 10):
			return (runner_distance_1015 * 10 +  runner_km67 - 1)
		if (user_s > 7.5 and user_s <= 8.5):
			return (runner_distance_1015 * 10 +  runner_km78 - 1)
		if (user_s > 6.5 and user_s <= 7.5):
			return (runner_distance_1015 * 10 +  runner_km89 - 1)
		if (user_s > 6 and user_s <= 6.5):
			return (runner_distance_1015 * 10 +  runner_km910 - 1)			
		if (user_s > 5.5 and user_s <= 6):
			return (runner_distance_1015 * 10 +  runner_km1011 - 1)		
		if (user_s > 5 and user_s <= 5.5):
			return (runner_distance_1015 * 10 +  runner_km1112 - 1)
		if (user_s > 4.5 and user_s <= 5):
			return (runner_distance_1015 * 10 +  runner_km1213 - 1)
	elif (user_d >= 15000):
		if (user_s > 15 and user_s <= 20):
			return (runner_distance_15 * 10 +  runner_km34 - 1)
		if (user_s > 12 and user_s <= 15):
			return (runner_distance_15 * 10 +  runner_km45 - 1)
		if (user_s > 10 and user_s <= 12):
			return (runner_distance_15 * 10 +  runner_km56 - 1)
		if (user_s > 8.5 and user_s <= 10):
			return (runner_distance_15 * 10 +  runner_km67 - 1)
		if (user_s > 7.5 and user_s <= 8.5):
			return (runner_distance_15 * 10 +  runner_km78 - 1)
		if (user_s > 6.5 and user_s <= 7.5):
			return (runner_distance_15 * 10 +  runner_km89 - 1)
		if (user_s > 6 and user_s <= 6.5):
			return (runner_distance_15 * 10 +  runner_km910 - 1)			
		if (user_s > 5.5 and user_s <= 6):
			return (runner_distance_15 * 10 +  runner_km1011 - 1)		
		if (user_s > 5 and user_s <= 5.5):
			return (runner_distance_15 * 10 +  runner_km1112 - 1)
		if (user_s > 4.5 and user_s <= 5):
			return (runner_distance_15 * 10 +  runner_km1213 - 1)


import json

with open("env.json") as json_file:
	json_data = json.load(json_file)

#Make the connection
from pymongo import MongoClient
connection = MongoClient(json_data["MONGODB_URI"])
#Call a collection
db = connection.heroku_czw9k6mx.Test_ranking

#itrate DB and update rank
go_over_db = db.find()
for doc in go_over_db:
	User_id = doc['_id']
	print User_id
	User_Speed = int(doc['Avg_Speed'])
	User_Distance = int(doc['Avg_Distance'])
	User_rank = give_user_rank(User_Speed,User_Distance)
	print(User_rank)
	db.update_one({"_id": User_id}, {"$set": {"rank": User_rank}})
connection.close()
