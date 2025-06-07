import React, { Component } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import { v4 as uuid } from "uuid";
import WithRouterWrapper from "./WithRouterWrapper";

import Message from "./Message";
import Card from "./Card";

import "../styles/Chatbot.css";

const cookies = new Cookies();

let hasWelcomed = false;

class Chatbot extends Component {
  messagesEnd;
  talkInput;

  constructor(props) {
    super(props);
    this._handleInputKeyPress = this._handleInputKeyPress.bind(this);
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this.chatbotRef = React.createRef();

    this.state = {
      messages: [],
      showBot: false,
    };

    if (!cookies.get("userID")) {
      cookies.set("userID", uuid(), { path: "/" });
    }
  }

  async df_text_query(queryText) {
    if (!queryText.trim()) return;

    this.setState((prev) => ({
      messages: [
        ...prev.messages,
        { speaks: "user", msg: { text: { text: queryText } } },
      ],
    }));

    const res = await axios.post("http://localhost:5000/api/df_text_query", {
      text: queryText,
      userID: cookies.get("userID"),
    });
    console.log("Dialogflow full response:", res.data);

    const botMsgs = res.data.fulfillmentMessages.map((msg) => ({
      speaks: "bot",
      msg,
    }));
    this.setState((prev) => ({ messages: [...prev.messages, ...botMsgs] }));
  }

  async df_event_query(eventName) {
    const res = await axios.post("http://localhost:5000/api/df_event_query", {
      event: eventName,
      userID: cookies.get("userID"),
    });
    const botMsgs = res.data.fulfillmentMessages.map((msg) => ({
      speaks: "bot",
      msg,
    }));
    this.setState((prev) => ({ messages: [...prev.messages, ...botMsgs] }));
  }

  componentDidMount() {
    if (!hasWelcomed) {
      this.df_event_query("welcome");
      hasWelcomed = true;
    }
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  componentDidUpdate() {
    if (this.messagesEnd)
      this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    if (this.talkInput) this.talkInput.focus();
  }

  handleClickOutside = (e) => {
    if (
      this.state.showBot &&
      this.chatbotRef.current &&
      !this.chatbotRef.current.contains(e.target)
    ) {
      this.setState({ showBot: false });
    }
  };

  show(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ showBot: true });
  }

  hide(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ showBot: false });
  }

  renderCards = (vals) =>
    vals.map((c, i) => <Card key={i} payload={c.structValue} />);

  renderOneMessage = (m, i) => {
    const elements = [];
    const pf = m.msg.payload?.fields;

    // Render plain text
    if (m.msg?.text?.text) {
      elements.push(
        <Message key={`text-${i}`} speaks={m.speaks} text={m.msg.text.text} />
      );
    }

    // Render richContent cards
    if (pf?.richContent?.listValue?.values?.[0]?.listValue?.values) {
      const outer = pf.richContent.listValue.values[0].listValue.values;
      const cards = outer.map((v) => {
        const f = v.structValue.fields;
        return {
          title: f.title.stringValue,
          subtitle: f.subtitle.stringValue,
          image: {
            src: {
              rawUrl:
                f.image.structValue.fields.src.structValue.fields.rawUrl
                  .stringValue,
            },
          },
          buttons: f.buttons.listValue.values.map((b) => ({
            text: b.structValue.fields.text.stringValue,
            link: b.structValue.fields.link.stringValue,
          })),
        };
      });

      elements.push(
        <div key={`cards-${i}`} className="cards-panel">
          <div className="cards-container">
            {cards.map((c, idx) => (
              <Card key={idx} card={c} />
            ))}
          </div>
        </div>
      );
    }

    // Render legacy cards
    if (pf?.cards?.listValue?.values) {
      elements.push(
        <div key={`legacy-cards-${i}`} className="cards-panel">
          <div className="cards-container">
            {this.renderCards(pf.cards.listValue.values)}
          </div>
        </div>
      );
    }

    return elements.length > 0 ? (
      <React.Fragment key={i}>{elements}</React.Fragment>
    ) : null;
  };

  renderMessages = (msgs) => msgs.map(this.renderOneMessage);

  _handleInputKeyPress = (e) => {
    if (e.key === "Enter") {
      const v = e.target.value.trim();
      if (v) {
        this.df_text_query(v);
        e.target.value = "";
      }
    }
  };

  render() {
    return (
      <>
        {!this.state.showBot && (
          <div className="chatbot-toggle-container">
            <div className="chatbot-toggle" onClick={this.show}>
              💬
            </div>
          </div>
        )}

        <div className="chatbot-wrapper">
          <div
            ref={this.chatbotRef}
            className={`chatbot-popup ${this.state.showBot ? "active" : ""}`}
          >
            <div className="chatbot-header" onClick={this.hide}>
              <span>Chatbot</span>
              <span className="chatbot-close">−</span>
            </div>

            <div className="chatbot-body">
              {this.renderMessages(this.state.messages)}
              <div ref={(el) => (this.messagesEnd = el)} />
            </div>

            <div className="chatbot-input-wrapper">
              <input
                className="chatbot-input"
                placeholder="Type a message..."
                type="text"
                ref={(i) => (this.talkInput = i)}
                onKeyPress={this._handleInputKeyPress}
              />
              <button
                className="chatbot-send"
                onClick={() => {
                  const v = this.talkInput.value.trim();
                  if (v) {
                    this.df_text_query(v);
                    this.talkInput.value = "";
                  }
                }}
              >
                ➤
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default WithRouterWrapper(Chatbot);
