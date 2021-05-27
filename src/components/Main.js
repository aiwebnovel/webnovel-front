import { Component, Fragment } from 'react';
import axios from 'axios';
import { Spinner } from "react-loading-io";
import * as config from '../config';
import reseticon from '../public/reset.png';

import '../style/Main.css';


class Main extends Component {
  constructor() {
    super();
    this.state = { 
      input: '',
      output: '',
      outputBeforeTlanslate: '',
      outputAfterTlanslate: '',
      loading: false,
      isFollow: false,
      options: ['판타지','현판','무협','미스터리','로판'],
      selectOptions: '판타지',
      Main_character: '',
      Place: '',
      Time: '',
      Main_Events: '',
      Material: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.requestcontents = this.requestcontents.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.onSelectFollow = this.onSelectFollow.bind(this);
    this.resetData = this.resetData.bind(this);
  }

  handleChange(e){
    this.setState({[e.target.name]: e.target.value});
  }

  onSelectFollow(e){
    this.setState({ isFollow: e.target.value});
  }

  onSelect(e){
    this.setState({ selectOptions: e.target.value});
  }

  requestcontents(){
    if (localStorage.getItem('token') !== undefined) {
    this.setState({loading: true});
    let story = '';
    if (this.state.isFollow) { story = this.state.outputBeforeTlanslate; }

    axios.post(`${config.SERVER_URL}/complation`, 
    { selectOptions: this.state.selectOptions,
      Main_character: this.state.Main_character,
      Place: this.state.Place,
      Time: this.state.Time,
      Main_Events: this.state.Main_Events,
      Material: this.state.Material,
      Story: story }, 
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


  resetData(){
    this.setState({next: ''});
    this.setState({input: ''});
    this.setState({output: ''});
    this.setState({outputBeforeTlanslate: ''});
    this.setState({outputAfterTlanslate: ''});
  }


  render() {
    return (
      <Fragment>
      <div class="sub">
        <div class="input">
          <select className='dropdowncategory' onChange={this.onSelect} >
            <option value={this.state.options[0]}>{this.state.options[0]}</option>
            <option value={this.state.options[1]}>{this.state.options[1]}</option>
            <option value={this.state.options[2]}>{this.state.options[2]}</option>
            <option value={this.state.options[3]}>{this.state.options[3]}</option>
            <option value={this.state.options[4]}>{this.state.options[4]}</option>
        </select>
        </div>
        <input class="sub_input_text" value={this.state.Main_character} onChange={this.handleChange} name='Main_character' placeholder="주요 인물"></input>
        <input class="sub_input_text" value={this.state.Place} onChange={this.handleChange} name='Place' placeholder="장소"></input>
        <input class="sub_input_text" value={this.state.Time} onChange={this.handleChange} name='Time' placeholder="시간"></input>
        <input class="sub_input_text" value={this.state.Main_Events} onChange={this.handleChange} name='Main_Events' placeholder="주요 사건"></input>
        <input class="sub_input_text" value={this.state.Material} onChange={this.handleChange} name='Material' placeholder="소재"></input>
        <button class="start" onClick = {this.requestcontents}>Start!</button>
        <select className='followSelector' onChange={this.onSelect} >
          <option value={false}>도입부 쓰기</option>
          <option value={true}>줄거리 쓰기</option>
        </select>
      </div>

      <div class="main">
        {this.state.loading ? 
        <div class="loading"> <Spinner size='8px' color='#3b2479'/> </div> : null}
        <div>
          <div>
            <textarea class="output" value={this.state.output} readOnly></textarea>
            <div class="reset">
              <a onClick={this.resetData}>
                <img  src={reseticon} class="reseticon"/>
              </a>
            </div>
          </div>
        </div>
      </div>
      </Fragment>
    );
  }
}

export default Main;
