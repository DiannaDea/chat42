import React, { Component } from 'react';
import classNames from 'classnames';
import CryptoJS from 'crypto-js';

import styles from './Chat.styl';

export default class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      messages: [],
    };
    this.props.socket.on('message', text => {
      const t = CryptoJS.DES.decrypt(text, this.props.secret.toString()).toString(CryptoJS.enc.Utf8);
      console.log(text, 'decrypted: ', t, 'secret: ', this.props.secret.toString());
      this.setState({
        ...this.state,
        messages: [
          ...this.state.messages,
          {
            text: t,
            mine: false,
          },
        ],
      });
    });
    this.sendMessage = this.sendMessage.bind(this);
  }
  sendMessage() {
    const text = this.state.value;
    const t = CryptoJS.DES.encrypt(text, this.props.secret.toString());
    this.props.socket.emit('message', t.toString());
    this.setState({
      ...this.state,
      value: '',
      messages: [
        ...this.state.messages,
        { text, mine: true },
      ],
    });
  }
  render() {
    return (
      <div className={styles.chat}>
        <div className={styles.messageBoard}>
          {
            this.state.messages.map((msg, i) =>
              (
                <div
                  key={msg + i}
                  className={
                    classNames(
                      styles.message,
                      {
                        [styles.mine]: msg.mine,
                        [styles.notMine]: !msg.mine,
                      },
                    )
                  }
                >
                  {msg.text}
                </div>
              ),
            )
          }
        </div>
        <div className={styles.inputGroup}>
          <textarea
            className={styles.input}
            value={this.state.value}
            onChange={({ target: { value } }) => this.setState({ value })}
          />
          <button
            className={styles.btn}
            onClick={this.sendMessage}
          >
            Submit
          </button>
        </div>
      </div>
    );
  }
}
