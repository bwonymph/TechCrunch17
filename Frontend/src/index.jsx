import React from "react";
import ReactDOM from "react-dom";
import { Link, Route, HashRouter } from "react-router-dom";
import SOS from "./sos.jsx";
import Routing from "./routing.jsx";

class App extends React.Component {
    componentDidMount(){
        $('.button-collapse').sideNav({
            menuWidth: 300, // Default is 300
            edge: 'right', // Choose the horizontal origin
            closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
            draggable: true, // Choose whether you can drag to open on touch screens,
            onOpen: function(el) { console.log("open") }, // A function to be called when sideNav is opened
            onClose: function(el) { console.log("close")}, // A function to be called when sideNav is closed
        });
    }
    activate(){
        console.log("button was clicked");        
    }
    render(){
        return (
            <div>
                <ul id="slide-out" className="side-nav">
                    <li><Link to="/sos" className="waves-effect">SOS</Link></li>
                    <li><Link to="/routing" className="waves-effect">Routing</Link></li>
                </ul>                
                <div data-activates="slide-out" className="fixed-action-btn button-collapse" onClick={()=>this.activate()}>
                    <a className="btn-floating btn-large red">
                        <i className="large material-icons">menu</i>
                    </a>
                </div>
                <Route path="/sos" component={SOS}/>
                <Route path="/routing" component={Routing}/>
            </div>
        );
    }
}

document.addEventListener("DOMContentLoaded", ()=>{
    ReactDOM.render(
        <HashRouter>
            <App/>
        </HashRouter>

    , document.getElementById("app"));
});