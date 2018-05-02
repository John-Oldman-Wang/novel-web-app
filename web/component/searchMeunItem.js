import React,{ Component } from "react";
import { Link } from "react-router-dom";
import Input, { InputLabel, InputAdornment } from 'material-ui/Input'
import { FormControl } from 'material-ui/Form'
import SearchIcon from '@material-ui/icons/Search'

import IconButton from 'material-ui/IconButton'


class SearchMeunItem extends Component{
    constructor(props){
        super(props)
        this.state={
            search: ''
        }
    }
    handleSearchChange(e){
        this.setState({ search: e.target.value })
    }
    render(){
        return (<FormControl >
            <InputLabel>
                Search
            </InputLabel>
            <Input
                id="search"
                type="text"
                value={this.state.search}
                onChange={(e)=>{this.handleSearchChange(e)}}
                endAdornment={
                    <Link to={"search?key=" + this.state.search}>
                    <InputAdornment position="end">
                        <IconButton>
                            <SearchIcon />
                        </IconButton>
                    </InputAdornment>
                    </Link>
                }
            />
        </FormControl>)
    }
}
export default SearchMeunItem