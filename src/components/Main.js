import { Component } from 'react';
import '../style/Main.css';

class Main extends Component {

  render() {
    return (
      <div class="main">
        <p class="middleTitle"> Completion </p>
        <div>
          <div class="input">
          <textarea type="text" class="input_text"></textarea>
          <button class="start">Start!</button>
          </div>

          <div class="output">
            <textarea type="text" readonly></textarea>
          </div>
        </div>
      </div>
    );
  }
}

export default Main;
