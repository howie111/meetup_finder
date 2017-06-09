import React from 'react';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import axios from 'axios';

class Drawerlist extends React.Component {

  constructor(props){
    super(props);
    this.state = {open: false};
    this.addToHistory = this.addToHistory.bind(this)
  }

handleToggle = () => this.setState({open: !this.state.open});
addToHistory(item){
      item.userid = this.props.userInfo;     
      axios
      .post('/save',item)
      .then( (res) =>{
        console.log(res);
      })
}
  render() {
        var meetupList = this.props.meetupInfo.map(item=>{
       console.log(item)
        return (<li>
                 <h4> When: {new Date(item.time?item.time.time:'unknow').toUTCString()} </h4>
                  <h4>{item.name}</h4>
                  <a href={item.url}>
                  <img className='meetupImg' src ={item.photo?item.photo.photo_link:'https://bytesizemoments.com/wp-content/uploads/2014/04/placeholder3.png'} />
                  </a>      
                  <button className='btn btn-primary interested_btn' onClick ={()=>this.addToHistory(item)}> Interested? </button>
               </li>)
    })
   return (
      
      <div>
        <div className='row text-center'>
         <button  className='btn btn-primary col-md-offset-3 col-md-6 ' id='showlist-btn'  label="Meetup List" 
          onClick={this.handleToggle}
          >Show Meetups</button>
         </div> 
        <Drawer  className='drawer' width={400}  openSecondary={true} open={this.state.open} >
          <AppBar className='appbar' title="Meetup list" />
          <ul className='meetup_ul text-center'>{meetupList}</ul>
        </Drawer>
      </div>
    );
  }
}


export default Drawerlist