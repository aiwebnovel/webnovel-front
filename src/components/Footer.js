import { Component } from 'react';
import '../style/Footer.css';

class Footer extends Component {



  render() {
    return (
    <footer>
    <p class="info">
      <a href="mailto:support@appplatform.co.kr" class='email'>support@appplatform.co.kr </a>
      <a href="https://www.notion.so/titanvdev/5beb50f9d7ea4438adff2511296eef73" class='email'> 개인정보 처리방침</a><br/>
      
      Address: #702 BS B/D seocho-daero 334 ,Seocho-gu, Seoul, Korea<br/>
      ㈜Appplatform 115-87-01388 대표 김춘남 115-87-01388  02-6959-4330<br/>
      ©Appplatform, Inc All Rights Reserved
    </p>

    </footer>
    );
  }
}

export default Footer;
