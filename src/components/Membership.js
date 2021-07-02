import { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { authService, firebaseInstance } from "../public/firebaseConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../style/Membership.css";
import Modal from "./Modal";
import * as config from "../config";

class Membership extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMenu: false,
      plan: "free",
      free: "currunt",
      basic: "change",
      premium: "change",
    };
    //this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.onClickPayment = this.onClickPayment.bind(this);
    this.requestPay = this.requestPay.bind(this);
    this.requestProfile = this.requestProfile.bind(this);
  }
/*
  openModal = async (e) => {
    const token = localStorage.getItem("token");
    axios
      .post(
        `${config.SERVER_URL}/event`,
        {},
        { headers: { authentication: token } }
      )
      .then((response) => {
        toast(
          `감사합니다~유료로 가입을 원하시는 분들께 아래 내용을 알려드립니다.  
당사는 SMART TECH KOREA 2021 행사 참여 기념으로 유료 가입자들에게는
6월23일~6월30일까지 무료 체험 사용에 대한 보너스를 드릴 예정입니다
유료 결재를 원하시는 분은 무료 체험을 해보시고 
7월1일 이후 구독 결재를 선택해 주시면 됩니다. 
가입하신 메일에 안내를 드리겠습니다.`,
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
      })
      .catch((error) => {
        if (error.response.status === 412) {
          this.setState({ loading: false });
          toast.error(`로그인이 필요합니다.`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          localStorage.removeItem("token");
        } else {
          this.setState({ loading: false });
          toast.error(`중복 결제는 불가능합니다!`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      });
  };
*/
  closeModal = () => {
    this.setState({ showMenu: false });
  };

  onClickPayment(e) {
    /* 1. 가맹점 식별하기 */
    const { IMP } = window;
    IMP.init("imp33624147");

    let amount = 0;
    if (this.state.plan === "basic") {
      amount = 10000;
    } else if (this.state.plan === "premium") {
      amount = 29000;
    } else {
      return;
    }
    /* 2. 결제 데이터 정의하기 */
    const data = {
      //pg: 'kakaopay',
      pg: e.target.name,
      pay_method: "card", // "card"만 지원됩니다
      merchant_uid: "merchant_" + new Date().getTime(), // 빌링키 발급용 주문번호
      //customer_uid: "gildong_0001_1234", // 카드(빌링키)와 1:1로 대응하는 값
      name: this.state.plan,
      amount: amount, // 0 으로 설정하여 빌링키 발급만 진행합니다.
      buyer_Uid: localStorage.getItem("userUid"),
    };

    /* 4. 결제 창 호출하기 */
    IMP.request_pay(data, (response) => {
      const { success, merchant_uid, imp_uid, error_msg } = response;

      if (success) {
        //console.log(success);
        //console.log(merchant_uid);
        //console.log(imp_uid);
        //console.log(response);
        alert("결제 성공");
        this.requestPay(this.state.plan, imp_uid, merchant_uid);
      } else {
        alert(`결제 실패: ${error_msg}`);
      }
    });
  }

  async requestPay(plan, imp_uid, merchant_uid) {
    let user = await localStorage.getItem("token");

    if (user !== undefined) {
      axios
        .post(
          `${config.SERVER_URL}/pay`,
          {
            imp_uid: imp_uid,
            merchant_uid: merchant_uid,
            plan: plan,
          },
          { headers: { authentication: user } }
        )
        .then((response) => {
          //console.log(response.data);
          this.closeModal();
        })
        .catch((error) => {
          //console.log(error);
        });
    }
  }

  async requestProfile() {
    let user = await localStorage.getItem("token");

    if (user !== undefined) {
      axios
        .get(`${config.SERVER_URL}/profile`, {
          headers: { authentication: user },
        })
        .then((response) => {
          localStorage.setItem("userUid", response.data.Uid);
          localStorage.setItem("plan", response.data.plan);
          this.closeModal();
        })
        .catch((error) => {});
    }
  }

  async componentDidMount() {
    await this.requestProfile();
    this.setState({ free: "change" });
    this.setState({ [localStorage.getItem("plan")]: "currunt" });
  }
  render() {
    return (
      <div class="pricingDiv">
        <div class="pricing">
          <h3 class="priceTitle">free</h3>
          <div class="priceDiv">
            <span class="price1">₩</span>
            <span class="price2">0</span>
            <span class="price3">/mo</span>
          </div>
          <a class="pricebutton" onClick={this.openModal} name="free">
            {this.state.free}
          </a>
          <p>✔ 장르 선택 및 주인공 입력 가능</p>
          <p>✔ 장소, 시간, 주제, 사건 입력 가능</p>
          <p>✔ 이어쓰기 2-3회 제공</p>
        </div>

        <div class="pricing">
          <h3 class="priceTitle">basic</h3>
          <div class="priceDiv">
            <span class="price1">₩</span>
            <span class="price2">10000</span>
            <span class="price3">/mo</span>
          </div>
          <a class="pricebutton" onClick={this.openModal} name="basic">
            {this.state.basic}
          </a>
          <p>✔ 장르 선택 및 주인공 입력 가능</p>
          <p>✔ 장소, 시간, 주제, 사건 입력 가능</p>
          <p>✔ 이어쓰기 및 이야기 완성 가능</p>
          <p>
            ✔ 이야기 2개 이상 창작 가능
            <br />
            (이야기 한개당 최대 길이 a4 2장)
          </p>
        </div>

        <div class="pricing">
          <h3 class="priceTitle">premium</h3>
          <div class="priceDiv">
            <span class="price1">₩</span>
            <span class="price2">30000</span>
            <span class="price3">/mo</span>
          </div>
          <a class="pricebutton" onClick={this.openModal} name="premium">
            {this.state.premium}
          </a>
          <p>✔ 장르 선택 및 주인공 입력 가능</p>
          <p>✔ 장소, 시간, 주제, 사건 입력 가능</p>
          <p>✔ 이어쓰기 및 이야기 완성 가능</p>
          <p>
            ✔ 이야기 7개 이상 창작 가능
            <br />
            (이야기 한개당 최대 길이 a4 2장)
          </p>
        </div>

        <Modal open={this.state.showMenu} close={this.closeModal} title="Price">
          <a
            class="pricebutton"
            onClick={this.onClickPayment}
            name="html5_inicis"
          >
            일반결제
          </a>
          <a class="pricebutton" onClick={this.onClickPayment} name="kakaopay">
            카카오
          </a>
        </Modal>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover
        />
      </div>
    );
  }
}

export default Membership;
