import React, { Component } from 'react';
import Units from './Units';
import axios from 'axios';
import Drawerlist from './Drawer';

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
class Map extends Component {
  constructor() {
    super();
    this.state = { radius: 0, unit: 'mt', lat: 43.7001, lng: -79.4162, meetupInfo: [], userInfo: [] };
    this.setRadiusUnit = this.setRadiusUnit.bind(this)
  }
  setRadiusUnit(radius, unit) {
    this.setState({ radius: radius, unit: unit })
  }
  componentWillMount() {

    this.setState({ userInfo: this.props.userId })

  }

  componentDidMount() {

    var map = new window.google.maps.Map(this.refs.map, {
      center: Toronto_POSITION,
      zoom: 16,

    })
    var marker = new window.google.maps.Marker({
      position: Toronto_POSITION,
      title: 'this is where you are',
      icon: 'http://maps.google.com/mapfiles/kml/pal3/icon28.png'
    })
    marker.setMap(map)

    var input = this.refs.input;
    var searchBox = new window.google.maps.places.SearchBox(input);
    map.addListener('bounds_changed', function () {
      searchBox.setBounds(map.getBounds());
    });
    var markers = [];
    searchBox.addListener('places_changed', () => {

      var places = searchBox.getPlaces();
      if (places.length == 0) {
        return;
      }
      // Clear out the old markers.
      markers.forEach((marker) => {
        marker.setMap(null);
      });
      markers = [];
      var bounds = new window.google.maps.LatLngBounds();
      places.forEach((place) => {
        if (!place.geometry) {
          console.log("Returned place contains no geometry");
          return;
        }
        var icon = {
          url: place.icon,
          size: new window.google.maps.Size(71, 71),
          origin: new window.google.maps.Point(0, 0),
          anchor: new window.google.maps.Point(17, 34),
          scaledSize: new window.google.maps.Size(25, 25)
        };
        markers.push(new window.google.maps.Marker({
          map: map,
          icon: icon,
          title: place.name,
          position: place.geometry.location
        }));

        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
          // this.props.lat_lon(place.geometry.location.lat(),place.geometry.location.lng(),place.name)
          this.setState({ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() })

        } else {
          bounds.extend(place.geometry.location);
        }
      });
      map.fitBounds(bounds);
    });

  }

  componentDidUpdate(prevProps, prevState) {
    if ((prevState.lat !== this.state.lat && prevState.lng !== this.state.lng) || this.state.meetupInfo.length === 0 || (prevState.lat == this.state.lat && prevState.lng == this.state.lng && prevState.radius !== this.state.radius)) {
      //// get the meet up group around you
      let url = '/meetup';
      axios.post(url, this.state)
        .then(result => {
          var meetupMarker = result.data.map(item => {
            return new window.google.maps.Marker({
              position: {
                lat: item.lat,
                lng: item.lon
              },
              title: item.name,
              icon: 'http://maps.google.com/mapfiles/kml/pal5/icon44.png'
            })
          });
          console.log('meetup length' + meetupMarker.length)
          var infowindow = result.data.map(item => {
            let a = '<h3>' + item.name + '<h3>' + '<a target="_blank" href =' + item.url + '>' + item.url + '</a>'
            return new window.google.maps.InfoWindow({ content: a })
          })
          for (let i = 0; i < meetupMarker.length; i++) {
            meetupMarker[i].addListener('click', () => { infowindow[i].open(map, meetupMarker[i]) })
            meetupMarker[i].setMap(map)
          }

          this.setState({ meetupInfo: result.data })

        })
        .catch(err => {
          console.log(err)
        }
        )
      var map = new window.google.maps.Map(this.refs.map, {
        center: {
          lat: this.state.lat,
          lng: this.state.lng
        },
        zoom: 16
      })

      var marker = new window.google.maps.Marker({
        position: {
          lat: this.state.lat,
          lng: this.state.lng
        },
        title: 'this is where you are',
        icon: 'http://maps.google.com/mapfiles/kml/pal3/icon28.png'
      })
      marker.setMap(map)
      var polygonDestructionHandler = () => {
        console.log(map)
        this.setMap(null);
      }
      var clearMarkers = function () {
        this.setMap()
      }
      var markerAPosition = new window.google.maps.LatLng(43.71, -79.3);
      var circleDrwaHandler = (e) => {

        let radiusConversion = (this.state.radius / earthRadiusUnits[this.state.unit]) * earthRadiusUnits['mt']
        var circle = new window.google.maps.Circle({

          center: {
            lat: this.state.lat,
            lng: this.state.lng
          },
          fillColor: '#9ab6e2',
          fillOpacity: 0.27,
          map: map,
          radius: radiusConversion,
          strokeColor: "#FF0000",
          strokeOpacity: 0.8,
          strokeWeight: 2,
        })
        window.google.maps.event.addDomListener(this.refs.reset, 'click', () => circle.setMap(null))
        var circleBounds = circle.getBounds();
        console.log(circleBounds.contains(markerAPosition))
      }
      window.google.maps.event.addDomListener(this.refs.drawcircle, 'click', circleDrwaHandler)
    }
  }

  render() {
    return (
      <div>
        <div className='search_box'>
          <input ref='input' type='text' className='search_Input' />
        </div>
        < div className='row line'>
          <div className='col-md-offset-4 col-md-4'>
            <Units setRadiusUnit={this.setRadiusUnit} />
            <div type='button' className='btn btn-primary pull-left' ref='drawcircle' >Show radius </div>
            <div type='button' className='btn btn-primary pull-right' ref='reset'>Clear radius </div>
          </div>
        </div>
        <div className='mapContainer' ref='map'>it should be a map! </div>
        <Drawerlist meetupInfo={this.state.meetupInfo} userInfo={this.state.userInfo} />
      </div>
    )

  }
}
export default Map;