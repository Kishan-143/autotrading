from os import remove
from firebase_admin import credentials, firestore, db
from pprint import pprint
from firebase_admin.firestore import ArrayUnion, ArrayRemove, Increment
import time

store = firestore.client()

def Add_watchlist(username,symbol):
    ref = store.collection("Watchlist").where('username','==',username).get()
    if(len(ref)==0):
        print("Kishan")
        store.collection("Watchlist").document().set({"username":username,"symbols":[]})
        ref = store.collection("Watchlist").where('username','==',username).get()
    for r in ref:
        ref2 = store.collection("Watchlist").document(r.id)
        ref2.update({
        "symbols": ArrayUnion([symbol])
        })
    return {"code":200}

def Remove_watchlist(username,symbol):
    ref = store.collection("Watchlist").where('username','==',username).get()
    if(len(ref)):
        for r in ref:
            ref2 = store.collection("Watchlist").document(r.id)
            ref2.update({
            "symbols": ArrayRemove([symbol])
            })
    return {"code":200}

def Get_watchlist(username):
    data = {}
    data['symbols'] = []
    data['code'] = 200
    ref = store.collection("Watchlist").where('username','==',username).get()
    if(len(ref)):
        for r in ref:
            data['symbols'] = r._data["symbols"]  
            print(data['symbols'])  
    return data