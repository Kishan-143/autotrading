// React 
import React, {Component,useEffect} from 'react';
import {BrowserRouter as Router,Route,Redirect,Switch} from 'react-router-dom';
import cookie from "react-cookies";
// Material ui
import Container from '@material-ui/core/Container'
import AppBar from '@material-ui/core/AppBar'
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import RadioGroup from '@material-ui/core/RadioGroup'
import Radio from '@material-ui/core/Radio'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import CheckBox from '@material-ui/core/Checkbox'
import Button from '@material-ui/core/Button'
import InputAdornment from '@material-ui/core/InputAdornment'
import { ThemeProvider, withStyles } from "@material-ui/core/styles";
import InputLabel from '@material-ui/core/InputLabel';
import Toolbar from '@material-ui/core/Toolbar'
import Link from '@material-ui/core/Link';
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'

import SymbolPrice from './SymbolPrice'
var styles = theme => ({
  root: {
    display: 'flex',
    justifyContent:'center',
    flexWrap: 'wrap',
    '& > *': {
      margin : '0%',
      width: theme.spacing(60),
      height: theme.spacing(90),
    },
  },
  dialogPaper : {
    display: 'flex',
    justifyContent:'center',
    width: theme.spacing(60),
    height: theme.spacing(50),
  },
  textfeild : {
    margin : "0px",
    width :"60px"
  },
  textfield2 : {
      width : "120px"
  },
  textfield3 : {
    width : "100px"
  },
  textfield4 : {
    width : "140px"
  },
  buyButton : {
    color : 'green',
    backgroundColor : 'lightgrey',
    width :'80px',
    fontSize : '20px'
  },
  sellButton : {
    color : 'red',
    backgroundColor : 'lightgrey',
    width :'80px',
    fontSize : '20px'
  },
  intraButton : {
    color : 'green',
    backgroundColor : 'lightgrey',
    width :'100px',
    fontSize : '20px'
  },
  cncButton : {
    color : 'red',
    backgroundColor : 'lightgrey',
    width :'100px',
    fontSize : '20px'
  },
  dialogtitle : {
      fontSize : "0px",
      align : 'center'  
  },
  header : {
    margin : "0px",
    fontSize : "20px",
    fontWeight : "bold",
    fontStyle : "italic",
  },
  title : {
    flexGrow : "1",
  },
  select : {
    variant : "outlined",
    width : "200px"
  },
  sell : {
      color : "default",
  },
  prevOrder : {
      color : "red"
  },     
});

class OrderPlaceSymbol extends Component {
    constructor(props) {
      super(props);
      this.state = {
            username : this.props.username,
            open : {
                'orderplacesymbol' : false
            },
            selectedSymbol : '',
            side : '',
            productType : '',
            orderType : 'market',
            limitPrice:'-',
            targetPrice:'-',
            targetPerc:'-',
            stoplossPrice:'-',
            stoplossPerc:'-',
            isTarget:false,
            isstoploss:false,
            qty:1,
            margin :0,
            fund : 0,
            loggedIn : false,
            rememberMe : false,
            error : '',
            buycolor : "default",
            sellcolor : "default",
            intracolor : "default",
            cnccolor : "default",
            isSubmit : false,
            buyQty : 0,
            sellQty : 0,
            market : 'EQ',
            symbolDetails : {},
            Ltype : '',
            lotqty : 1
        };
    }
    
    calculateAlreadyBuySellQty = () => {
        var buyQty = 0 
        var sellQty = 0 
        for(var i=0; i<this.props.activeOrders.length; i++){
            if(this.props.activeOrders[i].side.toLowerCase() == "buy"){
                buyQty += this.props.activeOrders[i].qty
            }
            if(this.props.activeOrders[i].side.toLowerCase() == "sell"){
                sellQty += this.props.activeOrders[i].qty
            }
        }
        this.setState({
            buyQty:buyQty,
            sellQty:sellQty
        })
    }
    getSymbolDetails = (s) => {
        var data1 = require("./symbols_data.json");
        return data1[s]
    }
    componentDidMount() {
        this.setState({symbolDetails:this.getSymbolDetails(this.props.symbol)},()=>{
            if(this.props.markets[this.state.symbolDetails.m] == "yes"){
                this.handleOpenDialog()
                this.calculateAlreadyBuySellQty()
                this.getFunds()
                this.setValue()
        
            }         
            else{
                alert(this.state.symbolDetails.m + " is not open.")
            }
        })
    }

