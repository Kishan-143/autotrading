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

def change_price(prices):
    con = sqlite3.connect(dbname)
    cur = con.cursor() 
    #cur.execute("DROP TABLE PRICE")
    #cur.execute("CREATE TABLE PRICE(symbol text,value float)")
    #cur.execute("INSERT INTO PRICE")
    for i in prices:
        #cur.execute("INSERT INTO PRICE VALUES(:e,:p)",{"e":i,"p":prices[i]})
        #cur.execute("UPDATE OLD_PRICE SET price=:p WHERE SYMBOL=:e",{"e":i,"p":prices[i]})
        cur.execute("UPDATE LIVE_PRICE SET price=:p WHERE SYMBOL=:e",{"e":i,"p":prices[i]})
        con.commit()
    cur.execute("SELECT * FROM LIVE_PRICE")
    rows = cur.fetchall()
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

def get_symbols_price(symbols):
    con = sqlite3.connect(dbname)
    cur = con.cursor() 
    global prices
    prices = {}
    for symbol in symbols:
        cur.execute("SELECT * FROM LIVE_PRICE WHERE SYMBOL=:e",{"e":symbol})
        rows = cur.fetchall()
        prices[symbol] = 0   
        if(len(rows)):
            prices[symbol]  = rows[0][1]
    con.close()
    return prices

def get_symbol_price(symbol):
    con = sqlite3.connect(dbname)
    cur = con.cursor() 
    cur.execute("SELECT * FROM LIVE_PRICE WHERE SYMBOL=:e",{"e":symbol})
    rows = cur.fetchall()
    price  = rows[0][1]
    con.close()
    return {"price":price}

def get_all_prices():
    con = sqlite3.connect(dbname)
    cur = con.cursor() 
    cur.execute("SELECT * FROM LIVE_PRICE")
    rows = cur.fetchall()
    symbols = []
    prices = []
    for i in range(len(rows)):
        symbols.append(rows[i][0])
        prices.append(rows[i][1])
    con.close()
    return [symbols,prices]

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

def INTRADAY_Trigger(data1):
    con = sqlite3.connect(dbname)
    cur = con.cursor() 
    cur.execute("CREATE TABLE TIME_TRIGGERS(SYMBOL text,VALUE float,TYPE text,ORDERID text)")
    if(data1['side2']=='over'):
        cur.execute("INSERT INTO TIME_TRIGGERS VALUES(:s,:p,'UL',:oid)",{"oid":data1['orderid']})

    if(data1['side2']=='under'):
        cur.execute("INSERT INTO TIME_TRIGGERS VALUES(:s,:p,'LL',:oid)",{"oid":data1['orderid']})

    con.commit()
    cur.execute("SELECT * FROM TIME_TRIGGERS")
    rows = cur.fetchall()
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
    con.commit()
    con.close()

def Delete_All_data():
    con = sqlite3.connect(dbname)
    cur = con.cursor()
    cur.execute("DELETE FROM ACTIVE_EQ_SYMBOLS")
    cur.execute("DELETE FROM LIVE_PRICE")
    cur.execute("DELETE FROM ACTIVE_TRIGGERS")
    con.commit()

def start_historical_server():
    #print("\nCreating a connection with the truedata historical server...\n")
    ws = create_connection(f"wss://push.truedata.in:{historical_port}?user={username}&password={password}")
    return ws

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
    disconnect_realtime(ws)
    if(result['MCX'] == 'OPEN'):
        return True
    return False

def Logout():
    ws.send('{"method":"logout"}')
    resp = ws.recv()

def Login():
    ws = create_connection(f"wss://push.truedata.in:{realtime_port}?user={username}&password={password}")
    
def Update_symbol():
    symbols = get_all_symbols()
    x = '{"method":"addsymbol","symbols":['
    for i in range(len(symbols)):
        if(i<len(symbols)-1):
            x = x + '"' + symbols[i].upper() + '",' 
        else:
            x = x + '"' + symbols[i].upper() + '"'
    x = x + ']}'
    ws.send(x)

def Get_price():
    x = 0    
    while 1:
        result = ws.recv()
        result2 = json.loads(result)
        if('trade' in result2):
            x = x + 1    

