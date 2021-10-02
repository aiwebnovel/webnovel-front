import { Component } from 'react';
import '../style/Modal.css';
import styled from 'styled-components'
import { Close } from 'grommet-icons';

export class Modal extends Component {

  
    render() {
          // 열기, 닫기, 모달 헤더 텍스트를 부모로부터 받아옴
        const { open, close, title } = this.props;

        return (
            <div className={ open ? 'openModal modal': 'modal' }>
                { open ? (  
                    <Container>
                        <ModalHeader>
                            <Button onClick={close} > <Close size="15px"/> </Button>
                        </ModalHeader>
                        <ModalMain>
                            <h3>{title}</h3>
                            {this.props.children}
                        </ModalMain>
                    </Container>
                ) : null }
            </div>
        )
    }
}

export default Modal;

const Container = styled.div`
    max-width: 900px;
    min-width: 400px;
    // max-height: 70%;
    // min-height: 100px;
    margin:0 auto;
    border-radius: 10px;
    background-color: #fff;
    
    
    /* 팝업이 열릴때 스르륵 열리는 효과 */
    animation: modal-show 0.3s;
    overflow: hidden;


    @keyframes modal-show {
        from {
            opacity: 0;
            margin-top: -50px;
        }
        to {
            opacity: 1;
            margin-top: 0;
        }
    }
` 

const ModalHeader = styled.div`
    display: flex;
    align-items : center;
    justify-content: flex-end;
    padding: 10px 20px;
    font-weight: 700;
    color: #ffffff;
    border-bottom : 1px solid #ededed;
`

const Button = styled.button`
  background-color : transparent;  
  outline: none;
  cursor: pointer;
  border: 0;
`
const ModalMain = styled.div`
    padding: 16px;
    border-bottom: 1px solid #ffffff;
    border-top: 1px solid #ffffff;
        
    > h3 {
        text-align: center;
        color : #090909;
        padding: 10px 0 15px 0;
    }
`
