import React from "react";
import ReactDOM from "react-dom";
import { Link, Route, HashRouter } from "react-router-dom";
import SOS from "./sos.jsx";
import Help from "./help.jsx";
import Heatmap from "./heatmap.jsx";
import Weather from "./weather.jsx";
import {mq, satori, pier48sf} from "./globals";

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



    render(){
        return (
            <div>
                <ul id="slide-out" className="side-nav">
                    <li><Link to="/sos" className="waves-effect">SOS</Link></li>
                    <li><Link to="/help" className="waves-effect">Seek Help</Link></li>
                    <li><Link to="/weather" className="waves-effect">Weather</Link></li>
                    <li><Link to="/heatmap" className="waves-effect">Heatmap</Link></li>
                </ul>                
                <div data-activates="slide-out" className="fixed-action-btn button-collapse" onClick={()=>this.activate()}>
                    <a className="btn-floating btn-large red">
                        <i className="large material-icons">menu</i>
                    </a>
                </div>
                <Route path="/sos" render={()=><SOS/>}/>
                <Route path="/help" render={()=><Help/>}/>
                <Route path="/weather" render={()=><Weather/>}/>
                <Route path="/heatmap" render={()=><Heatmap/>}/>
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