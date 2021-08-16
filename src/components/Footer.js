import { Component } from 'react';
import '../style/Footer.css';

class Footer extends Component {



  render() {
    return (
    <footer>
    <p class="info">
      <a href="mailto:support@appplatform.co.kr" class='email'>support@appplatform.co.kr </a>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <a href="https://www.notion.so/appplatform/d99f247a66d141bbbdf227739861a0a2" class='email'> 개인정보 처리방침</a><br/>
      <a href="https://appplatform.notion.site/8be8232fff0341799cf8c13728610b6b" class='email'> 이용약관 </a><br/>
      
      Address: #702 BS B/D seocho-daero 334 ,Seocho-gu, Seoul, Korea<br/>
      ㈜Appplatform 115-87-01388 대표 김춘남 115-87-01388  02-6959-4330<br/>
      ©Appplatform, Inc All Rights Reserved
    </p>

    </footer>
    );
  }
}

export default Footer;
