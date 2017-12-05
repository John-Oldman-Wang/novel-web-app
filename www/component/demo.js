const React = require('react');
const { Component } = require('react')
class Test extends Component {
    componentWillMount() {
        console.log("componentWillMount");
    }

    componentDidMount() {
        console.log("componentDidMount");
    }

    componentWillReceiveProps(nextProps) {
        console.log("componentWillReceiveProps");
    }

    shouldComponentUpdate() {
        console.log("shouldComponentUpdate");
        return true;
    }

    componentWillUpdate() {
        console.log("componentWillUpdate");
    }

    componentDidUpdate() {
        console.log("componentDidUpdate");
    }

    componentWillUnmount() {
        console.log("componentWillUnmount");
    }
    render() {
        console.log(this)
        return (
            <div>
                <h1>hello world</h1>
                <h2> {this.props.router} </h2>
            </div>
        );
    }
}