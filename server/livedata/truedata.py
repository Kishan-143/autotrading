from os import remove
from tradingview_ta import *
import sqlite3
import time
import json
from pprint import pprint
from copy import deepcopy
import pandas as pd
from datetime import date
import time
from websocket import *

from livedata.database import *
from apis.functions.Triggers import *

dbname = 'truedata_data.db'
prices = {}
username = 'FYERS1312'
password = 'wajRFFAE'

def add_new_symbols(symbols):
    con = sqlite3.connect(dbname)
    cur = con.cursor()
    #cur.execute("CREATE TABLE ACTIVE_EQ_SYMBOLS(symbol text)")
    #cur.execute("CREATE TABLE LIVE_PRICE(symbol text,price float)")   
    for symbol in symbols:
        cur.execute("SELECT * FROM ACTIVE_EQ_SYMBOLS WHERE SYMBOL=:e",{"e":symbol})
        rows = cur.fetchall()
        if(len(rows)==0):
            cur.execute("INSERT INTO ACTIVE_EQ_SYMBOLS VALUES(:e)",{"e":symbol})
            cur.execute("INSERT INTO LIVE_PRICE VALUES(:e,0)",{"e":symbol})
            con.commit()
    con.close()

def remove_symbols(symbols):
    con = sqlite3.connect(dbname)
    cur = con.cursor()
    for symbol in symbols:
        cur.execute("DELETE FROM ACTIVE_EQ_SYMBOLS WHERE SYMBOL=:e",{"e":symbol})
        cur.execute("DELETE FROM LIVE_PRICE WHERE SYMBOL=:e",{"e":symbol})
        con.commit()
    con.close()

def remove_all_symbols():
    con = sqlite3.connect(dbname)
    cur = con.cursor()
    cur.execute("DELETE FROM ACTIVE_EQ_SYMBOLS")
    cur.execute("DELETE FROM LIVE_PRICE")
    con.commit()
    con.close()

def get_all_symbols():
    con = sqlite3.connect(dbname)
    cur = con.cursor() 
    cur.execute("SELECT * FROM ACTIVE_EQ_SYMBOLS")
    rows = cur.fetchall()
    symbols = []
    for i in range(len(rows)):
        symbols.append(rows[i][0].upper())
    con.close()
    return symbols

def Add_trigger(data1):
    con = sqlite3.connect(dbname)
    cur = con.cursor() 
    #cur.execute("CREATE TABLE ACTIVE_TRIGGERS(SYMBOL text,VALUE float,TYPE text,ORDERID text)")
    if(data1['stoploss']!="-" and data1['side']=='buy'):
        cur.execute("INSERT INTO ACTIVE_TRIGGERS VALUES(:s,:p,'LL',:oid)",{"s":data1['symbol'],"p":data1['stoploss'],"oid":data1['orderid']})

    if(data1['target']!="-" and data1['side']=='sell'):
        cur.execute("INSERT INTO ACTIVE_TRIGGERS VALUES(:s,:p,'LL',:oid)",{"s":data1['symbol'],"p":data1['target'],"oid":data1['orderid']})

    if(data1['target']!="-" and data1['side']=='buy'):
        cur.execute("INSERT INTO ACTIVE_TRIGGERS VALUES(:s,:p,'UL',:oid)",{"s":data1['symbol'],"p":data1['target'],"oid":data1['orderid']})

    if(data1['stoploss']!="-" and data1['side']=='sell'):
        cur.execute("INSERT INTO ACTIVE_TRIGGERS VALUES(:s,:p,'UL',:oid)",{"s":data1['symbol'],"p":data1['stoploss'],"oid":data1['orderid']})
    con.commit()
    cur.execute("SELECT * FROM ACTIVE_TRIGGERS")
    rows = cur.fetchall()
    con.close()


def Add_limit_trigger(data1):
    con = sqlite3.connect(dbname)
    cur = con.cursor() 
    #cur.execute("CREATE TABLE ACTIVE_TRIGGERS(SYMBOL text,VALUE float,TYPE text,ORDERID text)")
    if(data1['side2']=='over'):
        cur.execute("INSERT INTO ACTIVE_TRIGGERS VALUES(:s,:p,'UL',:oid)",{"s":data1['symbol'],"p":data1['price'],"oid":data1['orderid']})

    if(data1['side2']=='under'):
        cur.execute("INSERT INTO ACTIVE_TRIGGERS VALUES(:s,:p,'LL',:oid)",{"s":data1['symbol'],"p":data1['price'],"oid":data1['orderid']})

    con.commit()
    cur.execute("SELECT * FROM ACTIVE_TRIGGERS")
    rows = cur.fetchall()
    con.close()

def Add_time_trigger(data1):
    con = sqlite3.connect(dbname)
    cur = con.cursor() 
    #cur.execute("CREATE TABLE ACTIVE_TIME_TRIGGERS(ORDERID text,SYMBOL text)")
    if(data1['productType']=='INTRA'):
        cur.execute("INSERT INTO ACTIVE_TIME_TRIGGERS VALUES(:oid,:s)",{"oid":data1['orderid'],"s":data1['symbol']})

    con.commit()
    cur.execute("SELECT * FROM ACTIVE_TIME_TRIGGERS")
    rows = cur.fetchall()
    print(rows)
    con.close()

def Remove_time_trigger(t):
    con = sqlite3.connect(dbname)
    cur = con.cursor() 
    cur.execute("SELECT * FROM ACTIVE_TIME_TRIGGERS")
    rows = cur.fetchall()
    for row in rows:
        price = get_symbol_price_truedata(row[1])
        #exit_order(row[0],price['ltp'])
    #cur.execute("DELETE FROM ACTIVE_TIME_TRIGGERS")
    con.commit()
    con.close()



