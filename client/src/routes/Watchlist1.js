// React 
import React, {Component} from 'react';
import cookie from "react-cookies";
import {TableRow, TableBody,TableCell,Table,TableContainer,TableHead,Paper} from '@material-ui/core'
import { Fragment } from 'react';
import Button from '@material-ui/core/Button'
import { withStyles } from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography'
import Toolbar from '@material-ui/core/Toolbar'
import SymbolPrice from './SymbolPrice'
import AddSymbol from './AddSymbol';
import RemoveSymbol from './RemoveSymbol';
import OrderPlace from './OrderPlace'
import OrderPlaceSymbol from './OrderPlaceSymbol';
import Input from '@material-ui/core/Input'

var styles = theme => ({
    button :{
        width :"33.3%"
    },
    buyButton : {
      color : 'green',
      '&:hover': {
        background: "green",
        color : "white"
      },
      size : "small"
    },
    sellButton : {
      color : 'red',
      '&:hover': {
        background: "red",
        color : "white"
      },
      fontsize:"10px",
      size : "small"
    },   
    toolbar : {
      flexGrow :"1"
    },
    remove : {
      padding: "4px 4px 4px 4px",
    },container:{
      maxHeight : "500px"
    }
  });
  

class Watchlist1 extends Component{
    constructor(props) {
        super(props);
        this.state = {
          watchlist : [],
          prices : {},
          isAdd : false,
          isBuy : {},
          isSell : {},
          activeOrders : this.props.activeOrders
        };
    }
    y = (res) => {
        fetch('/api/data/symbols/price/add', {
            method : 'post',
            headers: {'Content-Type':'application/json'},
            body : JSON.stringify({
                "symbols" : res.symbols
            })
        })
        .then(res3 => res3.json())
        .then(res3 => {   
            var prices2 = {}
            for(var i = 0; i < res.symbols.length;i++){

              prices2[res.symbols[i]] = {
                "ltp":0,
                "prev_close":"1"
              } 
            }
            this.setState({
              prices : {...this.state.prices,...prices2}
            },()=>{
              this.setState({watchlist:[...this.state.watchlist, ...res.symbols]})                     
            })
        })
        .catch(err => {
            this.setState({error:err.msg})
        });
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

        fetch('/api/user/watchlist/get', {
          method : 'post',
          headers: {'Content-Type':'application/json'},
          body : JSON.stringify({
              "username" : username,
              "hashval" : hashval
          })
        })
        .then(res=>res.json())
        .then(res=>{
          if(res.code == 200){
            this.y(res)
            this.setBuySell(res.symbols)
          }else{
            this.setState({error:res.msg})
          }
      })
      .catch(err=>{
        this.setState({error:err.msg})
      })
      this.interval = setInterval(() => this.tick(), 10000);
    }
    
    tick = () => {
        fetch('/api/data/symbols/price/get', {
            method : 'post',
            headers: {'Content-Type':'application/json'},
            body : JSON.stringify({
                "symbols" : this.state.watchlist
            })
        })
        .then(res => res.json())
        .then(res => {
            this.setState({prices : {...this.state.prices}})
        })
        .catch(err => {
            this.setState({error:err.msg})
        });
    }
  
    componentWillUnmount() {
      clearInterval(this.interval);
    }

    setBuySell = (s) => {
      for(var i=0;i<s.length;i++){
        this.setState(prevState => ({
          isBuy:{
            ...prevState.isBuy,
            [s[i]]: false
          }
        }));  
        this.setState(prevState => ({
          isSell:{
            ...prevState.isSell,
            [s[i]]: false
          }
        }));  
      }      
    }
    handleBuy = (e) => {
      this.setState(prevState => ({
        isBuy:{
          ...prevState.isBuy,
          [e.target.value]: true
        }
      }));
    }
    handleSell = (e) => {
      this.setState(prevState => ({
        isSell:{
          ...prevState.isSell,
          [e.target.value]: true
        }
      }));
    }
    closeBuy = (symbol) => {
        this.setState(prevState => ({
            isBuy:{
              ...prevState.isBuy,
              [symbol]: false
            }
        }));   
    }
    closeSell = (symbol) => {
      this.setState(prevState => ({
          isSell:{
            ...prevState.isSell,
            [symbol]: false
          }
      }));   
    }
    handleRemoveSymbol = (e) => {
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

        fetch('/api/user/watchlist/remove', {
          method : 'post',
          headers: {'Content-Type':'application/json'},
          body : JSON.stringify({
              "symbol": e.target.value,
              "username":username,
              "hashval":hashval
          })
        })
        .then(res=>res.json())
        .then(res=>{
          if(res.code == 200){
            this.setState({watchlist:this.state.watchlist.filter(item=>item !=e.target.value)})
          }else{
            this.setState({error:res.msg})
          }
        })
        .catch(err=>{
          this.setState({error:err.msg})
        })
    }
    addWatchlist = (symbol) => {
      if(this.state.watchlist.indexOf(symbol)==-1){
        var res = {}
        res['symbols'] = [symbol]
        this.y(res)
      }
    }
    render(){
        const { classes } = this.props;
          return(
          <div>
            <AddSymbol watchlist={this.state.watchlist} addWatchlist={this.addWatchlist}></AddSymbol>              
            <TableContainer component={Paper} className={classes.container}>
              <Table aria-label='simple table'>
                  <TableBody>
                    {
                    this.state.watchlist.map(symbol=>(
                      <Fragment>
                        <TableRow>
                          <TableCell>
                            <Typography>{symbol}</Typography>
                          </TableCell>
                            <TableCell>
                              <button value={symbol} className={classes.buyButton} onClick={this.handleBuy}>Buy</button>
                              <button value={symbol} className={classes.sellButton}  onClick={this.handleSell}>Sell</button></TableCell>
                            {this.state.isBuy[symbol]==true?(<OrderPlaceSymbol activeOrders={this.props.activeOrders.filter(item=>item.symbol==symbol)}  market="EQ" symbol={symbol} indication={this.state.isBuy[symbol]} price={this.state.prices[symbol].ltp} side="Buy" closeBuy={this.closeBuy} passOrder={this.props.passOrder} changeFund={this.props.changeFund}></OrderPlaceSymbol>):(<div></div>)}
                            {this.state.isSell[symbol]==true?(<OrderPlaceSymbol activeOrders={this.props.activeOrders.filter(item=>item.symbol==symbol)}  market="EQ" symbol={symbol} indication={this.state.isSell[symbol]} price={this.state.prices[symbol].ltp} side="Sell" closeSell={this.closeSell} passOrder={this.props.passOrder} changeFund={this.props.changeFund}></OrderPlaceSymbol>):(<div></div>)}
                          <TableCell>
                          </TableCell>
                          <TableCell className={classes.remove}>                            
                            <Typography>{this.state.prices[symbol].ltp}</Typography>
                          </TableCell>
                          <TableCell className={classes.remove}>                            
                            <button color="inherit" value={symbol} onClick={this.handleRemoveSymbol}> - </button>
                          </TableCell>
                        </TableRow>
                      </Fragment>
                    ))}
                      </TableBody>
                  </Table>
              </TableContainer>
          </div>
      )
    }
}

export default withStyles(styles, { withTheme: true })(Watchlist1)