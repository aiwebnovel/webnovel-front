import { Component } from 'react';
import withFirebaseAuth from 'react-with-firebase-auth'
import firebase from 'firebase/app';
import 'firebase/auth';
import firebaseConfig from '../public/firebaseConfig';
import '../style/Header.css';

const firebaseApp = firebase.initializeApp(firebaseConfig);

class Header extends Component {
  render() {
    const { user, signOut, signInWithGoogle, } = this.props;
    return (
      <header>
        <span class="logo">WebNovel</span>
        <p class="beta">Beta</p>
        <div >
          { user
            ? <p>Hello, {user.displayName} {console.log(this.props)}</p>
            : null
          }
          { user
            ? <button class="login" onClick={signOut}>Sign out</button>
            : <button class="login" onClick={signInWithGoogle}>Sign in with Google</button>
          }
        </div>
      </header>
    );
  }
}

const firebaseAppAuth = firebaseApp.auth();
const providers = { googleProvider: new firebase.auth.GoogleAuthProvider(), };

export default withFirebaseAuth({
  providers,
  firebaseAppAuth,
})(Header);
