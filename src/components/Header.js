import { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { authService, firebaseInstance } from "../public/firebaseConfig";
import '../style/Header.css';
import usericon from '../public/user.png';
import facebookicon from '../public/facebook.png';
import googleicon from '../public/google.png';
import ProgressBar from "@ramonak/react-progress-bar";
import * as config from '../config';
import Modal from './Modal';
//import { GoogleLogin } from 'react-google-login';




class Header extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      showMenu: false,
      userName: '로그인 되지 않은 사용자',
      userToken: 0,
      userTokenP: 0,
      userImage: usericon,
      priceModalOpen: false,
      loginModalOpen: false,
      user: false
    };
    this.showMenu = this.showMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.signOut = this.signOut.bind(this);
    this.signIn = this.signIn.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);

    
  }

  openModal = (event) => {
    this.setState({ [event.target.name]: true })
  }

  closeModal = () => {
    this.setState({ priceModalOpen: false })
    this.setState({ loginModalOpen: false })
  }

  showMenu(event) {
    event.preventDefault();
    event.stopPropagation();
    this.requestProfile();

    if (this.state.showMenu) {
      this.setState({ showMenu: false });
      document.removeEventListener('click', this.closeMenu);
    }else{
      this.setState({ showMenu: true });
      document.addEventListener('click', this.closeMenu);
    }
  }
  
  closeMenu(event) {
    event.preventDefault();

    if (!this.dropdownMenu.contains(event.target)) {
      this.setState({ showMenu: false });
      document.removeEventListener('click', this.closeMenu);
    }
  }

  async requestProfile() {
    let user = await localStorage.getItem('token');
   
    if (user !== undefined) {
      axios.get(`${config.SERVER_URL}/profile`, { headers: {authentication: user} })
      .then((response) => {
        this.setState({user: true});
        this.setState({ userName: response.data.name});
        this.setState({ userToken: response.data.token});
        this.setState({ userTokenP: response.data.tokenP});
        this.setState({ userImage: response.data.photoURL});
        this.closeModal();
      })
      .catch((error) => {
        
      })
    }

  }

  async refreshProfile() {
    authService.onAuthStateChanged(async (user) => {
      if (authService.currentUser) {
        authService.currentUser.getIdToken().then(async (data) => {
          await localStorage.setItem('token', data)

        }).catch(async (error) => {
          console.log(error);
        });
      }
    });
  }

  async componentDidMount(){
    await this.refreshProfile();
    await this.requestProfile();
  }

  async signOut(){
    await localStorage.removeItem('token');
    this.setState({user: false});
    this.setState({ showMenu: false });
    document.removeEventListener('click', this.closeMenu);
    await authService.signOut();
  }

  async signIn(event){
    const { target: { name } } = event;
    let provider = new firebaseInstance.auth.GoogleAuthProvider();
    if (name === 'Facebook') { provider = new firebaseInstance.auth.FacebookAuthProvider(); }
    else if (name === 'Google'){ provider = new firebaseInstance.auth.GoogleAuthProvider(); }

    await authService.signInWithPopup(provider).then(async(result) => {
      /** @type {firebase.auth.OAuthCredential} */
      let credential = result.credential;
      let user = result.user;
      console.log(credential);
      console.log(user.za);
      console.log(credential.idToken);
      await localStorage.setItem('token', user.za)
      this.setState({user: true});
      this.requestProfile();
    })
    .catch((error) => {
      let errorCode = error.code;
      let errorMessage = error.message;
      let email = error.email;
      let credential = error.credential;
    });
  }

  onClickPayment() {
    /* 1. 가맹점 식별하기 */
      const { IMP } = window;
      IMP.init('imp33624147');

    /* 2. 결제 데이터 정의하기 */
    const data = {
      pg: 'html5_inicis',                           // PG사
      pay_method: 'tosspay',                           // 결제수단
      merchant_uid: `mid_${new Date().getTime()}`,  // 주문번호
      amount: 1000,                                 // 결제금액
      name: '아임포트 결제 데이터 분석',                  // 주문명
      buyer_name: '홍길동',                           // 구매자 이름
      buyer_tel: '01012341234',                     // 구매자 전화번호
      buyer_email: 'example@example',               // 구매자 이메일
      buyer_addr: '신사동 661-16',                    // 구매자 주소
      buyer_postcode: '06018',                      // 구매자 우편번호
    };

    /* 4. 결제 창 호출하기 */
    IMP.request_pay(data, (response) => {
      const {
        success,
        merchant_uid,
        error_msg,
      } = response;

      if (success) {
        console.log(success);
        console.log(merchant_uid);
        console.log(response);
        alert('결제 성공');
      } else {
        alert(`결제 실패: ${error_msg}`);
      }
    });
  }




  render() {
    return (
      <header>
      <Link to="/"><span class="logo">WebNovel</span></Link>
        <div class="loginProfile">
          <button className='links' onClick={ this.openModal } name='priceModalOpen'>membership</button>
          <Modal open={ this.state.priceModalOpen } close={ this.closeModal } title="Pricing">
            <div class='pricing1'>
              <h3 class='priceTitle'>free</h3>
              <div class ='priceDiv'>
                <span class = 'price1'>₩</span>
                <span class = 'price2'>0</span>
                <span class = 'price3'>/mo</span>
              </div>
              <a class='pricebutton' onClick={this.onClickPayment}>currunt</a>
              <p>✔ 장르 선택 및 주인공 입력 가능</p>
              <p>✔ 국판 기준 약 1매 분량 제공</p>
            </div>

            <div class='pricing2'>
              <h3 class='priceTitle'>basic</h3>
              <div class ='priceDiv'>
                <span class = 'price1'>₩</span>
                <span class = 'price2'>10000</span>
                <span class = 'price3'>/mo</span>
              </div>
              <a class='pricebutton'>buy</a>
              <p>✔ 장르 선택 및 주인공 입력 가능</p>
              <p>✔ 장소, 시간, 주제, 사건 입력 가능</p>
              <p>✔ 국판 기준 약 70매 분량 제공</p>
              <p>* 이야기당 길이는 최대 5매 이내</p>
            </div>

          </Modal>

          { localStorage.getItem('token') ? 
            <div class="profile">
              <a onClick={this.showMenu}>
                <img  src={this.state.userImage} class="profileicon"/>
              </a>
            </div>
            : <button className='login' onClick={ this.openModal } name='loginModalOpen'>login</button>
          }

          <Modal open={ this.state.loginModalOpen } close={ this.closeModal } title="Login">
            <button  onClick={this.signIn} name='Google' class="loginModal">
              <img  src={googleicon} onClick={this.signIn} name='Google' class='google'/>
            </button>
            <br/>
            <button onClick={this.signIn} onClick={this.signIn} name='Google' name='Facebook' class="loginModal">
              <img  src={facebookicon} class='facebook'/>
            </button>
          </Modal>


          { this.state.showMenu ? (
            <div ref={(element) => { this.dropdownMenu = element; }}>
              <div class="dropdown">
                <div class="name">
                  <p>{this.state.userName}</p>
                </div>
                <div class="token">
                  <ProgressBar completed={this.state.userTokenP} height="8px" isLabelVisible={false}/>
                  <span>{this.state.userToken} token</span>
                </div>
                <button onClick={this.signOut} class="logout">logout</button>
              </div>
            </div> ) : (null)
          }
        </div>
      </header>
    );
  }
}


export default Header;
