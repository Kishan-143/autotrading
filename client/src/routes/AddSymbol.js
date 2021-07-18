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
import NativeSelect from '@material-ui/core/NativeSelect'
import MenuItem from '@material-ui/core/MenuItem'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions';
var data2 = require("./symbols_data.json");

function get_all_symbol_list() {
  var data = []
  var data1 = require("./symbols_data.json");
  data = [...data1["EQ"],...data1["CM_FUT"],...data1["CM_OP_CE"],...data1["CM_OP_PE"],...data1["COM_FUT"],...data1["COM_OP_CE"],...data1["COM_OP_PE"]]
  data = data.sort()
  //data = [...data,...data1["CM_OP_CE"]]
  //data = [...data,...data1["CM_OP_PE"]]
  //data = [...data,...data1["COM_FUT"]]
  //data = [...data,...data1["COM_OP_CE"]]
  //data = [...data,...data1["COM_OP_PE"]]
  return data
}


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
  },
  sell : {
      color : "default",
  },
  option : {
    width:"100px",
    hight:"150px"
  },list:{
    width:"200px"
  }
  
});

class AddSymbol extends Component {
    constructor(props) {
      super(props);
      this.state = {
          symbols : [],
          selectedSymbol : '-',
          isSubmit : false,
          searchValue : '',
          results : [],
          types : [],
          from : '',
          type : '',
          open1 : false
      };
    }
    componentDidMount() {
      this.getSymbolsall()
    }
    componentWillUnmount() {
    }
    handleSelectMarket = (e) => {        
      this.setState({from:e.target.value},()=>{
        if(this.state.from == "COM"){
          this.setState({types:["FUT","CM"]})
        }
        if(this.state.from == "EQ"){
          this.setState({types:["FUT","CM","OP"]})
        }
      })
    }
    handleSelectType = (e) => {
      this.setState({type:e.target.value},()=>{
        //this.getSymbols()
      })
    }
    getSymbolsall = () => {
      this.setState({
        symbols:get_all_symbol_list()
      })
    }
    handleSubmit = (e) => {
      if( this.props.watchlist.indexOf(this.state.selectedSymbol) == -1 && this.state.symbols.indexOf(this.state.selectedSymbol)>=0){
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
        fetch('/api/user/watchlist/add', {
          method : 'post',
          headers: {'Content-Type':'application/json'},
          body : JSON.stringify({
              "symbol": this.state.selectedSymbol,
              "username":username,
              "hashval":hashval
          })
        })
        .then(res=>res.json())
        .then(res=>{
          if(res.code == 200){
            this.props.addWatchlist(this.state.selectedSymbol)
          }else{
            this.setState({error:res.msg})
          }
        })
        .catch(err=>{
          this.setState({error:err.msg})
        })
      }
    }
    handleChangeSymbol = (e) => {
        this.setState({selectedSymbol:e.target.value})
        this.setState({searchValue:e.target.value})
    }
    handleChangeMarket = (e) => {
      this.setState({symbols:data2[e.target.value]},()=>{
        this.filterPosts(this.state.symbols,this.state.searchValue)
      })  
    }
    handleSearch = (e) => {
      this.setState({searchValue:e.target.value},()=>{
        this.filterPosts(this.state.symbols,this.state.searchValue)
      })
    }
    filterPosts = (posts, query) => {
      if (!query || query=='') {
          return posts;
      }
      var x =  posts.filter((post)=>{
        if(post.includes(query.toUpperCase())){
          return true
        }else{
          return false
        }
      })
      this.setState({results:x},()=>{
        this.setState({open1:true})
      })
    };
    render() {
        const { classes } = this.props;
        return (
                <div>
                  <Grid container spacing={1}>
                      <Grid item xs={8}>
                        <div>
                          <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            id="search"
                            label="Search Symbol"
                            name="search"
                            onChange = {this.handleSearch}
                            ONMOUSEOVER = {this.getSymbolsall}
                            />
                        </div>
                      </Grid>
                      <Grid item xs={4}>
                        <div>
                          <NativeSelect className={classes.select}
                            labelId="symbols"
                            id="symbols"
                            fullWidth
                            onChange={this.handleChangeMarket}
                            defaultValue = "None"
                          >
                          <option value="EQ">NSE EQUITY</option>
                          <option value="CM_FUT">NSE FUTURE</option>
                          <option value="CM_OP_CE">NSE Option - CE</option>
                          <option value="CM_OP_PE">NSE Option - PE</option>
                          <option value="COM_FUT">MCX FUTURE</option>
                          <option value="COM_OP_CE">MCX Option - CE</option>
                          <option value="COM_OP_PE">MCX Option - PE</option>
                        </NativeSelect>
                      </div>
                        
                      </Grid>
                      <Grid item xs={8}>
                      {this.state.open1 == true?(
                          <div>
                            <NativeSelect className={classes.select}
                            labelId="symbols"
                            id="symbols"
                            fullWidth
                            onChange={this.handleChangeSymbol}
                            defaultValue = "None"
                            >
                            <option value="None">None</option>
                            {this.state.results.map(user => (
                                <option value={user} className={classes.option}>
                                  {user}
                                </option>
                            ))}
                            </NativeSelect>
                          </div>
                        ):(<div></div>)}
                      </Grid>                      
                      <Grid item xs={4}>
                          <Grid container justify="center">
                              <Button type="submit" onClick={this.handleSubmit} variant="contained" color="primary">Add Symbol</Button>
                      </Grid>
                      </Grid>
                  </Grid>
              </div>

        )
    }
  }
  export default withStyles(styles, { withTheme: true })(AddSymbol);