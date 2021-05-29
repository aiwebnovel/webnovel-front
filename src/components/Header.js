import { Component } from 'react';
import axios from 'axios';
import withFirebaseAuth from 'react-with-firebase-auth'
import { authService, firebaseInstance } from "../public/firebaseConfig";
import '../style/Header.css';
import usericon from '../public/user.png';
import ProgressBar from "@ramonak/react-progress-bar";
import * as config from '../config';
import Modal from './Modal';



class Header extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      showMenu: false,
      userName: '로그인 되지 않은 사용자',
      userToken: 0,
      userTokenP: 0,
      userImage: usericon,
      modalOpen: false,
      user: false
    };
    this.showMenu = this.showMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.signOut = this.signOut.bind(this);
    this.signIn = this.signIn.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }
    openModal = () => {
        this.setState({ modalOpen: true })
    }
    closeModal = () => {
        this.setState({ modalOpen: false })
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
      })
      .catch((error) => {
        
      })
    }

  }

  componentDidMount(){
    this.requestProfile();

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

  render() {
    let { user } = this.props;  
    return (
      <header>
        <span class="logo">WebNovel</span>
        <div class="loginProfile">
          
          <button className='links' onClick={ this.openModal }>PRICING</button>
          <Modal open={ this.state.modalOpen } close={ this.closeModal } title="Create a chat room">
               
            프로토타입에서는 지원되지 않는 기능입니다.
          </Modal>
          { localStorage.getItem('token') ? console.log(localStorage.getItem('token')) : this.signOut() }
          { this.state.user ? 
            <div class="profile">
              <a onClick={this.showMenu}>
                <img  src={this.state.userImage} class="profileicon"/>
              </a>
            </div>
            : <button class="login" onClick={this.signIn} name='Google'>login</button>
          }
            {/*<button class="login" onClick={this.signIn} name='Facebook'>Sign in with Facebook</button>*/}
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
