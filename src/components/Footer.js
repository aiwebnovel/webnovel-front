import { React, Component } from 'react';
import '../style/Footer.css';
import { Footer as FooterLayout, Box,} from 'grommet';
import {Facebook, Instagram} from 'grommet-icons'
import footerLogo from '../public/Footer_logo.png'

class Footer extends Component {

  render() {
    return (
    <FooterLayout background="light-3" pad="small" style={footerStyle}>
        <img src={footerLogo} alt="footer_logo" className="footer-logo"/>
       
          <div className="InfoBox">
          <p><b>(주)앱플랫폼</b></p>
          <p>대표 : 김춘남</p>
          <p>사업자 번호 : 115-87-01388</p>
          <p>전화 : 02-6959-4330</p>
          </div>


          <div className="InfoBox">
          <p><b>주소</b></p>    
          <p>서울 서초구 반포대로28길56-6, 3층 301호</p>   
          <p>301, 56-6, Banpo-daero 28-gil, Seocho-gu,</p>
          <p>Seoul, Korea</p>
          </div>
        
          <div className="InfoBox">
          <p><b>정책</b></p>   
          <a href="https://www.notion.so/appplatform/d99f247a66d141bbbdf227739861a0a2"><p>개인정보 처리방침</p></a>
          <a href="https://appplatform.notion.site/8be8232fff0341799cf8c13728610b6b"> <p>이용약관</p></a>
          <a href="mailto:support@appplatform.co.kr">support@appplatform.co.kr </a>
          </div>

          <div className="InfoBox">
            <div className="IconBox">
              <Facebook size="medium"/>
              <Instagram size="medium"/>
            </div>
            <p>©Appplatform, Inc All Rights Reserved</p>
          </div>


    </FooterLayout>
    );
  }
}

export default Footer;

const footerStyle = {
  justifyContent: 'center',
  alignItems: 'end'
}
