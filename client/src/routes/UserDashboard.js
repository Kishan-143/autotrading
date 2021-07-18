// React 
import React, {Component} from 'react';
import cookie from "react-cookies";

// Material ui
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import { withStyles } from "@material-ui/core/styles";
import Toolbar from '@material-ui/core/Toolbar'
import Link from '@material-ui/core/Link';
import SymbolPrice from './SymbolPrice'
import OrderPlace from './OrderPlace';
import Watchlist from './Watchlist'
import OrderBook from './OrderBook'
import PermanentSymbols from './PermanentSymbols'
const styles = theme => ({
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
    height: theme.spacing(70),
  },
  wpaper : {
    display: 'flex',
    justifyContent:'center',
    width: theme.spacing(40),
    height: theme.spacing(80),
  },

  textfeild : {
    margin : "10px",
    width :"300px"
  },
  button : {
    margin : "10px",
    width :"300px"
  },
  dialogtitle : {
      fontSize : "50px",
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
    width : "140px"
  }
});

class UserDashboard extends Component {
    constructor(props) {
      super(props);
      this.state = {
        loggedIn : false,
        error : '',
        user : {
            username : '',
        },
        symbols:[],
        funds : 0,
        userFund : {},
        com : 0,
        activeOrders:[],
        data:{},
        markets : {
          "EQ":"no",
          "FO":"no",
          "MCX":"no"
        },
        prices : {}
      };
    }
    checkLogin = () => {
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

      fetch('/api/user/hashval', {
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
          this.setState({
            loggedIn:true,
            user : {
              ...this.state.user,
              ['username'] : username
            }
          },()=>{
            this.getFunds()
          })
        }else{
          this.setState({error:res.msg})
        }
      })
      .catch(err=>{
        this.setState({error:err.msg})
      })
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
              this.setState({userFund:res.data})
          }
      })
      .catch(err => {
          this.setState({error:err.msg})
      });
    }

    marketStatus = () => {
      fetch('/api/user/market', {
        method : 'get',
      })
      .then(res => res.json())
      .then(res => {
        this.setState({markets:res})
      })
      .catch(err => {
        this.setState({error:err.msg})
      });
    }
    handleLogout = () => {
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

      fetch('/api/user/logout', {
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
              this.setState({loggedIn:false})
          }
      })
      .catch(err => {
          this.setState({error:err.msg})
      });
    }
    

    componentDidMount() {
        this.checkLogin()
        this.marketStatus()
        this.interval = setInterval(() => this.tick(), 10000);
    }

    addSymbols = (s) => {
      fetch('/api/data/symbols/price/add', {
        method : 'post',
        headers: {'Content-Type':'application/json'},
        body : JSON.stringify({
          "symbols":s
        })
      })
      .then(res => res.json())
      .then(res => {
        var prices2 = {}
        for(var i=0;i<s.length;i++){
          prices2[s[i]] = {
            'ltp':'-',
            'prev_close':1
          }
        }
        this.setState({prices:{...prices2,...this.state.prices}},()=>{
          this.setState({symbols:[...this.state.symbols,...s]})
        })              
      })
      .catch(err => {
          this.setState({error:err.msg})
      });
    }

    removeSymbol = (s) => {
      this.setState({symbols:this.state.symbols.filter(item=>item!=s)})
    }
    
    removeSymbols = (s) => {
        for(var i=0;i<s.length;i++){
            this.setState({symbols:this.state.symbols.filter(item=>item!=s[i])})
        }
    }
    
    changePrice = (prices) => {
      this.setState({prices:prices})
    }

    passOrder = (data) => {
      this.setState({data:data})
    }
    
    changeFund = (fund) => {
      this.setState({
        userFund:{
          ...this.state.userFund,
          F:this.state.userFund.F + fund
        }
      })
    }

    setActiveOrders = (data) => {
      this.setState({activeOrders:data})
    }

    tick = () => {
      fetch('/api/data/symbols/price/get', {
        method : 'post',
        headers: {'Content-Type':'application/json'},
        body : JSON.stringify({
          "symbols":this.state.symbols
        })
      })
      .then(res => res.json())
      .then(res => {

        this.setState({prices:{...this.state.prices,...res.prices}})
      })
      .catch(err => {
          this.setState({error:err.msg})
      });
    }

    componentWillUnmount(){
      clearInterval(this.tick)
    }

    render() {
        const { classes } = this.props;
        if(this.state.loggedIn == false) {
            return (
                <div>
                    <Link href="/user/login"> Click to Login page</Link>
                </div>  
            )
        }
        else{
            return (
                <div>
                    <AppBar position="static" className={classes.header}>
                        <Toolbar>
                          <Typography className={classes.title}>
                              Welcome, {this.state.user.username}
                          </Typography>
                          <OrderPlace></OrderPlace>
                          <Button color="inherit" align='right'>Order Placed</Button>
                          <Button color="inherit" align='right'>Profile</Button>
                          <Button color="inherit" align='right' onClick={this.handleLogout}>Logout</Button>
                        </Toolbar>
                    </AppBar>
                    <Grid container spacing ={1}>
                        <Grid item xs={4}>
                            <Grid container spacing={1}>
                                <Watchlist 
                                    userFund={this.state.userFund} 
                                    markets={this.state.markets} 
                                    prices={this.state.prices}
                                    activeOrders ={this.state.activeOrders}
                                    addSymbols={this.addSymbols}
                                    changeFund={this.changeFund}
                                    removeSymbols={this.removeSymbols} 
                                    removeSymbol={this.removeSymbol} 
                                    passOrder={this.passOrder}>    
                                </Watchlist>
                            </Grid>
                        </Grid>
                        <Grid item xs={8}>
                            <Grid container spacing={1}>
                                <Grid item xs={12}>
                                    <PermanentSymbols 
                                      addSymbols={this.addSymbols} 
                                      prices={this.state.prices} 
                                      userFund={this.state.userFund} 
                                      funds={this.state.funds}></PermanentSymbols>
                                </Grid>
                                <Grid item xs={12}>
                                    <OrderBook data={this.state.data} 
                                      com={this.state.com} 
                                      changeFund={this.changeFund} 
                                      prices={this.state.prices}
                                      setActiveOrders={this.setActiveOrders}></OrderBook>                                    
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            );
        }
    }
  }
  export default withStyles(styles, { withTheme: true })(UserDashboard);