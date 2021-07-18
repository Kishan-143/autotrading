from os import remove
from firebase_admin import credentials, firestore, db
from pprint import pprint
from firebase_admin.firestore import ArrayUnion, ArrayRemove
import time

from apis.functions.Funds import *
from livedata.truedata import Add_trigger, Add_limit_trigger, Remove_trigger
from livedata.truedata import get_symbol_price_truedata,  Add_time_trigger,Remove_time_trigger
from apis.functions.Symbol_Market import *

store = firestore.client()
com = 0.03

def do_format_side(side):
    return side.lower()

def do_format_ordertype(side):
    return side.lower()

def Order_place(username,data):
    data['ordertype'] = do_format_side(data['ordertype'])
    data['side'] = do_format_side(data['side'])
    data['ordertime'] = time.strftime('%A, %Y-%m-%d %H:%M:%S', time.localtime(time.time()))

    side = "sell"
    if(data['side'] =="sell"):
        side = "buy"    

    ref1 = store.collection("orders").document()    
    data1 = {}
    data2 = {}

    data2['side'] = side
    data2['exitprice'] = data['price']
    data2['exittime'] = time.strftime('%A, %Y-%m-%d %H:%M:%S', time.localtime(time.time()))
    data2['symbol'] = data['symbol']

    data1['username'] = username
    data1['orderid'] = ref1.id
    data1['ordertime'] = time.strftime('%A, %Y-%m-%d %H:%M:%S', time.localtime(time.time()))
    data1['price'] = data['price']
    data1['symbol'] = data['symbol']
    data1['target'] = data['target']
    data1['stoploss'] = data['stoploss']
    data1['side'] = data['side']
    data1['margin'] = data['margin']
    data1['com'] = data['com']
    data1['productType'] = data['productType']
    

    if(data['ordertype']=='market'):
        data['ordertime'] = time.strftime('%A, %Y-%m-%d %H:%M:%S', time.localtime(time.time()))
        ref_list = store.collection('orders').where('status','==','Active').where('username','==',username).where('side','==',side).where('symbol','==',data['symbol']).get()
       
        qty = data['qty']

        for o in ref_list:
            if(qty):
                data2['entryprice'] = o._data['price']
                data2['entrytime'] = o._data['ordertime']
                data2['qty'] = min(o._data['qty'],qty)
                #cur_com = max(20,data2['qty']*data2['exitprice']*com*0.01)
                cur_com = calculate_com(o._data,data2)
                qty = qty - data2['qty']
                cur_com1 = ((o._data['qty']-data2['qty'])*o._data['com'])/o._data['qty']
                data2['com'] = cur_com + (o._data['com']*data2['qty'])/o._data['qty']

                ref2 = store.collection("ordersComplete").where('username','==',username).get()
                if(len(ref2)):
                    for r in ref2:
                        ref2 = store.collection("ordersComplete").document(r.id)
                        ref2.update({
                            "data": ArrayUnion([data2])
                        })    
                else:
                    store.collection("ordersComplete").document().set({
                        "username": username,
                        "data" : [data2]
                    })

                o._data['qty'] = o._data['qty'] - data2['qty']                
                if(o._data['qty']>0):
                    ref = store.collection("orders").document(o._data['orderid'])
                    ref.update({
                        "qty":o._data['qty'],
                        "com":cur_com1
                    })
                else:
                    ref = store.collection("orders").document(o._data['orderid']).delete()
                
                if(data2['side']=='buy'):
                    add_eq_fund(username,o._data['margin']*data2['qty'] + (data2['exitprice']-data2['entryprice'])*data2['qty'] - cur_com)
                else:
                    add_eq_fund(username,o._data['margin']*data2['qty'] - (data2['exitprice']-data2['entryprice'])*data2['qty'] - cur_com)
                Remove_trigger(o._data['orderid'])
                    
        if(qty>0):
            data1['qty'] = qty
            data1['status'] = 'Active'
            add_eq_fund(username,-(data1['margin']*data1['qty']+data1['com']))
            ref1.set(data1)    
            Add_trigger(data1)
            Add_time_trigger(data1)
            return {"code":200,"data":data1}
    else:
        data1['price'] = data['limit']
        data1['side2'] = data['side2']
        data1['qty'] = data['qty']
        data1['ordertime'] = time.strftime('%A, %Y-%m-%d %H:%M:%S', time.localtime(time.time()))
        data1['status'] = 'Pending'
        ref1.set(data1)
        Add_limit_trigger(data1)
        return {"code":200,"data":data1}

