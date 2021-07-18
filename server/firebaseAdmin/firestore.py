import firebase_admin
from firebase_admin import credentials, firestore
from pprint import pprint
from firebaseAdmin.setup import *
from firebaseAdmin.sendmail import *
import random
import time
store = firestore.client()


# Add order in queue 
def Add_Order_in_queue(data):
     ref = store.collection("placedOrder").document()
     print(ref.id)
     data['orderid'] = ref.id
     data['timstamp'] = firestore.SERVER_TIMESTAMP
     ref.set(data)
     return {"code":200}

def Delete_Order_from_queue(orderid):
     store.collection("placedOrder").document(orderid).delete()
     return {"code":200}

def Executed_Order(data):
     return {"code":200}



def Update_user_funds(email,data):
     data2 = {}
     data2['code'] = 200
     ref = store.collection("userFunds").document(email)
     ref.update(data)
     return data2

def Get_user_funds(email):
     ref = store.collection("userFunds").document(email).get()
     return ref


############################# Admin login & signup ###########################

def admin_Login(email,password):
     ref1 = store.collection("AdminLogin").where('email','==',email).where('password','==',password).get()
     data = {}
     if(len(ref1)==1):
          for ref in ref1:
               s = random.random()
               s =str(s)
               val = hash(s + email+"rajesh"+password+"shivraj"+email+"kishan"+s)
               val = str(val)
               ref = store.collection("AdminLogin").document(ref.id).update({
                    "val":val,
                    "logintime":time.time()
               })
          data['code'] = 200
          data['email'] = email
          data['val'] = val
     else:          
          data['code'] = 201
     return data

def admin_Login_Hashval(email,hashval):
     print(email+hashval)
     ref1 = store.collection("AdminLogin").where('email','==',email).where('val','==',hashval).get()
     data = {}
     print(ref1)
     if(len(ref1)==1):
          for ref in ref1:
               print(time.time())
               print(ref._data['logintime'])
               if(time.time() - ref._data['logintime']<=10000):
                    data['code'] = 200
               else:
                    data['code'] = 202
     else:          
          data['code'] = 201
     return data

def admin_user_add(email,username):
     secretcode = hash(email + "kishan" + username + str(random.random()) + email + str(random.random()))
     secretcode = str(secretcode)
     ref = store.collection("RequestedUsers").where('email','==',email).get()
     ref1 = store.collection("RequestedUsers").where('username','==',username).get()
     data = {}
     if(len(ref)==0 and len(ref1)==0):
          store.collection("RequestedUsers").document().set({
               "email":email,
               "secretcode":secretcode,
               "username":username
          })
          Send_code(email,username,secretcode)
          data['code'] = 200
     else:
          data['code'] = 201
          data['msg'] = ' Secret already send to this username or email.'
     return data



##################### User Login & Signup #########################################
def check_user_code(username,secretcode):
     print(username)
     print(secretcode)
     data = {}
     ref = store.collection("RequestedUsers").where('username','==',username).where('secretcode','==',secretcode).get()
     if(len(ref)==1):
          data['code'] = 200
          for r in ref:
               data['email'] = r._data['email']
     else:
          data['code'] = 201
          data['msg'] = "Invalid Secret or username."
     return data

def Create_User(username,password,name,email):
     ref = store.collection("Users").where('username','==',username).get()
     ref1 = store.collection("Users").where('email','==',email).get()
     if(len(ref)==0 and len(ref1)==0):
          store.collection("Users").document().set({
               "username":username,
               "email":email,
               "password":password,
               "name":name
          })
          return {"code":200}
     else:
          data = {}
          data['code'] = 201
          data['msg'] = 'Already User created.'
          return data 

def user_Login(username,password):
     ref1 = store.collection("Users").where('username','==',username).where('password','==',password).get()
     data = {}
     if(len(ref1)==1):
          for ref in ref1:
               s = random.random()
               s = str(s)
               val = hash(s + username+"rajesh"+password+"shivraj"+username+"kishan"+s)
               val = str(val)
               ref = store.collection("Users").document(ref.id).update({
                    "val":val,
                    "logintime":time.time()
               })
          data['code'] = 200
          data['username'] = username 
          data['val'] = val
     else:          
          data['code'] = 201
     return data

def user_Login_Hashval(username,hashval):
     print(username+hashval)
     ref1 = store.collection("Users").where('username','==',username).where('val','==',hashval).get()
     data = {}
     print(ref1)
     if(len(ref1)==1):
          for ref in ref1:
               print(time.time())
               print(ref._data['logintime'])
               if(time.time() - ref._data['logintime']<=10000):
                    data['code'] = 200
               else:
                    data['code'] = 202
     else:          
          data['code'] = 201
     return data
