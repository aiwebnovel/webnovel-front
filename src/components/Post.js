import { Component } from 'react';
import '../style/Post.css';
import PostMap from './PostMap.js';

class Post extends Component {
  state = { option: 'date' };



  render() {
    return (
      <div class="Post">
        <PostMap/>
        <PostMap/>
        <PostMap/>
        <PostMap/>
        <PostMap/>
        <PostMap/>
        <PostMap/>
        <PostMap/>
      </div>
    );
  }
}

export default Post;
