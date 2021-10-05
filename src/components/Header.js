import { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { authService, firebaseInstance } from "../public/firebaseConfig";
import { ToastContainer, toast } from "react-toastify";
import ProgressBar from "@ramonak/react-progress-bar";
import "../style/Header.css";
import usericon from "../public/user.png";
import facebookicon from "../public/facebook.png";
import * as config from "../config";
import Modal from "./Modal";
//import { GoogleLogin } from 'react-google-login';
import { Header as HeaderLayout, Nav, Anchor, Button, Avatar } from 'grommet';
import {Google , Facebook} from 'grommet-icons';



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
    };
    this.showMenu = this.showMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.signOut = this.signOut.bind(this);
    this.signIn = this.signIn.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

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

    if (user !== undefined) {
      axios
        .get(`${config.SERVER_URL}/profile`, {
          headers: { authentication: user },
        })
        .then((response) => {
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
        toast(
          `Thank you for visiting our site. The service is currently awaiting approval. I'll let you know as soon as it starts.`,
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
        this.requestProfile();
      })
      .catch((error) => {
        let errorCode = error.code;
        let errorMessage = error.message;
        let email = error.email;
        let credential = error.credential;
      });
  }

  render() {
    return (
      <>
      <HeaderLayout background="#fff" className="header">
        <Link to="/" className="logo">
          <img src="/logo.png" alt="logo"/>
        </Link>
        <Nav direction="row" className="Menu">
          <Anchor
            color="#3b2479"
            label="Membership"
            href="/membership"
          >
          {/* <Link to="/membership">
            <span className="links">membership</span>
          </Link> */}
          </Anchor>

          {localStorage.getItem("token") ? (
            <Anchor 
            className="profile" 
            onClick={this.showMenu}>
                <Avatar 
                src={this.state.userImage} 
                className="profileicon"
                style={{width: '40px',height:'40px'}}
                />
            </Anchor>
          ) : (
            // <Anchor
            //   background="#3b2479"
            //   color="light-1">
            //   login
            // </Anchor>
            <Button
              label="Login"
              className="login"
              onClick={this.openModal}
              name="loginModalOpen"
              primary
            />
          )}
          </Nav>
      </HeaderLayout>
      <Modal
            open={this.state.loginModalOpen}
            close={this.closeModal}
            title="Login"
          >
            <div className="AvatarBox">
              <img src={usericon} alt="singinUser" className="loginAvatar"/>
            </div>
            <div class="signBox">
            <button onClick={this.signIn} className="googleButton">
              <Google color="plain" size="medium" /> Sign in with Google
            </button>
            <br />
            
            <div className="AvatarBox">
            <button
              onClick={this.signIn}
              className="facebookButton"
            >
              <Facebook color="plain" size="medium"/> Sign in with Facebook
            </button>
            </div>
            </div>
          </Modal>

          {this.state.showMenu ? (
            <div
              ref={(element) => {
                this.dropdownMenu = element;
              }}
            >
              <div className="dropdown">
                <div className="name">
                  <p>{this.state.userName}</p>
                </div>
                <div className="token">
                  <ProgressBar
                    completed={this.state.userTokenP}
                    height="8px"
                    isLabelVisible={false}
                  />
                  <span>{this.state.userToken} token</span>
                  <p>{localStorage.getItem("plan")}</p>
                </div>
                <button onClick={this.signOut} className="logout">
                  logout
                </button>
              </div>
            </div>
          ) : null}
      

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
      </>
    );
  }
}

export default Header;
