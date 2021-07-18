function get_all_symbol_list() {
    var data = []
    var data1 = require("./symbols_data.json");
    data = [...data,...data1["EQ"]]
    data = [...data,...data1["CM_FUT"]]
    data = [...data,...data1["CM_OP_CE"]]
    data = [...data,...data1["CM_OP_PE"]]
    data = [...data,...data1["COM_FUT"]]
    data = [...data,...data1["COM_OP_CE"]]
    data = [...data,...data1["COM_OP_PE"]]
    return data
}

function get_eq_symbols_list() {
    
}

function get_fo_symbols_list() {
    
}

function get_fo_symbols_list() {
    
}

console.log(get_all_symbol_list())