import pandas as pd
import json

s = {}

with open("symbols_data.json", "r") as infile:
    s = json.load(infile) 

s = {}

def get_CM_symbols(type1):
    data = pd.read_csv('x.csv',header=None)
    symbols = []
    data2 = data[:][9]
    for i in range(len(data2)):
        x = data2[i].rfind('-')
        if(data2[i][x+1:]==type1):
            symbols.append(data2[i][4:x])
            s[data2[i][4:x]] = {}
            s[data2[i][4:x]]['type'] = "EQ"
            s[data2[i][4:x]]['m'] = "NSE"            
    return symbols

def get_COM_symbols(t):
    data = pd.read_csv('x2.csv',header=None)
    symbols = []
    data2 = data[:][9]
    if(t=="FUT"):        
        for i in range(len(data2)):
            if(data2[i][len(data2[i])-3:]=="FUT"):
                symbols.append(data2[i][4:])
                s[data2[i][4:]] = {}
                s[data2[i][4:]]['lotsize'] = str(data[3][i])
                s[data2[i][4:]]['type'] = t
                s[data2[i][4:]]['m'] = "MCX"            
    if(t=="CE" or t=="PE"):        
        for i in range(len(data2)):
            if(data2[i][len(data2[i])-2:]==t):
                s3 = data[1][i]
                x = s3.find(' ')
                x1 = s3.rfind(' ')
                s2 = s3[:x] + s3[x+1:x+3] + get_month(s3[x+4:x+7]) + s3[x+8:x+10] + s3[x+11:x1] + s3[x1+1:]
                symbols.append(s2)
                s[s2] = {}
                s[s2]['lotsize'] = str(data[3][i])
                s[s2]['type'] = t
                s[s2]['m'] = "MCX"
    return symbols

def get_CM_FO_symbols(t):
    data = pd.read_csv('x1.csv',header=None)
    symbols = []
    data2 = data[:][9]
    if(t=="FUT"):        
        for i in range(len(data2)):
            if(data2[i][len(data2[i])-3:]=="FUT"):
                symbols.append(data2[i][4:])
                s[data2[i][4:]] = {}
                s[data2[i][4:]]['lotsize'] = str(data[3][i])
                s[data2[i][4:]]['type'] = t
                s[data2[i][4:]]['m'] = "NSE"
    if(t=="CE" or t=="PE"):        
        for i in range(len(data2)):
            if(data2[i][len(data2[i])-2:]==t):
                s3 = data[1][i]
                x = s3.find(' ')
                x1 = s3.rfind(' ')
                s2 = s3[:x] + s3[x+1:x+3] + get_month(s3[x+4:x+7]) + s3[x+8:x+10] + s3[x+11:x1] + s3[x1+1:]
                symbols.append(s2)
                s[s2] = {}
                s[s2]['lotsize'] = str(data[3][i])
                s[s2]['type'] = t
                s[s2]['m'] = "NSE"
    return symbols

def get_month(x):
    if(x == "Jan"):
        return "01"
    if(x == "Feb"):
        return "02"
    if(x == "Mar"):
        return "03"
    if(x == "Apr"):
        return "04"
    if(x == "May"):
        return "05"
    if(x == "Jun"):
        return "06"
    if(x == "Jul"):
        return "07"
    if(x == "Aug"):
        return "08"
    if(x == "Sep"):
        return "09"
    if(x == "Oct"):
        return "10"
    if(x == "Nov"):
        return "11"
    if(x == "Dec"):
        return "12"
    

s["EQ"] = get_CM_symbols("EQ")
s["COM_FUT"] = get_COM_symbols("FUT")
s["COM_OP_CE"] = get_COM_symbols("CE")
s["COM_OP_PE"] = get_COM_symbols("PE")
s["CM_FUT"] = get_CM_FO_symbols("FUT")
s["CM_OP_CE"] = get_CM_FO_symbols("CE")
s["CM_OP_PE"] = get_CM_FO_symbols("PE")

with open("symbols_data.json", "w") as outfile:
    json.dump(s,outfile)
