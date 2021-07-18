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
      fontSize : "35px",
      fontWeight : "bold",
      color : "blue"
  },
  subtitle : {
    fontSize : "30px",
    fontWeight : "bold",
    color : "black"
  },
  subsubtitle : {
    fontSize : "25px",
    fontWeight : "bold"
  },
  select : {
    variant : "outlined",
    width : "140px"
  },
  paper : {
    display: 'flex',
    justifyContent:'center',
    width: theme.spacing(28),
    height: theme.spacing(20),
  },
  color1 : {
    fontSize : "25px",
    fontWeight : "bold",
    color : "green"
  },
  color2 : {
    fontSize : "25px",
    fontWeight : "bold",
    color : "red"
  }

});
const symbols = ["NIFTY 50","NIFTY BANK"]
class PermanentSymbols extends Component {
    constructor(props) {
      super(props);
      this.state = {
        prices : {},
        symbols : []
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
              "prev_close":2
            } 
          }
          this.setState({
            prices : {...this.state.prices,...prices2}
          },()=>{
            //this.addSymbols(res.symbols)
            this.setState({symbols:[...this.state.symbols, ...res.symbols]})                     
          })
      })
      .catch(err => {
          this.setState({error:err.msg})
      });
    }
    componentDidUpdate(props,state) {
        if(this.props.prices != props.prices){
          this.setState({prices:{...this.state.prices,...this.props.prices}})
        }
    }
    componentDidMount() {
      var res = {}
      res['symbols'] = symbols
      this.y(res)
      this.props.addSymbols(symbols)
    }
    render() {
        const { classes } = this.props;
        return (
            <div>
                <br></br>
                <br></br>
                <Grid container spacing={0}>
                          {this.state.symbols.map((symbol)=>(
                    <Grid item xs={4}>
                    <Paper className={classes.paper} elevation={0}>
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
                                        {this.state.prices[symbol].ltp-this.state.prices[symbol].prev_close>=0?(
                                          <Typography className={classes.color1}>{Math.floor((this.state.prices[symbol].ltp-this.state.prices[symbol].prev_close)*100)/100}</Typography>                    
                                        ):(
                                          <Typography className={classes.color2}>{Math.floor((this.state.prices[symbol].ltp-this.state.prices[symbol].prev_close)*100)/100}</Typography>                    
                                        )}
                                      </Grid>
                                      <Grid item xs={4}></Grid>
                                      <Grid item xs={3}>
                                        {this.state.prices[symbol].ltp-this.state.prices[symbol].prev_close>=0?(
                                          <Typography className={classes.color1}>{Math.floor((this.state.prices[symbol].ltp-this.state.prices[symbol].prev_close)/this.state.prices[symbol].prev_close*10000)/100}</Typography>                    
                                        ):(
                                          <Typography className={classes.color2}>{Math.floor(((this.state.prices[symbol].ltp-this.state.prices[symbol].prev_close)/this.state.prices[symbol].prev_close)*10000)/100} </Typography>                    
                                        )}
                                      </Grid>
                                      <Grid item xs={1}>
                                        {this.state.prices[symbol].ltp-this.state.prices[symbol].prev_close>=0?(
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
                          )
                          )}
                    <Grid item xs={4}>
                    <Paper className={classes.paper} elevation={0}>
                            <Grid container spacing={0}>
                                <Grid item xs={12}>
                                    <Typography className={classes.title}>funds</Typography>                            
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography className={classes.subtitle}>{Math.floor(this.props.userFund.F*100)/100}</Typography>                            
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid container spacing={0}>
                                      <Grid item xs={4}>
                                        {this.props.userFund.F-this.props.userFund.PF>=0?(
                                          <Typography className={classes.color1}>{Math.floor((this.props.userFund.F-this.props.userFund.PF)*100)/100}</Typography>                    
                                        ):(
                                          <Typography className={classes.color2}>{Math.floor((this.props.userFund.F-this.props.userFund.PF)*100)/100}</Typography>                    
                                        )}
                                      </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        );
    }
  }
  export default withStyles(styles, { withTheme: true })(PermanentSymbols);