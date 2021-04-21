import { Component } from 'react';
import axios from 'axios';
import * as config from '../config';
import '../style/Main.css';

class Main extends Component {
  constructor() {
    super();
    this.state = { 
      input: 'false',
      output: '',
      loading: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.requestcontents = this.requestcontents.bind(this);
  }

  handleChange(event){
    this.setState({input: event.target.value});
  }

  requestcontents(){
    this.setState({loading: true});
    
    axios.post(`${config.SERVER_URL}/complation`, 
    { input: this.state.input }, 
    { headers: {authentication: localStorage.getItem('token')},
    timeout: 10000 })
    .then((response) => {
      console.log(response);
      this.setState({ output: response.data.output});
      this.setState({loading: false});
    })
    .catch((error) => {
      console.log(error);
      this.setState({loading: false});
    })
  }

  render() {
    return (
      <div class="main">
        <p class="middleTitle"> Completion </p>
        <div>
          <div class="input">
          <textarea class="input_text" value={this.state.input} onChange={this.handleChange}></textarea>
          <button class="start" onClick = {this.requestcontents}>Start!</button>
          </div>
          <div>
            <textarea class="output" value={this.state.output} readOnly></textarea>
          </div>
        </div>
      </div>
    );
  }
}

export default Main;
