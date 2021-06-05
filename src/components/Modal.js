import { Component } from 'react';
import '../style/Modal.css';

export class Modal extends Component {

  
    render() {
          // 열기, 닫기, 모달 헤더 텍스트를 부모로부터 받아옴
        const { open, close } = this.props;

        return (
            <div className={ open ? 'openModal modal': 'modal' }>
                { open ? (  
                    <section>
                        <header>
                            Pricing
                            <button className="close" onClick={close}> &times; </button>
                        </header>
                        <main>
                            {this.props.children}
                        </main>
                    </section>
                ) : null }
            </div>
        )
    }
}

export default Modal;
