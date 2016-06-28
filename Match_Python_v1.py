
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
db = connection.heroku_czw9k6mx.Test_ranking

#take p@ra Fitness_rank and crouser of db and return the first op with that rank. 
#also check that current user is not matched with himself/herself
def return_oppenent_by_rank(Fitness_rank,current_user_id,index_x):
	for document in index_x:
		if index_x.count() > 0:
			if (current_user_id == document["_id"]):
				index_x = index_x.next()				
				OP_LIST = {"_id": document["_id"], "name": document["name"],"rank": document["rank"]}		
				return OP_LIST
			else:
				OP_LIST = {"_id": document["_id"], "name": document["name"],"rank": document["rank"]}		
				return OP_LIST
		else:
			return False

#input p@ra user_id and crouser db
#output op by random rank.
def return_oppenent_by_random_rank(Fitness_rank,current_user_id,index_x):
	flag = True	
	while (flag):	
		rand_rank = random.randint(1,59)
		while (rand_rank == Fitness_rank):
			rand_rank = random.randint(1,59)
		index_new = db.find({"rank": rand_rank})
		op_list = return_oppenent_by_rank(rand_rank,current_user_id,index_new)
		if (op_list == None):
			flag = True
		else:
			return op_list


#input p@ra rank and a list for stroing matching ranks
#output list by reference. !initilize list for the avoidance of overlaps!
def calc_groups_by_rank_same_time(rank,rank_list):
	#rank_list = []
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
		return False
	count = 0
	while (count <= list_len):	
		rand_crouser = int(random.randrange(0,list_len,1))
		new_rank = list_rank[rand_crouser]
		index_new = db.find({"rank": new_rank})
		op_list = return_oppenent_by_rank(new_rank,current_user_id,index_new)
		if (op_list == None):
			count += 1
		else:
			return op_list


print("Test Oppenent match")
print("-------------------")
op_rank = input("Please enter rank")
index = db.find({"rank": op_rank})
xyz = index.next()
print("Current user id - ")
print xyz["_id"]
print("------------------")
listx = return_oppenent_by_rank(op_rank,xyz["_id"],index)
print ("By rank")
print listx
listx = return_oppenent_by_random_rank(op_rank,xyz["_id"],index)
print ("Random level")
print listx
listx = return_oppenent_by_rank_level(op_rank,xyz["_id"],index,True,False,False)
print ("High level")
print listx
listx = return_oppenent_by_rank_level(op_rank,xyz["_id"],index,False,True,False)
print ("Low level")
print listx
listx = return_oppenent_by_rank_level(op_rank,xyz["_id"],index,False,False,True)
print ("Same speed level op")
print listx
x = True
while (x):
	x = input("True/False")

connection.close()




