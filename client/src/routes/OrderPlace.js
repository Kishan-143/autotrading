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
import { withStyles } from "@material-ui/core/styles";
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
      height: theme.spacing(70),
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
  button : {
    width :"80px"
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
  }
  
});

class OrderPlace extends Component {
    constructor(props) {
      super(props);
      this.state = {
          username : '',
          open : {
              'orderplace' : false
          },
          orderprice : 0,
          market : '-',
          symbols : [],
          selectedSymbol : '-',
          symbolPrice:0,
          side:'',
          productType:'',
          orderType:'',
          limitPrice:'-',
          targetPrice:'-',
          tagetPerc:'-',
          stoplossPrice:'-',
          stoplossPerc:'-',
          isTarget:false,
          isstoploss:false,
          qty:1,
          userFunds : {},
          margin :0,
          fund : 0,
          loggedIn : false,
          rememberMe : false,
          error : '',
          buycolor : "default",
          sellcolor : "default",
          intracolor : "default",
          cnccolor : "default",
          isSubmit : false
          
      };
    }
    componentDidMount() {
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

        fetch('/api/get/user/funds', {
            method : 'post',
            headers: {'Content-Type':'application/json'},
            body : JSON.stringify({
                "username":username
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
    componentWillUnmount() {
    }
    handleCloseDialog = () => {
        this.setState(prevState => ({
            open:{
              ...prevState.open,
              ['orderplace']: false
            }
        }));
    }
    handleOpenDialog = () => {
        this.setState(prevState => ({
            open:{
              ...prevState.open,
              ['orderplace']: true
            }
        }));
    }
    handleSelectMarket = (e) => {
        
        this.setState({market:e.target.value})
        fetch('/api/get/symbols', {
            method : 'post',
            headers: {'Content-Type':'application/json'},
            body : JSON.stringify({
                "type" : e.target.value,
                "from" : "CM"
            })
        })
        .then()
        .then(res => res.json())
        .then(res => {
            this.setState({symbols:res["EQ"]})
        })
        .catch(err => {
          this.setState({error:err.msg})
        });
    }
    handleChangeSymbol = (e) => {
        fetch('/api/remove/symbols', {
            method : 'post',
            headers: {'Content-Type':'application/json'},
            body : JSON.stringify({
                "symbols" : [this.state.selectedSymbol],
                "market": this.state.market
            })
        })
        .then(res => res.json())
        .then(res => {
        })
        .catch(err => {
            this.setState({error:err.msg})
        });
        
        fetch('/api/add/symbol', {
            method : 'post',
            headers: {'Content-Type':'application/json'},
            body : JSON.stringify({
                "symbol" : e.target.value,
                "market": this.state.market
            })
        })
        .then(res => res.json())
        .then(res => {
        })
        .catch(err => {
            this.setState({error:err.msg})
        });
        this.setState({selectedSymbol:e.target.value})
    }
    handleChangeSide = async (e) => {
        this.setState({side:e})        
        if(e=="Buy"){
            this.setState({targetPerc:((this.state.targetPrice-this.state.symbolPrice)/this.state.symbolPrice)*100})        
        }
        if(e=="Sell"){
            this.setState({targetPerc:((-this.state.targetPrice+this.state.symbolPrice)/this.state.symbolPrice)*100})        
        }
        if(e=="Sell"){
            this.setState({stoplossPerc:((this.state.stoplossPrice-this.state.symbolPrice)/this.state.symbolPrice)*100})        
        }
        if(e=="Buy"){
            this.setState({stoplossPerc:((-this.state.stoplossPrice+this.state.symbolPrice)/this.state.symbolPrice)*100})        
        }
        await this.calculateMargin()
    } 
    handleChangeproductType = async (e) => {
        this.setState({productType:e})
        await this.calculateMargin()
    }
    handleChangeorderType = async (e) => {
        this.setState({orderType:e.target.value})
        await this.handleChangeOrderprice()
    }
    handleChangelimitPrice = async (e) => {
        this.setState({limitPrice:e.target.value})
        await this.handleChangeOrderprice()
    }
    handleChangeOrderprice = async () => {
        if(this.state.orderType=="market"){
            this.setState({orderprice:this.state.symbolPrice})      
        }else{
            this.setState({orderprice:this.state.limitPrice})
        }
        await this.calculateMargin()          
    }
    handleqty = async (e) => {
        this.setState({qty:e.target.value})
        await this.calculateMargin()
    }

    handleChangeistarget = (e) => {
        if(this.state.isTarget==true)
            this.setState({isTarget:false})
        if(this.state.isTarget==false)
            this.setState({isTarget:true})
    }
    handleChangeisstoploss = (e) => {
        if(this.state.isstoploss==true)
            this.setState({isstoploss:false})
        if(this.state.isstoploss==false)
            this.setState({isstoploss:true})
    }
    handleChangetargetPrice = (e) => {
        if(this.state.side=="Buy"){
            this.setState({targetPrice:e.target.value})
            this.setState({targetPerc:((e.target.value-this.state.symbolPrice)/this.state.symbolPrice)*100})        
        }
        if(this.state.side=="Sell"){
            this.setState({targetPrice:e.target.value})
            this.setState({targetPerc:((-e.target.value+this.state.symbolPrice)/this.state.symbolPrice)*100})        
        }
    }
    handleChangestoplossPrice = (e) => {
        if(this.state.side=="Buy"){
            this.setState({stoplossPrice:e.target.value})
            this.setState({stoplossPerc:((-e.target.value+this.state.symbolPrice)/this.state.symbolPrice)*100})        
        }
        if(this.state.side=="Sell"){
            this.setState({stoplossPrice:e.target.value})
            this.setState({stoplossPerc:((e.target.value-this.state.symbolPrice)/this.state.symbolPrice)*100})        
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

        alert(" Order will be placed.")
        fetch('/api/order/place', {
            method : 'post',
            headers: {'Content-Type':'application/json'},
            body : JSON.stringify({
                "username":username,
                "hashval":hashval,
                "data":{
                    "ordertype":this.state.orderType,
                    "qty":this.state.qty,
                    "symbol":this.state.selectedSymbol,
                    "productype":this.state.productType,
                    "limit":parseInt(this.state.limitPrice),
                    "stoploss":parseInt(this.state.stoplossPrice),
                    "target":parseInt(this.state.targetPrice),
                    "side":this.state.side.toLowerCase(), 
                    "market":this.state.market,
                    "price":parseInt(this.state.orderprice),
                    "margin":parseInt(this.state.margin),
                    "side2":"under"
                }
            })
        })
        .then(res => res.json())
        .then(res => {
        })
        .catch(err => {
            this.setState({error:err.msg})
        });    
    }

    calculateMargin = async () => {
        var s = "F" +  this.state.market 
        var fund = this.state.userFunds[s] 
        s = "L" + this.state.productType + this.state.market 
        var levrage = this.state.userFunds[s]  
        var margin = (this.state.orderprice*this.state.qty)/levrage
        if(margin<=fund){
            this.setState({isSubmit:true})
        }else{
            this.setState({isSubmit:false})
        }
        await this.setState({margin:margin,fund:fund})
    }

    changePrice = async (symbol,price) => {
        this.setState({symbolPrice:price})
        await this.handleChangeOrderprice()
    }
    buyHandle = () => {
        this.setState({buycolor:"primary"})
        this.setState({sellcolor:"default"})
        this.handleChangeSide("Buy")
        
    }
    sellHandle = () => {
        this.setState({buycolor:"default"})
        this.setState({sellcolor:"secondary"})
        this.handleChangeSide("Sell")
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
                <Button color="inherit" onClick={this.handleOpenDialog}>OrderPlace</Button>
                <Dialog disableBackdropClick disableEscapeKeyDown 
                open={this.state.open.orderplace} 
                onClose={this.handleCloseDialog}
                aria-labelledby="p">
                <DialogTitle id="p" >
                    <Toolbar>
                        <div className={classes.title}>
                            Place a order
                        </div>
                        <TextField size="small" default variant="outlined" label="Market price" value={this.state.symbolPrice}></TextField>
                    </Toolbar>
                </DialogTitle>
                <DialogContent>
                    <div className={classes.dialogPaper}>
                        <Grid container spacing={1}>
                            <Grid item xs={6}>
                                <Grid container justify="center">
                                    <div>
                                        <Grid item xs={6}>
                                        <InputLabel id="marketselect">Market</InputLabel>
                                        <Select className={classes.select}
                                        labelId="marketselect"
                                        id="marketselect"
                                        label="Market"
                                        onChange={this.handleSelectMarket}
                                        >
                                        <MenuItem value="EQ">Equity</MenuItem>
                                        <MenuItem value="FO">Future & Options</MenuItem>
                                        <MenuItem value="CO">Comodity</MenuItem>
                                        </Select>
                                        </Grid>
                                    </div>
                                </Grid>
                            </Grid>
                            <Grid item xs={6}>
                                <Grid container justify="center">
                                    {this.state.market=='-'?(<div></div>):(
                                    <div>
                                        <Grid item xs={6}>
                                        <InputLabel id="symbolselect">Symbol</InputLabel>
                                        <Select className={classes.select}
                                        labelId="symbolselect"
                                        id="symbolselect"
                                        label="Symbol"
                                        onChange={this.handleChangeSymbol}
                                        >
                                        {this.state.symbols.map(symbol => (
                                            <MenuItem value={symbol}>{symbol}</MenuItem>
                                        ))}
                                        </Select>
                                        </Grid>
                                    </div>
                                    )}
                                </Grid>
                            </Grid>
                            <Grid item xs={5}
                            >
                                <Grid container justify="center">
                                    <div>                                        
                                        <Button className={classes.button} id="buy" variant="contained" color={this.state.buycolor} onClick={this.buyHandle}>Buy</Button>
                                        <Button className={classes.button} id="sell" variant="contained" color={this.state.sellcolor} onClick={this.sellHandle}>Sell</Button>
                                    </div>
                                </Grid>
                            </Grid>
                            <Grid item xs={7}>
                                <Grid container justify="center">
                                    <div>                                        
                                        <Button className={classes.button} id="INTRA" variant="contained" color={this.state.intracolor} onClick={this.intraHandle}>IntraDay</Button>
                                        <Button className={classes.button} id="CNC" variant="contained" color={this.state.cnccolor} onClick={this.cncHandle}>CNC</Button>
                                    </div>
                                </Grid>
                            </Grid>
                            <Grid item xs={4}>
                                <Grid container justify="center">
                                    <div>
                                        <RadioGroup onChange={this.handleChangeorderType}>
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
                                        <TextField size="small" disabled default variant="outlined" label="Market price"value={this.state.symbolPrice}></TextField>
                                    </div>
                                    )}
                                    <TextField type="Number" size="small" default variant="outlined" label="qty" value={this.state.qty} onChange={this.handleqty}></TextField>                        

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
                                      defaultValue=""
                                      variant="outlined"
                                      value={this.state.targetPerc}
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
                                      value={this.state.stoplossPerc}
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
                                        <Typography>{this.state.side}ing @{this.state.orderprice}</Typography>
                                        <Typography>Margin Req. : {this.state.margin}</Typography>
                                    </div>
                                </Grid>
                            </Grid>

                            <Grid item xs={12}>
                                <Grid container justify="center">
                                    {this.state.isSubmit==true?(                                    
                                    <div>
                                        <Button type="submit" onClick={this.handleSubmit} variant="contained" color="primary">Place Order</Button>
                                    </div>
                                    ):(
                                        <div>
                                            Your Availble Fund is : {this.state.fund}
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
  export default withStyles(styles, { withTheme: true })(OrderPlace);