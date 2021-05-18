import { Component } from 'react';
import axios from 'axios';
import { Slide } from 'react-slideshow-image';
import { Spinner } from "react-loading-io";
import * as config from '../config';
import reseticon from '../public/reset.png';
import fantasy from '../public/fantasy.png';
import modernfantasy from '../public/modernfantasy.png';
import martial from '../public/martial.png';
import mystery from '../public/mystery.png';
import romance from '../public/romance.png';
import romancefantasy from '../public/romancefantasy.png';
import 'react-slideshow-image/dist/styles.css'

import '../style/Main.css';


class Main extends Component {
  constructor() {
    super();
    this.state = { 
      input: '',
      output: '',
      next: '',
      outputBeforeTlanslate: '',
      outputAfterTlanslate: '',
      temp: '',
      loading: false,
      options: ['판타지','현판','무협','미스터리','로판'],
      selectOptions: '판타지',
      mainChar: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.requestcontents = this.requestcontents.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.resetData = this.resetData.bind(this);
    this.handleChangeN = this.handleChangeN.bind(this);
    this.requestNextContents = this.requestNextContents.bind(this);
  }

  handleChange(event){
    this.setState({input: event.target.value});
  }

  handleChangeN(event){
    this.setState({next: event.target.value});
  }

  requestcontents(){
    if (localStorage.getItem('token') !== undefined) {
    this.setState({loading: true});

    axios.post(`${config.SERVER_URL}/complation`, 
    { input: this.state.input,
      category: this.state.selectOptions }, 
    { headers: {authentication: localStorage.getItem('token')},
    timeout: 10000 })
    .then((response) => {
      this.setState({ mainChar: this.state.input});
      this.setState({ outputAfterTlanslate: this.state.outputAfterTlanslate + response.data.output});
      this.setState({ outputBeforeTlanslate: this.state.outputBeforeTlanslate + response.data.outputBeforeTlanslate});
      this.setState({ temp: response.data.outputBeforeTlanslate});
      this.setState({ output: this.state.outputAfterTlanslate+ '\n\n원본\n'+ this.state.outputBeforeTlanslate});
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
  }

  resetData(){
    this.setState({next: ''});
    this.setState({input: ''});
    this.setState({output: ''});
    this.setState({mainChar: ''});
    this.setState({outputBeforeTlanslate: ''});
    this.setState({outputAfterTlanslate: ''});
  }


  requestNextContents(next){
    if (localStorage.getItem('token') !== undefined) {
    this.setState({loading: true});
    console.log(this.state.next);


    axios.post(`${config.SERVER_URL}/next`, 
    { mainCharacter: this.state.mainChar,
      category: this.state.selectOptions,
      story: this.state.temp,
      action: this.state.next }, 
    { headers: {authentication: localStorage.getItem('token')},
    timeout: 10000 })
    .then((response) => {
      this.setState({ outputAfterTlanslate: this.state.outputAfterTlanslate + response.data.output});
      this.setState({ outputBeforeTlanslate: this.state.outputBeforeTlanslate + response.data.outputBeforeTlanslate});
      this.setState({ output: this.state.outputAfterTlanslate+ '\n\n원본\n'+ this.state.outputBeforeTlanslate});
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
    const images = [
      mystery,
      martial,
      fantasy,
      modernfantasy,
      romance,
      romancefantasy
    ];
    return (
      <div class="main">
        <div className="slider">
        <Slide easing="ease">
          <div className="each-slide">
            <img className="background-image" src={images[0]}/>
          </div>
          <div className="each-slide">
            <img className="background-image" src={images[1]}/>
          </div>
          <div className="each-slide">
            <img className="background-image" src={images[2]}/>
          </div>
          <div className="each-slide">
            <img className="background-image" src={images[3]}/>
          </div>
          <div className="each-slide">
            <img className="background-image" src={images[4]}/>
          </div>
          <div className="each-slide">
            <img className="background-image" src={images[5]}/>
          </div>
        </Slide>
      </div>
        {this.state.loading ? 
          <div class="loading">
            <Spinner size='8px' color='#3b2479'/>
          </div>
        : null}
        <div>
          <div class="input">
                  <select className='dropdowncategory' onChange={this.onSelect} >
          <option value={this.state.options[0]}>{this.state.options[0]}</option>
          <option value={this.state.options[1]}>{this.state.options[1]}</option>
          <option value={this.state.options[2]}>{this.state.options[2]}</option>
          <option value={this.state.options[3]}>{this.state.options[3]}</option>
          <option value={this.state.options[4]}>{this.state.options[4]}</option>
        </select>
          <input class="input_text" value={this.state.input} onChange={this.handleChange} placeholder="당신의 주인공을 입력하세요!"></input>
          <button class="start" onClick = {this.requestcontents}>Start!</button>
          </div>
          <div>
            <textarea class="output" value={this.state.output} readOnly></textarea>
            <div class="reset">
              <a onClick={this.resetData}>
                <img  src={reseticon} class="reseticon"/>
              </a>
            </div>

          {this.state.mainChar ? 
          <div>
            <div class="next_input">
              <span>{this.state.mainChar}은 " </span>
              <input class="next_text" value={this.state.next} onChange={this.handleChangeN} placeholder="다음 행동을 입력하세요!"></input>
              <span> " 하기로 했다.</span>
            </div>
            <button class="next" onClick = {() => {this.requestNextContents(this.state.next)}}>Next!</button>
          </div>

          : null}
          
        </div>
        </div>
      </div>
    );
  }
}

export default Main;
