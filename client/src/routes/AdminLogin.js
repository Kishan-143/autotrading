
// React 
import React, {Component} from 'react';
import {BrowserRouter as Router,Route,Redirect,Switch} from 'react-router-dom';
import cookie from "react-cookies";
// Material ui
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Container from '@material-ui/core/Container';

class AdminLogin extends Component {
    constructor(props) {
      super(props);
      this.state = {
        user: {
          email :'',
          password:''
        },
        loggedIn : false,
        rememberMe : false,
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
    fetch('/api/admin/hashval', {
        method : 'post',
        headers: {'Content-Type':'application/json'},
        body : JSON.stringify({
            "email" : email,
            "hashval" : hashval
        })
      })
      .then(res=>res.json())
      .then(res=>{
        if(res.code == 200){
          this.setState({loggedIn:true})
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
        fetch('/api/admin/login', {
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
              cookie.save('adminemail',res.email,{path: '/',maxAge: 10000})
              cookie.save('adminhashval',res.val,{path: '/',maxAge: 10000})
            } else {
              this.setState({error:res.msg})
            }
        })
        .catch(err => {
          this.setState({error:err.msg})
        });
    }

    render() {
      return (
          <Container>
            <Typography>Admin Sing in</Typography>
            <TextField value={this.state.user.email} label="email" onChange={this.handleChangeEmail}></TextField>
            <TextField value={this.state.user.password} label="password" type="password" onChange={this.handleChangePassword}></TextField>
            <Checkbox checked={this.rememberMe} onChange={this.handleRemember}>Remembber Me </Checkbox>
            <Button type="submit" label="submit" onClick={this.handleSubmit}> Sign In </Button>
            {this.state.loggedIn?(
                <div>
                <Switch>
                    <Redirect from="/admin/login" to="/admin/dashboard"></Redirect>
                </Switch>
                </div>
            ):(<Typography>{this.error}</Typography>)}
          </Container>
      );
    }
  }
  export default AdminLogin;