import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ChatBot, { Loading } from 'react-simple-chatbot';
import { geolocated } from "react-geolocated";
import './App.css';

const axios = require('axios');

class Geoloc extends Component {
    constructor(props) {
      super(props);
  
      this.state = {
        loading: true,
        result: '',
        trigger: false,
        googleMap:'',
        latitude:'',
        longitude:''
      };
  
      this.triggetNext = this.triggetNext.bind(this);
    }
    getObjectRespense(myObject){
      let firstObject;
     
      Object.keys(myObject).map(function(key, index) {
        //console.log("index :: ",index); 
       if(index === 0)  {
        firstObject = myObject[key];
       }
      });
       return firstObject;    
    }
    componentWillReceiveProps() {
      const self = this;
      if(this.props.coords != null){
        console.log(" props if :: ",this.props);
        const body = {
          "input":{"text": `agence proche`},
          "context": {
          "lat":this.props.coords.latitude,
          "long":this.props.coords.longitude
         }
      };

      axios.post('https://gateway-lon.watsonplatform.net/assistant/api/v1/workspaces/544c1e4a-1f3d-44f4-b48c-beae1f839741/message?version=2019-07-11', 
      body, 
      {
       auth: {
         username: "apikey",
         password: "mAx0ygL19hEPzxPcqQ5BzigvrXBZx42phOiQg8rKEq-5"
       }
     })
     .then((response) => {
      console.log("response ::",response.data.context.my_result.message);
      
     // this.getObjectRespense(response.data.context.my_result.message)
      self.setState({ loading: false, 
        result: this.getObjectRespense(response.data.context.my_result.message),
        googleMap:`https://www.google.com/maps/@${this.getObjectRespense(response.data.context.my_result.message).latitude},${this.getObjectRespense(response.data.context.my_result.message).longitude}z`
  
       });
     })
     .catch(function (error) {
       console.log(error);
       self.setState({ loading: false, result: 'Not found.' });
     });

      }
      
   
  
      
    }
    triggetNext() {
      this.setState({ trigger: true }, () => {
        this.props.triggerNextStep();
      });
    }
  
    render() {
      const { trigger, loading, result } = this.state;
      console.log(" this.props.coords :: ", this.props.coords);
      return (
        this.props.coords && <div className="dbpedia">
          { loading ? <Loading /> : `Agence ${result.libelleAgence}, ouverte ${result.joursHeuresOuverture} ` }
          {!loading &&  <div>{`Adresse  : ${result.adresseAgence} `}</div>}
          {
            !loading &&
            <div
              style={{
                textAlign: 'center',
                marginTop: 20,
              }}
            >
              <a href={this.state.googleMap}>Google map</a>
              {/* {
                !trigger &&
                <button
                  onClick={() => this.triggetNext()}
                >
                  Search Again
                </button>
              } */}
            </div>
          }
        </div>);
    }
  
  
  }

  export default geolocated({
    positionOptions: {
    enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
    }) (Geoloc);