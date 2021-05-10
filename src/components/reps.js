import React from "react";
import axios from "axios";

import eventBus from "../util/eventbus";
import RepCard from './rep_card'

import '../styles/reps.css'


class Reps extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      zip_code: "",
      reps: [],
      loading: false,
      messages: [],
      errors: []
    };
  }

  componentDidMount() {
    eventBus.on("zip_code_submit", (data) => {
      this.getRepresentatives(data.zip_code);
      this.setState({zip_code: data.zip_code})
    });
    axios.get(`https://frozen-brook-43368.herokuapp.com`)
  }

  componentWillUnmount() {
    eventBus.remove("zip_code_submit");
  }

  getRepresentatives(zip_code) {
    this.setState({loading: true})
    axios
      .get(`https://frozen-brook-43368.herokuapp.com/reps/${zip_code}`)
      // .get(`http://localhost:5000/reps/${zip_code}`)
      .then((res) => {
        this.setState({reps: res.data.reps})
        this.addMessage(res.data.message)
      })
      .catch((error) => {
        this.addError(error.response.data.error)
      })
      .then(() => {
        this.setState({loading: false})
        this.clearMessages()
      });
  }

  addMessage(message){
    this.setState({messages: this.state.messages.concat([message])})
  }

  addError(error){
    this.setState({errors: this.state.errors.concat([error])})
  }

  clearMessages() {
    setInterval(
      () => this.setState({messages: [], errors: []})
      , 5000);
  }


  render() {
    return (
      <div className='reps'>
        {this.state.messages ? this.state.messages.map( message => 
          <p key={message} style={{color:"green"}}>{message}</p>
        ): null}
        {this.state.errors ? this.state.errors.map( error => 
          <p key={error} style={{color:"red"}}>{error}</p>
        ): null}
        {this.state.loading ? <p>Loading ...</p>: null}
        {this.state.reps.length ?  
          <div>
            <h1>Representatives for {this.state.zip_code}</h1>
            {this.state.reps.map( rep => 
              <RepCard props={rep} key={rep.name}></RepCard>
            )}
          </div>
        : null}
      </div>
    );
  }
}

export default Reps;
