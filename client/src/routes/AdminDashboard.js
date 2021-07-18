// React 
import React, {Component} from 'react';
import {BrowserRouter as Router,Route,Redirect,Switch} from 'react-router-dom';
import cookie from "react-cookies";
// Material ui
import {TableRow, TableBody,TableCell,Table,TableContainer,TableHead,Paper, requirePropFactory} from '@material-ui/core'
import { Fragment } from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { withStyles } from "@material-ui/core/styles";
import SetUser  from './SetUser';
import SetFunds from './SetFunds'

const writeFileP = require("write-file-p");

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

function Update_symbols(p) {
    let user = {
        "EQLIST":[],
        "FOLIST":[],
        "COMLIST":[],
    }
    let data = {}
    data = {...data,...user}
    //writeJsonFile("./live_data.json",{foo:true})
}
  
class AdminDashboard extends Component {
    constructor(props) {
      super(props);
      this.state = {
        user: {
          email :'',
          username:''
        },
        errors: {
            adduser: ''
        },
        users : [],
        open:false,
        loggedIn : false,
        rememberMe : false,
        error : '',
        adduserclick:false,
        NSE:"yes",
        MCX:"yes"
      };
    }
    componentDidMount() {
        this.interval = setInterval(() => this.tick(), 10000);

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
        fetch('/api/admin/user/get/all/list', {
            method : 'post',
            headers: {'Content-Type':'application/json'},
            body : JSON.stringify({
                "email":email,
                "hashval":hashval
            })
        })
        .then(res => res.json())
        .then(res => {     
            if(res.code == 200){
                this.setState({users:res.data})
            }
        })
        .catch(err => {
            this.setState({error:err.msg})
        });
    }
    componentDidUpdate() {
        //this.calculateMargin()
    }
    componentWillUnmount() {
        clearInterval(this.tick)
    }
    handleAdduser = (e) => {
        this.setState({adduserclick:true})
    }
    handleChangeUsername = (e) => {
        this.setState(prevState => ({
            user:{
              ...prevState.user,
              ['username']: e.target.value
            }
        }));
    }
    handleSendClick = () => {
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
  
        fetch('/api/admin/user/add', {
            method : 'post',
            headers: {'Content-Type':'application/json'},
            body : JSON.stringify({
                "requestedEmail" : this.state.user.email,
                "username" : this.state.user.username,
                "email":email,
                "hashval":hashval
            })
        })
        .then(res => res.json())
        .then(res => {
            if(res.code != 200){
                this.setState(prevState => ({
                    errors:{
                      ...prevState.errors,
                      ['adduser']: res.msg
                    }
                }));
            }
            else{
                this.setState(prevState => ({
                    errors:{
                      ...prevState.errors,
                      ['adduser']: ''
                    }
                }));    
            }
        })
        .catch(err => {
            this.setState(prevState => ({
                errors:{
                    ...prevState.errors,
                    ['adduser']: err.msg
                }
            }));
        });
        this.setState({adduserclick:false});
    }
    handleClickOpen = () => {
        this.setState({open:true});
    };
    handleChangeEmail = (e) => {
        this.setState({
            user : {
                ...this.state.user,
                ['email']:e.target.value
            }
        })
    }
    handleDeleteUser = (e) => {
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
  
        fetch('/api/admin/user/remove', {
            method : 'post',
            headers: {'Content-Type':'application/json'},
            body : JSON.stringify({
                "username" : e.target.value,
                "email":email,
                "hashval":hashval
            })
        })
        .then(res => res.json())
        .then(res => {
            if(res.code == 200){

                //                this.setState({userList:this.state.userList.filter((user)=>user!=e.target.value)})
            }
        })
        .catch(err => {
            alert(err)
        });        
    }
    tick = () => {
        fetch('/api/admin/get/price/all', {
            method : 'post',
            headers: {'Content-Type':'application/json'},
            body : JSON.stringify({
            })
        })
        .then(res => res.json())
        .then(res => {          
 
            Update_symbols(res.p)
        })
        .catch(err => {
            this.setState({error:err.msg})
        });
    }

