import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { View, WebView, StyleSheet } from "react-native";

const BRIDGE = require("./bridge.html");
const validTypes = ["encrypt"];
const requests = {};
const guid = () => Math.random().toString(36).slice(2);
const createAction = (type, data) => ({
    _id: guid(),
    type,
    data
});
const createRequest = (action) => {
    return new Promise((resolve, reject) => {
        requests[action._id] = {
            resolve, reject, action
        }
    });
}
const styles = StyleSheet.create({
    container: {
        width: 0,
        height: 0,
        display: "none"
    }
});

export default class BlueSnapEncrypter extends PureComponent {
    constructor(props, context) {
        super(props, context);

        this.webView = null;
        this.setWebViewRef = this.setWebViewRef.bind(this);
        this.encrypt = this.encrypt.bind(this);
        this.onEncrypt = this.onEncrypt.bind(this);
        this.onMessage = this.onMessage.bind(this);
    }

    setWebViewRef(webView) {
        this.webView = webView;
    }

    getInjectedJavaScript() {
        const { bluesnapVersion, clientEncryptionKey, fraudSessionId } = this.props;

        return `window.initialize("${clientEncryptionKey}", "${bluesnapVersion}", "${fraudSessionId}");`;
    }

    onEncrypt(action) {
        const request = requests[action._id];

        if (request) {
            request.resolve(action.data);
            delete requests[action._id];
        }
    }

    onMessage(event) {
        try {
            const action = JSON.parse(event.nativeEvent.data);

            if (!action.type || !validTypes.includes(action.type)) {
                return;
            }

            switch (action.type) {
                case "encrypt":
                    this.onEncrypt(action);
                    break;
            }
        } catch (e) {

        }
    }

    encrypt(data) {
        if (this.webView) {
            const action = createAction("encrypt", data);
            this.webView.postMessage(JSON.stringify(action), "*");
            return createRequest(action);
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <WebView
                    ref={this.setWebViewRef}
                    onMessage={this.onMessage}
                    injectedJavaScript={this.getInjectedJavaScript()}
                    source={BRIDGE}
                />
            </View>
        );
    }
}

BlueSnapEncrypter.propTypes = {
    clientEncryptionKey: PropTypes.string.isRequired,
    bluesnapVersion: PropTypes.string
}

BlueSnapEncrypter.defaultProps = {
    bluesnapVersion: "1.0.3",
    fraudSessionId: ""
}