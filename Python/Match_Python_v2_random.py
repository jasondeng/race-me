
#This is a test python program for the -
#population of mongodb with user fitness DB.
# analaysis
# match groups.

import json
import random
import sys
import os
from bson.json_util import dumps
from bson.objectid import ObjectId
from pymongo import MongoClient

dbURI = None
if os.environ.get('NODE_ENV') == 'production':
	dbURI = os.environ.get('MONGODB_URI')
else:
	with open("env.json") as json_file:
		json_data = json.load(json_file)
		dbURI = json_data["MONGODB_URI"]

#Make the connection

connection = MongoClient(dbURI)
#Call a collection
db = connection.heroku_czw9k6mx.ranks


#take p@ra Fitness_rank and current_user_id and return random  op with that rank. 
#also check that current user is not matched with himself/herself
def return_opponent_by_rank_v2(Fitness_rank,current_user_id):
	random_index = random.random()
	user = db.find({"user": {"$ne": ObjectId(current_user_id)}})
	user = json.loads(dumps(user))
	user = user[random.randrange(len(user))]
	# print(user)
	OP_LIST = {"userID": user["user"]["$oid"], "username": user["username"],"rank": user["rank"]}
	return dumps(OP_LIST)
	
	

#input p@ra user_id and cursor db
#output op by random rank.
def return_opponent_by_random_rank(Fitness_rank,current_user_id):
	flag = True	
	while (flag):	
		rand_rank = random.randint(0,59)
		while (rand_rank == Fitness_rank):
			rand_rank = random.randint(0,59)
		if db.find_one({"rank": rand_rank}) != None:
			op_list = return_opponent_by_rank_v2(rand_rank,current_user_id)
			return op_list


#input p@ra rank and a list for stroing matching ranks
#output list by reference. !initilize list for the avoidance of overlaps!
def calc_groups_by_rank_same_time(rank,rank_list):
	new_range = 0	
	rank_first_digit = int(rank % 10)
	for x in range(1,6):
		new_range = (x*10) + rank_first_digit
		if new_range != rank:
			rank_list.append(new_range)
#input p@ra rank and bolean high and low and same speed for matching rank_first_digit
#output list.
def calc_groups_by_rank_high_low(rank,high,low,same_speed):
	list_for_storing_rank = []
	rank_second_digit = int(rank / 10)
	if same_speed:
		calc_groups_by_rank_same_time(rank,list_for_storing_rank)
		return list_for_storing_rank
	if high:
		new_rank = rank - 1
		if new_rank >= rank_second_digit * 10:
			calc_groups_by_rank_same_time(new_rank,list_for_storing_rank)
			list_for_storing_rank.append(new_rank)
			return list_for_storing_rank
		else:
			return list_for_storing_rank
	if low:
		new_rank = rank + 1
		if new_rank < (rank_second_digit + 1) * 10:
			calc_groups_by_rank_same_time(new_rank,list_for_storing_rank)
			list_for_storing_rank.append(new_rank)
			return list_for_storing_rank
		else:
			return list_for_storing_rank
			

def return_opponent_by_rank_level(Fitness_rank,current_user_id,index_x,high,low,same_speed):
	list_rank = calc_groups_by_rank_high_low(Fitness_rank,high,low,same_speed)
	list_len = len(list_rank)
	if list_len == 0:
		return None
	count = 0
	while (count < list_len):	
		rand_cursor = int(random.randrange(0,list_len,1))
		new_rank = list_rank[rand_cursor]
		op_list = return_opponent_by_rank_v2(new_rank,current_user_id)
		if (op_list == None):
			count += 1
		else:
			return op_list



# op_rank = int(input("Please enter rank: "))
op_rank = int(sys.argv[1])
index = db.find({"rank": op_rank})
xyz = index.next()

chose = str(sys.argv[2])
# chose = input("Enter r(ank), rand(om),h(igh),l(ow),ro(w):\n")
if chose == "r":
	print (return_opponent_by_rank_v2(op_rank, sys.argv[3]))
elif chose == "rand":	
	print (return_opponent_by_random_rank(op_rank,xyz["_id"]))
elif chose == "h":	
	print (return_opponent_by_rank_level(op_rank,xyz["_id"],index,True,False,False))
elif chose == "l":	
	print (return_opponent_by_rank_level(op_rank,xyz["_id"],index,False,True,False))
elif chose == "ro":	
	print (return_opponent_by_rank_level(op_rank,xyz["_id"],index,False,False,True))
exit()




