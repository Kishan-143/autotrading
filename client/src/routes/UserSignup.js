
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

class UserSignup extends Component {
    constructor(props) {
      super(props);
      this.state = {
        user: {
          name : '',
          username :'',
          password:'',
          cpassword:'',
          secretcode : ''
        },
        loggedIn : false,
        rememberMe : false,
        error : ''
      };
    }
    handleChangeUsername = (e) => {
        this.setState(prevState => ({
            user:{
              ...prevState.user,
              ['username']: e.target.value
            }
          }));
    }
    handleChangeName = (e) => {
      this.setState(prevState => ({
          user:{
            ...prevState.user,
            ['name']: e.target.value
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
    handleChangeCPassword = (e) => {
      this.setState(prevState => ({
          user:{
            ...prevState.user,
            ['cpassword']: e.target.value
          }
        }));
    }
    handleChangeSecretCode = (e) => {
      this.setState(prevState => ({
          user:{
            ...prevState.user,
            ['secretcode']: e.target.value
          }
        }));
    }
    fetchdata(){
      fetch('/api/user/signup', {
          method : 'post',
          headers: {'Content-Type':'application/json'},
          body : JSON.stringify({
              "password" : this.state.user.password,
              "username" : this.state.user.username,
              "cpassword" : this.state.user.cpassword,
              "secretcode" : this.state.user.secretcode,
              "name" : this.state.user.name,
          })
      })
      .then(res => res.json())
      .then(res => {
          if(res.code == 200){  
            this.setState({loggedIn:true})
          } else {
            this.setState({error:res.msg})
          }
      })
      .catch(err => {
        this.setState({error:err.msg})
      });
    }
    validate = async() => {
      if(this.state.user.password.length >=8){
        this.setState({error:"Password must contain 8 character."})
      }else if(this.state.password == this.state.cpassword){
        this.setState({error:"Password should match with Confirm password."})
      }else if(this.state.user.name.length==0){
        this.setState({error:"Name is empty"})
      }else{
        await this.fetchdata()
      }
    }
    handleSubmit = (e) => {
      this.validate()
    }

    render() {
      return (
          <Container>
            <Typography>Sing up</Typography>
            <TextField value={this.state.user.name} label="Name" onChange={this.handleChangeName}></TextField>
            <TextField value={this.state.user.username} label="Username" onChange={this.handleChangeUsername}></TextField>
            <TextField value={this.state.user.secretcode} label="SecretCode" onChange={this.handleChangeSecretCode}></TextField>
            <TextField value={this.state.user.password} label="Password" type="password" onChange={this.handleChangePassword}></TextField>
            <TextField value={this.state.user.cpassword} label="Confirm password" type="password" onChange={this.handleChangeCPassword}></TextField>
            <Button type="submit" label="submit" onClick={this.handleSubmit}> Sign Up </Button>
            <Typography>{this.state.error}</Typography>
            {this.state.loggedIn?(
                <div>
                <Switch>
                    <Redirect from="/user/signup" to="/user/login"></Redirect>
                </Switch>
                </div>
            ):(<Typography>{this.state.error}</Typography>)}
          </Container>
      );
    }
  }
  export default UserSignup;