def check_triggers(prices):
    con = sqlite3.connect(dbname)
    cur = con.cursor()
    #cur.execute("CREATE TABLE ACTIVE_TRIGGERS(SYMBOL text,VALUE float,TYPE text,ORDERID text)")
    cur.execute("SELECT * FROM ACTIVE_TRIGGERS")
    rows = cur.fetchall()
    for i in range(len(rows)):
        if(rows[i][2] == "LL"):
            if(prices[rows[i][0]]<=rows[i][1]):
                data1 = active_trigger(rows[i][3],prices[rows[i][0]])
                cur.execute("DELETE FROM ACTIVE_TRIGGERS WHERE ORDERID=:oid",{"oid": rows[i][3]})
                con.commit()
                if(data1['code'] == 200):   
                    Add_trigger(data1)

        if(rows[i][2] == "UL"):
            if(prices[rows[i][0]]>=rows[i][1]):
                data1 = active_trigger(rows[i][3],prices[rows[i][0]])
                cur.execute("DELETE FROM ACTIVE_TRIGGERS WHERE ORDERID=:oid",{"oid": rows[i][3]})
                con.commit()
                Add_trigger(data1)

def Remove_trigger(id):
    con = sqlite3.connect(dbname)
    cur = con.cursor()
    cur.execute("DELETE FROM ACTIVE_TRIGGERS WHERE ORDERID=:oid",{"oid": id})
    cur.execute("DELETE FROM ACTIVE_TIME_TRIGGERS WHERE ORDERID=:oid",{"oid": id})
    con.commit()
    con.close()

def Delete_All_data():
    con = sqlite3.connect(dbname)
    cur = con.cursor()
    cur.execute("DELETE FROM ACTIVE_EQ_SYMBOLS")
    cur.execute("DELETE FROM LIVE_PRICE")
    cur.execute("DELETE FROM ACTIVE_TRIGGERS")
    con.commit()

def is_NSE_open():
    ws = connect_realtime(username,password)
    ws.send('{"method": "getmarketstatus"}')
    result = ws.recv()
    result = json.loads(result)
    disconnect_realtime(ws)
    if(result['NSE_EQ'] == 'OPEN'):
        return True
    return False

def is_FO_open():
    ws = connect_realtime(username,password)
    ws.send('{"method": "getmarketstatus"}')
    result = ws.recv()
    result = json.loads(result)
    disconnect_realtime(ws)
    if(result['NSE_FO'] == 'OPEN'):
        return True
    return False

def is_MCX_open():
    ws = connect_realtime(username,password)
    ws.send('{"method": "getmarketstatus"}')
    result = ws.recv()
    result = json.loads(result)
    #print(result)
    disconnect_realtime(ws)
    if 'MCX' in result:
        if(result['MCX'] == 'OPEN'):
            return True
    return False

def get_symbol_price_truedata(symbol):
    prices = {}
    with open("data.json", "r") as infile:
        prices = json.load(infile) 

    x = {}
    x['ltp'] = 0
    x['prev_close'] = 0
    if symbol in prices:
        x = prices[symbol]
    return x

def connect_realtime(username,password):
    realtime_port = 8082
    ws = create_connection(f"wss://push.truedata.in:{realtime_port}?user={username}&password={password}")
    resp = ws.recv()
    #if(resp["success"] == "false"):
    #    if(resp["message"] == "User Already Connected"):
    #        disconnect_realtime(ws) 
    return ws

def disconnect_realtime(ws):
    ws.send('{"method":"logout"}')
    resp = ws.recv()
    #print(resp)

def add_live_symbols(ws,symbols):
    global prices
    x = '{"method":"addsymbol","symbols":['
    for i in range(len(symbols)):
        if(i<len(symbols)-1):
            x = x + '"' + symbols[i].upper() + '",' 
        else:
            x = x + '"' + symbols[i].upper() + '"'
    x = x + ']}'
    ws.send(x)
    while True:
        resp = ws.recv() 
        if 'message' in resp:
            break
    resp = json.loads(resp)

    prices = {}
    with open("data.json", "r") as infile:
        prices = json.load(infile) 

    if(resp['message'] == "symbols added"):
        for i in range(resp['symbolsadded']):
            value = resp['symbollist'][i]
            prices[value[0]] = {
                'prev_close': value[10],
                'ltp' : value[3]
            }

    with open("data.json", "w") as outfile:
        json.dump(prices, outfile)

    return {"code":200}

def remove_live_symbols(ws,symbols):
    x = '{"method":"removesymbol","symbols":['
    for i in range(len(symbols)):
        if(i<len(symbols)-1):
            x = x + '"' + symbols[i].upper() + '",' 
        else:
            x = x + '"' + symbols[i].upper() + '"'
    x = x + ']}'
    ws.send(x)
    resp = ws.recv() 

def Update_live_data():
    counter = 0

    while True:
        symbols = get_all_symbols()
        stepsize = 200
        end_cnt = min(counter+stepsize,len(symbols))
        symbols2 = symbols[counter:end_cnt]
        counter = counter + stepsize
        ws = connect_realtime(username,password)
        add_live_symbols(ws,symbols2)
        remove_live_symbols(ws,symbols2)
        disconnect_realtime(ws)

        if(end_cnt==len(symbols)):
            break

    return {"code":200}