    handleCloseDialog = () => {
        this.setState({
            open:{
                ...this.state.open,
                ['orderplacesymbol']:false
            }
        },()=>{
            if (this.props.side == "Buy") {
                this.props.closeBuy(this.state.selectedSymbol)
            } 
            if (this.props.side == "Sell") {
                this.props.closeSell(this.state.selectedSymbol)
            }     
        })

    }
    handleOpenDialog = () => {
        this.setState({
            open:{
                ...this.state.open,
                ['orderplacesymbol']:true
            }
        })
    }

    setValue = () => {
        this.setState({
            selectedSymbol : this.props.symbol,
            side : this.props.side,
            market : this.props.market,            
        },()=>{
            this.colorSide(this.props.side)
            this.calculateCom()
        })
    }

    handleChangeSide = (e) => {
        this.setState({side:e.target.value},()=>{
            this.calculateLtype()
            this.calculateMargin()
        })
    } 

    handleChangeproductType =  (e) => {
        this.setState({productType:e.target.value})
    }

    handleChangeorderType = (e) => {
        this.setState({orderType:e.target.value},()=>{
            this.colorOrder()
        })
    }

    handleChangelimitPrice = (e) => {
        this.setState({limitPrice:e.target.value})
    }

    handleqty = (e) => {
        this.setState({qty:e.target.value})
    }

    handlelotqty = (e) => {
        this.setState({lotqty:e.target.value},()=>{
            this.setState({qty:this.state.symbolDetails.lotsize*this.state.lotqty})
        })
    }

    handleChangeistarget = (e) => {
        this.state.isTarget == true ?(this.setState({isTarget:false})):(this.setState({isTarget:true}))
    }
    
    handleChangeisstoploss = (e) => {
        this.state.isstoploss == true ?(this.setState({isstoploss:false})):(this.setState({isstoploss:true}))
    }

    handleChangetargetPrice = (e) => {
        this.setState({targetPrice:e.target.value},()=>{
            this.calculateTargetPerc()
        })
    }

    handleChangetargetPerc = (e) => {
        this.setState({targetPerc:e.target.value},()=>{
        //            this.calculateTargetPr()
        })
    }

    handleChangestoplossPrice = (e) => {
        this.setState({stoplossPrice:e.target.value},()=>{
            this.calculateStoplossPerc()
        })
    }

    calculateStoplossPerc = () => {
        var perc = ((this.state.stoplossPrice-this.props.price)/this.props.price)*100
        this.setState({stoplossPerc:this.state.side == "buy" ? (-1*perc):(perc)})
    }

    calculateTargetPerc = () => {
        var perc = ((this.state.targetPrice-this.props.price)/this.props.price)*100
        this.setState({targetPerc:this.state.side == "sell" ? (-1*perc):(perc)})
    }

    calculateMargin = () => {
        if(this.state.symbolDetails.type == "EQ"){
            var alreadyQty = (this.state.side == "buy")? (this.state.sellQty):(this.state.buyQty)
            var qty1 = (alreadyQty>this.state.qty)? (0):(this.state.qty-alreadyQty)    
            if(this.state.orderType == "limit"){
                this.setState({margin:((this.state.limitPrice*qty1)/this.props.userFunds["L"+this.state.productType+this.state.market])})
            }
            if(this.state.orderType == "market"){
                this.setState({margin:((this.props.price*qty1)/this.props.userFunds["L"+this.state.productType+this.state.market])})
            }    
        }
        else
        {
            var alreadyQty = (this.state.side == "buy")? (this.state.sellQty):(this.state.buyQty)
            var qty1 = (alreadyQty>this.state.qty)? (0):(this.state.qty-alreadyQty) 
            if(qty1>0)
            {
                if(this.state.side.toUpperCase() == "BUY"){
                    if(this.state.orderType == "limit"){
                        this.setState({margin:((this.state.limitPrice*qty1)/this.props.userFunds["L"+this.state.productType+"OP"+this.state.side.toUpperCase()])})
                    }
                    if(this.state.orderType == "market"){
                        this.setState({margin:((this.props.price*qty1)/this.props.userFunds["L"+this.state.productType+"OP" +this.state.side.toUpperCase()])})
                    }        
                }    
            }
            else
                this.setState({margin:0})
        }
    }