    handleStart = (e) => {
        if(e.target.value == "NSE")
            this.setState({NSE:"yes"})
        if(e.target.value == "MCX")
            this.setState({MCX:"yes"})

        fetch('/api/admin/start/server', {
            method : 'post',
            headers: {'Content-Type':'application/json'},
            body : JSON.stringify({
                "market":e.target.value
            })
        })
        .then(res => res.json())
        .then(res => {          
        })
        .catch(err => {
            this.setState({error:err.msg})
        });        
    }
    handleStop = (e) => {
        if(e.target.value == "NSE")
            this.setState({NSE:"no"})
        if(e.target.value == "MCX")
            this.setState({MCX:"no"})

        fetch('/api/admin/stop/server', {
            method : 'post',
            headers: {'Content-Type':'application/json'},
            body : JSON.stringify({
                "market":e.target.value
            })
        })
        .then(res => res.json())
        .then(res => {          
        })
        .catch(err => {
            this.setState({error:err.msg})
        });        
    }
    handleCloseMarket = (e) => {
        fetch('/api/admin/close/market', {
            method : 'post',
            headers: {'Content-Type':'application/json'},
            body : JSON.stringify({
                "market":e.target.value
            })
        })
        .then(res => res.json())
        .then(res => {          
        })
        .catch(err => {
            this.setState({error:err.msg})
        });        
    }
    render() {        
    const { classes } = this.props;
      return (
          <div>
              <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Grid container justify="center" spacing={2}>
                            <Grid item xs={3}>
                                <Button variant="outlined" color="primary" onClick={this.handleAdduser}>
                                    Add User
                                </Button>                            
                            </Grid>
                            <Grid item xs={3}>
                                {this.state.adduserclick?(
                                    <TextField  onChange={this.handleChangeEmail} value={this.state.user.email} placeholder="Enter email : ">
                                    </TextField>
                                ):(
                                    <Typography>{this.state.errors.adduser}</Typography>
                                )}
                            </Grid>
                            <Grid item xs={3}>
                                {this.state.adduserclick?(
                                    <TextField  onChange={this.handleChangeUsername} value={this.state.user.username}placeholder="Enter Username : ">
                                    </TextField>
                                ):(
                                    <Typography>{this.state.errors.adduser}</Typography>
                                )}
                            </Grid>
                            <Grid item xs={3}>
                                {this.state.adduserclick?(
                                    <Button onClick={this.handleSendClick}>Send Code</Button>
                                ):(
                                    <Typography></Typography>
                                )}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container justify="center" spacing={2}>
                        <SetFunds users={this.state.users}></SetFunds>
                    </Grid>
                </Grid>
                <Grid item xs={6}>
                <TableContainer component={Paper} className={classes.container}>
                    <Table aria-label='simple table'>
                        <TableHead>
                            <TableRow>
                                <TableCell align='center' size='medium' >Username</TableCell>
                                <TableCell align='center' size='medium' >Available Funds</TableCell>
                                <TableCell align='center' size='medium' >Provided Funds</TableCell>
                                <TableCell align='center' size='medium' >P/L</TableCell>
                                <TableCell align='center' size='medium' >Remove</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.users.map(user =>(
                                <Fragment>
                                <TableRow>
                                    <TableCell align='center' size='medium'>{user.u}</TableCell>
                                    <TableCell align='center' size='medium'>{user.a}</TableCell>
                                    <TableCell align='center' size='medium'>{user.p}</TableCell>
                                    <TableCell align='center' size='medium'>{(user.a-user.p)} {(user.a-user.p)*100/user.a}%</TableCell>
                                    <TableCell align='center' size='medium'>
                                        <button color="secondary" value={user.u} onClick={this.handleDeleteUser}>Delete</button>
                                    </TableCell>
                                </TableRow>
                                </Fragment>
                            ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                <Grid item xs={3}>
                    <button onClick={this.handleStart} value="NSE">Start NSE Market</button>
                    {this.state.NSE == "yes" ? (
                        <button value="NSE" onClick={this.handleStop}>Stop Server</button>
                    ) : (<div></div>)}
                </Grid>
                <Grid item xs={3}>
                    <button onClick={this.handleStart} value="MCX">Start MCX Market</button>
                    {this.state.MCX == "yes" ? (
                        <button value="MCX" onClick={this.handleStop}>Stop Server</button>
                    ) : (<div></div>)}
                </Grid>
                <br></br>
                <br></br>
                <br></br>
                <Grid item xs={3}>
                    <button onClick={this.handleCloseMarket} value="NSE">Close All NSE INTRDAY ORDERS</button>
                </Grid>
                <Grid item xs={3}>
                    <button onClick={this.handleCloseMarket} value="MCX">Close All MCX INTRDAY ORDERS</button>
                </Grid>
          </div>
      );
    }
  }
  export default withStyles(styles, { withTheme: true })(AdminDashboard)
