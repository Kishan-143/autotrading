from flask import Flask,request
from flask.templating import render_template
from firebaseAdmin.firestore import *

from apis.functions.Admin_Auth import *
from apis.functions.Funds import *
from flask import Blueprint
from livedata.truedata import Update_live_data,is_NSE_open,is_FO_open,is_MCX_open,Remove_time_trigger
import json
admin = Blueprint('admin', __name__)

@admin.route('/login',methods=["POST"])
def Admin_Login():
    req = request.get_json()
    return admin_Login(req['email'],req['password'])

@admin.route('/hashval',methods=["POST"])
def Admin_Login_Hahval():
    req = request.get_json()
    return admin_Login_Hashval(req['email'],req['hashval'])

@admin.route('/user/add',methods=["POST"])
def Admin_User_Add():
    req = request.get_json()
    resp = admin_Login_Hashval(req['email'],req['hashval'])
    data = {}
    if(resp['code'] == 200):
        return admin_user_add(req['requestedEmail'],req['username'])
    else:
        data['code'] = 203
    return data

@admin.route('/user/get/all',methods=["POST"])
def Admin_User_get_all():
    req = request.get_json()
    resp = admin_Login_Hashval(req['email'],req['hashval'])
    data = {}
    if(resp['code'] == 200):
        return admin_user_get_all()
    return resp

@admin.route('/user/get/all/list',methods=["POST"])
def Admin_User_get_all_list():
    req = request.get_json()
    resp = admin_Login_Hashval(req['email'],req['hashval'])
    data = {}
    if(resp['code'] == 200):
        return admin_user_get_all_list()
    return resp

@admin.route('/user/funds/set',methods=["POST"])
def admin_setuserfunds():
    req = request.get_json()
    resp = admin_Login_Hashval(req['email'],req['hashval'])
    if(resp['code'] == 200):
        return Set_user_funds(req['username'],req['data'])
    return resp

@admin.route('/user/funds/update',methods=["POST"])
def admin_updateuserfunds():
    req = request.get_json()
    resp = admin_Login_Hashval(req['email'],req['hashval'])
    if(resp['code'] == 200):
        return Update_user_funds(req['username'],req['data'])
    return resp

@admin.route('/user/funds/get',methods=["POST"])
def admin_getuserfunds():
    req = request.get_json()
    resp = admin_Login_Hashval(req['email'],req['hashval'])
    if(resp['code'] == 200):
        return Get_user_funds(req['username'])
    return resp



###########################################################################

@admin.route('/user/remove',methods=["POST"])
def Admin_User_Remove():
    req = request.get_json()
    resp = admin_Login_Hashval(req['email'],req['hashval'])
    data = {}
    if(resp['code'] == 200):
        return admin_user_delete(req['username'])
    else:
        data['code'] = 203
    return data

@admin.route('/get/price/all',methods=["POST"])
def Admin_get_all_symbol_price():
    req = request.get_json()
    #data = {}
    #with open("market.json", "r") as infile:
    #    data = json.load(infile) 

    #if(is_NSE_open() == False):
    #    data["NSE"] = "no"

    #if(is_FO_open() == False):
    #    data["FO"] = "no"
    
    #if(is_MCX_open() == False):
    #    data["MCX"] = "no"

    #with open("market.json", "w") as outfile:
    #    json.dump(data, outfile)

    return Update_live_data()


######################################### Start NSE Server ######################
@admin.route('/start/server',methods=["POST"])
def start_server():
    req = request.get_json()
    markets = {}
    with open("market.json", "r") as infile:
        markets = json.load(infile) 

    print(req["market"])
    markets[req["market"]] = "yes"
    with open("market.json", "w") as outfile:
        json.dump(markets, outfile)
    return {"code":200}


@admin.route('/stop/server',methods=["POST"])
def stop_server():
    req = request.get_json()
    markets = {}
    with open("market.json", "r") as infile:
        markets = json.load(infile) 

    markets[req["market"]] = "no"

    with open("market.json", "w") as outfile:
        json.dump(markets, outfile)
    return {"code":200}

@admin.route('/close/market',methods=["POST"])
def Close_market():
    req = request.get_json()
    Remove_time_trigger(req["market"])
    return {"code":200}

def Update_symbol():
    req = request.get_json()
    markets = {}