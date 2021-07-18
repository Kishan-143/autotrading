// React 
import React, {Component} from 'react';
import cookie from "react-cookies";
import {TableRow, TableBody,TableCell,Table,TableContainer,TableHead,Paper} from '@material-ui/core'
import { Fragment } from 'react';
import Button from '@material-ui/core/Button'
import { withStyles } from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography'
import OrderModify from './OrderModify';
import PendingModify from './PendingModify';

var styles = theme => ({
    button :{
        width :"25%"
    },
    orderbook : {
        height : "100px"
    },
    container :{
        maxHeight :"350px"
    },  
    color1 : {
        fontWeight : "bold",
        color : "green"
    },
    color2 : {
        fontWeight : "bold",
        color : "red"
    }
    
  });
class OrderBook extends Component{
    constructor(props) {
        super(props);
        this.state = {
            activecolor : "primary",
            pendingcolor : "default",
            completecolor : "default",
            cancelcolor : "default",
            activeOrders : [],
            pendingOrders : [],
            completeOrders : [],
            cancelOrders : [],
            symbolOrders : {},
            symbols : [],
            prices : {},
            pendingModify : false,
            profit : 0
        };
    }
    y = (res) => {
        var status = 'Active'
        var s1 = []
        for(var i = 0; i <res.data.length;i++){
            if(res.data[i].status == 'Pending')
                status = 'Pending'
            s1.push(res.data[i].symbol)                    
        }
        fetch('/api/data/symbols/price/add', {
            method : 'post',
            headers: {'Content-Type':'application/json'},
            body : JSON.stringify({
                "symbols" : s1
            })
        })
        .then(res3 => res3.json())
        .then(res3 => {
            if(res3.code == 200){
                fetch('/api/data/symbols/price/get', {
                    method : 'post',
                    headers: {'Content-Type':'application/json'},
                    body : JSON.stringify({
                        "symbols" : [...this.state.symbols,...s1]
                    })
                })
                .then(res2 => res2.json())
                .then(res2 => {
                    this.setState({
                        prices:{...this.state.prices,...res2.prices},
                        symbols:[...this.state.symbols,...s1]
                    },()=>{
                        if(status == 'Pending'){
                            this.setState({pendingOrders:[...res.data,...this.state.pendingOrders,]})
                        }else if(status == 'Active'){
                            this.setState({activeOrders:[...res.data,...this.state.activeOrders]})
                        }    
                    })
                })
                .catch(err => {
                    this.setState({error:err.msg})
                });
            }
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
        fetch('/api/order/get/pending', {
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
            }else{
                this.setState({error:res.msg})
            }
        })
        .catch(err=>{
            this.setState({error:err.msg})
        })  

        fetch('/api/order/get/active', {
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
            this.props.setActiveOrders(res.data)
        }else{
            this.setState({error:res.msg})
          }
        })
        .catch(err=>{
          this.setState({error:err.msg})
        })  

        fetch('/api/order/get/complete', {
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
              this.setState({completeOrders:res.data})  
              }else{
              this.setState({error:res.msg})
            }
          })
          .catch(err=>{
            this.setState({error:err.msg})
          }) 