def get_active_order(username):    
    ref = store.collection("orders").where('username','==',username).where('status','==','Active').get()
    data = []
    for r in ref:
        data2 = r._data
        data.append(data2)
    return {"code":200,"data":data}

def get_pending_order(username):
    ref = store.collection("orders").where('username','==',username).where('status','==','Pending').get()
    data = []
    for r in ref:
        data2 = r._data
        data.append(data2)
    return {"code":200,"data":data}

def get_cancel_order(username):
    ref = store.collection("orders").where('username','==',username).where('status','==','Canceled').get()
    data = []
    for r in ref:
        data2 = r._data
        data.append(data2)
    return {"code":200,"data":data}

def get_complete_order(username):
    ref = store.collection("ordersComplete").where('username','==',username).get()
    for r in ref:
        return {"code":200,"data":r._data['data']}
    return {"code":200,"data":[]}

def exit_order(id):
    cur_com = 0
    ref  = store.collection("orders").document(id).get()
    if(ref._data is None):
        return {"code":201}
    cur_price = get_symbol_price_truedata(ref._data["symbol"])
    cur_price = cur_price['ltp']
    
    data2 = {}
    data2['side'] = ref._data['side']
    data2['entryprice'] = ref._data['price']
    data2['exitprice'] = float(cur_price)
    data2['entrytime'] = ref._data['ordertime']
    data2['exittime'] = time.strftime('%A, %Y-%m-%d %H:%M:%S', time.localtime(time.time()))
    data2['qty'] = int(ref._data['qty'])
    data2['symbol'] = ref._data['symbol']    
    com = float(0.03)
    #cur_com = max(20.0,data2['qty']*data2['exitprice']*com*0.01)
    cur_com = calculate_com(ref._data,data2)
    data2['com'] = cur_com + (ref._data['com']*data2['qty'])/ref._data['qty']

    
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
    store.collection("orders").document(id).delete()

    fund = (data2['exitprice']-data2['entryprice'])*(data2['qty'])
    if(data2['side']=='sell'):
        fund = -fund 
    fund = fund + ref._data['margin']*data2['qty'] - cur_com
    add_eq_fund(username,fund)
    Remove_trigger(id)
    return {"data":data2,"code":200,"fund":fund}

def exit_order_all():
    ref  = store.collection("orders").where('status','==','Active').get()
    for r in ref:
        exit_order(r.id)
    return {"code":200}

def active_order(id,cur_price):
    store.collection("orders").document(id).update({'status':'Active'})
    ref = store.collection("orders").document(id).get()
    add_eq_fund(ref._data["username"],-(data1['margin']*data1['qty']+data1['com']))
    Add_trigger(ref._data)

def cancel_order(id):
    store.collection("orders").document(id).update({'status':'Canceled'})
    Remove_trigger(id)

def modify_order(id,data):
    store.collection("orders").document(id).update(data)
    r = store.collection("orders").document(id).get()
    Remove_trigger(id)
    if(r._data['status']=='Pending'):
        Add_limit_trigger(r._data)
    else:
        Add_trigger(r._data)

def close_market(t):
    Remove_time_trigger()

def calculate_com(data,data1):
    x = get_symbol_type(data['symbol'])
    if(x == "EQ"):
        com1 = min(20,data1['exitprice']*data1['qty']*com*0.01)
        return com1
    else:
        com1 = (data1['qty']*data['com'])/data['qty']
        return com1
