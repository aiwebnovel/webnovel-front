import { Component, Fragment } from "react";
import axios from "axios";
import { Spinner } from "react-loading-io";
import { authService, firebaseInstance } from "../public/firebaseConfig";
import { CopyToClipboard } from "react-copy-to-clipboard";
import * as config from "../config";
import { toast } from "react-toastify";
import ProgressBar from "@ramonak/react-progress-bar";
import "react-toastify/dist/ReactToastify.css";

import "../style/Main.css";

import { Grid, Box, ResponsiveContext } from "grommet";
import {
  FormEdit,
  FormDown,
  FormSubtract,
  FormNext,
  Update,
  Info,
  Copy,
} from "grommet-icons";

const LanguageDetect = require("languagedetect");

class Main extends Component {
  constructor() {
    super();
    this.state = {
      input: "",
      output: "",
      outputEnglish: "",
      outputKorean: "",
      loading: false,
      options: ["판타지", "현판", "무협", "미스터리", "로판"],
      selectOptions: "",
      Main_character: "",
      Place: "",
      Time: "",
      Main_Events: "",
      Material: "",
      Start: "Create a story",
      tempLength: 0,
      tempWrite: "",
      progress: 0,
      isHuman: false,
      isChange: false,
      isSider: false,
      copied: false,

      before_selectOptions: "판타지",
      before_Main_character: "",
      before_Place: "",
      before_Time: "",
      before_Main_Events: "",
      before_Material: "",
      before_outputEnglish: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.requestcontents = this.requestcontents.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.resetData = this.resetData.bind(this);
    this.handleStory = this.handleStory.bind(this);
  }

  NoticeWriteIcon = () => {
    if (this.state.outputKorean === "") {
      toast.warning("연필 아이콘을 눌러 키워드를 넣어주세요!");
    } else {
      return;
    }
  };

  onCopied = () => {
    if (this.state.outputKorean !== "") {
      this.setState({ copied: true });
    } else {
      toast.warn("연필 아이콘을 눌러 키워드를 넣어주세요!");
    }
  };

  handleChange(e) {
    if (e.target.value.length < 20 && e.target.name === "Main_Events") {
      this.setState({ [e.target.name]: e.target.value });
    } else if (e.target.value.length < 10) {
      this.setState({ [e.target.name]: e.target.value });
    } else {
      toast.error(`${e.target.value.length}글자를 넘어갈 수 없어요!😭 `);
    }
  }

  async handleStory(e) {
    this.setState({ outputKorean: e.target.value });
    this.setState({ isChange: true });

    if (this.state.isHuman === false) {
    
      if (e.target.value.length > 0) {
        this.setState({ Start: "Need a story" });
      } else {
        return
        // this.setState({ Start: "Create a story" });
      }
    } else {   
      const lngDetector = new LanguageDetect();
      const language = await lngDetector.detect(this.state.outputKorean, 1);
     
      if (this.state.progress >= 100) {
        this.setState({ Start: "Continue" });
        
      }

      if (language[0] === "english") {
        this.setState({
          progress:
            ((this.state.outputKorean.length - this.state.tempLength) * 100) /
            150,
        });
        
      } else {
        this.setState({
          progress:
            ((this.state.outputKorean.length - this.state.tempLength) * 100) /
            100,
        });
      }
    }
  }

  onSelect(e) {
    this.setState({ selectOptions: e.target.value });
  }

  async refreshProfile() {
    authService.onAuthStateChanged(async (user) => {
      if (authService.currentUser) {
        authService.currentUser
          .getIdToken()
          .then(async (data) => {
            await localStorage.setItem("token", data);
          })
          .catch(async (error) => {
            //console.log(error);
          });
      }
    });
  }


  async requestcontents(e) {
    await this.refreshProfile();
    
    if (this.state.isHuman === true && this.state.progress < 100) {
      toast.error(`추가 이야기의 길이(${100-this.state.progress}자)가 부족해요😭`);
      return;
    } else {
      this.setState({ isHuman: false });
      this.setState({ progress: 0 });
    }

    if (localStorage.getItem("token") !== null) {
      let story = this.state.outputEnglish;
      let selectOptions = this.state.selectOptions;
      let Main_character = this.state.Main_character;
      let Place = this.state.Place;
      let Time = this.state.Time;
      let Main_Events = this.state.Main_Events;
      let Material = this.state.Material;

      if (this.state.isChange === true) {
        story = this.state.outputKorean;
      }

      // if (e.target.name === "reset") {
      //   console.log('reset');
      //   selectOptions = this.state.before_selectOptions;
      //   Main_character = this.state.before_Main_character;
      //   Place = this.state.before_Place;
      //   Time = this.state.before_Time;
      //   Main_Events = this.state.before_Main_Events;
      //   Material = this.state.before_Material;
      //   story = this.state.before_outputEnglish;
      //   await this.setState({ selectOptions: selectOptions });
      //   await this.setState({ Main_character: Main_character });
      //   await this.setState({ Place: Place });
      //   await this.setState({ Time: Time });
      //   await this.setState({ Main_Events: Main_Events });
      //   await this.setState({ Material: Material });
      //   await this.setState({ outputEnglish: story });
      // }

      if(selectOptions === "") {
        toast.error(`장르를 선택해 주세요!`);
        return;
      } else if (Main_character === "") {
        toast.error(`주인공을 입력해 주세요!`);
        return;
      } else if (Place === "") {
        toast.error(`장소를 입력해 주세요!`);
        return;
      } else if (Time === "") {
        toast.error(`시간대를 입력해 주세요!`);
        return;
      } else if (Main_Events === "") {
        toast.error(`주요 사건을 입력해 주세요!`);
        return;
      } else if (Material === "") {
        toast.error(`소재를 입력해 주세요!`);
        return;
      }
      this.setState({ loading: true });
      axios
        .post(
          `${config.SERVER_URL}/complation`,
          {
            selectOptions: selectOptions,
            Main_character: Main_character,
            Place: Place,
            Time: Time,
            Main_Events: Main_Events,
            Material: Material,
            isChange: this.state.isChange,
            Story: story,
          },
          {
            headers: { authentication: localStorage.getItem("token") },
            timeout: 100000,
          }
        )
        .then((response) => {
          //console.log(response.data);
          this.setState({
            outputKorean: this.state.outputKorean + response.data[0],
          });
          this.setState({
            outputEnglish: this.state.outputEnglish + response.data[1],
          });
          this.setState({
            output:
              this.state.outputKorean + "\n\n원본\n" + this.state.outputEnglish,
          });
          this.setState({ loading: false });
          this.setState({ isChange: false });
          this.setState({ tempLength: this.state.outputKorean.length });
          this.setState({ tempWrite: this.state.outputKorean });
          this.setState({ Start: "Need a Story" });
          this.setState({ isHuman: true });
          //console.log(response.data.warn);

          if (response.data[2] >= 2) {
            toast.error(
              `결과물에 유해한 내용이 포함되어 있어서 표시할 수 없습니다. 입력하신 내용을 수정해서 다시 입력해보세요`
            );
            this.setState({ isHuman: false });
          } else {
            toast.info(
              `이어지는 내용을 100자 이상 쓰면, 이야기를 계속 이어갈 수 있습니다.`);
          }

          this.setState({ before_selectOptions: selectOptions });
          this.setState({ before_Main_character: Main_character });
          this.setState({ before_Place: Place });
          this.setState({ before_Time: Time });
          this.setState({ before_Main_Events: Main_Events });
          this.setState({ before_Material: Material });
          this.setState({ before_outputEnglish: story });
        })
        .catch((error) => {
         console.log(error);
          if (error.response.status === 412) {
            this.setState({ loading: false });
            toast.info(`로그인이 필요합니다!`, {
              icon:'🙅‍♀️',
              progressStyle: { backgroundColor: "#7D4CDB" },
            });
            localStorage.removeItem("token");
          } else {
            if (
              error.response.status === 403 &&
              error.response.data.errorCode === "001"
            ) {
              toast.error(`이야기의 길이가 너무 길어요ㅠ`);
              this.setState({ loading: false });
            } else {
              this.setState({ loading: false });
              this.setState({ output: "토큰이 부족합니다!" });
            }
          }
        });
    } else {
      toast.info("로그인 후 다시 시도해 주세요!", {
        icon:'🙅‍♀️',
        progressStyle: { backgroundColor: "#7D4CDB" }
      });
      // this.setState({ output: "로그인 후 다시 시도해 주세요!" });
    }
  }

  resetData() {
    this.setState({ next: "" });
    this.setState({ input: "" });
    this.setState({ output: "" });
    this.setState({ outputEnglish: "" });
    this.setState({ outputKorean: "" });
    this.setState({ Main_character: "" });
    this.setState({ Place: "" });
    this.setState({ Time: "" });
    this.setState({ Main_Events: "" });
    this.setState({ Material: "" });
    this.setState({ copied: false });
    this.setState({ progress: 0})
  }


  render() {
    return (
      <>
        <div className='mainpage'>
          <ResponsiveContext.Consumer>
            {(size) =>
              size !== "small" ? (
                /* 768px 초과 크기에서 적용  */
                <Grid
                  fill
                  rows={["auto", "flex"]}
                  columns={["auto", "flex"]}
                  areas={[
                    { name: "sidebar", start: [0, 1], end: [0, 1] },
                    { name: "main", start: [1, 1], end: [1, 1] },
                  ]}
                >
                  <div
                    className="IconBox"
                    onClick={() => {
                      this.setState({ isSider: !this.state.isSider });
                    }}
                  >
                    <FormEdit
                      color='#fff'
                      size='medium'
                      style={{ cursor: "pointer" }}
                    />
                    <p>
                      <b>Write</b>
                    </p>
                  </div>
                  {this.state.isSider && (
                    <Box
                      gridArea='sidebar'
                      background='#fff'
                      width='small'
                      animation={[
                        { type: "fadeIn", duration: 300 },
                        { type: "slideRight", size: "xlarge", duration: 150 },
                      ]}
                      style={SiderStyle}
                    >
                      <div className='SiderBox'>
                        <select
                          defaultValue='default'
                          className='dropdowncategory'
                          onChange={this.onSelect}
                        >
                          <option value='default' disabled className='gradient'>
                            장르를 선택해주세요! ✔
                          </option>
                          <option value={this.state.options[0]}>
                            {this.state.options[0]}
                          </option>
                          <option value={this.state.options[1]}>
                            {this.state.options[1]}
                          </option>
                          <option value={this.state.options[2]}>
                            {this.state.options[2]}
                          </option>
                          <option value={this.state.options[3]}>
                            {this.state.options[3]}
                          </option>
                          <option value={this.state.options[4]}>
                            {this.state.options[4]}
                          </option>
                        </select>

                        <input
                          className='sub_input_text'
                          value={this.state.Main_character}
                          onChange={this.handleChange}
                          name='Main_character'
                          placeholder='주요 인물'
                        ></input>
                        <input
                          className='sub_input_text'
                          value={this.state.Place}
                          onChange={this.handleChange}
                          name='Place'
                          placeholder='장소'
                        ></input>
                        <input
                          className='sub_input_text'
                          value={this.state.Time}
                          onChange={this.handleChange}
                          name='Time'
                          placeholder='시간'
                        ></input>
                        <input
                          className='sub_input_text'
                          value={this.state.Material}
                          onChange={this.handleChange}
                          name='Material'
                          placeholder='소재'
                        ></input>
                        <input
                          className='sub_input_text'
                          value={this.state.Main_Events}
                          onChange={this.handleChange}
                          name='Main_Events'
                          placeholder='주요 사건'
                        ></input>
                        <button
                          className='create'
                          onClick={this.requestcontents}
                        >
                          {this.state.Start}
                        </button>
                        <div className='progress'>
                          <ProgressBar
                            completed={this.state.progress}
                            bgColor='#3D138D'
                            width='200px'
                            height='8px'
                            margin='20px 0 0 0 '
                            isLabelVisible={false}
                          />
                        </div>
                      </div>
                    </Box>
                  )}
                  <Box
                    gridArea='main'
                    background='#f9f9f9'
                    justify='center'
                    align='center'
                  >
                    {this.state.loading ? (
                      <div className='loading'>
                        <Spinner size={200} color='#3b2479' />
                      </div>
                    ):(
                      <>
                    <div className='outputContainer'>
                      <textarea
                        className='output'
                        value={this.state.outputKorean}
                        placeholder='write 버튼을 눌러 글을 만들어주세요!'
                        onClick={this.NoticeWriteIcon}
                        onChange={this.handleStory}
                      ></textarea>

                      <textarea
                        className='output_right'
                        value={this.state.outputEnglish}
                        readOnly
                      ></textarea>
                    </div>

                    <div className='ButtonDiv'>
                      {/* 리셋 */}
                      <Update
                        size='medium'
                        color='brand'
                        className='iconDetail'
                        onClick={this.resetData}
                      />
                      {/* 복사 */}
                      <CopyToClipboard
                        text={this.state.outputKorean}
                        onCopy={this.onCopied}
                      >
                        <Copy
                          color='brand'
                          size='medium'
                          className='iconDetail'
                        />
                      </CopyToClipboard>
                      {this.state.copied ? (
                        <div className='copyStyle'>Copied!</div>
                      ) : null}

                      {/* 이어쓰기 */}
                      <FormNext
                        color='brand'
                        size='medium'
                        className='iconDetail'
                        name='reset'
                        onClick={this.requestcontents}
                      />
                    </div>
                    </>
                    )}
                  </Box>
                </Grid>
              ) : (
                /* 768px 이하에서 적용 */
                <Grid
                  fill
                  rows={["auto", "auto"]}
                  columns={["auto"]}
                  areas={[
                    { name: "sidebar", start: [0, 0], end: [0, 0] },
                    { name: "main", start: [0, 1], end: [0, 1] },
                  ]}
                >
                  {this.state.isSider ? (
                    <Box
                      gridArea='sidebar'
                      background='#fff'
                      width='small'
                      style={MobileSider}
                      animation={[
                        { type: "fadeIn", duration: 300 },
                        { type: "slideDown", size: "small", duration: 300 },
                      ]}
                    >
                      <div className='SiderBox'>
                        <select
                          defaultValue='default'
                          className='dropdowncategory'
                          onChange={this.onSelect}
                        >
                          <option value='default' disabled className='gradient'>
                            장르를 선택해주세요! ✔
                          </option>
                          <option value={this.state.options[0]}>
                            {this.state.options[0]}
                          </option>
                          <option value={this.state.options[1]}>
                            {this.state.options[1]}
                          </option>
                          <option value={this.state.options[2]}>
                            {this.state.options[2]}
                          </option>
                          <option value={this.state.options[3]}>
                            {this.state.options[3]}
                          </option>
                          <option value={this.state.options[4]}>
                            {this.state.options[4]}
                          </option>
                        </select>

                        <input
                          className='sub_input_text'
                          value={this.state.Main_character}
                          onChange={this.handleChange}
                          name='Main_character'
                          placeholder='주요 인물'
                        ></input>
                        <input
                          className='sub_input_text'
                          value={this.state.Place}
                          onChange={this.handleChange}
                          name='Place'
                          placeholder='장소'
                        ></input>
                        <input
                          className='sub_input_text'
                          value={this.state.Time}
                          onChange={this.handleChange}
                          name='Time'
                          placeholder='시간'
                        ></input>
                        <input
                          className='sub_input_text'
                          value={this.state.Material}
                          onChange={this.handleChange}
                          name='Material'
                          placeholder='소재'
                        ></input>
                        <input
                          className='sub_input_text'
                          value={this.state.Main_Events}
                          onChange={this.handleChange}
                          name='Main_Events'
                          placeholder='주요 사건'
                        ></input>
                        <button
                          className='create'
                          onClick={this.requestcontents}
                        >
                          {this.state.Start}
                        </button>
                        <div className='progress'>
                          <ProgressBar
                            completed={this.state.progress}
                            gColor='#3D138D'
                            width='200px'
                            height='8px'
                            margin='20px 0 0 0 '
                            isLabelVisible={false}
                          />
                        </div>
                      </div>
                      <div
                        className="IconBox"
                        onClick={() => {
                          this.setState({ isSider: !this.state.isSider });
                        }}
                      >
                        <FormSubtract
                          color='#fff'
                          size='medium'
                          style={{ cursor: "pointer" }}
                        />
                      </div>
                    </Box>
                  ) : (
                    <div
                      className="IconBox"
                      onClick={() => {
                        this.setState({ isSider: !this.state.isSider });
                       
                      }}
                    >
                      <FormEdit
                        color='#fff'
                        size='medium'
                        style={{ cursor: "pointer" }}
                      />
                      <p>
                        <b>Write</b>
                      </p>
                      <FormDown
                        color='#fff'
                        size='medium'
                        style={{ cursor: "pointer" }}
                      />
                    </div>
                  )}
                  <Box
                    gridArea='main'
                    background='#f9f9f9'
                    justify='center'
                    align='center'
                  >
                    {this.state.loading ? (
                      <div className='loading'>
                        <Spinner size={64} color='#3b2479' />
                      </div>
                    ) : (
                      <>
                        <div className='outputContainer'>
                          <textarea
                            className='output'
                            placeholder='write 버튼을 눌러 글을 만들어주세요!'
                            onClick={this.NoticeWriteIcon}
                            value={this.state.outputKorean}
                            onChange={this.handleStory}
                          ></textarea>

                          <textarea
                            className='output_right'
                            value={this.state.outputEnglish}
                            readOnly
                          ></textarea>
                        </div>
                        <div className='ButtonDiv'>
                          {/* 리셋 */}
                          <Update
                            size='medium'
                            color='brand'
                            className='iconDetail'
                            onClick={this.resetData}
                          />

                          {/* 복사 */}
                          <CopyToClipboard
                            text={this.state.outputKorean}
                            onCopy={this.onCopied}
                          >
                            <Copy
                              color='brand'
                              size='medium'
                              className='iconDetail'
                            />
                          </CopyToClipboard>
                          {this.state.copied ? (
                            <div className='copyStyle'>Copied!</div>
                          ) : null}
                          {/* 이어쓰기 */}
                          <FormNext
                            color='brand'
                            size='medium'
                            className='iconDetail'
                            name='reset'
                            onClick={this.requestcontents}
                          />
                        </div>
                      </>
                    )}
                  </Box>
                </Grid>
              )
            }
          </ResponsiveContext.Consumer>
        </div>
      </>
    );
  }
}

export default Main;

const SiderStyle = {
  width: "250px",
  boxShadow: "2px 3px 8px #EDEDED",
};

const MobileSider = {
  width: "100%",
  height: "100%",
  overflow: "scroll",
};
