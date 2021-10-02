import { Component } from "react";
import { Link } from "react-router-dom";
import ReactCodeInput from "react-code-input";
import axios from "axios";
import CreditCardInput from "react-credit-card-input";
import { authService, firebaseInstance } from "../public/firebaseConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../style/Membership.css";
import Modal from "./Modal";
import * as config from "../config";

import styled from "styled-components";

import { Box, Grid, Text } from "grommet";

class Membership extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMenu: false,
      plan: "free",
      free: "",
      basic: "가입하기",
      premium: "가입하기",
      cardNum: "",
      buyerName: "",
      idNum: "",
      cardExpire: "",
      cardCvc: "",
      cardPwd: "",
      Price: "",
    };
    this.openModal = this.openModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleNumber = this.handleNumber.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.requestBill = this.requestBill.bind(this);
    this.changeBill = this.changeBill.bind(this);
    this.requestProfile = this.requestProfile.bind(this);
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleNumber(e) {
    if (isNaN(e.target.value) === false) {
      this.setState({ [e.target.name]: e.target.value });
    }
  }

  openModal = (e) => {
    authService.onAuthStateChanged(async (user) => {
      if (authService.currentUser) {
        authService.currentUser
          .getIdToken()
          .then(async (data) => {
            await localStorage.setItem("token", data);
            console.log(e.target.name.split(" ")[0]);
            console.log(e.target.name.split(" ")[1]);
            this.setState({ plan: e.target.name.split(" ")[0] });
            this.setState({ Price: e.target.name.split(" ")[1] });
            this.setState({ showMenu: true });
          })
          .catch(async (error) => {
            toast.error(`로그인이 필요합니다.`, {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          });
      } else {
        toast.error(`로그인이 필요합니다.`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    });
  };

  openModalPay = (e) => {
    this.setState({ showMenu: true });
  };

  closeModal = () => {
    this.setState({ showMenu: false });
  };

  async requestBill() {
    let user = await localStorage.getItem("token");
    if (user !== undefined) {
      const now = new Date();
      const option = {
        arsUseYn: "N",
        buyerName: this.state.buyerName, //등록자 이름
        cardExpire:
          this.state.cardExpire.split(" / ")[1] +
          this.state.cardExpire.split(" / ")[0], //유효기간
        cardNum: this.state.cardNum.replaceAll(" ", ""), //카드번호 (숫자)
        cardPwd: this.state.cardPwd, //카드 비밀번호 앞 2 자리
        idNum: this.state.idNum, //주민번호 앞 6 자리
        mid: "arstest03m", //상점 아이디
        moid:
          now.getFullYear() +
          "" +
          (now.getMonth() + 1) +
          now.getDate() +
          now.getHours() +
          now.getMinutes() +
          now.getSeconds(), //가맹점 주문번호
        userId: (await localStorage.getItem("userUid")) + Math.random(),
      };
      console.log(option);
      axios
        .post(`https://api.innopay.co.kr/api/regAutoCardBill`, option)
        .then((response) => {
          console.log(response.data);
          if (response.data.resultCode === "0000") {
            axios
              .post(
                `${config.SERVER_URL}/pay`,
                {
                  billKey: response.data.billKey,
                  plan: this.state.plan,
                  name: this.state.buyerName,
                },
                { headers: { authentication: user } }
              )
              .then((response) => {
                console.log(response);
                this.closeModal();
              })
              .catch((error) => {
                console.log(error);
              });
          } else {
            throw new Error();
          }
          this.closeModal();
        })
        .catch((error) => {
          console.log(error);
          this.closeModal();
        });
    }
  }

  async changeBill() {
    let user = await localStorage.getItem("token");
    if (user !== undefined) {
      axios
        .put(
          `${config.SERVER_URL}/pay`,
          {
            plan: this.state.plan,
          },
          { headers: { authentication: user } }
        )
        .then((response) => {
          console.log(response);
          this.closeModal();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  async requestProfile() {
    let user = await localStorage.getItem("token");

    if (user !== undefined) {
      axios
        .get(`${config.SERVER_URL}/profile`, {
          headers: { authentication: user },
        })
        .then((response) => {
          localStorage.setItem("userUid", response.data.uid);
          localStorage.setItem("plan", response.data.plan);
          this.closeModal();
        })
        .catch((error) => {});
    }
  }

  async componentDidMount() {
    await this.requestProfile();
    this.setState({ free: "change" });
    this.setState({ [localStorage.getItem("plan")]: "currunt" });
  }

  render() {
    return (
      <>
        <Box
          width='100%'
          height='100vh'
          background='#f9f9f9'
          direction='column'
          justify='evenly'
          align='center'
        >
          <Box justify='center' align='center'>
            <h1 className='MenuMark'>Membership</h1>
            <div className='DecoBox'></div>
          </Box>
          <Box direction='row-responsive' justify='center' align='center'>
            <Grid
              columns={{
                count: 3,
                size: "auto",
              }}
              gap='medium'
            >
              <Card>
                <div className='CardTitle'>
                  <h2>Free</h2>
                </div>
                  <div className='CardPrice'>
                    <Text size='2xl' color='#000' weight='bold'>
                      ₩0
                    </Text>
                    <Text size='small' color='dark-3'>
                      /month
                    </Text>
                  </div>
                  <div style={{ textAlign: "center", padding: '20px'  }}>
                    <button
                      className='PriceButton'
                      onClick={this.openModal}
                      name='free 0'
                    >
                      {this.state.free}
                    </button>
                  </div>
                  <div className='CardContent'>
                    <p>✔ 장르 선택 및 주인공 입력 가능</p>
                    <p>✔ 장소, 시간, 주제, 사건 입력 가능</p>
                    <p>✔ 이어쓰기 2-3회 제공</p>
                  </div>
                
              </Card>

              <Card>
                <div className='CardTitle'>
                  <h2>Basic</h2>
                </div>
                <div className='CardPrice'>
                  <Text size='xlarge' color='#000' weight='bold'>
                    ₩10,000
                  </Text>
                  <Text size='small' color='dark-3'>
                    /month
                  </Text>
                </div>
                <div style={{ textAlign: "center", padding: '20px'  }}>
                  <button
                    className='PriceButton'
                    onClick={this.openModal}
                    name='basic 10000'
                  >
                    {this.state.basic}
                  </button>
                </div>
                <div className='CardContent'>
                  <p>✔ 장르 선택 및 주인공 입력 가능</p>
                  <p>✔ 장소, 시간, 주제, 사건 입력 가능</p>
                  <p>✔ 이어쓰기 및 이야기 완성 가능</p>
                  <p>✔ 이야기 2개 이상 창작 가능</p>
                  <p>(이야기 한개당 최대 길이 a4 2장)</p>
                </div>
                
              </Card>

              <Card>
                <div className='CardTitle'>
                  <h2>Premium</h2>
                </div>
                  <div className='CardPrice'>
                    <Text size='xlarge' color='#000' weight='bold'>
                      ₩30,000
                    </Text>
                    <Text size='small' color='dark-3'>
                      /month
                    </Text>
                  </div>
                  <div style={{ textAlign: "center", padding: '20px' }}>
                    <button
                      className='PriceButton'
                      onClick={this.openModal}
                      name='premium 30000'
                    >
                      {this.state.premium}
                    </button>
                  </div>
                  <div className='CardContent'>
                    <p>✔ 장르 선택 및 주인공 입력 가능</p>
                    <p>✔ 장소, 시간, 주제, 사건 입력 가능</p>
                    <p>✔ 이어쓰기 2-3회 제공</p>
                    <p>✔ 이어쓰기 및 이야기 완성 가능</p>
                    <p>✔ 이야기 7개 이상 창작 가능</p>
                    <p>(이야기 한개당 최대 길이 a4 2장)</p>
                  </div>
                
              </Card>
            </Grid>
          </Box>

          <Modal
            open={this.state.showMenu}
            close={this.closeModal}
            title='Payment'
          >
            {localStorage.getItem("isBill") !== "true" ? (
            <>
              <div className='creditCard'>
                <CreditCardInput  
                  cardNumberInputProps={{
                    value: this.state.cardNum,
                    onChange: this.handleChange,
                    name: "cardNum",
                  }}
                  cardExpiryInputProps={{
                    value: this.state.cardExpire,
                    onChange: this.handleChange,
                    name: "cardExpire",
                  }}
                  cardCVCInputProps={{
                    value: this.state.cardCvc,
                    onChange: this.handleChange,
                    name: "cardCvc",
                  }}
                  fieldClassName='input'

                  containerStyle={{
                    borderBottom: '1px solid #ededed'
                  }}
                />
              </div>
              
                <div className='ElementBox'>
                  <p>이름</p>
                  <input
                    className='LabelElement'
                    value={this.state.buyerName}
                    onChange={this.handleChange}
                    name='buyerName'
                    maxLength='4'
                  ></input>
                </div>

                <div className='ElementBox'>
                  <p>비밀번호</p>
                  <input
                    className='PwElement'
                    value={this.state.cardPwd}
                    onChange={this.handleNumber}
                    name='cardPwd'
                    maxLength='2'
                  ></input>
                  <span>**</span>
                </div>
              
              <div className='ElementBox'>
                <p>주민번호</p>
                <input
                  className='BuyerElement'
                  value={this.state.idNum}
                  onChange={this.handleNumber}
                  name='idNum'
                  maxLength='6'
                ></input>
                <span>-*******</span>
              </div>

              <div style={payButton}>
                <button className='creditCardButton' onClick={this.requestBill}>
                  {this.state.Price}원 결제하기
                </button>
              </div>
            </>  
            ) : (
              <div style={payButton}>
              <button className='changeButton' onClick={this.changeBill}>
                  플랜 바꾸기
              </button>
            </div>
            )}
          </Modal>

          <ToastContainer
            position='top-right'
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss={false}
            draggable
            pauseOnHover
          />
        </Box>
      </>
    );
  }
}

export default Membership;

const Card = styled.div`
  text-align: center;
  height: 60vh;
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 5px 6px 8px rgba(0, 0, 0, 0.16);
  border-radius: 15px;
  /* border : 1px solid #ededed; */
`;

const payButton = {
  padding: '10px 0',
  borderTop: '1px solid #ededed',
  textAlign:'center'
}