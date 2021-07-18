from os import remove
from tradingview_ta import *
import sqlite3
import time

from apis.functions.Triggers import *

def add_new_symbols(symbols):
    con = sqlite3.connect('symbols.db')
    cur = con.cursor()
    #cur.execute("CREATE TABLE ACTIVESYMBOLS(symbol text)")
    #cur.execute("CREATE TABLE PRICE(symbol text,price float)")    
    for symbol in symbols:
        cur.execute("SELECT * FROM ACTIVESYMBOLS WHERE SYMBOL=:e",{"e":symbol})
        rows = cur.fetchall()
        if(len(rows)==0):
            cur.execute("INSERT INTO ACTIVESYMBOLS VALUES(:e)",{"e":symbol})
            cur.execute("INSERT INTO PRICE VALUES(:e,0)",{"e":symbol})
            con.commit()
    con.close()

def remove_symbols(symbols):
    con = sqlite3.connect('symbols.db')
    cur = con.cursor()
    for symbol in symbols:
        cur.execute("DELETE FROM ACTIVESYMBOLS WHERE SYMBOL=:e",{"e":symbol})
        cur.execute("DELETE FROM PRICE WHERE SYMBOL=:e",{"e":symbol})
        con.commit()
    con.close()

def remove_all_symbols():
    con = sqlite3.connect('symbols.db')
    cur = con.cursor()
    cur.execute("DELETE FROM ACTIVESYMBOLS")
    cur.execute("DELETE FROM PRICE")
    con.commit()
    con.close()

def change_price(prices):
    con = sqlite3.connect('symbols.db')
    cur = con.cursor() 
    #cur.execute("DROP TABLE PRICE")
    #cur.execute("CREATE TABLE PRICE(symbol text,value float)")
    #cur.execute("INSERT INTO PRICE")
    for i in prices:
        #cur.execute("INSERT INTO PRICE VALUES(:e,:p)",{"e":i,"p":prices[i]})
        #cur.execute("UPDATE OLD_PRICE SET price=:p WHERE SYMBOL=:e",{"e":i,"p":prices[i]})
        cur.execute("UPDATE PRICE SET price=:p WHERE SYMBOL=:e",{"e":i,"p":prices[i]})
        con.commit()
    cur.execute("SELECT * FROM PRICE")
    rows = cur.fetchall()
    con.close()

def get_all_symbols():
    con = sqlite3.connect('symbols.db')
    cur = con.cursor() 
    cur.execute("SELECT * FROM ACTIVESYMBOLS")
    rows = cur.fetchall()
    symbols = []
    for i in range(len(rows)):
        symbols.append(rows[i][0].lower())
    con.close()
    return symbols

def get_symbols_price(symbols):
    con = sqlite3.connect('symbols.db')
    cur = con.cursor() 
    prices = {}
    for symbol in symbols:
        cur.execute("SELECT * FROM PRICE WHERE SYMBOL=:e",{"e":symbol})
        rows = cur.fetchall()
        prices[symbol] = 0   
        if(len(rows)):
            prices[symbol]  = rows[0][1]
    con.close()
    return prices

def get_symbol_price(symbol):
    con = sqlite3.connect('symbols.db')
    cur = con.cursor() 
    cur.execute("SELECT * FROM PRICE WHERE SYMBOL=:e",{"e":symbol})
    rows = cur.fetchall()
    price  = rows[0][1]
    con.close()
    return {"price":price}

def get_all_prices():
    con = sqlite3.connect('symbols.db')
    cur = con.cursor() 
    cur.execute("SELECT * FROM PRICE")
    rows = cur.fetchall()
    symbols = []
    prices = []
    for i in range(len(rows)):
        symbols.append(rows[i][0])
        prices.append(rows[i][1])
    con.close()
    return [symbols,prices]

def Add_trigger(data1):
    con = sqlite3.connect('symbols.db')
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
    print(rows)
    con.close()


def Add_limit_trigger(data1):
    con = sqlite3.connect('symbols.db')
    cur = con.cursor() 
    #cur.execute("CREATE TABLE ACTIVE_TRIGGERS(SYMBOL text,VALUE float,TYPE text,ORDERID text)")
    if(data1['side2']=='over'):
        cur.execute("INSERT INTO ACTIVE_TRIGGERS VALUES(:s,:p,'UL',:oid)",{"s":data1['symbol'],"p":data1['price'],"oid":data1['orderid']})

    if(data1['side2']=='under'):
        cur.execute("INSERT INTO ACTIVE_TRIGGERS VALUES(:s,:p,'LL',:oid)",{"s":data1['symbol'],"p":data1['price'],"oid":data1['orderid']})

    con.commit()
    cur.execute("SELECT * FROM ACTIVE_TRIGGERS")
    rows = cur.fetchall()
    print(rows)
    con.close()

def check_triggers(prices):
    con = sqlite3.connect('symbols.db')
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
                print(data1)
                con.commit()
                Add_trigger(data1)

def Remove_trigger(id):
    con = sqlite3.connect('symbols.db')
    cur = con.cursor()
    cur.execute("DELETE FROM ACTIVE_TRIGGERS WHERE ORDERID=:oid",{"oid": id})
    con.commit()
    con.close()

def Get_price():
    counter = 0
    while True:
        symbols = get_all_symbols()
        Live_Analytics = get_multiple_analysis(screener="india", interval=Interval.INTERVAL_1_MINUTE, symbols=symbols)
        prices = {}
        for s in symbols:
            prices[s.upper()] = Live_Analytics[s.upper()].indicators["close"]
        change_price(prices)
        check_triggers(prices)
        counter = counter + 1
        time.sleep(1)

def Delete_All_data():
    con = sqlite3.connect('symbols.db')
    cur = con.cursor()
    cur.execute("DELETE FROM ACTIVESYMBOLS")
    cur.execute("DELETE FROM PRICE")
    cur.execute("DELETE FROM ACTIVE_TRIGGERS")
    con.commit()
