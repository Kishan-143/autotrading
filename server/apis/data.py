from flask import Flask,request
from flask.templating import render_template
from flask import Blueprint

from apis.functions.Symbol_Market import *
from livedata.truedata import *

data = Blueprint('data', __name__)

@data.route('/market/symbols/get',methods=["POST"])
def get_allsymbols():
    req = request.get_json()
    return get_Symbols(req['type'],req['from'])

@data.route('/market/symbols/get/all',methods=["GET"])
def get_all_symbols1():
    return get_all_symbols2()

@data.route('/symbols/price/addget',methods=["POST"])
def GetAdd_symbols_price():
    req = request.get_json()
    NSE_EQ = []
    for symbol in req['symbols']:
        if(symbol['type']=="EQ" and symbol['market']=='NSE'):
            NSE_EQ.append(symbol['symbol'])
    add_new_symbols(NSE_EQ)    
    prices = get_symbols_price(NSE_EQ)
    return {"code":200,"prices":prices}

@data.route('/symbols/price/get',methods=["POST"])
def Get_symbols_price():
    req = request.get_json()
    prices = {}
    for symbol in req['symbols']:
        prices[symbol] = get_symbol_price_truedata(symbol)
    return {"code":200,"prices":prices}

@data.route('/symbols/price/add',methods=["POST"])
def Add_symbols_price():
    req = request.get_json()
    add_new_symbols(req['symbols']) 
    return {"code":200}

@data.route('/indexs/price/get',methods=["POST"])
def Get_symbols_price2():
    req = request.get_json()
    prices = {}
    for symbol in req['symbols']:
        x= get_symbol_price_truedata(symbol)
        prices[symbol] = x
    return {"code":200,"prices":prices}