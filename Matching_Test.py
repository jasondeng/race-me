#This is a test python program for the -
#population of mongodb with user fitness DB.
# analaysis
# match groups.

# make a random DB for testing
import random
#Make the connection
from pymongo import MongoClient
#Please replace ???? !!!!!!!!!!
connection = MongoClient('mongodb://????:????@ds015334.mlab.com:15334/heroku_czw9k6mx')
#Call a collection
db = connection.heroku_czw9k6mx.Test

#Creat dictionary using a loop
Fitness_record = {}
flag = 0
while (flag == 0):
#Match_Rank 1-7
	Name = raw_input("Name Enter Parameters: ")	
	HR = random.randrange(50,220,1)
	print(HR)
	AVG_Speed = random.randrange(0,25,1)
	print(AVG_Speed)
	AVG_Distance = random.randrange(0,45000,1)
	print(AVG_Distance)
	Fitness_record = {'name':Name, 'HR':HR, 'Avg_Speed':AVG_Speed, 'Avg_Distance':AVG_Distance,'rank':0}
	db.insert(Fitness_record)
	flag = input("Stop? press 1 continue press 0")
connection.close()
#end DB population.
	
