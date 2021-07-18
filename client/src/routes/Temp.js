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
      width: theme.spacing(80),
      height: theme.spacing(80),
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
    width :"350px"
  },
  link : {
    align : "right",
  }
});

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

  handleSubmit = (e) => {
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
    render() {
      const { classes } = this.props;
      return (
        <div className={classes.root}>
          <Paper elevation={5} align='center'>
            <Typography className={classes.title} align='center' color='primary' variant='h4'> Sing Up</Typography>
            <TextField className={classes.textfield} variant='outlined' align='center' color='primary' size='medium' value={this.state.user.name} label="Name" onChange={this.handleChangeName}></TextField>
            <TextField className={classes.textfield} variant='outlined' align='center' color='primary' size='medium' value={this.state.user.username} label="Username" onChange={this.handleChangeUsername}></TextField>
            <TextField className={classes.textfield} variant='outlined' align='center' color='primary' size='medium' value={this.state.user.secretcode} label="SecretCode" onChange={this.handleChangeSecretCode}></TextField>
            <TextField className={classes.textfield} variant='outlined' align='center' color='primary' size='medium' value={this.state.user.password} label="Password" type="password" onChange={this.handleChangePassword}></TextField>
            <TextField className={classes.textfield} variant='outlined' align='center' color='primary' size='medium' value={this.state.user.cpassword} label="Confirm password" type="password" onChange={this.handleChangeCPassword}></TextField>
            <br></br>
            <Link href="/user/signin">Already Account</Link>
            <br></br>
            <Button className={classes.field} size="large" variant="contained" color="default" type="submit" label="submit" onClick={this.handleSubmit}> Sign Up </Button>
            <br></br>
            {this.state.loggedIn?(
              <div>
              <Switch>
                  <Redirect from="/user/signup" to="/user/login"></Redirect>
              </Switch>
              </div>
          ):(<Typography>{this.error}</Typography>)}

          </Paper>
        </div>
      );
    }
  }
  export default withStyles(styles, { withTheme: true })(UserSignup);