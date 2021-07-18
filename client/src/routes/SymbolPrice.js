import React, {Component} from 'react';
import {BrowserRouter as Router,Route,Redirect,Switch} from 'react-router-dom';
import cookie from "react-cookies";
import Typography from '@material-ui/core/Typography';
class SymbolPrice extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          prices : 0,
          symbols : []
      };
    }
  
    tick() {
        fetch('/api/data/symbols/price/get', {
            method : 'post',
            headers: {'Content-Type':'application/json'},
            body : JSON.stringify({
                "symbols" : this.props.symbols
            })
        })
        .then(res => res.json())
        .then(res => {
            this.props.changePrice(res.prices)
        })
        .catch(err => {
            this.setState({error:err.msg})
        });
    }
  
    componentDidMount() {
        this.interval = setInterval(() => this.tick(), 10000);
    }
  
    componentWillUnmount() {
      clearInterval(this.interval);
    }
  
    render() {
      return (
          <Typography></Typography>
      );
    }
  }
  export default SymbolPrice;