    calculateLtype = () => {
        var s = "L" + this.state.productType
        s = s + this.state.symbolDetails.type

        if(this.state.symbolDetails.type == "COM_FUT" || this.state.symbolDetails.type == "CM_FUT"){
            s = s + this.state.side.toUpperCase()
        }
        if(this.state.symbolDetails.type == "CE" || this.state.symbolDetails.type == "PE" || this.state.symbolDetails.type == "FUT" ){
            s = s + this.state.side.toUpperCase()
        }
        this.setState({Ltype:s})
    }
    calculateCom = () => {
        if(this.state.symbolDetails.type == "EQ"){
            if(this.state.orderType == "market"){
                this.setState({com : parseFloat(Math.max(20,this.props.userFunds["COMEQ"]*this.props.price*this.state.qty*0.01))})
            }else{
                this.setState({com : parseFloat(Math.max(20,this.props.userFunds["COMEQ"]*this.state.limitPrice*this.state.qty*0.01))})
            }
        }else if(this.state.symbolDetails.type == "CE" || this.state.symbolDetails.type == "PE"){ 
            this.setState({com : parseFloat(Math.max(20,this.props.userFunds["COMOP"]*this.state.lotqty))})
        }
        else if(this.state.symbolDetails.type == "FUT"){ 
            this.setState({com : parseFloat(Math.max(20,this.props.userFunds["COMFUT"]*this.state.lotqty))})
        }
    }
    colorSide = (x) => {
        if(x == "buy"){
            var property = document.getElementById("buyButton")

            if(property != null && property != 'undefined'){
                property.style.backgroundColor = "green"
                property.style.color = "white"    
            }
            property = document.getElementById("sellButton");
            if(property != null && property != 'undefined'){
                property.style.backgroundColor = "lightgrey"
                property.style.color = "red"
            }
        }
        if(x == "sell" ){
            var property = document.getElementById("sellButton");
            if(property != null && property != 'undefined'){
                property.style.backgroundColor = "red"
                property.style.color = "white"
            }
            property = document.getElementById("buyButton");
    
            if(property != null && property != 'undefined'){
                property.style.backgroundColor = "lightgrey"
                property.style.color = "green"
            }
        }

    }

    colorOrder = () => {
    }

