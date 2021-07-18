from flask import Flask,request
from flask.templating import render_template
from flask import Blueprint

from apis.functions.User_Auth import *
from apis.functions.User_watchlist import *
from apis.functions.Funds import *
import json
user = Blueprint('user', __name__)

@user.route('/signup',methods=["POST"])
def User_signup():
    req = request.get_json()
    resp = check_user_code(req['username'],req['secretcode'])
    if(resp['code'] == 200):
        return Create_User(req['username'],req['password'],req['name'],resp['email'])
    else:
        return resp

@user.route('/logout',methods=["POST"])
def User_Logout():
    req = request.get_json()
    return user_Logout(req['username'],req['hashval'])

@user.route('/login',methods=["POST"])
def User_Login():
    req = request.get_json()
    return user_Login(req['username'],req['password'])

@user.route('/hashval',methods=["POST"])
def User_Login_Hahval():
    req = request.get_json()
    return user_Login_Hashval(req['username'],req['hashval'])

@user.route('/watchlist/add',methods=["POST"])
def Watchlist_add():
    req = request.get_json()
    resp = user_Login_Hashval(req['username'],req['hashval'])
    if(resp['code'] == 200):
        return Add_watchlist(req['username'],req['symbol'])
    else:
        return resp

@user.route('/watchlist/remove',methods=["POST"])
def Watchlist_remove():
    req = request.get_json()
    resp = user_Login_Hashval(req['username'],req['hashval'])
    if(resp['code'] == 200):
        return Remove_watchlist(req['username'],req['symbol'])
    else:
        return resp

@user.route('/watchlist/get',methods=["POST"])
def Watchlist_get():
    req = request.get_json()
    resp = user_Login_Hashval(req['username'],req['hashval'])
    if(resp['code'] == 200):
        return Get_watchlist(req['username'])
    else:
        return resp

@user.route('/funds/get',methods=["POST"])
def user_getuserfunds():
    req = request.get_json()
    resp = user_Login_Hashval(req['username'],req['hashval'])
    if(resp['code'] == 200):
        return Get_user_funds(req['username'])
    return resp

@user.route('/market',methods=["GET"])
def user_markets():
    data = {}
    markets = {}
    with open("market.json", "r") as infile:
        markets = json.load(infile) 
    return markets