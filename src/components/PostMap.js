import { Component } from 'react';
import '../style/PostMap.css';
import like from '../image/like.svg';

class PostMap extends Component {
  state = { showMenu: false };


  render() {
    return (
      <div class="PostMap">
        <a class="postImage">
          <img class="PostImage" src="https://media.vlpt.us/images/dongyi/post/afdf1622-db3e-4ec2-adce-ab51f541feff/썸네일 - 인터뷰.jpg?w=640"/>
        </a>

        <div class="PostText">
          <h4 class="PostStrong">제목</h4>
          <div class="PostDemo">
          내용
          </div>

          <div class="PostDate">
            2021년 3월 17일·14개의 댓글
          </div>
        </div>

        <div class="PostBottom">
          <a class="Bottomuser">
            <img class="Bottomimg" src="https://media.vlpt.us/images/dongyi/profile/1d42f7e3-42c3-4b65-8c64-e6169c437565/cm-fb-profile.png?w=120"/>
            <span class="Bottomfont">
              by<b> dongyi</b>
            </span>
          </a>
          <div class="like">
            <img class="Bottomlike" src={like} />
            231
          </div>
        </div>
      </div>
    );
  }
}

export default PostMap;