    colorProduct = () => {
        if(this.state.productType == "INTRA" ){
            var property = document.getElementById("intraButton")
            if(property != null && property != 'undefined'){
                property.style.backgroundColor = "green"
                property.style.color = "white"    
            }
            property = document.getElementById("cncButton");
            if(property != null && property != 'undefined'){
                property.style.backgroundColor = "lightgrey"
                property.style.color = "red"
            }
        }
        if(this.state.productType == "CNC"){
            var property = document.getElementById("cncButton");
            if(property != null && property != 'undefined'){
                property.style.backgroundColor = "red"
                property.style.color = "white"
            }
            property = document.getElementById("intraButton");
    
            if(property != null && property != 'undefined'){
                property.style.backgroundColor = "lightgrey"
                property.style.color = "green"
            }
        }
    }
    getFunds = () => {
        var username = cookie.load('username')
        var hashval = cookie.load('hashval')
        if(username){
        }else{
          username = ''
        }
        if(hashval){
        }else{
          hashval = ''
        }

        fetch('/api/user/funds/get', {
            method : 'post',
            headers: {'Content-Type':'application/json'},
            body : JSON.stringify({
                "username":username,
                "hashval":hashval
            })
        })
        .then(res => res.json())
        .then(res => {
            if(res.code==200){
                this.setState({userFunds:res['data']})
            }
        })
        .catch(err => {
            this.setState({error:err.msg})
        });
    }
    componentDidUpdate(props,state){
        if(this.state.side != state.side){
            this.calculateStoplossPerc()
            this.calculateTargetPerc()
            this.colorSide(this.state.side)
            this.calculateLtype()
            this.calculateMargin()
        }
        if(this.state.productType != state.productType){
            this.colorProduct()
            this.calculateLtype()
        }
        if(this.state.targetPrice != state.targetPrice){
            this.calculateTargetPerc()
        }
        if(this.state.stoplossPrice != state.stoplossPrice){
            this.calculateStoplossPerc()
        }
        if(this.state.orderType != state.orderType){
            this.colorOrder()    
            this.calculateMargin()
            this.calculateCom()
            this.calculateLtype()
        }
        if(this.state.productType != state.productType || this.state.orderType != state.orderType || this.state.qty != state.qty){
            this.calculateMargin()
        }
        
        if(this.props.price != props.price || this.state.limitPrice != state.limitPrice){
            this.calculateMargin()
            this.calculateStoplossPerc()
            this.calculateTargetPerc()
            this.calculateCom()
        }
        if(this.state.qty != state.qty){
            this.calculateMargin()
            this.calculateCom()
        }
        if(this.state.lotqty != state.lotqty){
            this.calculateMargin()
            this.calculateCom()
        }
    }
    handleSubmit = (e) => {
        var username = cookie.load('username')
        var hashval = cookie.load('hashval')
        if(username){
        }else{
          username = ''
        }
        if(hashval){
        }else{
          hashval = ''
        }
        alert("Order will be placed.")
        fetch('/api/order/place', {
            method : 'post',
            headers: {'Content-Type':'application/json'},
            body : JSON.stringify({
                "username":username,
                "hashval":hashval,
                "data":{
                    "ordertype":this.state.orderType.toLowerCase(),
                    "qty":this.state.symbolDetails.type=="EQ"?parseInt(this.state.qty):parseInt(this.state.symbolDetails.lotsize*this.state.lotqty),
                    "symbol":this.state.selectedSymbol.toUpperCase(),
                    "productType":this.state.productType.toUpperCase(),
                    "limit":this.state.limitPrice=="-"?("-"):(parseFloat(this.state.limitPrice)),
                    "stoploss":this.state.stoplossPrice=="-"?("-"):(parseFloat(this.state.stoplossPrice)),
                    "target":this.state.targetPrice=="-"?("-"):(parseFloat(this.state.targetPrice)),
                    "side":this.state.side.toLowerCase(), 
                    "market":this.state.market.toUpperCase(),
                    "price":parseFloat(this.props.price),
                    "margin":this.state.symbolDetails.type=="EQ"?(parseFloat(((this.state.margin/this.state.qty)*100)/100)):(parseFloat(((this.state.margin/(this.state.symbolDetails.lotsize*this.state.lotqty))*100)/100)),
                    "side2":this.state.limitPrice>this.props.price ? "over":"under",
                    "com" : parseFloat((this.state.com*100)/100)
                }
            })
        })
        .then(res => res.json())
        .then(res => {
            if(res.code==200){
                this.props.changeFund(- this.state.margin - this.state.com)
                this.props.passOrder(res.data)
            }
        })
        .catch(err => {
            this.setState({error:err.msg})
        });    
    }
    buyHandle = () => {
        this.setState({buycolor:"primary"})
        this.setState({sellcolor:"default"})
        this.handleChangeSide("Buy")        
        var property = document.getElementById("buyButton");
        property.style.backgroundColor = "green"
        property.style.color = "white"

        property = document.getElementById("sellButton");
        property.style.backgroundColor = "lightgrey"
        property.style.color = "red"
    }

