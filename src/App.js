import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ChatBot, { Loading } from 'react-simple-chatbot';
import './App.css';
import Geoloc from './Geoloc'
const axios = require('axios');

class DBPedia extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      result: '',
      trigger: false,
    };

    this.triggetNext = this.triggetNext.bind(this);
  }

  componentWillMount() {
    const self = this;
    const { steps } = this.props;
    const search = steps.search.value;
    
    const body = {"input":{
      "text": ` ${search}`
    }};

    axios.post('https://gateway-lon.watsonplatform.net/assistant/api/v1/workspaces/544c1e4a-1f3d-44f4-b48c-beae1f839741/message?version=2019-07-11', 
    body, 
    {
     auth: {
       username: "apikey",
       password: "mAx0ygL19hEPzxPcqQ5BzigvrXBZx42phOiQg8rKEq-5"
     }
   })
   .then((response) => {
    //this.setState({ firstResult: response.data.output.text[0] });
    self.setState({ loading: false, result: response.data.output.text[0] });
   })
   .catch(function (error) {
     console.log(error);
     self.setState({ loading: false, result: 'Not found.' });
   });
  }

  triggetNext() {
    this.setState({ trigger: true }, () => {
      this.props.triggerNextStep();
    });
  }

  render() {
    const { trigger, loading, result } = this.state;

    return (
      <div className="dbpedia">
        { loading ? <Loading /> : result }
        {
          !loading &&
          <div
            style={{
              textAlign: 'center',
              marginTop: 20,
            }}
          >
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
      </div>
    );
  }
}

DBPedia.propTypes = {
  steps: PropTypes.object,
  triggerNextStep: PropTypes.func,
};

DBPedia.defaultProps = {
  steps: undefined,
  triggerNextStep: undefined,
};



const ExampleDBPedia = () => (
    <ChatBot
    steps={[
      {
        id: '1',
        message: 'Bonjour je suis votre assistant SGMA virtuel,en quoi puis-je vous être utile',
        trigger: '2',
      },
      {
        id: '2',
        options: [
          { value: 1, label: 'Ouvrir un compte', trigger: 'Accueil du client' },
          { value: 2, label: "Trouver l'agence  SGMA la plus proche", trigger: 'agence' },
        ],
      },
      {
        id: 'search',
        user: true,
        trigger: '3',
      },
      {
        id: '3',
        component: <DBPedia />,
        
        trigger: '4',
      },
      {
        id: '4',
        message: `Avez vous d'autre question ? `,
        trigger: 'search',
      },
      {
        id: 'Accueil du client',
        message: `Nous sommes heureux de vous compter parmi nos nouveaux clients, que voulez vous savoir ? `,
        trigger: 'search',
      },
      {
        id: 'agence',
        component: <Geoloc />,
        trigger: '4',
      },
    ]}
  />
);

export default ExampleDBPedia;