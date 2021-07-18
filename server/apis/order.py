from flask import Flask,request
from flask.templating import render_template
from flask import Blueprint

from apis.functions.Order import *
from apis.functions.User_Auth import *

order = Blueprint('order', __name__)

@order.route('/place',methods=["POST"])
def order_place():
    req = request.get_json()
    resp = user_Login_Hashval(req['username'],req['hashval'])
    if(resp['code'] == 200):
        return Order_place(req['username'],req['data'])
    else:
        return resp
    return resp


@order.route('/exit',methods=["POST"])
def Exit_order():
    req = request.get_json()
    resp = user_Login_Hashval(req['username'],req['hashval'])
    if(resp['code'] == 200):
        return exit_order(req['orderid'])
    return resp
    
@order.route('/exit/all',methods=["POST"])
def Exit_order_all():
    req = request.get_json()
    resp = user_Login_Hashval(req['username'],req['hashval'])
    if(resp['code'] == 200):
        return exit_order_all()
    return resp
    
@order.route('/cancel',methods=["POST"])
def Cancel_order():
    req = request.get_json()
    resp = user_Login_Hashval(req['username'],req['hashval'])
    if(resp['code'] == 200):
        cancel_order(req['id'])
    return resp

@order.route('/modify',methods=["POST"])
def Modify_order():
    req = request.get_json()
    resp = user_Login_Hashval(req['username'],req['hashval'])
    if(resp['code'] == 200):
        modify_order(req['id'],req['data'])
    return resp

@order.route('/get/active',methods=["POST"])
def Get_active_order():
    req = request.get_json()
    resp = user_Login_Hashval(req['username'],req['hashval'])
    if(resp['code'] == 200):
        return get_active_order(req['username'])
    return resp

@order.route('/get/pending',methods=["POST"])
def Get_pending_order():
    req = request.get_json()
    resp = user_Login_Hashval(req['username'],req['hashval'])
    if(resp['code'] == 200):
        return get_pending_order(req['username'])
    return resp

@order.route('/get/cancel',methods=["POST"])
def Get_cancel_order():
    req = request.get_json()
    resp = user_Login_Hashval(req['username'],req['hashval'])
    if(resp['code'] == 200):
        return get_cancel_order(req['username'])
    return resp

@order.route('/get/complete',methods=["POST"])
def Get_complete_order():
    req = request.get_json()
    resp = user_Login_Hashval(req['username'],req['hashval'])
    if(resp['code'] == 200):
        return get_complete_order(req['username'])
    return resp
    
