// React 
import React, {Component,useEffect} from 'react';
import cookie from "react-cookies";
// Material ui
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import RadioGroup from '@material-ui/core/RadioGroup'
import Radio from '@material-ui/core/Radio'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Button from '@material-ui/core/Button'
import InputAdornment from '@material-ui/core/InputAdornment'
import { ThemeProvider, withStyles } from "@material-ui/core/styles";
import InputLabel from '@material-ui/core/InputLabel';
import Toolbar from '@material-ui/core/Toolbar'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'

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

class RemoveSymbol extends Component {
    constructor(props) {
      super(props);
      this.state = {
          open : {
              'addsymbol' : false
          },
          symbols : [],
          selectedSymbol : '-',
          isSubmit : false          
      };
    }
    componentDidMount() {
    }
    componentWillUnmount() {
    }
    handleCloseDialog = () => {
        this.setState(prevState => ({
            open:{
              ...prevState.open,
              ['addsymbol']: false
            }
        }));
    }
    handleOpenDialog = () => {
        this.setState(prevState => ({
            open:{
              ...prevState.open,
              ['addsymbol']: true
            }
        }));
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
    handleRemoveSymbol = (e) => {
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

        fetch('/api/user/watchlist/remove', {
            method : 'post',
            headers: {'Content-Type':'application/json'},
            body : JSON.stringify({
                "symbol": this.props.symbol,
                "username":username,
                "hashval":hashval
            })
          })
          .then(res=>res.json())
          .then(res=>{
            if(res.code == 200){
            }else{
              this.setState({error:res.msg})
            }
          })
          .catch(err=>{
            this.setState({error:err.msg})
          })

          fetch('/api/remove/symbols', {
            method : 'post',
            headers: {'Content-Type':'application/json'},
            body : JSON.stringify({
                "symbols": [this.state.selectedSymbol]
            })
          })
          .then(res=>res.json())
          .then(res=>{
            if(res.code == 200){
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
        return (
            <div>
                <Button color="inherit" onClick={this.handleRemoveSymbol}>-</Button>
            </div>
        )
    }
}
export default withStyles(styles, { withTheme: true })(RemoveSymbol);