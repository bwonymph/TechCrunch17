import React from "react";
import {mq, satori, pier48sf, ow} from "./globals";

class Weather extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            center : pier48sf
        }
    }

    componentDidMount(){
        this.map();
    }

    map(){
        let self = this;
        L.mapquest.key = mq.key;

        // 'map' refers to a <div> element with the ID map
        let map = L.mapquest.map('map', {
            center: self.state.center,
            layers: L.mapquest.tileLayer('satellite'),
            zoom: 12
        });

        /*
        L.tileLayer(
            'http://tile.openweathermap.org/map/cloud_new/12/'+this.state.center[0]+'/'+this.state.center[1]+'.png?appid='+ow.appid, {
        }).addTo(map);
        */
        L.tileLayer(
            'http://tile.openweathermap.org/map/cloud_new/3/3/3.png?appid='+ow.appid, {
        }).addTo(map);
        /*
        Add controls
        */
        map.addControl(L.mapquest.control({
            position : "topleft"
        }));
        // add the weather control
        L.control.weather({
            lang: "es",
            units: "metric"
        }).addTo(map); 
    }
    render(){
        
        return(
            <div id="map"></div>
        );
    }
}

module.exports = Weather;