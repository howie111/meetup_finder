import React, { Component } from 'react';
import Units from './Units';
import axios from 'axios';
import Drawerlist from './Drawer';
import {Router,Route,browserHistory,IndexRoute} from 'react-router';

const Toronto_POSITION = {
    lat: 43.7001,
    lng: -79.4163
};
// the radius of the earth in various units
const earthRadiusUnits = {
    mi: 3963.1676,
    km: 6378.1,
    ft: 20925524.9,
    mt: 6378100,
    in: 251106299,
    yd: 6975174.98,
}
class Recordmap extends Component {
    constructor() {
        super();
        this.state = {meetupRecord: [],loading: true};
        this.deleteRecord = this.deleteRecord.bind(this)
    }
    deleteRecord(id){
       let newMeetupRecord = this.state.meetupRecord.filter(item =>{
           return item.id !==id;
       })
       this.setState({meetupRecord:newMeetupRecord})

        axios.delete('/delete/'+id).then(res=>{
        })
    }
    componentWillMount() {
        axios.get('/getrecord/' + this.props.userId).then(result => {
            this.setState({ meetupRecord: result.data, loading: false })
        })
    }
    componentDidUpdate() {
        if (!this.state.loading) {
            var map = new window.google.maps.Map(this.refs.record_map, {
                center: Toronto_POSITION,
                zoom: 16,
            })
            var marker = new window.google.maps.Marker({
                position: Toronto_POSITION,
                title: 'this is where you are',
                icon: 'http://maps.google.com/mapfiles/kml/pal3/icon28.png'
            })
            marker.setMap(map);
            console.log(this.state.meetupRecord)
            console.log(this.state.howie)
            var meetupMarker = this.state.meetupRecord.map(item => {

                return new window.google.maps.Marker({
                    position: {
                        lat: Number(item.lat),
                        lng: Number(item.lon)
                    },
                    title: item.name,
                    //icon:'img/compass.png'
                    icon: 'http://maps.google.com/mapfiles/kml/pal5/icon44.png'
                })
            });
            console.log('meetup length' + meetupMarker.length)
            var infowindow = this.state.meetupRecord.map(item => {
                let a = '<h3>' + item.name + '<h3>';
                return new window.google.maps.InfoWindow({ content: a })
            })
            for (let i = 0; i < meetupMarker.length; i++) {
                meetupMarker[i].addListener('click', () => { infowindow[i].open(map, meetupMarker[i]) })
                meetupMarker[i].setMap(map)
                console.log(meetupMarker[i].position + ' lan and long ' + meetupMarker[i].position)
            }
        }
    }
    
    render() {     
       var recordrows = this.state.meetupRecord.map(recordrow=>{
            return (<tr><th className='text-center'>{recordrow.name}</th><th className='text-center'>{new Date(recordrow.time?Number(recordrow.time):'unknow').toUTCString()}</th><th className='text-center'><button className='btn btn-danger' onClick={(e)=>this.deleteRecord(recordrow.id)}>Delete</button></th></tr>)
       })
       let infotable = (
             <div className='table-responsive'>
                 <h2 className='text-center'> Meetup Table </h2>
               <table className='table table-striped'>
                    <tr>
                        <th  className='text-center'><h3>Meetup</h3></th>
                        <th className='text-center'><h3>Date</h3></th>
                        <th className='text-center'><h3>Delete it</h3> </th>         
                    </tr>
                    {recordrows}
               </table>
             </div>
       )         
        return (
            <div>
                <div className='text-center'> <h2> My Meetup Maps </h2> </div>
                <div>
                    <div className='recordmapContainer' ref='record_map'> it should be a map </div>
                </div>
                {infotable }
            </div>
        )

    }
}
export default Recordmap;