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
import Paper from '@material-ui/core/Paper';
import { withStyles } from "@material-ui/core/styles";
import InputLabel from '@material-ui/core/InputLabel';
import Link from '@material-ui/core/Link';
const styles = theme => ({
  root: {
    display: 'flex',
    justifyContent:'center',
    flexWrap: 'wrap',
    '& > *': {
      margin : '5%',
      width: theme.spacing(60),
      height: theme.spacing(70),
    },
  },
  title : {
    padding : "30px",
    margin : "10px"
  },
  field : {
    margin : "10px",
  },
  textfield : {
    margin : "10px",
    width :"300px"
  },
  link : {
    align : "right",
  }
});

class UserLogin extends Component {
    constructor(props) {
      super(props);
      this.state = {
        user: {
          username :'',
          password:''
        },
        loggedIn : false,
        rememberMe : false,
        error : ''
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
        }else{
          this.setState({error:res.msg})
        }
      })
      .catch(err=>{
        this.setState({error:err.msg})
      })
    }

    handleChangeUsername = (e) => {
        this.setState(prevState => ({
            user:{
              ...prevState.user,
              ['username']: e.target.value
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
    handleSubmit = (e) => {
        fetch('/api/user/login', {
            method : 'post',
            headers: {'Content-Type':'application/json'},
            body : JSON.stringify({
                "username" : this.state.user.username,
                "password" : this.state.user.password
            })
        })
        .then(res => res.json())
        .then(res => {
            if(res.code == 200){  
              this.setState({loggedIn:true})
              cookie.save('username',res.username,{path: '/',maxAge: 30000})
              cookie.save('hashval',res.val,{path: '/',maxAge: 30000})
            } else {
              this.setState({error:res.msg})
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
        <div className={classes.root}>
          <Paper elevation={5} align='center'>
            <Typography className={classes.title} align='center' color='primary' variant='h4'> Sing in</Typography>
            <TextField className={classes.textfield} variant='outlined' align='center' color='primary' size='medium' value={this.state.user.username} label="Username" onChange={this.handleChangeUsername}></TextField>
            <br></br>
            <TextField className={classes.textfield} variant='outlined' align='center' color='primary' size='medium' value={this.state.user.password} label="Password" type="password" onChange={this.handleChangePassword}></TextField>
            <br></br>
            <Link href="/user/signup">Create Account</Link>
            <br></br>
            <Link href="/user/signup">Forgot Password</Link>
            <br></br>
            <Checkbox id="c" label="Remember me" checked={this.rememberMe} onChange={this.handleRemember}>Remembber Me </Checkbox>

            <InputLabel for="c">Remeber Me</InputLabel>
            <Button className={classes.field} size="large" variant="contained" color="default" type="submit" label="submit" onClick={this.handleSubmit}> Sign In </Button>
            <br></br>
            {this.state.loggedIn?(
              <div>
              <Switch>
                  <Redirect from="/user/login" to="/user/dashboard"></Redirect>
              </Switch>
              </div>
          ):(<Typography>{this.error}</Typography>)}

          </Paper>
        </div>
      );
    }
  }
  export default withStyles(styles, { withTheme: true })(UserLogin);