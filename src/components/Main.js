import { Component } from 'react';
import axios from 'axios';
import { Spinner } from "react-loading-io";
import * as config from '../config';
import '../style/Main.css';

class Main extends Component {
  constructor() {
    super();
    this.state = { 
      input: '',
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

    if (localStorage.getItem('token') !== undefined) {
    this.setState({loading: true});
    this.setState({output: 'Loading...'});
    
    axios.post(`${config.SERVER_URL}/complation`, 
    { input: this.state.input }, 
    { headers: {authentication: localStorage.getItem('token')},
    timeout: 10000 })
    .then((response) => {
      this.setState({ output: this.state.input+response.data.output});
      this.setState({loading: false});
    })
    .catch((error) => {
      this.setState({loading: false});
      this.setState({ output: '토큰이 부족합니다!'});
    })
    }else{
      this.setState({output: '로그인 후 다시 시도해 주세요!'});
    }

  }


  render() {
    return (
      <div class="main">
        <p class="middleTitle"> Completion </p>
        {this.state.loading ? 
          <div class="loading">
            <Spinner size='8px' color='#3b2479'/>
          </div>
        : null}
        <div>
          <div class="input">
          <textarea class="input_text" value={this.state.input} onChange={this.handleChange} placeholder="가사의 주제를 입력하세요!"></textarea>
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
