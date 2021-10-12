import { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { authService, firebaseInstance } from "../public/firebaseConfig";
import { toast } from "react-toastify";
import ProgressBar from "@ramonak/react-progress-bar";
import "../style/Header.css";
import usericon from "../public/user.png";

import * as config from "../config";
import Modal from "./Modal";
//import { GoogleLogin } from 'react-google-login';
import {
  Header as HeaderLayout,
  Nav,
  Anchor,
  Button,
  Avatar,
  ResponsiveContext,
  Box,
} from "grommet";
import { Google, FacebookOption, Menu } from "grommet-icons";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMenu: false,
      userName: "로그인 되지 않은 사용자",
      userToken: 0,
      userTokenP: 0,
      userImage: usericon,
      priceModalOpen: false,
      loginModalOpen: false,
      user: false,
      isChecked: false,
      isOpen: false,
    };
    this.showMenu = this.showMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.signOut = this.signOut.bind(this);
    this.signIn = this.signIn.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.isChecked = this.isChecked.bind(this);
    this.isOpen = this.isOpen.bind(this);
  }

  isChecked = () => {
    this.setState({ isChecked: !this.state.isChecked });
    console.log(this.state.isChecked);
  };

  isOpen = () => {
    this.setState({ isOpen: !this.state.isOpen });
    console.log(this.state.isOpen);
  };

  openModal = (event) => {
    this.setState({ [event.target.name]: true });
  };

  closeModal = () => {
    this.setState({ priceModalOpen: false });
    this.setState({ loginModalOpen: false });
  };

  showMenu(event) {
    event.preventDefault();
    event.stopPropagation();
    this.requestProfile();

    if (this.state.showMenu) {
      this.setState({ showMenu: false });
      document.removeEventListener("click", this.closeMenu);
    } else {
      this.setState({ showMenu: true });
      document.addEventListener("click", this.closeMenu);
    }
  }

  closeMenu(event) {
    event.preventDefault();

    if (!this.dropdownMenu.contains(event.target)) {
      this.setState({ showMenu: false });
      document.removeEventListener("click", this.closeMenu);
    }
  }

  async requestProfile() {
    let user = await localStorage.getItem("token");
    
    if (user !== null) {
      axios
        .get(`${config.SERVER_URL}/profile`, {
          headers: { authentication: user },
        })
        .then((response) => {
          // console.log(response);
          this.setState({ user: true });
          this.setState({ userName: response.data.name });
          this.setState({ userToken: response.data.token });
          this.setState({ userTokenP: response.data.tokenP });
          this.setState({ userImage: response.data.photoURL });
          localStorage.setItem("userUid", response.data.uid);
          localStorage.setItem("plan", response.data.plan);
          localStorage.setItem("isBill", response.data.isBill);
          
          this.closeModal();
          
        })
        .catch((error) => {});
    }
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

  //첫 렌더링 마친 후 호출하는 메서드.
  async componentDidMount() {
    await this.refreshProfile();
    await this.requestProfile();
  }

  async signOut() {
    await localStorage.removeItem("token");
    this.setState({ user: false });
    this.setState({ showMenu: false });
    document.removeEventListener("click", this.closeMenu);
    await authService.signOut();
  }

  async signIn(event) {
    if (this.state.isChecked === true) {
      const {
        target: { name },
      } = event;
      let provider = new firebaseInstance.auth.GoogleAuthProvider();
      if (name === "Facebook") {
        provider = new firebaseInstance.auth.FacebookAuthProvider();
      } else if (name === "Google") {
        provider = new firebaseInstance.auth.GoogleAuthProvider();
      }

      await authService
        .signInWithPopup(provider)
        .then(async (result) => {
          /** @type {firebase.auth.OAuthCredential} */
          let credential = result.credential;
          let user = result.user;
          //console.log(credential);
          //console.log(user.za);
          //console.log(credential.idToken);
          await localStorage.setItem("token", user.za);
          this.setState({ user: true });
          toast.success(
            `로그인 되었습니다!`,);
          this.requestProfile();
        })
        .catch((error) => {
          let errorCode = error.code;
          let errorMessage = error.message;
          let email = error.email;
          let credential = error.credential;
        });
    } else {
      toast.error('이용약관 및 개인정보처리방침에 동의해주세요!');
    
    }
  }

  render() {
    return (
      <>
        <HeaderLayout background='#fff' className='header'>
          <Link to='/' className='logo'>
            <img src='/logo.png' alt='logo' />
          </Link>
          <ResponsiveContext.Consumer>
            {(size) =>
              size === "small" ? (
                <Nav>
                  <Anchor>
                    <Menu color='brand' size='medium' onClick={this.isOpen} />
                  </Anchor>
                </Nav>
              ) : (
                <Nav direction='row' className='Menu'>
                  <Anchor
                    color='#3b2479'
                    label='Membership'
                    href='/membership'
                  ></Anchor>

                  {localStorage.getItem("token") ? (
                    <Anchor className='profile' onClick={this.showMenu}>
                      <Avatar
                        src={this.state.userImage}
                        className='profileicon'
                        style={{ width: "40px", height: "40px" }}
                      />
                    </Anchor>
                  ) : (
                    <Button
                      label='Login'
                      className='login'
                      onClick={this.openModal}
                      name='loginModalOpen'
                      primary
                    />
                  )}
                </Nav>
              )
            }
          </ResponsiveContext.Consumer>
        </HeaderLayout>

        <Modal
          open={this.state.loginModalOpen}
          close={this.closeModal}
          title='Login'
        >
          <div className='AvatarBox'>
            <img src={usericon} alt='singinUser' className='loginAvatar' />
          </div>

          <div className='signBox'>
            <button onClick={this.signIn} className='googleButton'>
              <Google color='plain' size='medium' /> Sign in with Google
            </button>

            <div className='signBox'>
              <button onClick={this.signIn} className='facebookButton'>
                <FacebookOption color='plain' size='medium' /> Sign in with
                Facebook
              </button>
            </div>
            <div className='isChecked'>
              <input
                type='checkbox'
                name='agree'
                value={this.state.isChecked}
                onClick={this.isChecked}
                style={{ width: "18px", height: "18px", marginRight: "5px" }}
              />
              <a
                href='https://appplatform.notion.site/8be8232fff0341799cf8c13728610b6b'
                target='_blank'
                rel='noreferrer'
              >
                이용약관
              </a>
              과 &nbsp;
              <a
                href='https://www.notion.so/appplatform/d99f247a66d141bbbdf227739861a0a2'
                target='_blank'
                rel='noreferrer'
              >
                개인정보처리방침
              </a>
              에&nbsp;동의합니다.
            </div>
          </div>
        </Modal>

        {this.state.showMenu ? (
          <div
            ref={(element) => {
              this.dropdownMenu = element;
            }}
          >
            <div className='afterLogin'>
              <div className='Username'>
                <p>{this.state.userName}</p>
              </div>
              <div className='token'>
                <ProgressBar
                  completed={this.state.userTokenP}
                  height='8px'
                  isLabelVisible={false}
                  bgColor='#7D4CDB'
                  margin='5px 0'
                />
                <span>{this.state.userToken} token</span>
                <p>{localStorage.getItem("plan")}</p>
              </div>
              <div className='logout'>
                <Button primary label='logout' onClick={this.signOut}></Button>
              </div>
            </div>
          </div>
        ) : null}

    <ResponsiveContext.Consumer>
      {(size) => size === 'small' && this.state.isOpen && (
          <Nav gap="small" direction='column' className='Menu' justify="center" align="center">
            <Anchor
              className="MobileMem"
              color='#3b2479'
              label='Membership'
              href='/membership'
            ></Anchor>
            {localStorage.getItem("token") ? (
              <Anchor 
              className='profile' 
              label='My Page'
              style={MypageButton}
              onClick={this.showMenu}>
                {/* <Avatar
                  src={this.state.userImage}
                  className='profileicon'
                  style={{ width: "40px", height: "40px" }}
                /> */}
              </Anchor>
            ) : (
              <Button
                style={mobileButton}
                label='Login'
                className='login'
                onClick={this.openModal}
                name='loginModalOpen'
                primary
              />
            )}
          </Nav>
        )}
        </ResponsiveContext.Consumer>

      </>
    );
  }
}

export default Header;


const mobileButton = {
  width: '100%',
  borderRadius: 0,
  padding: '10px 0',
  
}

const MypageButton = {
  // backgroundColor:'#3b2479',
  backgroundColor:'#7D4CDB',
  color: '#fff',
  width: '100%',
  borderRadius: 0,
  padding: '10px 0',
  textAlign: 'center'
}