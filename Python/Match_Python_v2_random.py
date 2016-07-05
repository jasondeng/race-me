
#This is a test python program for the -
#population of mongodb with user fitness DB.
# analaysis
# match groups.

import json

with open("env.json") as json_file:
	json_data = json.load(json_file)

import random
#Make the connection
from pymongo import MongoClient
connection = MongoClient(json_data["MONGODB_URI"])
#Call a collection
db = connection.heroku_czw9k6mx.USER_RANKING

#take p@ra Fitness_rank and current_user_id and return random  op with that rank. 
#also check that current user is not matched with himself/herself
def return_oppenent_by_rank_v2(Fitness_rank,current_user_id):
	random_index = random.random()
	user = db.find_one({"rand_index": { "$gte": random_index, "$lte": random_index + 0.009}, "rank": Fitness_rank})
	while (user == None) or (user["_id"] == current_user_id):
		random_index = random.random()
		user = db.find_one({"rand_index": { "$gte": random_index, "$lte": random_index + 0.009}, "rank": Fitness_rank})
	OP_LIST = {"_id": user["_id"], "name": user["name"],"rank": user["rank"]}		
	return OP_LIST
	
	

#input p@ra user_id and cursor db
#output op by random rank.
def return_oppenent_by_random_rank(Fitness_rank,current_user_id):
	flag = True	
	while (flag):	
		rand_rank = random.randint(1,59)
		while (rand_rank == Fitness_rank):
			rand_rank = random.randint(1,59)
		if db.find_one({"rank": rand_rank}) != None:
			op_list = return_oppenent_by_rank_v2(rand_rank,current_user_id)
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
			

def return_oppenent_by_rank_level(Fitness_rank,current_user_id,index_x,high,low,same_speed):
	list_rank = calc_groups_by_rank_high_low(Fitness_rank,high,low,same_speed)
	list_len = len(list_rank)
	if list_len == 0:
		return None
	count = 0
	while (count < list_len):	
		rand_cursor = int(random.randrange(0,list_len,1))
		new_rank = list_rank[rand_cursor]
		op_list = return_oppenent_by_rank_v2(new_rank,current_user_id)
		if (op_list == None):
			count += 1
		else:
			return op_list


print("Test Oppenent match")
print("-------------------")
x = True
while (x):
	op_rank = input("Please enter rank")
	index = db.find({"rank": op_rank})
	xyz = index.next()
	print("Current user id - ", xyz["_id"])
	print("------------------")
	chose = raw_input("Enter r(ank), rand(om),h(igh),l(ow),ro(w)")
	if chose == "r":
		listx = return_oppenent_by_rank_v2(op_rank,xyz["_id"])
		print ("By rank")
		print listx
	elif chose == "rand":	
		listx = return_oppenent_by_random_rank(op_rank,xyz["_id"])
		print ("Random level")
		print listx
	elif chose == "h":	
		listx = return_oppenent_by_rank_level(op_rank,xyz["_id"],index,True,False,False)
		print ("High level")
		print listx
	elif chose == "l":	
		listx = return_oppenent_by_rank_level(op_rank,xyz["_id"],index,False,True,False)
		print ("Low level")
		print listx
	elif chose == "ro":	
		listx = return_oppenent_by_rank_level(op_rank,xyz["_id"],index,False,False,True)
		print ("Same speed level op")
		print listx
	x = input("True/False")
connection.close()




