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

class SetFunds extends Component {
    constructor(props) {
      super(props);
      this.state = {
          open : {
              'setfunds':false
          },
          username : '',
          users : [],
          userfunds : {
              'F' : 1000000,
              'LINTRAEQ':5,
              'LCNCEQ':2, 
              'LINTRAFUTBUY':50,
              'LINTRAFUTSELL':50,
              'LCNCFUTBUY':25, 
              'LINTRAOPBUY':5,
              'LINTRAOPSELL':50,
              'LCNCOPBUY':2,
              'COMEQ':0.03,
              'COMFUT':40,
              'COMOP':40,             
          }
          
      };
    }
    componentDidMount() {
        fetch('/api/user/get/all', {
            method : 'get',
            headers: {'Content-Type':'application/json'},
        })
        .then(res => res.json())
        .then(res => {
            this.setState({users:res["users"]})
        })
        .catch(err => {
          this.setState({error:err.msg})
        });
    }
    
    handleCloseDialog = () => {
        this.setState(prevState => ({
            open:{
              ...prevState.open,
              ['setfunds']: false
            }
        }));
    }
    handleOpenDialog = () => {
        this.setState(prevState => ({
            open:{
              ...prevState.open,
              ['setfunds']: true
            }
        }));
    }
    
    handleChangeFunds = (e) => {
        this.setState(prevState => ({
            userfunds:{
              ...prevState.userfunds,
              [e.target.id]: e.target.value
            }
        }));
    }
    handleSubmit = () =>{
        var email = cookie.load('adminemail')
        var hashval = cookie.load('adminhashval')
        if(email){
        }else{
            email = ''
        }
        if(hashval){
        }else{
            hashval = ''
        }

        var data = this.state.userfunds
        for(var key in data){
            data[key] = parseFloat(data[key])
        }
        fetch('/api/admin/user/funds/set', {
            method : 'post',
            headers: {'Content-Type':'application/json'},
            body : JSON.stringify({
                "email":email,
                "hashval":hashval,
                "username":this.state.username,
                "data":data
            })
        })
        .then(res => res.json())
        .then(res => {
        })
        .catch(err => {
            this.setState({error:err.msg})
        });
    }
    handleSelectUsers = (e) => {
        this.setState({'username':e.target.value})
    }
    render() {
        const { classes } = this.props;
        return (
            <div>
                <Button id="setuserfunds" onClick={this.handleOpenDialog} size="Large" variant="outlined" color="primary">
                    Set User Funds & Levrages
                </Button>
                <Dialog disableBackdropClick disableEscapeKeyDown 
                open={this.state.open.setfunds} 
                onClose={this.handleCloseDialog}
                aria-labelledby="p">
                <DialogTitle id="p" >
                    <Toolbar>
                        <div className={classes.title}> 
                            Set User Funds & Levrages
                        </div>
                        <TextField size="small" default variant="outlined" label="Username" value={this.state.username}></TextField>
                    </Toolbar>
                </DialogTitle>
                <DialogContent>
                    <div className={classes.dialogPaper}>
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <Grid container justify="center">
                                    <div>
                                        <InputLabel id="Username">Username</InputLabel>
                                        <Select className={classes.select}
                                        labelId="username"
                                        id="username"
                                        label="Users"
                                        onChange={this.handleSelectUsers}
                                        >
                                        {this.props.users.map(user => (
                                            <MenuItem value={user}>{user}</MenuItem>
                                        ))}
                                        </Select>
                                    </div>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container justify="center">
                                    <Typography >Funds </Typography>
                                    <TextField value={this.state.userfunds.F} type="Number" size="small" default variant="outlined" id="F" onChange={this.handleChangeFunds}></TextField>                        
                                </Grid>
                            </Grid>
                            <br></br>
                            <Grid item xs={4}>
                                <Grid container justify="center">
                                    <Typography >Lev-EQ-INTRA </Typography>
                                    <TextField value={this.state.userfunds.LINTRAEQ} type="Number" size="small" default variant="outlined" id="LINTRAEQ" onChange={this.handleChangeFunds}></TextField>                        
                                </Grid>
                            </Grid>
                            <Grid item xs={4}>
                                <Grid container justify="center">
                                    <Typography >Lev-EQ-CNC </Typography>
                                    <TextField value={this.state.userfunds.LCNCEQ} type="Number" size="small" default variant="outlined" id="LCNCEQ" onChange={this.handleChangeFunds}></TextField>                        
                                </Grid>
                            </Grid>
                            <Grid item xs={4}></Grid>
                            <Grid item xs={4}>
                                <Grid container justify="center">
                                    <Typography >Lev-FUT-INTRA-Buy </Typography>
                                    <TextField value={this.state.userfunds.LINTRAFUTBUY} type="Number" size="small" default variant="outlined" id="LINTRAFUTBUY" onChange={this.handleChangeFunds}></TextField>                        
                                </Grid>
                            </Grid>
                            <Grid item xs={4}>
                                <Grid container justify="center">
                                    <Typography >Lev-FUT-INTRA-Sell </Typography>
                                    <TextField value={this.state.userfunds.LINTRAFUTSELL} type="Number" size="small" default variant="outlined" id="LINTRAFUTSELL" onChange={this.handleChangeFunds}></TextField>                        
                                </Grid>
                            </Grid>
                            <Grid item xs={4}>
                                <Grid container justify="center">
                                    <Typography >Lev-FUT-CNC-Buy </Typography>
                                    <TextField value={this.state.userfunds.LCNCFUTBUY} type="Number" size="small" default variant="outlined" id="LCNCFUTBUY" onChange={this.handleChangeFunds}></TextField>                        
                                </Grid>
                            </Grid>
                            <Grid item xs={4}>
                                <Grid container justify="center">
                                    <Typography >Lev-OP-INTRA-Buy </Typography>
                                    <TextField value={this.state.userfunds.LINTRAOPBUY} type="Number" size="small" default variant="outlined" id="LINTRAOPBUY" onChange={this.handleChangeFunds}></TextField>                        
                                </Grid>
                            </Grid>
                            <Grid item xs={4}>
                                <Grid container justify="center">
                                    <Typography >Lev-OP-INTRA-Sell </Typography>
                                    <TextField value={this.state.userfunds.LINTRAOPSELL} type="Number" size="small" default variant="outlined" id="LINTRAOPSELL" onChange={this.handleChangeFunds}></TextField>                        
                                </Grid>
                            </Grid>
                            <Grid item xs={4}>
                                <Grid container justify="center">
                                    <Typography >Lev-OP-CNC-Buy </Typography>
                                    <TextField value={this.state.userfunds.LCNCOPBUY} type="Number" size="small" default variant="outlined" id="LCNCOPBUY" onChange={this.handleChangeFunds}></TextField>                        
                                </Grid>
                            </Grid>
                            <Grid item xs={4}>
                                <Grid container justify="center">
                                    <Typography >Com-EQ </Typography>
                                    <TextField value={this.state.userfunds.COMEQ} type="Number" size="small" default variant="outlined" id="COMEQ" onChange={this.handleChangeFunds}></TextField>                        
                                </Grid>
                            </Grid>
                            <Grid item xs={4}>
                                <Grid container justify="center">
                                    <Typography >Com-FUT </Typography>
                                    <TextField value={this.state.userfunds.COMFUT} type="Number" size="small" default variant="outlined" id="COMFUT" onChange={this.handleChangeFunds}></TextField>                        
                                </Grid>
                            </Grid>
                            <Grid item xs={4}>
                                <Grid container justify="center">
                                    <Typography >Com-OP </Typography>
                                    <TextField value={this.state.userfunds.COMOP} type="Number" size="small" default variant="outlined" id="COMOP" onChange={this.handleChangeFunds}></TextField>                        
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container justify="center">
                                    <div>
                                        <Button type="submit" onClick={this.handleSubmit} variant="contained" color="primary">Set Funds</Button>
                                    </div>
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
  export default withStyles(styles, { withTheme: true })(SetFunds);