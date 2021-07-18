import pandas as pd
import json

def get_CM_types():
    data = pd.read_csv('https://public.fyers.in/sym_details/NSE_CM.csv',header=None)
    types = set([])
    data2 = data[:][9]
    for i in range(len(data2)):
        x = data2[i].rfind('-')
        types.add(data2[i][x:])
    return types

def get_CM_symbols(type1):
    data = pd.read_csv('https://public.fyers.in/sym_details/NSE_CM.csv',header=None)
    symbols = []
    data2 = data[:][9]
    for i in range(len(data2)):
        x = data2[i].rfind('-')
        if(data2[i][x+1:]==type1):
            symbols.append(data2[i][4:x])
    return symbols

def get_FO_symbols(type1):
    data = pd.read_csv('https://public.fyers.in/sym_details/NSE_FO.csv',header=None)
    sy2 = []
    s = {}
    with open("symbols_data.json", "r") as infile:
        s = json.load(infile) 

    for i in range(len(data)):
        s1 = str(data[9][i][4:])
        s2 = {}
        s2['lot'] =  str(data[4][i])
        s2['symbol'] =  str(data[13][i])
        sy2.append(s1)
        s[s1] = s2
        s["FOLIST"].append(s1)
    
    with open("symbols_data.json", "w") as outfile:
        json.dump(s,outfile)

    return sy2

def get_COM_symbols(type1):
    data = pd.read_csv('https://public.fyers.in/sym_details/NSE_FO.csv',header=None)
    sy2 = []
    s = {}
    with open("symbols_data.json", "r") as infile:
        s = json.load(infile) 

    for i in range(len(data)):
        s1 = str(data[9][i][4:])
        s2 = {}
        s2['lot'] =  str(data[4][i])
        s2['symbol'] =  str(data[13][i])
        sy2.append(s1)
        s[s1] = s2
        s["FOLIST"].append(s1)
    
    with open("symbols_data.json", "w") as outfile:
        json.dump(s,outfile)

    return sy2

def get_FO_symbols_LOT_WISE():
    data = pd.read_csv('https://public.fyers.in/sym_details/NSE_FO.csv',header=None)
    symbols = {}
    for i in range(len(data)):
        symbols[str(data[13][i])] = str(data[3][i])
    return symbols

def get_COM_symbols(t):
    data = pd.read_csv('https://public.fyers.in/sym_details/MCX_COM.csv',header=None)
    symbols = []
    data2 = data[:][9]
    if(t=="FUT"):        
        for i in range(len(data2)):
            if(data2[i][len(data2[i])-3:]=="FUT"):
                symbols.append(data2[i][4:])
    return symbols

def get_Symbols(t,f):
    data = {}
    if(f=="CM"):
        data1 = get_CM_symbols(t)
        data['symbols'] = data1
    if(f=="FO"):
        data1 = get_FO_symbols(t)
        data['symbols'] = data1
    if(f=="COM"):
        data1 = get_COM_symbols(t)
        data['symbols'] = data1

    data['symbols'].sort()
    return data

def get_all_symbols():
    x = get_FO_symbols("l")    
    y = get_EQ_symbols("l")
    with open("symbols_data.json", "r") as infile:
        s = json.load(infile) 

    s["CMLIST"] = []
    for i in y:
        s["CMLIST"].append(i)
    
    with open("symbols_data.json", "w") as outfile:
        json.dump(s,outfile)

    y = get_COM_FO_symbols("FUT")
    with open("symbols_data.json", "r") as infile:
        s = json.load(infile) 

    s["COMFUTLIST"] = []
    for i in y:
        s["COMFUTLIST"].append(i)
    
    with open("symbols_data.json", "w") as outfile:
        json.dump(s,outfile)

def get_symbol_type(s):
    s1 = {} 
    with open("./apis/functions/symbols_data.json", "r") as outfile:
        s1 = json.load(outfile)
    print(s1[s])
    return s1[s]['type']