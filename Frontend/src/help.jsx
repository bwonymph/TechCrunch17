import React from 'react';
import {mq, satori, pier48sf} from "./globals";

class Help extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            center : pier48sf
        };
    }

    componentDidMount(){
        this.map();
        this.sendSignals();
    }

    sendSignals(){

    }

    map(){

        L.mapquest.key = mq.key;
        // 'map' refers to a <div> element with the ID map
        let map = L.mapquest.map('map', {
            center: self.state.center,
            layers: L.mapquest.tileLayer('map'),
            zoom: 12
        });
        map.addControl(L.mapquest.control({
            position : "topleft"
        }));
        let trafficLayer = L.mapquest.trafficLayer();
        map.addLayer(trafficLayer);
        

        L.marker(self.state.center, {
            icon: L.mapquest.icons.via({
                primaryColor: '#47adf8',
                secondaryColor: '#ffffff',
                shadow: true,
                size: 'lg'
            })
        }).addTo(map);

        self.setState({
            map : map,
            trafficLayer : trafficLayer
        });
    }


    render(){
        return (
            <div id="map">

            </div>
        );
    }
}

module.exports = Help;