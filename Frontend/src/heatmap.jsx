import React from "react";
import {mq, satori, pier48sf} from "./globals";

class Heatmap extends React.Component {
    constructor(props){
        super(props);
        
        this.state = {
            map : null,
            heatLayer : null,
            center : pier48sf,
            mounted : true
        };
    }

    componentDidMount(){
        console.log("l");
        this.map();
        this.getSignals();
        this.setState({
            mounted : true
        });
    }
    componentWillUnmount() {
        this.setState({mounted:  false});
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
        Add controls
        */
        map.addControl(L.mapquest.control({
            position : "topleft"
        }));
        
        /*
        Add heatmap
        */
        let heatLayer = L.heatLayer([]).addTo(map);
        
        this.setState({
            map : map,
            heatLayer : heatLayer
        });

    }
    getSignals(){
        let self = this;
        let client = new RTM(satori.endpoint, satori.appkey);
        client.on('enter-connected', function () {
            console.log('Connected to Satori RTM!');
        });

        client.on('error', function (error) {
            console.log('Failed to connect', error);
        });

        client.start();

        let help = client.subscribe('help', RTM.SubscriptionMode.SIMPLE);
        let phoneSpoof = client.subscribe('phoneSpoof', RTM.SubscriptionMode.SIMPLE);
        
        help.on('rtm/subscription/data', handler);
        phoneSpoof.on('rtm/subscription/data', handler);

        function handler(pdu) {
            if(self.state.mounted){
                pdu.body.messages.forEach(function (msg) {
                    /*
                    self.setState({
                        points : [...self.state.points, [msg.lat, msg.lon, .5]]
                    });
                    */
                    console.log(msg);
                    self.state.heatLayer.addLatLng(L.latLng([msg.lat, msg.lon]));
                    
                });
            }
        }
    }
    render(){
        return (
            <div id="map">
                
            </div>
        );
    }
}

module.exports = Heatmap;