          fetch('/api/order/get/cancel', {
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
              this.setState({cancelOrders:res.data})  
            }else{
              this.setState({error:res.msg})
            }
          })
          .catch(err=>{
            this.setState({error:err.msg})
          })   
        //this.interval = setInterval(() => this.tick(), 10000);

    }
    handleChangeActiveButton = (e) => {
        this.setState({activecolor:"primary",pendingcolor: "default",completecolor: "default",cancelcolor:"default"})
    }
    handleChangeCompleteButton = (e) => {
        this.setState({activecolor:"default",pendingcolor: "default",completecolor: "primary",cancelcolor:"default"})
    }
    handleChangePendingButton = (e) => {
        this.setState({activecolor:"default",pendingcolor: "primary",completecolor: "default",cancelcolor:"default"})
    }
    handleChangeCancelButton = (e) => {
        this.setState({activecolor:"default",pendingcolor: "default",completecolor: "default",cancelcolor:"primary"})
    }
    handleCancel = (e) => {
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

        fetch('/api/order/cancel', {
            method : 'post',
            headers: {'Content-Type':'application/json'},
            body : JSON.stringify({
                "username" : username,
                "hashval" : hashval,
                "id":e.target.value
            })
        })
        .then(res=>res.json())
        .then(res=>{
            if(res.code == 200){
                this.setState(prevState=>({cancelOrders:[...prevState.cancelOrders, res.data]}))
                //this.setState({pendingOrders:this.state.pendingOrders.filter(item=>item.orderid !=e.target.value)})
            }else{
                this.setState({error:res.msg})
            }
        })
        .catch(err=>{
            this.setState({error:err.msg})
        })  
    }
    handleExitAll = () => {
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

        fetch('/api/order/exit/all', {
            method : 'post',
            headers: {'Content-Type':'application/json'},
            body : JSON.stringify({
                "username" : username,
                "hashval" : hashval,
            })
        })
        .then(res=>res.json())
        .then(res=>{
            if(res.code == 200){
                var profit = 0
                this.setState({profit:profit})
            }else{
                this.setState({error:res.msg})
            }
        })
        .catch(err=>{
            this.setState({error:err.msg})
        })  

    }
    handleExit = (e) => {
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

        fetch('/api/order/exit', {
            method : 'post',
            headers: {'Content-Type':'application/json'},
            body : JSON.stringify({
                "username" : username,
                "hashval" : hashval,
                "orderid" : e.target.value
            })
        })
        .then(res=>res.json())
        .then(res=>{
            if(res.code == 200){
                this.setState({
                    completeOrders:[...this.state.completeOrders,res.data],
                    activeOrders : [...this.state.activeOrders.filter(item => item.orderid != e.target.value)]
                },this.calculateProfit)
                this.props.changeFund(res.fund)
            }else{
                this.setState({error:res.msg})
            }
        })
        .catch(err=>{
            this.setState({error:err.msg})
        })  
    }
    calculateProfit = () => {
        var profit = 0
        for(var i=0;i<this.state.activeOrders.length;i++){
            var order = this.state.activeOrders[i]
            if(order.side == "buy"){
                profit += (this.state.prices[order.symbol].ltp - order.price)*order.qty                    
            }else{
                profit += (-1*this.state.prices[order.symbol].ltp + order.price)*order.qty                    
            }
        }
        this.setState({profit:profit})
    }

    tick = () => {
        fetch('/api/data/symbols/price/get', {
            method : 'post',
            headers: {'Content-Type':'application/json'},
            body : JSON.stringify({
                "symbols" : this.state.symbols
            })
        })
        .then(res => res.json())
        .then(res => {
            this.setState({prices:{...this.state.prices,...res.prices}},this.calculateProfit)
        })
        .catch(err => {
            this.setState({error:err.msg})
        });
    }
  
    closeOrder = () => {
        //this.setState({pendingModify:false})
    }
    
    myfunc = (a,b) => {
        return a + b.qty
    }

    handlePendingModify = () => {
        this.setState({pendingModify:true})
    }

    changeOrder = () => {

    }

    componentDidUpdate(props,state){
        if(this.props.data != props.data){
            var res = {}
            res['data'] = [this.props.data]
            this.y(res)
        }
    }

    render(){
        const { classes } = this.props;
        let completeorders = (
        <div>
            <TableContainer component={Paper} className={classes.container}>
                <Table aria-label='simple table'>
                    <TableHead>
                        <TableRow>
                            <TableCell size='medium' >Symbol</TableCell>
                            <TableCell align='center' size='medium' >Call</TableCell>
                            <TableCell align='center' size='medium' >EntryTime</TableCell>
                            <TableCell align='center' size='medium' >EntryPrice</TableCell>
                            <TableCell align='center' size='medium' >ExitTime</TableCell>
                            <TableCell align='center' size='medium' >ExitPrice</TableCell>
                            <TableCell align='center' size='medium' >Qty</TableCell>
                            <TableCell align='center' size='medium' >Investment</TableCell>
                            <TableCell align='center' size='medium' >Commision</TableCell>
                            <TableCell align='center' size='medium' >Profit/Loss</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.completeOrders.map(order =>(
                                <Fragment>
                                <TableRow>
                                    <TableCell >{order.symbol}</TableCell>
                                    <TableCell align='center'>{order.side}</TableCell>
                                    <TableCell align='center'>{order.entrytime}</TableCell>
                                    <TableCell align='center'>{order.entryprice}</TableCell>
                                    <TableCell align='center'>{order.exittime}</TableCell>
                                    <TableCell align='center'>{order.exitprice}</TableCell>
                                    <TableCell align='center'>{order.qty}</TableCell>
                                    <TableCell align='center'>{Math.floor(order.qty*order.entryprice*100)/100}</TableCell>
                                    <TableCell align='center'>{Math.floor(order.com*100)/100}</TableCell>
                                    <TableCell align='center'>
                                        {order.side == "buy" ? (
                                            Math.floor((order.exitprice - order.entryprice)*order.qty*100)/100
                                        ):(
                                            Math.floor((-order.exitprice + order.entryprice)*order.qty*100)/100
                                        )}
                                    </TableCell>
                                </TableRow>
                                </Fragment>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        )
        
        let activeorders = (
            <div>
                <TableContainer component={Paper} className={classes.container}>
                    <Table aria-label='simple table'>
                        <TableHead>
                            <TableRow>
                                <TableCell size='medium' >Symbol</TableCell>
                                <TableCell align='center' size='medium' >Call</TableCell>
                                <TableCell align='center' size='medium' >EntryPrice</TableCell>
                                <TableCell align='center' size='medium' >Qty</TableCell>
                                <TableCell align='center' size='medium' >Stoploss</TableCell>
                                <TableCell align='center' size='medium' >Target</TableCell>
                                <TableCell align='center' size='medium' >Product Type</TableCell>
                                <TableCell align='center' size='medium' >Market price</TableCell>
                                <TableCell align='center' size='medium' >P/L</TableCell>
                                <TableCell align='center' size='medium' >Comision</TableCell>
                                <TableCell align='center' size='medium' >Exit/Modify</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.activeOrders.map(order =>(
                                <Fragment>
                                <TableRow>
                                    <TableCell >{order.symbol}</TableCell>
                                    <TableCell align='center'>{order.side}</TableCell>
                                    <TableCell align='center'>{order.price}</TableCell>
                                    <TableCell align='center'>{order.qty}</TableCell>
                                    <TableCell align='center'>{order.stoploss}</TableCell>
                                    <TableCell align='center'>{order.target}</TableCell>
                                    <TableCell align='center'>{order.productType}</TableCell>
                                    <TableCell align='center'>{this.state.prices[order.symbol].ltp}</TableCell>
                                    <TableCell align='center'>
                                        {order.side == "buy" ? (
                                            <div>
                                                {(this.state.prices[order.symbol].ltp - order.price)*order.qty - order.com>=0?(
                                                    <Typography className={classes.color1}>{Math.floor((((this.state.prices[order.symbol].ltp - order.price)*order.qty - order.com)*100)/100)}</Typography>                                                
                                                ):(
                                                    <Typography className={classes.color2}>{Math.floor((((this.state.prices[order.symbol].ltp - order.price)*order.qty - order.com)*100)/100)}</Typography>                                                
                                                )}
                                                {(this.state.prices[order.symbol].ltp - order.price)*order.qty - order.com>=0?(
                                                    <Typography className={classes.color1}>{Math.floor(((((this.state.prices[order.symbol].ltp - order.price)*order.qty - order.com)/(order.price*order.qty))*1000000)/10000)}%</Typography>                                                
                                                ):(
                                                    <Typography className={classes.color2}>{Math.floor(((((this.state.prices[order.symbol].ltp - order.price)*order.qty - order.com)/(order.price*order.qty))*1000000)/10000)}%</Typography>                                                
                                                )}
                                            </div>
                                        ):(
                                            <div>
                                            {(this.state.prices[order.symbol].ltp - order.price)*order.qty - order.com>=0?(
                                                <Typography className={classes.color1}>{Math.floor(((( - this.state.prices[order.symbol].ltp + order.price)*order.qty - order.com)*100)/100)}</Typography>                                                
                                            ):(
                                                <Typography className={classes.color2}>{Math.floor(((( - this.state.prices[order.symbol].ltp + order.price)*order.qty - order.com)*100)/100)}</Typography>                                                
                                            )}
                                            {(this.state.prices[order.symbol].ltp - order.price)*order.qty - order.com>=0?(
                                                <Typography className={classes.color1}>{Math.floor((((( - this.state.prices[order.symbol].ltp + order.price)*order.qty - order.com)/(order.price*order.qty))*1000000)/10000)}%</Typography>                                                
                                            ):(
                                                <Typography className={classes.color2}>{Math.floor((((( - this.state.prices[order.symbol].ltp + order.price)*order.qty - order.com)/(order.price*order.qty))*1000000)/10000)}%</Typography>                                                
                                            )}
                                        </div>
                                        )}
                                    </TableCell>
                                    <TableCell align='center'>{Math.floor(order.com*1000)/1000}</TableCell>
                                    <TableCell>
                                        <button onClick={this.handleExit} value={order.orderid} color="red">Exit</button>
                                        <OrderModify price={order.price} order={order} side={order.side} changeOrder={this.changeOrder}></OrderModify>                                        
                                    </TableCell>
                                </TableRow>
                                </Fragment>
                            ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            )

            let pendingorders = (
                <div>
                    <TableContainer component={Paper}>
                        <Table aria-label='simple table'>
                            <TableHead>
                                <TableRow>
                                    <TableCell size='medium' >Symbol</TableCell>
                                    <TableCell align='center' size='medium' >Call</TableCell>
                                    <TableCell align='center' size='medium' >RequestedTime</TableCell>
                                    <TableCell align='center' size='medium' >Limit</TableCell>
                                    <TableCell align='center' size='medium' >Qty</TableCell>
                                    <TableCell align='center' size='medium' >Stoploss</TableCell>
                                    <TableCell align='center' size='medium' >Target</TableCell>
                                    <TableCell align='center' size='medium' >Cancel/Modify</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.pendingOrders.map(order =>(
                                <Fragment>
                                <TableRow>
                                    <TableCell >{order.symbol}</TableCell>
                                    <TableCell align='center'>{order.side}</TableCell>
                                    <TableCell align='center'>{order.ordertime}</TableCell>
                                    <TableCell align='center'>{order.price}</TableCell>
                                    <TableCell align='center'>{order.qty}</TableCell>
                                    <TableCell align='center'>{order.stoploss}</TableCell>
                                    <TableCell align='center'>{order.target}</TableCell>
                                    <TableCell>
                                        <button onClick={this.handleExit} value={order.orderid} color="red">Exit</button>
                                        <button onClick={this.handlePendingModify} value={order.orderid} color="red">Modify</button>
                                        <PendingModify indication={this.state.pendingModify} price={10} order={order} closeOrder={this.closeOrder}></PendingModify>                                        
                                    </TableCell>

                                </TableRow>
                                </Fragment>
                            ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                )
                let cancelorders = (
                    <div>
                        <TableContainer component={Paper}>
                            <Table aria-label='simple table'>
                                <TableHead>
                                    <TableRow>
                                        <TableCell size='medium' >Symbol</TableCell>
                                        <TableCell align='center' size='medium' >Call</TableCell>
                                        <TableCell align='center' size='medium' >Limit</TableCell>
                                        <TableCell align='center' size='medium' >Qty</TableCell>
                                        <TableCell align='center' size='medium' >Stoploss</TableCell>
                                        <TableCell align='center' size='medium' >Target</TableCell>
                                        <TableCell align='center' size='medium' >Reactivate</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.state.cancelOrders.map(order =>(
                                    <Fragment>
                                    <TableRow>
                                        <TableCell >{order.symbol}</TableCell>
                                        <TableCell align='center'>{order.side}</TableCell>
                                        <TableCell align='center'>{order.ordertime}</TableCell>
                                        <TableCell align='center'>{order.price}</TableCell>
                                        <TableCell align='center'>{order.qty}</TableCell>
                                        <TableCell align='center'>{order.stoploss}</TableCell>
                                        <TableCell align='center'>{order.target}</TableCell>
                                        <TableCell>
                                            <button onClick={this.handleCancel} value={order.orderid} color="red">Reactivate</button>
                                            <button color="red">Modify</button>
                                        </TableCell>
    
                                    </TableRow>
                                    </Fragment>
                                ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    )
    
            return(
            <div>
                <br></br>
                <Button className={classes.button} variant="contained" color={this.state.activecolor} onClick={this.handleChangeActiveButton}>Active Orders</Button>
                <Button className={classes.button} variant="contained" color={this.state.pendingcolor} onClick={this.handleChangePendingButton}>Pending Orders</Button>
                <Button className={classes.button} variant="contained" color={this.state.completecolor} onClick={this.handleChangeCompleteButton}>Complete Orders</Button>
                <Button className={classes.button} variant="contained" color={this.state.cancelcolor} onClick={this.handleChangeCancelButton}>Canceled Orders</Button>
                {this.state.activecolor=="primary"?activeorders:this.state.completecolor=="primary"?completeorders:this.state.pendingcolor=="primary"?pendingorders:cancelorders}
                {this.state.activeOrders.length>0?(
                    <Typography> Profit : {Math.floor(this.state.profit*1000)/1000}</Typography>
                ):(
                    <Typography>No Orders.</Typography>
                )}
                <Button onClick={this.handleExitAll}>Exit All</Button>
            </div>
        )
    }
}

export default withStyles(styles, { withTheme: true })(OrderBook)