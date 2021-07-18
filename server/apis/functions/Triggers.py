from firebase_admin import firestore
from firebase_admin.firestore import ArrayUnion, ArrayRemove
import time
from firebaseAdmin.setup import *

from apis.functions.Symbol_Market import *
from apis.functions.Funds import *

store = firestore.client()

def calculate_com(data,exitprice):
    print(get_symbol_type(data['symbol']))
    com = data['com']
    return com

def active_trigger(orderid,price):
    print(orderid)
    ref = store.collection("orders").document(orderid).get()
    if(ref._data['status']=='Pending'):
        return active_limit_order(orderid)
    if(ref._data['status']=='Active'):
        exit_order(orderid,price)
        return {"code":201}

def exit_order(id,cur_price):
    ref  = store.collection("orders").document(id).get()
    data2 = {}
    data2['side'] = ref._data['side']
    data2['entryprice'] = ref._data['price']
    data2['exitprice'] = cur_price
    data2['entrytime'] = ref._data['ordertime']
    data2['exittime'] = time.strftime('%A, %Y-%m-%d %H:%M:%S', time.localtime(time.time()))
    data2['qty'] = ref._data['qty']
    data2['symbol'] = ref._data['symbol']
    cur_com = calculate_com(ref._data,cur_price)
    data2['com'] = cur_com + ref._data['com']

    store.collection("orders").document(id).delete()

    username = ref._data['username']
    ref2 = store.collection("ordersComplete").where('username','==',username).get()
    if(len(ref2)==0):
        store.collection("ordersComplete").document().set({
            "username": username,
            "data" : [data2]
        })
    else:
        for r in ref2:
            ref2 = store.collection("ordersComplete").document(r.id).update({
                "data": ArrayUnion([data2])
            })    
    if(data2['side']=='buy'):
        add_eq_fund(username,(ref._data['margin']*data2['qty']) + (data2['exitprice']-data2['entryprice'])*(data2['qty']) - cur_com)
    else:
        add_eq_fund(username, (ref._data['margin']*data2['qty'])- (data2['exitprice']-data2['entryprice'])*(data2['qty']) - cur_com)
    return {"data":data2,"code":200}

def active_limit_order(id):
    store.collection("orders").document(id).update({'status':'Active'})
    ref = store.collection("orders").document(id).get()
    add_eq_fund(ref._data["username"],-(ref._data['margin']*ref._data['qty']+ref._data['com']))
    data = ref._data
    data['code'] = 200
    return data

