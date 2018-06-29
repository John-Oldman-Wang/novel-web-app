import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';


import SignAppBar from '../comps/SignAppBar.jsx'
const styles = (theme)=>({
  content:{
    margin: theme.spacing.unit,
  },
  listwrap: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
})

class SignUp extends React.Component {
  constructor(props){
    super(props)
    this.state={
      username:'',
      password:''
    }
    this.signup=()=>{
      fetch('/signup?pbj=1',{
        method: 'POST',
        body: JSON.stringify(this.state),
        headers:{
          'x-response-type':'multipart'
        }
      }).then(res=>{
        return res.json()
      }).then(data=>{
        console.log(data)
      }).catch(err=>{
        console.log(`signup fetch error`)
      })
    }
  }
  handleChange(name){
    return event => {
      this.setState({
        [name]: event.target.value,
      });
    };
  }
  render() {
    const { classes } = this.props
    const { username, password } = this.state
    return (
      <React.Fragment>
        <SignAppBar title="欢迎加入" {...this.props}/>
        <Typography variant="headline" component="h3" className={classes.content}>
          注册
        </Typography>
        <TextField
          id="username-input"
          label="用户名"
          className={classes.listwrap}
          type="text"
          autoComplete="current-username"
          margin="normal"
          value={username}
          onChange={this.handleChange('username')}
        />
        <TextField
          id="password-input"
          label="密码"
          className={classes.listwrap}
          type="password"
          autoComplete="current-password"
          margin="normal"
          value={password}
          onChange={this.handleChange('password')}
        />
        <Button disabled={!username.length||!password.length} onClick={this.signup} variant="contained" color="primary" className={classes.content}>
          注册
        </Button>
      </React.Fragment>
    );
  }
}

export default withStyles(styles, { withTheme: true })(SignUp)