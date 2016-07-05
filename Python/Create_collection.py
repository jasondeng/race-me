#This is a test python program for the -
#population of mongodb with user fitness DB.
# analaysis
# match groups.
import random
#Make the connection

import json

with open("../env.json") as json_file:
	json_data = json.load(json_file)

import random
#Make the connection
from pymongo import MongoClient
connection = MongoClient(json_data["MONGODB_URI"])
#Call a collection
db = connection.heroku_czw9k6mx.USER_RANKING


#Creat dictionary using a loop
Fitness_record = {}
txt_file = 'C:/Users/Zack/Desktop/project/Python/names.txt'
with open(txt_file,'r') as names_list:
	for name in names_list:
		user_name = name[:name.find(' ')]		
		HR = random.randrange(50,220,1)
		AVG_Speed = random.randrange(0,25,1)
		AVG_Distance = random.randrange(0,45000,1)
		r_index = random.random()
		Fitness_record = {'name':user_name, 'HR':HR, 'Avg_Speed':AVG_Speed, 'Avg_Distance':AVG_Distance,'rank':0, 'rand_index': r_index}
		print Fitness_record
		db.insert(Fitness_record)
names_list.close()
connection.close()

