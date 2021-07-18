from firebase_admin import credentials, firestore
from firebaseAdmin.setup import *
import time
import random 
store = firestore.client()

from apis.functions.Send_code import *

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

def admin_user_delete(username):
     ref1 = store.collection("Users").where('username','==',username).get()
     data = {}

     if(len(ref1)==1):
          for r in ref1:
               print(r.id)
               store.collection("Users").document(r.id).delete()
          data['code'] = 200
     else:
          data['code'] = 201
          data['msg'] = 'username not exits'
     print(data)
     return data

def admin_user_get_all():
     ref = store.collection("Users").get()
     users = []
     for r in ref:
          users.append({
               "u":r._data['username']
          })
     return {"code":200,"data":users}

def admin_user_get_all_list():
     ref = store.collection("Users").get()
     users = []
     for r in ref:
          users.append(r._data['username'])
     return {"code":200,"data":users}
