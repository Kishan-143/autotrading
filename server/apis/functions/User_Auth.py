from firebase_admin import credentials, firestore,db
from firebaseAdmin.setup import *
import time
import random 
store = firestore.client()
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
               ref = db.reference('usersLogin').order_by_child('username').equal_to(username).get()
               if(len(ref)==1):
                    for r in ref:
                         db.reference('usersLogin').child(r).update({
                              "username":username,
                              "val":val,
                              "logintime":time.time()
                         })
               else:
                    db.reference('usersLogin').push({
                         "username":username,
                         "val":val,
                         "logintime":time.time()
                    })
#               ref = store.collection("Users").document(ref.id).update({
#                    "val":val,
#                    "logintime":time.time()
#               })
          data['code'] = 200
          data['username'] = username 
          data['val'] = val
     else:          
          data['code'] = 201
     return data

def user_Logout(username,hashval):
     ref = db.reference('usersLogin').order_by_child('username').equal_to(username).get()
     if(len(ref)==1):
          for r in ref:
               db.reference('usersLogin').child(r).delete()
     return {"code":200}

def user_Login_Hashval(username,hashval):
     print(username+hashval)
     ref = db.reference('usersLogin').order_by_child('username').equal_to(username).get()
#     ref1 = store.collection("Users").where('username','==',username).where('val','==',hashval).get()
     data = {}
     print(ref)
     if(len(ref)==1):
          for r in ref:
               print(time.time())
               print(ref[r]['logintime'])
               if(ref[r]['val']==hashval and time.time() - ref[r]['logintime']<=10000):
                    data['code'] = 200
               else:
                    data['code'] = 202
                    data['msg'] = 'Login Expired.'
     else:          
          data['code'] = 201
          data['msg'] = 'Invalid Credintails.'
     return data
