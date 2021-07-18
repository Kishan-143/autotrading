
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

class PendingModify extends Component {
    constructor(props) {
      super(props);
      this.state = {
          username : this.props.username,
          open : {
              'ordermodify' : this.props.indication
          },
          userFunds : {},
          selectedSymbol : '',
          side : '',
          productType : '',
          orderType : 'market',
          limitPrice:'-',
          targetPrice:'-',
          tagetPerc:'-',
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
          sellQty : 0
      };
    }
    componentDidMount() {
    }
    componentWillUnmount() {
    }
    handleCloseDialog = () => {
        this.setState(prevState => ({
            open:{
              ...prevState.open,
              ['ordermodify']: false
            }
        }));
        this.props.closeOrder()
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

    handleOpenDialog = () => {
        this.setState(prevState => ({
            open:{
              ...prevState.open,
              ['ordermodify']: true
            }
        }));
        this.getFunds()
        this.setValue()
    }

    setValue = () => {
        if(this.props.order.stoplossPrice == "-"){
            this.setState({isstoploss:true})
        }
        if(this.props.order.targetPrice == "-"){
            this.setState({isTarget:true})
        }
        if(this.props.order.status == "Pending"){
            this.setState({orderType:"limit"})
        }
        this.setState({selectedSymbol:this.props.order.symbol})
        this.setState({side:this.props.order.side})
        this.setState({username:this.props.order.username})
        this.setState({limitPrice:this.props.order.price})
        this.setState({stoplossPrice:this.props.order.stoploss})
        this.setState({targetPrice:this.props.order.target})
        this.setState({qty:this.props.order.qty})
        this.setState({productType:this.props.order.product})
        this.colorSide(this.props.order.side)
        this.colorProduct()
        this.colorOrder()
    }

    handleChangeSide = (e) => {
        this.setState({side:e.target.value})
    } 

    handleChangeproductType =  (e) => {
        this.setState({productType:e.target.value})
    }

    handleChangeorderType = (e) => {
        this.setState({orderType:e.target.value})
    }

    handleChangelimitPrice = (e) => {
        this.setState({limitPrice:e.target.value})
    }

    handleqty = (e) => {
        this.setState({qty:e.target.value})
    }

    handleChangeistarget = (e) => {
        this.state.isTarget == true ?(this.setState({isTarget:false})):(this.setState({isTarget:true}))
    }
    
    handleChangeisstoploss = (e) => {
        this.state.isstoploss == true ?(this.setState({isstoploss:false})):(this.setState({isstoploss:true}))
    }

    handleChangetargetPrice = (e) => {
        this.setState({targetPrice:e.target.value})
    }

    handleChangestoplossPrice = (e) => {
        this.setState({stoplossPrice:e.target.value})
    }

    calculateStoplossPerc = () => {
        var perc = ((this.state.stoploss-this.props.price)/this.props.price)*100
        this.setState({stoplossPerc:this.state.side == "buy" ? (-1*perc):(perc)})
    }

    calculateTargetPerc = (e) => {
        var perc = ((this.state.target-this.props.price)/this.props.price)*100
        this.setState({targetPerc:this.state.side == "sell" ? (-1*perc):(perc)})
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
        if(this.state.productType == "INTRA"  && this.state.open.ordermodify == true){
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
        if(this.state.productType == "CNC" && this.state.open.ordermodify == true){
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

    colorProduct = () => {
        if(this.state.productType == "INTRA"  && this.state.open.ordermodify == true){
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
        if(this.state.productType == "CNC" && this.state.open.ordermodify == true){
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

    componentDidUpdate(props,state){
        if(this.state.side != state.side){
            this.calculateStoplossPerc()
            this.calculateTargetPerc()
            this.colorSide(this.state.side)
        }
        if(this.state.productType != state.productType){
            this.colorProduct()
        }
        if(this.state.targetPrice != state.targetPrice){
            this.calculateTargetPerc()
        }
        if(this.state.stoplossPrice != state.stoplossPrice){
            this.calculateStoplossPerc()
        }
        if(this.state.orderType != state.orderType){
            this.colorOrder()    
        }
        if(this.props.indication != props.indication){
            if(this.props.indication == true){
                this.handleOpenDialog()
            }else{
                this.handleCloseDialog()
            }
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

        var data = {
            "ordertype":this.props.orderType.toLowerCase(),
            "qty":parseInt(this.state.qty),
            "symbol":"NSE:" + this.state.selectedSymbol.toUpperCase(),
            "productype":this.state.productType.toUpperCase(),
            "limit":this.state.limitPrice=="-"?("-"):(parseFloat(this.state.limitPrice)),
            "stoploss":this.state.stoplossPrice=="-"?("-"):(parseFloat(this.state.stoplossPrice)),
            "target":this.state.target=="-"?("-"):(parseFloat(this.state.target)),
            "side":this.state.side.toLowerCase(), 
            "market":this.state.market.toUpperCase(),
            "price":parseInt(this.props.ordeprice),
            "margin":this.props.ordeType == "market" ? parseFloat((this.props.price)/this.state.userFunds["L"+this.state.productType+this.state.market]):parseFloat((this.props.limitPrice)/this.state.userFunds["L"+this.state.productType+this.state.market]),
            "side2":this.state.limitPrice>this.props.price ? "over":"under" 
        }
        alert(" Order will be placed.")
        fetch('/api/order/place', {
            method : 'post',
            headers: {'Content-Type':'application/json'},
            body : JSON.stringify({
                "username":username,
                "hashval":hashval,
                "data":{
                    "ordertype":this.props.ordeType.toLowerCase(),
                    "qty":parseInt(this.state.qty),
                    "symbol":"NSE:" + this.state.selectedSymbol.toUpperCase(),
                    "productype":this.state.productType.toUpperCase(),
                    "limit":this.state.limitPrice=="-"?("-"):(parseFloat(this.state.limitPrice)),
                    "stoploss":this.state.stoplossPrice=="-"?("-"):(parseFloat(this.state.stoplossPrice)),
                    "target":this.state.targetPrice=="-"?("-"):(parseFloat(this.state.targetPrice)),
                    "side":this.state.side.toLowerCase(), 
                    "market":this.state.market.toUpperCase(),
                    "price":parseFloat(this.props.price),
                    "margin":this.props.ordeType == "market" ? parseFloat((this.props.price)/this.state.userFunds["L"+this.state.productType+this.state.market]):parseFloat((this.props.limitPrice)/this.state.userFunds["L"+this.state.productType+this.state.market]),
                    "side2":this.state.limitPrice>this.props.price ? "over":"under",
                    "com" : parseFloat(Math.max(this.state.userFunds.COM*0.01*this.props.price*this.state.qty,20))
                }
            })
        })
        .then(res => res.json())
        .then(res => {
            if(res.code==200){
                this.props.passActiveOrders(data)
            }
        })
        .catch(err => {
            alert(err.msg)
            this.setState({error:err.msg})
        });    
    }


    render() {
        const { classes } = this.props;
        return (
            <div>
                <Dialog disableBackdropClick disableEscapeKeyDown 
                open={this.state.open.ordermodify} 
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
                        <TextField size="small" default variant="outlined" label="Available Fund" value={Math.floor(this.state.userFunds["F" + this.state.market]*100)/100} className={classes.textfield4}></TextField>                                   
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
                                        <button value="buy" id="buyButton" className={classes.buyButton} onClick={this.handleChangeSide}>Buy</button>
                                        <button value="sell" id="sellButton" className={classes.sellButton} onClick={this.handleChangeSide}>Sell</button>
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
                                    <TextField type="Number" size="small" default variant="outlined" label="qty" value={this.state.qty} onChange={this.handleqty}></TextField>                        
                                </Grid>
                            </Grid>
                            <Grid item xs={4}>
                                <Grid container justify="center">
                                    <div>
                                        <Button onClick={this.handleChangeistarget} variant="contained" color="primary">Target</Button>
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
                                      defaultValue=""
                                      variant="outlined"
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
                                        <Button onClick={this.handleChangeisstoploss} variant="contained" color="primary">StopLoss</Button>
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
                                                <Typography>This Order Margin Req. : {Math.floor(((this.state.limitPrice*this.state.qty)/this.state.userFunds["L"+this.state.productType+this.state.market])*100)/100}</Typography>
                                            </div>
                                            ):(
                                            <div>
                                                <Typography>{this.state.side}ing @{this.props.price}</Typography>
                                                <Typography>This Order Margin Req. : {Math.floor(((this.props.price*this.state.qty)/this.state.userFunds["L"+this.state.productType+this.state.market])*100)/100}</Typography>
                                            </div>
                                        )}
                                    </div>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container justify="center">                                    
                                    {this.state.userFunds["F" + this.state.market]>=(this.props.price*this.state.qty)/this.state.userFunds["L"+this.state.productType+this.state.market]?(                                    
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
  export default withStyles(styles, { withTheme: true })(PendingModify);