
// React 
import React, {Component} from 'react';
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
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem';
class SetUser extends Component {
    constructor(props) {
      super(props);
      this.state = {
        funds: {
          'LCNCEQ' : 1,
          'FCNCEQ' : 0,
          'LCNCFO' : 1,
          'FCNCFO' : 0,
          'LINTRAEQ' : 3,
          'FINTRAEQ' : 0,
          'LINTRAFO' : 3,
          'FINTRAFO' : 0 
        },
        user : {
            'email':''
        },
        users : [],
        error : ''
      };
    }
    componentDidMount() {
    
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
  
        fetch('/api/users/all', {
            method : 'post',
            headers: {'Content-Type':'application/json'},
            body : JSON.stringify({
                "email" : email,
                "hashval" : hashval
            })
        })
        .then(res=>res.json())
        .then(res=>{
            if(res.code==200){
                this.setState({users:res.users})
            }else{
                this.setState({error:res.msg})
            }
        })
        .catch(err=>{
            this.setState({error:err.msg})
        })
    }

    handleChangeEmail = (e) => {
        this.setState(prevState => ({
            user:{
              ...prevState.user,
              ['email']: e.target.value
            }
          }));
    }
    handleSubmit = (e) => {
        fetch('/api/user/login', {
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
    handleChangeEmail = (e) => {
        this.setState(prevState => ({
            user:{
              ...prevState.user,
              ['email']: e.target.value
            }
          }));
    }

    render() {
        return (
            <div>
                <Paper width="50%">
                    <InputLabel id="demo-simple-select-label">User</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={this.state.email}
                        onChange={this.handleChangeEmail}
                    >
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                </Paper>
            </div>
        );
    }
  }
  export default SetUser;