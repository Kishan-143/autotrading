from os import remove
from firebase_admin import credentials, firestore, db
from pprint import pprint
from firebase_admin.firestore import ArrayUnion, ArrayRemove, Increment
import time

store = firestore.client()

def add_eq_fund(username,amount):
    ref = store.collection("userFunds").document(username).update({
        "F":firestore.Increment(amount)
    })


def Get_All_Users():
    ref = store.collection("Users").get()
    users = []
    for r in ref:
        users.append(r._data['username'])
    return {"code":200,"users":users}

def Set_user_funds(username,data):
    data2 = {}
    data2['code'] = 200
    ref = store.collection("userFunds").document(username).set(data)
    return data2

def Update_user_funds(username,data):
    data2 = {}
    data2['code'] = 200
    store.collection("userFunds").document(username).update(data)
    return data2

def Get_user_funds(username):
    data2 = {}
    data2['code'] = 200
    ref = store.collection("userFunds").document(username).get()
    data2['data'] = ref._data
    return data2

