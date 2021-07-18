from truedata_ws.websocket.TD import TD
from copy import deepcopy
import pandas as pd
from datetime import date
import time

prices = {}


def Connection():
    username = 'wssand040'
    password = 'rajesh040'

    # Default ports are 8082 / 8092 in the library
    realtime_port = 8082
    history_port = 8092

    td_app = TD(username, password, live_port=realtime_port)

    symbols = ["NIFTY 50","NIFTY BANK","NIFTY20102911000CE","MCXCOMPDEX","AARTIIND","BRITANNIA",
            "COLPAL","DMART","EICHERMOT","GILLETTE","HDFCBANK","ICICIBANK","JKTYRE","KAJARIACER",
            "LICHSGFIN","MINDTREE","OFSS","PNB","QUICKHEAL","RELIANCE","SBIN","TCS","UJJIVAN",
            "WIPRO","YESBANK","ZEEL","NIFTY20OCTFUT", "NIFTY-I","BANKNIFTY-I","TCS20OCTFUT","RELIANCE20OCTFUT",
            "UPL-I","VEDL-I","VOLTAS-I","ZEEL-I","CRUDEOIL20OCTFUT","CRUDEOIL-I","GOLDM-I","SILVERM-I","COPPER-I", "SILVER-I"]

    print('Starting Real Time Feed.... ')
    print(f'Port > {realtime_port}')

    req_ids = td_app.start_live_data(symbols)
    live_data_objs = {}

    time.sleep(1)

    for req_id in req_ids:
        live_data_objs[req_id] = deepcopy(td_app.live_data[req_id])

    while True:
        for req_id in req_ids:
            print(req_id)
            if not td_app.live_data[req_id] == live_data_objs[req_id]:
                prices[td_app.live_data[req_id].symbol] = td_app.live_data[req_id]
                live_data_objs[req_id] = deepcopy(td_app.live_data[req_id])

def get_symbol_price(symbol):
    return prices
