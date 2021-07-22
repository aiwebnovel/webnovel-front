import { Component, Fragment } from 'react';
import axios from 'axios';
import { Spinner } from "react-loading-io";
import { authService, firebaseInstance } from "../public/firebaseConfig";
import { CopyToClipboard } from 'react-copy-to-clipboard'
import * as config from '../config';
import reseticon from '../public/reset.png';
import trashicon from '../public/trash.jpg';
import copyicon from '../public/copy.png';
import { ToastContainer, toast } from 'react-toastify';
import ProgressBar from "@ramonak/react-progress-bar";
import 'react-toastify/dist/ReactToastify.css';
import '../style/Main.css';
const LanguageDetect = require('languagedetect');

class Main extends Component {
  constructor() {
    super();
    this.state = { 
      input: '',
      output: '',
      outputBeforeTlanslate: '',
      outputAfterTlanslate: '',
      loading: false,
      options: ['판타지','현판','무협','미스터리','로판'],
      selectOptions: '판타지',
      Main_character: '',
      Place: '',
      Time: '',
      Main_Events: '',
      Material: '',
      Start: 'Create a story',
      tempLength: 0,
      tempWrite: '',
      progress: 0,
      isHuman: false,
      isChange: false,
      
      before_selectOptions: '판타지',
      before_Main_character: '',
      before_Place: '',
      before_Time: '',
      before_Main_Events: '',
      before_Material: '',
      before_outputBeforeTlanslate: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.requestcontents = this.requestcontents.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.resetData = this.resetData.bind(this);
    this.handleStory = this.handleStory.bind(this);
  }

  handleChange(e){
    if(e.target.value.length < 20 && e.target.name === 'Main_Events'){   
      this.setState({[e.target.name]: e.target.value});
    } else if(e.target.value.length < 10){
      this.setState({[e.target.name]: e.target.value});
    }else{
      toast.error(`🦄 ${e.target.value.length}글자를 넘어갈 수 없어요!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }

  async handleStory(e){
    this.setState({outputAfterTlanslate: e.target.value});
    this.setState({isChange: true});
    if (this.state.isHuman == false) {
      if (e.target.value.length > 0) {
        this.setState({Start: 'Continue'});
      }else{
        this.setState({Start: 'Create a story'});
      }
    }else{
      this.setState({Start: 'Need write'});
      const lngDetector = new LanguageDetect();
      const language = await lngDetector.detect(this.state.outputAfterTlanslate, 1);

      if (this.state.progress >= 100) {
        this.setState({Start: 'Continue'});
      }

      if (language[0] == 'english') {
        this.setState({progress: ((this.state.outputAfterTlanslate.length - this.state.tempLength) * 100) / 150 });
      //console.log((this.state.outputAfterTlanslate.length - this.state.tempLength) * 100 / 150);
      }else{
      //console.log((this.state.outputAfterTlanslate.length - this.state.tempLength) * 100 / 100);
        this.setState({progress: ((this.state.outputAfterTlanslate.length - this.state.tempLength) * 100) / 100 });
      }
    }
  }

  onSelect(e){
    this.setState({ selectOptions: e.target.value});
  }

  async requestcontents(e){
    await this.refreshProfile();
    if (this.state.isHuman == true && this.state.progress < 100) {
      toast.error(`추가 이야기의 길이가 부족해요ㅠㅠ`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }else{
      this.setState({isHuman: false});
    }

    if (localStorage.getItem('token') !== undefined) {
      let story = this.state.outputBeforeTlanslate;
      let selectOptions = this.state.selectOptions;
      let Main_character = this.state.Main_character;
      let Place = this.state.Place;
      let Time = this.state.Time;
      let Main_Events = this.state.Main_Events;
      let Material = this.state.Material;

      if (this.state.isChange === true) {
        story = this.state.outputAfterTlanslate;
      }

      if (e.target.name == 'reset') {
        //console.log('reset');
        selectOptions = this.state.before_selectOptions;
        Main_character = this.state.before_Main_character;
        Place = this.state.before_Place;
        Time = this.state.before_Time;
        Main_Events = this.state.before_Main_Events;
        Material = this.state.before_Material;
        story = this.state.before_outputBeforeTlanslate;
        await this.setState({selectOptions: selectOptions});
        await this.setState({Main_character: Main_character});
        await this.setState({Place: Place});
        await this.setState({Time: Time});
        await this.setState({Main_Events: Main_Events});
        await this.setState({Material: Material});
        await this.setState({outputBeforeTlanslate: story});
      }



      if (Main_character == '') {
        toast.error(`주인공을 입력해 주세요!`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return;
      }else if(Place == ''){
          toast.error(`장소를 입력해 주세요!`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return;
      }else if(Time == ''){
          toast.error(`시간대를 입력해 주세요!`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return;
      }else if(Main_Events == ''){
          toast.error(`주요 사건을 입력해 주세요!`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return;
      }else if(Material == ''){
          toast.error(`소재를 입력해 주세요!`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return;
      }
      this.setState({loading: true}); 
      axios.post(`${config.SERVER_URL}/complation`,
        { selectOptions: selectOptions,
          Main_character: Main_character,
          Place: Place,
          Time: Time,
          Main_Events: Main_Events,
          Material: Material,
          isChange: this.state.isChange,
          Story: story }, 
        { headers: {authentication: localStorage.getItem('token')},
        timeout: 100000 })
      .then((response) => {
        //console.log(response.data);
        this.setState({ outputAfterTlanslate: this.state.outputAfterTlanslate + response.data[0]});
        this.setState({ outputBeforeTlanslate: this.state.outputBeforeTlanslate + response.data[1]});
        this.setState({ output: this.state.outputAfterTlanslate+ '\n\n원본\n'+ this.state.outputBeforeTlanslate});
        this.setState({loading: false});
        this.setState({isChange: false});
        this.setState({tempLength: this.state.outputAfterTlanslate.length});
        this.setState({tempWrite: this.state.outputAfterTlanslate});
        this.setState({Start: 'Continue'});
        this.setState({isHuman: true});
        //console.log(response.data.warn);

        if(response.data[2] >= 2){
          toast.error(`결과물에 유해한 내용이 포함되어 있어서 표시할 수 없습니다. 입력하신 내용을 수정해서 다시 입력해보세요`, {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          this.setState({isHuman: false});
        }else{
          toast(`이어지는 내용을 100자 이상 쓰면, 이야기를 계속 이어갈 수 있습니다.`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }


        this.setState({before_selectOptions: selectOptions});
        this.setState({before_Main_character: Main_character});
        this.setState({before_Place: Place});
        this.setState({before_Time: Time});
        this.setState({before_Main_Events: Main_Events});
        this.setState({before_Material: Material});
        this.setState({before_outputBeforeTlanslate: story});

 
      }).catch((error) => {
        //console.log(error);
        if (error.response.status === 412) {
          this.setState({loading: false});
          toast.error(`로그인이 필요합니다!`, {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          localStorage.removeItem('token');
        }else{
          if (error.response.status === 403 && error.response.data.errorCode == '001') {
            toast.error(`이야기의 길이가 너무 길어요ㅠ`, {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            this.setState({loading: false});
          }else{
            this.setState({loading: false});
            this.setState({ output: '토큰이 부족합니다!'});
          }
        }
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
    this.setState({Main_character: ''});
    this.setState({Place: ''});
    this.setState({Time: ''});
    this.setState({Main_Events: ''});
    this.setState({Material: ''});
  }

  async refreshProfile() {
    authService.onAuthStateChanged(async (user) => {
      if (authService.currentUser) {
        authService.currentUser.getIdToken().then(async (data) => {
          await localStorage.setItem('token', data)
        }).catch(async (error) => {
          //console.log(error);
        });
      }
    });
  }

  async copyContents() {
    document.execCommand("copy");
  }
  render() {
    return (
      <Fragment>
      <div class="mainpage">
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
          <button class="start" onClick = {this.requestcontents}>{this.state.Start}</button>
          <div class="progress">
            <ProgressBar completed={this.state.progress} height="8px" isLabelVisible={false} />
          </div>

        </div>


        <div class="main">
          <div class="landing">
            AI가 당신의 이야기에 필요한 영감을 제공합니다.
          </div>
          {this.state.loading ? <div class="loading"> <Spinner size='8px' color='#3b2479'/> </div> : null}
          <div class="outputDiv">
            <textarea class="output" value={this.state.outputAfterTlanslate} onChange={this.handleStory}></textarea>
            <textarea class="output_right" value={this.state.outputBeforeTlanslate} readOnly></textarea>
          </div>
          <div class="resetDiv">
            <div class="reset">
              <a onClick={this.resetData}>
                <img  src={trashicon} class="reseticon"/>
              </a>
            </div>
            <div class="reset">
              <CopyToClipboard text={this.state.outputAfterTlanslate}>
                <a>
                  <img  src={copyicon} class="reseticon"/>
                </a>
              </CopyToClipboard>
            </div>
            <div class="reset">
              <a onClick={this.requestcontents}>
                <img  src={reseticon} class="reseticon"  name="reset"/>
              </a>
            </div>
          </div>
        </div>


        
      </div>



      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
      />
      </Fragment>
    );
  }
}

export default Main;
