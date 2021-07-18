import React,{Component} from "react";
import Typography from "@material-ui/core/Typography"
class PL extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    componentDidUpdate(){
    }
    render(){
        return(
            <Typography>{this.state.total}</Typography>
        )
    }
}
export default PL;