def Connection():

    # Default ports are 8082 / 8092 in the library
    realtime_port = 8082
    history_port = 8092

    td_app = TD(username, password, live_port=8092)

    symbols = ["NIFTY 50","BANK NIFTY"]

    #print('Starting Real Time Feed.... ')
    #print(f'Port > {realtime_port}')

    req_ids = td_app.start_live_data(symbols)
    live_data_objs = {}

    time.sleep(1)

    for req_id in req_ids:
        live_data_objs[req_id] = deepcopy(td_app.live_data[req_id])

    while True:
        symbols = get_all_symbols()
        req_ids = td_app.start_live_data(symbols)
        for req_id in req_ids:
            #print(req_id)
            prices = {}
            with open("data.json", "r") as infile:
                prices = json.load(infile) 

            prices[td_app.live_data[req_id].symbol] = {
                'change': td_app.live_data[req_id].change,
                'change_perc' : td_app.live_data[req_id].change_perc,
                'ltp' : td_app.live_data[req_id].ltp
            }

            with open("data.json", "w") as outfile:
                json.dump(prices, outfile)

def get_symbol_price_truedata(symbol):
    prices = {}
    with open("data.json", "r") as infile:
        prices = json.load(infile) 
    return prices[symbol]

def Connection1():

    realtime_port = 8082
    history_port = 8092

    td_app = TD(username, password, live_port=8082)

    symbols = get_all_symbols()
    req_ids = td_app.start_live_data(symbols)
    live_data_objs = {}

    for req_id in req_ids:
        live_data_objs[req_id] = deepcopy(td_app.live_data[req_id])
        prices = {}
        with open("data.json", "r") as infile:
            prices = json.load(infile) 
        prices[td_app.live_data[req_id].symbol] = {
            'change': td_app.live_data[req_id].change,
            'change_perc' : td_app.live_data[req_id].change_perc,
            'ltp' : td_app.live_data[req_id].ltp,
            'prev_day_close' : td_app.live_data[req_id].prev_day_close,
        }
        with open("data.json", "w") as outfile:
            json.dump(prices, outfile)


    while True:
        for req_id in req_ids:
            if not td_app.live_data[req_id] == live_data_objs[req_id]:
                prices = {}
                with open("data.json", "r") as infile:
                    prices = json.load(infile) 

                prices[td_app.live_data[req_id].symbol] = {
                    'change': td_app.live_data[req_id].change,
                    'change_perc' : td_app.live_data[req_id].change_perc,
                    'ltp' : td_app.live_data[req_id].ltp
                }
                with open("data.json", "w") as outfile:
                    json.dump(prices, outfile)

                live_data_objs[req_id] = deepcopy(td_app.live_data[req_id])



def connect_realtime(username,password):
    realtime_port = 8082
    ws = create_connection(f"wss://push.truedata.in:{realtime_port}?user={username}&password={password}")
    resp = ws.recv()
    #print(resp)
    return ws

def disconnect_realtime(ws):
    ws.send('{"method":"logout"}')
    resp = ws.recv()
    #print(resp)

def get_live_price(ws,symbols):
    for i in range(len(symbols)):
        resp = ws.recv()
        prices = {}
        #with open("data.json", "r") as infile:
        #    prices = json.load(infile) 

        #prices[td_app.live_data[req_id].symbol] = {
        #    'change': td_app.live_data[req_id].change,
        #    'change_perc' : td_app.live_data[req_id].change_perc,
        #    'ltp' : td_app.live_data[req_id].ltp
        #}
        #with open("data.json", "w") as outfile:
        #    json.dump(prices, outfile)



def Get_data():
    username = 'wssand040'
    password = 'rajesh040'

    counter = 0
    while True:
        symbols = get_all_symbols()
        stepsize = 45
        end_cnt = min(counter+stepsize,len(symbols))
        symbols2 = symbols[counter:end_cnt]
        counter = counter + stepsize
        if(end_cnt==len(symbols)):
            counter = 0
        
        ws = connect_realtime(username,password)
        add_live_symbols(ws,symbols2)
        remove_live_symbols(ws,symbols2)
        disconnect_realtime(ws)

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
        stepsize = 45
        end_cnt = min(counter+stepsize,len(symbols))
        symbols2 = symbols[counter:end_cnt]
        counter = counter + stepsize
        
        ws = connect_realtime(username,password)
        add_live_symbols(ws,symbols2)
        remove_live_symbols(ws,symbols2)
        disconnect_realtime(ws)

        if(end_cnt==len(symbols)):
            break
    
def Update_live_data2():
    counter = 0

    while True:
        symbols = get_all_symbols()
        stepsize = 50
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
