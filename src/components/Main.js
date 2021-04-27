import { Component } from 'react';
import axios from 'axios';
import { Spinner } from "react-loading-io";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import * as config from '../config';
import '../style/Main.css';

class Main extends Component {
  constructor() {
    super();
    this.state = { 
      input: '',
      output: '',
      loading: false,
      options: ['발라드','댄스','랩/힙합','R&B/Soul','인디음악','록/메탈','트로트','포크/블루스'],
      selectOptions: '발라드'
    };

    this.handleChange = this.handleChange.bind(this);
    this.requestcontents = this.requestcontents.bind(this);
    this.onSelect = this.onSelect.bind(this);
  }

  handleChange(event){
    this.setState({input: event.target.value});
  }

  requestcontents(){

    if (localStorage.getItem('token') !== undefined) {
    this.setState({loading: true});
    this.setState({output: 'Loading...'});
    
    axios.post(`${config.SERVER_URL}/complation`, 
    { input: this.state.input,
      category: this.state.selectOptions }, 
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

  onSelect(event){
    this.setState({ selectOptions: event.target.value});
    console.log(event.target.value);
  }


  render() {
    return (
      <div class="main">
        <div class="middleTitle">
        <span> Completion </span>
        <select className='dropdowncategory' onChange={this.onSelect} >
          <option value={this.state.options[0]}>{this.state.options[0]}</option>
          <option value={this.state.options[1]}>{this.state.options[1]}</option>
          <option value={this.state.options[2]}>{this.state.options[2]}</option>
          <option value={this.state.options[3]}>{this.state.options[3]}</option>
          <option value={this.state.options[4]}>{this.state.options[4]}</option>
          <option value={this.state.options[5]}>{this.state.options[5]}</option>
          <option value={this.state.options[6]}>{this.state.options[6]}</option>
          <option value={this.state.options[7]}>{this.state.options[7]}</option>
        </select>
        </div>
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
