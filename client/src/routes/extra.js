// React 
import React, {Component} from 'react';
import cookie from "react-cookies";

// Material ui
import AppBar from '@material-ui/core/AppBar'
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import RadioGroup from '@material-ui/core/RadioGroup'
import Radio from '@material-ui/core/Radio'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import CheckBox from '@material-ui/core/CheckBox'
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
import OrderPlace from './OrderPlace';
import Watchlist from './Watchlist'
import OrderBook from './OrderBook'
import OrderPlaceSymbol from './OrderPlaceSymbol'
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
        market : 'EQ',
        symbols : [],
        prices : {},
        selectedSymbol : '',
        symbolPrice:0,
        side:'',
        productType:'',
        orderType:'',
        limitPrice:0,
        targetPrice:0,
        tagetPerc:0,
        stoplossPrice:0,
        stoplossPerc:0,
        isTarget:false,
        isstoploss:false,
        qty:1,
        userFunds : {},
        userPortfolios : {},
        margin :0,
        loggedIn : false,
        rememberMe : false,
        error : '',
        user : {
            username : '',
        },
        open : {
            portfoilo : false
        }
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
            this.setState({loggedIn:true})
            this.setState(prevState => ({
                user:{
                  ...prevState.user,
                  ['username']: username
                }
            }));
    
          }else{
            this.setState({error:res.msg})
          }
        })
        .catch(err=>{
          this.setState({error:err.msg})
        })
        
        fetch('/api/get/user/funds', {
            method : 'post',
            headers: {'Content-Type':'application/json'},
            body : JSON.stringify({
                "email" : "kishankavathiya143"
            })
        })
        .then(res => res.json())
        .then(res => {
            this.setState({userFunds:res})
        })
        .catch(err => {
            this.setState({error:err.msg})
        });

        fetch('/api/get/portfolios',{
            method : 'post',
            headers: {'Content-Type':'application/json'},
            body : JSON.stringify({
                "username" : username,
                "hashval":hashval
            })
        })
        .then(res => res.json())
        .then(res => {
            this.setState({userPortfolios:res.portfolios})
        })
        .catch(err => {
            this.setState({error:err.msg})
        });
        

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
            this.setState({symbols:res.symbols})    
            this.Add_all_symbols(this.state.symbols)
          }else{
            this.setState({error:res.msg})
          }
        })
        .catch(err=>{
          this.setState({error:err.msg})
        })
    }
    Add_all_symbols(symbols){
        for(var i=0;i<symbols.length;i++){
            fetch('/api/add/symbol', {
                method : 'post',
                headers: {'Content-Type':'application/json'},
                body : JSON.stringify({
                    "symbol" : i,
                    "market": this.state.market
                })
            })
            .then(res => res.json())
            .then(res => {
                this.setState(prevState => ({
                    prices:{
                      ...prevState.prices,
                      [symbols[i]]: 0
                    }
                }));
            })
            .catch(err => {
                this.setState({error:err.msg})
            });   
        }
    }
    componentWillUnmount() {
        clearInterval(this.tid)
    }
    handleChangeEmail = (e) => {
        this.setState(prevState => ({
            user:{
              ...prevState.user,
              ['email']: e.target.value
            }
        }));
    }

    handleChangePassword = (e) => {
        this.setState(prevState => ({
            user:{
              ...prevState.user,
              ['password']: e.target.value
            }
        }));
    }
    handleRemember = (e) => {
      this.setState({rememberMe:e.target.checked})
    }
    hashpassword = () => {
      return this.state.user.password
    }
    handleSubmit = (e) => {
        fetch('/api/place/order', {
            method : 'post',
            headers: {'Content-Type':'application/json'},
            body : JSON.stringify({
                "email" : this.state.user.email,
                "password" : this.state.user.password
            })
        })
        .then(res => res.json())
        .then(res => {
            if(res.code == 200){  
              this.setState({loggedIn:true})
              cookie.save('email',res.email,{path: '/',maxAge: 10000})
              cookie.save('hashval',res.val,{path: '/',maxAge: 10000})
            } else {
              this.setState({error:res.msg})
            }
        })
        .catch(err => {
          this.setState({error:err.msg})
        });
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
        this.setState({selectedSymbol:e.target.value})
    }
    handleChangeSide = (e) => {
        this.setState({side:e.target.value})
        if(e.target.value=="Buy"){
            this.setState({targetPerc:((this.state.targetPrice-this.state.symbolPrice)/this.state.symbolPrice)*100})        
        }
        if(e.target.value=="Sell"){
            this.setState({targetPerc:((-this.state.targetPrice+this.state.symbolPrice)/this.state.symbolPrice)*100})        
        }
        if(e.target.value=="Sell"){
            this.setState({stoplossPerc:((this.state.stoplossPrice-this.state.symbolPrice)/this.state.symbolPrice)*100})        
        }
        if(e.target.value=="Buy"){
            this.setState({stoplossPerc:((-this.state.stoplossPrice+this.state.symbolPrice)/this.state.symbolPrice)*100})        
        }
    } 
    handleChangeproductType = (e) => {
        this.setState({productType:e.target.value})
    }
    handleChangeorderType = (e) => {
        this.setState({orderType:e.target.value})
    }
    handleChangelimitPrice = (e) => {
        this.setState({limitPrice:e.target.value})
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
    handleChangelimitPerc = (e) => {
        this.setState({limitPerc:(this.state.symbolPrice-this.state.symbolPrice*e.target.value*0.01)})
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
    calculateMargin = () => {
        var s = "F" + this.state.productType + this.state.market 
        var fund = this.state.userFunds[s] 
        s = "L" + this.state.productType + this.state.market 
        var levrage = this.state.userFunds[s]         
        var margin = (this.state.symbolPrice*this.state.qty)/levrage
        this.setState({margin:margin})
    }
    handleClosePortfolio = () => {
        this.setState(prevState => ({
            open:{
              ...prevState.open,
              ['portfolio']: false
            }
        }));
    }
    handleOpenPortfolio = () => {
        this.setState(prevState => ({
            open:{
              ...prevState.open,
              ['portfolio']: true
            }
        }));
    }
    changePrice = (symbol,price) => {
        this.setState(prevState => ({
            prices:{
              ...prevState.prices,
              [symbol]: price
            }
        }));    
    }
    
    handleAddWatchlist = (symbol) => {
        var username = this.props.username
        var hashval = cookie.load('hashval')
        if(hashval){
        }else{
          hashval = ''
        }

        fetch('/api/user/watchlist/add', {
            method : 'post',
            headers: {'Content-Type':'application/json'},
            body : JSON.stringify({
                "username" : username,
                "hashval" : hashval,
                "symbol": symbol
            })
          })
          .then(res=>res.json())
          .then(res=>{
            if(res.code == 200){
                var symbols2 = this.state.symbols
                symbols2.union([symbol]) 
                //this.updateWatchlist()
            }else{
              this.setState({error:res.msg})
            }
          })
          .catch(err=>{
            this.setState({error:err.msg})
          })  
    }
    handleRemoveWatchlist = (symbol) => {
        var username = this.props.username
        var hashval = cookie.load('hashval')
        if(hashval){
        }else{
          hashval = ''
        }

        fetch('/api/user/watchlist/remove', {
            method : 'post',
            headers: {'Content-Type':'application/json'},
            body : JSON.stringify({
                "username" : username,
                "hashval" : hashval,
                "symbol": symbol
            })
        })
        .then(res=>res.json())
        .then(res=>{
            if(res.code == 200){
                var symbols2 = this.state.symbols
                symbols2.remove([symbol])
                //this.updateWatchlist()
            }else{
              this.setState({error:res.msg})
            }
        })
        .catch(err=>{
            this.setState({error:err.msg})
        })  
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
                        {this.state.symbols.forEach(symbol=>(
                            <h1>symbol</h1>
                        ))} 

                        <Toolbar>
                          <Typography className={classes.title}>
                              Welcome, {this.state.user.username}
                          </Typography>
                          <OrderPlace></OrderPlace>
                          <Button color="inherit" align='right'>Order Placed</Button>
                          <Button color="inherit" align='right'>Profile</Button>
                          <Button color="inherit" align='right'>Logout</Button>
                        </Toolbar>
                    </AppBar>
                    <Grid container spacing ={1}>
                        <Grid item xs={4}>
                            <Grid container spacing={1}>
                                <Watchlist></Watchlist>
                            </Grid>
                        </Grid>
                        <Grid item xs={8}>
                            <Grid container spacing={1}>
                                <OrderBook></OrderBook>
                            </Grid>
                        </Grid>
                    </Grid>
                            <div className={classes.wpaper}>
                            <Grid container spacing={1}>
                                    <Grid item xs={12}>
                                        <Toolbar>
                                        <div className={classes.title}>
                                            <Typography>Watchlist</Typography>                                            
                                        </div>
                                        <Button color="primary">Add Symbol </Button>
                                        </Toolbar>
                                        <hr></hr>
                                    </Grid>      
                                    {this.state.symbols.map(symbol=>(
                                            <Grid item xs={12} margin="19px">
                                                <Grid container spacing={2}>
                                                    <Grid item xs={1}>
                                                    </Grid>
                                                    <Grid item xs={3}>
                                                        <Typography>{this.state.price}</Typography>
                                                        <Typography>{symbol} + {this.state.prices[symbol]}</Typography>
                                                    </Grid>

                                                    <Grid item xs={2}>
                                                        <Button color="primary">Buy</Button>
                                                    </Grid>
                                                    <Grid item xs={2}>
                                                        <Button color="secondary">Sell</Button>
                                                    </Grid>
                                                    <Grid item xs={3}>
                                                        <Button color="secondary">-</Button>
                                                    </Grid>
                                                    <Grid item xs={1}>

                                                    </Grid>
                                                </Grid>
                                                <hr></hr>
                                            </Grid>                                      
                                    ))}
                                </Grid>
                            </div>
                            Hello
                    <div>
                    <Grid container spacing={1}>
                        <Grid item xs={3}>
                            <div className={classes.wpaper}>
                            </div>
                        </Grid>
                      <Grid item xs ={3}>
                          <Paper>
                              <Toolbar>
                                <div className={classes.title}>
                                    <InputLabel id="demo-simple-select-outlined-label">Portfolio</InputLabel>
                                    <Select className={classes.select}
                                    labelId="demo-simple-select-outlined-label"
                                    id="demo-simple-select-outlined"
                                    label="Portfolio"
                                    >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value={10}>Ten</MenuItem>
                                    <MenuItem value={20}>Twenty</MenuItem>
                                    <MenuItem value={30}>Thirty</MenuItem>
                                    </Select>
                                </div>
                                <Button color='inharit' onClick={this.handleOpenPortfolio}>
                                    Create Portfolio
                                </Button>
                                <Dialog disableBackdropClick disableEscapeKeyDown open={this.state.open.portfolio} onClose={this.handleClosePortfolio}
                                ria-labelledby="p">
                                    <DialogTitle id="p" >Create a Portfolio</DialogTitle>
                                    <DialogContent>
                                        <div className={classes.dialogPaper}>
                                            <Grid Container>
                                                <Grid item xs={12}>
                                                    <TextField variant="outlined" label="Portfoilo Name" placeholder="Enter Portfolio name : " className={classes.textfeild}></TextField>                                                    
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Button  color="primary" className={classes.button}> Add Symbol</Button>
                                                </Grid>
                                                <Grid item xs={12}>
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
                                                    {this.state.market}
                                                    <InputLabel id="symbolselect">Symbol</InputLabel>
                                                    <Select className={classes.select}
                                                    labelId="symbolselect"
                                                    id="symbolselect"
                                                    label="Symbol"
                                                    >
                                                    
                                                    {this.state.symbols.map(symbol => (
                                                        <MenuItem value={symbol}>{symbol}</MenuItem>
                                                    ))}
                                                    </Select>
                                                </Grid>
                                                <Button  color="primary" className={classes.button}> Add Symbol</Button>

                                            </Grid>
                                        </div>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={this.handleClosePortfolio} color="primary">
                                            Cancel
                                        </Button>
                                        <Button onClick={this.handleClosePortfolio} color="primary">
                                            Add
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                            </Toolbar>                            
                          </Paper>
                      </Grid>
                      <Grid item xs={10}>
                          <Grid container spacing={3}>
                              <Grid item xs={9}>
                              <label for="market">Choose a market:</label>
                              <select name="market" id="market" onChange={this.handleSelectMarket}>
                                  <option value="None">None</option>
                                  <option value="EQ">Equity</option>
                              </select>
                              </Grid>
                              <Grid item xs={10}>
                              <label for="market">Select Stock</label>
                              <select name="market" id="market" onChange={this.handleChangeSymbol}>
                                  {this.state.symbols.map(symbol => (<option value={symbol}>{symbol}</option>))}
                              </select>
                              {this.state.selectedSymbol==''?(<Grid item xs={0}></Grid>):(<Typography>Stock : {this.state.selectedSymbol}</Typography>)}
                              {this.state.symbolPrice==0?(<Grid item xs={0}></Grid>):(<Typography>Price : {this.state.symbolPrice}</Typography>)}
                              {this.state.side==''?(<Grid item xs={0}></Grid>):(<Typography>Side : {this.state.side}</Typography>)}
                              {this.state.productType==''?(<Grid item xs={0}></Grid>):(<Typography>Producttype : {this.state.productType}</Typography>)}
                              {this.state.orderType==''?(<Grid item xs={0}></Grid>):(<Typography>orderType : {this.state.orderType}</Typography>)}
                              </Grid>
                              <Grid item xs={3}>
                                  <RadioGroup onChange={this.handleChangeSide}>
                                      <FormControlLabel value="Buy" control={<Radio />} label="Buy" />
                                      <FormControlLabel value="Sell" control={<Radio />} label="Sell" />
                                  </RadioGroup>
                              </Grid>
                              <Grid item xs={2}>
                                  <RadioGroup onChange={this.handleChangeproductType}>
                                      <FormControlLabel value="INTRA" control={<Radio />} label="Intraday" />
                                      <FormControlLabel value="CNC" control={<Radio />} label="CNC" />
                                  </RadioGroup>
                              </Grid>
                              <Grid item xs={7}>
                                  <RadioGroup onChange={this.handleChangeorderType}>
                                      <FormControlLabel value="market" control={<Radio />} label="Market" />
                                      <FormControlLabel value="limit" control={<Radio />} label="Limit Order" />
                                  </RadioGroup>
                              {this.state.orderType=="limit"?(
                                  <div>
                                  <TextField placeholder="Limit order" label="Limit" value={this.state.limitPrice} onChange={this.handleChangelimitPrice}></TextField>
                                  <TextField
                                      disabled
                                      id="outlined-disabled"
                                      label="Per %"
                                      defaultValue=""
                                      variant="outlined"
                                      value={((this.state.symbolPrice-this.state.limitPrice)/this.state.symbolPrice)*100}
                                      InputProps={{
                                          startAdornment: <InputAdornment position="start">%</InputAdornment>,
                                      }}
                                      onChange={this.handleChangelimitPerc}
                                  />
                                  </div>
                              ):(<div></div>)}
                              </Grid>
                              <Grid item xs={3}>
                                   <FormControlLabel value="target" onChange={this.handleChangeistarget} control={<CheckBox />} label="Target" />
                                  {this.state.isTarget?(
                                  <div>
                                  <TextField placeholder="Target Price" label="Target Price" value={this.state.targetPrice} onChange={this.handleChangetargetPrice}></TextField>
                                  <TextField
                                      disabled
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
      
                              <Grid item xs={3}>
                                   <FormControlLabel onChange={this.handleChangeisstoploss} control={<CheckBox />} label="Stoploss" />
                                  {this.state.isstoploss?(
                                  <div>
                                  <TextField placeholder="stoploss Price" label="stoploss Price" value={this.state.stoplossPrice} onChange={this.handleChangestoplossPrice}></TextField>
                                  <TextField
                                      disabled
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
                              <Grid item xs={1}>
                                  <TextField type="number" label="Qty" value={this.state.qty} onChange={(e)=>{this.setState({qty:e.target.value})}}></TextField>
                              </Grid>
                              <Grid item xs={5}></Grid>
                              <Grid item xs={3}></Grid>
                              <Grid item xs={2}>
                                  <Typography>{this.state.side}ing @{this.state.symbolPrice}</Typography>
                                  <Typography>Margin Req. : {this.state.margin}</Typography>
                              </Grid>
                              <Grid item xs={2}>
                                  <TextField value="x" label="Your fund"></TextField>
                              </Grid>
                              <Grid item xs={4}></Grid>
                              <Grid item xs={4}></Grid>
                              <Grid item xs={2}>
                                  <Button onClick={this.handleSubmit}>Submit</Button>
                              </Grid>
                          </Grid>
                      </Grid>
                    </Grid>
                    </div>
                </div>
            );
        }
    }
  }
  export default withStyles(styles, { withTheme: true })(UserDashboard);



  <Grid item xs={3}>
  <Paper className={classes.paper} elevation={3}>
      <Grid container spacing={0}>
            <Grid item xs={12}>
                <Typography className={classes.title}>{symbol}</Typography>                            
            </Grid>
            <Grid item xs={12}>
                <Typography className={classes.subtitle}>{this.state.prices[symbol].ltp}</Typography>                            
            </Grid>
            <Grid item xs={12}>
                <Grid container spacing={0}>
                    <Grid item xs={4}>
                      {(this.state.prices[symbol].ltp-this.state.prices[symbol].prev_close)>=0?(
                        <Typography className={classes.color1}>{Math.floor(this.state.prices[symbol].change*100)/100}</Typography>                    
                      ):(
                        <Typography className={classes.color2}>{Math.floor(this.state.prices[symbol].change*100)/100}</Typography>                    
                      )}
                    </Grid>
                    <Grid item xs={4}></Grid>
                    <Grid item xs={3}>
                      {this.state.prices.change>=0?(
                        <Typography className={classes.color1}>{Math.floor(this.state.prices[symbol].change_perc*100)/100}</Typography>                    
                      ):(
                        <Typography className={classes.color2}>{Math.floor(this.state.prices[symbol].change_perc*100)/100} </Typography>                    
                      )}
                    </Grid>
                    <Grid item xs={1}>
                      {this.state.prices.change>=0?(
                        <Typography className={classes.color1}>%</Typography>                    
                      ):(
                        <Typography className={classes.color2}>%</Typography>                    
                      )}
                    </Grid>                                    
                  </Grid>
            </Grid>
        </Grid>                        
        </Paper>
      </Grid>
