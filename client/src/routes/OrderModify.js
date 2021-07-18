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
    width :'20px'
  },
  sellButton : {
    color : 'red',
    backgroundColor : 'lightgrey',
    width :'20px'
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

class OrderModify extends Component {
    constructor(props) {
      super(props);
      this.state = {
          username : this.props.order.username,
          open : {
              'orderplace' : false
          },
          targetPrice:'-',
          tagetPerc:'-',
          stoplossPrice:'-',
          stoplossPerc:'-',
          isTarget:true,
          isstoploss:true,
          loggedIn : false,
          rememberMe : false,
          error : '',
      };
    }
    componentDidMount() {
        if(this.props.order.target != '-'){
            this.setState({targetPrice:this.props.order.target})
            this.setState({isTarget:true})
            if(this.props.order.side=="buy"){
                this.setState({targetPerc:((this.props.order.target-this.props.price)/this.props.price)*100})        
            }
            if(this.props.order.side=="sell"){
                this.setState({targetPerc:((-this.props.order.target+this.props.price)/this.props.price)*100})        
            }    
        }else{
            this.setState({isTarget:false})    
        }
        if(this.props.order.stoploss != '-'){
            this.setState({stoplossPrice:this.props.order.stoploss})
            if(this.props.order.side=="buy"){
                this.setState({stoplossPerc:((-this.props.order.stoploss+this.props.price)/this.props.price)*100})        
            }
            if(this.props.order.side=="sell"){
                this.setState({stoplossPerc:((this.props.order.stoploss-this.props.price)/this.props.price)*100})        
            }
            this.setState({isstoploss:true})
        }else{
            this.setState({isstoploss:false})    
        }
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
        if(this.props.order.side=="buy"){
            this.setState({targetPrice:e.target.value})
            this.setState({targetPerc:((e.target.value-this.props.price)/this.props.price)*100})        
        }
        if(this.props.order.side=="sell"){
            this.setState({targetPrice:e.target.value})
            this.setState({targetPerc:((-e.target.value+this.props.price)/this.props.price)*100})        
        }
    }
    handleChangestoplossPrice = (e) => {
        if(this.props.order.side=="buy"){
            this.setState({stoplossPrice:e.target.value})
            this.setState({stoplossPerc:((-e.target.value+this.props.price)/this.props.price)*100})        
        }
        if(this.props.order.side=="sell"){
            this.setState({stoplossPrice:e.target.value})
            this.setState({stoplossPerc:((e.target.value-this.props.price)/this.props.price)*100})        
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

        alert(" Order will Modified.")
        fetch('/api/order/modify', {
            method : 'post',
            headers: {'Content-Type':'application/json'},
            body : JSON.stringify({
                "username":username,
                "hashval":hashval,
                "data":{
                    "stoploss":this.state.stoplossPrice=="-"?("-"):(parseFloat(this.state.stoplossPrice)),
                    "target":this.state.targetPrice=="-"?("-"):(parseFloat(this.state.targetPrice))
                },
                "id":this.props.order.orderid
            })
        })
        .then(res => res.json())
        .then(res => {
            if(res.code==200){
                this.props.changeOrder(this.props.order.orderid,this.state.stoplossPrice,this.state.targetPrice)
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
                <button onClick={this.handleOpenDialog}> Modify</button>
                <Dialog disableBackdropClick disableEscapeKeyDown 
                open={this.state.open.orderplace} 
                onClose={this.handleCloseDialog}
                aria-labelledby="p">
                <DialogTitle id="p" >
                    <Toolbar>
                        <div className={classes.title}>
                            Modify order
                        </div>
                        <TextField size="small" default variant="outlined" label="Market price" value={this.props.price}></TextField>
                    </Toolbar>
                </DialogTitle>
                <DialogContent>
                    <div className={classes.dialogPaper}>
                        <Grid container spacing={1}>
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
                                    <Button type="submit" onClick={this.handleSubmit} variant="contained" color="primary">Modify Order</Button>
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
  export default withStyles(styles, { withTheme: true })(OrderModify);