    sellHandle = () => {
        this.setState({buycolor:"default"})
        this.setState({sellcolor:"secondary"})
        this.handleChangeSide("Sell")
        var property = document.getElementById("sellButton");
        property.style.backgroundColor = "red"
        property.style.color = "white"

        property = document.getElementById("buyButton");
        property.style.backgroundColor = "lightgrey"
        property.style.color = "green"

    }
    intraHandle = () => {
        this.setState({intracolor:"primary"})
        this.setState({cnccolor:"disabled"})
        this.handleChangeproductType("INTRA")
    }
    cncHandle = () => {
        this.setState({intracolor:"default"})
        this.setState({cnccolor:"primary"})
        this.handleChangeproductType("CNC")
    }
    render() {
        const { classes } = this.props;
        return (
            <div>
                <Dialog disableBackdropClick disableEscapeKeyDown 
                open={this.state.open.orderplacesymbol} 
                onClose={this.handleCloseDialog}
                aria-labelledby="p">
                <DialogTitle id="p" >
                    <Toolbar>
                        <div className={classes.title}>
                            Place a order
                        </div>
                        {this.state.side=="buy"?(
                            <TextField size="small" default variant="outlined" label="Available Sell Qty." value={this.state.sellQty} className={classes.textfield3}></TextField>                                   
                        ):(
                            <TextField size="small" default variant="outlined" label="Available Buy Qty." value={this.state.buyQty} className={classes.textfield3}></TextField>                                   
                        )}
                        <TextField size="small" default variant="outlined" label="Available Fund" value={Math.floor(this.props.userFunds.F*100)/100} className={classes.textfield4}></TextField>                                   
                    </Toolbar>
                </DialogTitle>
                <DialogContent>
                    <div className={classes.dialogPaper}>
                        <Grid container spacing={1}>
                            <Grid item xs = {6}>
                                <Grid container justify="center">
                                    <div>                                        
                                        <TextField size="small" default variant="outlined" label="Symbol" value={this.state.selectedSymbol}></TextField>
                                    </div>
                                </Grid>
                            </Grid>
                            <Grid item xs = {6}>
                                <Grid container justify="center">
                                    <div>                                        
                                        <TextField size="small" default variant="outlined" label="Market price" value={this.props.price}></TextField>
                                    </div>
                                </Grid>
                            </Grid>
                            <Grid item xs={5}>
                                <Grid container justify="center">
                                    <div>                   
                                        <button value="buy" id="buyButton" className={classes.buyButton}  onClick={this.handleChangeSide}>Buy</button>
                                        <button value="sell" id="sellButton" className={classes.sellButton}  onClick={this.handleChangeSide}>Sell</button>
                                    </div>
                                </Grid>
                            </Grid>
                            <Grid item xs={7}>
                                <Grid container justify="center">
                                    <div>                     
                                        <button id="intraButton" value="INTRA" variant="contained" className={classes.intraButton}  onClick={this.handleChangeproductType}>IntraDay</button>
                                        <button id="cncButton" value="CNC" variant="contained" className={classes.cncButton} onClick={this.handleChangeproductType}>CNC</button>
                                    </div>
                                </Grid>
                            </Grid>
                            <Grid item xs={4}>
                                <Grid container justify="center">
                                    <div>
                                        <RadioGroup onChange={this.handleChangeorderType} defaultValue={this.state.orderType}>
                                            <FormControlLabel value="market" control={<Radio />} label="Market"/>
                                            <FormControlLabel value="limit" control={<Radio />} label="Limit" />
                                        </RadioGroup>
                                    </div>
                                </Grid>
                            </Grid>
                            <Grid item xs={8}>
                                <Grid container justify="center">
                                    {this.state.orderType=="limit"?(
                                        <div>
                                        <TextField variant="outlined" size="small" placeholder="Limit order" label="Limit" value={this.state.limitPrice} onChange={this.handleChangelimitPrice}></TextField>
                                    </div>
                                        ):(
                                        <div>
                                        <TextField size="small" disabled default variant="outlined" label="Market price"value={this.props.price}></TextField>
                                    </div>
                                    )}
                                    {this.state.symbolDetails.type == "EQ"?(
                                        <TextField type="Number" size="small" default variant="outlined" label="qty" value={this.state.qty} onChange={this.handleqty}></TextField>                        
                                    ):(
                                        <div>
                                            <TextField size="small" default variant="outlined" label="Lot Size" value={this.state.symbolDetails.lotsize}></TextField>
                                            <TextField type="Number" size="small" default variant="outlined" label="Lot qty" value={this.state.lotqty} onChange={this.handlelotqty}></TextField>                        
                                        </div>
                                    )}
                                    <div>
                                    </div>
                                </Grid>
                            </Grid>
                            <Grid item xs={4}>
                                <Grid container justify="center">
                                    <div>
                                        <Button value="target" onClick={this.handleChangeistarget} variant="contained" color="primary">Target</Button>
                                    </div>
                                </Grid>
                            </Grid>
                            <Grid item xs={8}>
                                <Grid container justify="center">
                                {this.state.isTarget?(
                                  <div>
                                  <TextField className={classes.textfield2} placeholder="Target Price" label="Target Price" value={this.state.targetPrice} onChange={this.handleChangetargetPrice}></TextField>
                                  <TextField
                                        className={classes.textfield2}
                                      id="outlined-disabled"
                                      label="Per %"
                                      variant="outlined"
                                      onChange={this.handleChangetargetPerc}
                                      value={Math.floor(this.state.targetPerc*100)/100}
                                      InputProps={{
                                          startAdornment: <InputAdornment position="start">%</InputAdornment>,
                                      }}
                                  />
                                  </div>
                                ):(<div></div>)}
                                </Grid>
                            </Grid>
                        <Grid item xs={4}>
                                <Grid container justify="center">
                                    <div>
                                        <Button width="120px" value="stoploss" onClick={this.handleChangeisstoploss} variant="contained" color="primary">StopLoss</Button>
                                    </div>
                                </Grid>
                            </Grid>
                            <Grid item xs={8}>
                                <Grid container justify="center">
                                {this.state.isstoploss?(
                                  <div>
                                  <TextField className={classes.textfield2} placeholder="Triggerd Price" label="Triggered Price" value={this.state.stoplossPrice} onChange={this.handleChangestoplossPrice}></TextField>
                                  <TextField
                                        className={classes.textfield2}
                                      id="outlined-disabled"
                                      label="Per %"
                                      defaultValue=""
                                      variant="outlined"
                                      value={Math.floor(this.state.stoplossPerc*100)/100}
                                      InputProps={{
                                          startAdornment: <InputAdornment position="start">%</InputAdornment>,
                                      }}
                                  />
                                  </div>
                                ):(<div></div>)}
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container justify="center">
                                    <div>
                                        {this.state.orderType=="limit"?(
                                            <div>
                                                <Typography>{this.state.side}ing @{this.state.limitPrice}</Typography>
                                                <Typography>This Order Margin Req. : {Math.floor(this.state.margin*100)/100}</Typography>
                                                <Typography>This Order Commision Req. : {Math.floor(this.state.com*100)/100}</Typography>
                                            </div>
                                            ):(
                                            <div>
                                                <Typography>{this.state.side}ing @{this.props.price}</Typography>
                                                <Typography>This Order Margin Req. : {Math.floor(this.state.margin*100)/100}</Typography>
                                                <Typography>This Order Commision Req. : {Math.floor(this.state.com*100)/100}</Typography>
                                            </div>
                                        )}
                                    </div>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container justify="center">            
                                    {this.props.userFunds.F>=this.state.margin?(                                    
                                        <div>
                                            <Button type="submit" onClick={this.handleSubmit} variant="contained" color="primary">Place Order</Button>
                                        </div>
                                    ):(
                                        <div>
                                        </div>
                                    )}
                                </Grid>
                            </Grid>
                        </Grid>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleCloseDialog} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
        )
    }
  }
  export default withStyles(styles, { withTheme: true })(OrderPlaceSymbol);