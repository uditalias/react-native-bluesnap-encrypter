# react-native-bluesnap-encrypter 🔐
A Cross platform React Native module to encrypt BlueSnap sensitive form data. As described in BlueSnap [API docs](https://developers.bluesnap.com/docs/client-side-encryption#section-implementing-client-side-encryption-in-your-web-form)


## Why

BlueSnap SDKs provides a soluion for Web, iOS and Android plaforms. This module wraps BlueSnap's Web JavaScript SDK so you can perform data encryption from your react native application.

## Features

- Zero configurations - only your BlueSnap's client encryption key is required
- Promise based - use **Promise** or **async/await**

## Install

```bash
npm i --save react-native-bluesnap-encrypter
```

## Quick Start

```jsx
import React, { Component } from "react";
import { View, Button } from "react-native";
import BlueSnapEncrypter from "react-native-bluesnap-encrypter";

class MyComponent extends Component {
    constructor(props, context) {
        super(props, context);

        this.encrypter = null;
    }

    onEncrypt = async () => {

        const encrypted = await this.encrypter.encrypt({
            creditCardNumber: "1234123412341234",
            cvvNumber: "123"
        });

        console.log(encrypted);
        /*
            {
                "ccLast4Digits": "1234",
                "encryptedCreditCard": "ENCYPTED",
                "encryptedCvv": "ENCYPTED"
            }
        */
    }

    render() {
        return (
            <View>
                <Button
                    title="Encrypt Credit Card"
                    onPress={this.onEncrypt}
                />

                <BlueSnapEncrypter
                    clientEncryptionKey="YOUR_CLIENT_ENCRYPTION_KEY"
                    bluesnapVersion="1.0.3"
                    ref={(encrypter) => this.encrypter = encrypter}
                />
            </View>
        );
    }
}
```
## Props
| Property | Type | Description |
| --- | --- | --- |
|clientEncryptionKey | PropTypes.string.isRequired | Your BlueSnap client encription key (located at your API Settings)|
|bluesnapVersion | PropTypes.string | Optional BlueSnap JavaScript SDK version, defaults to 1.0.3|

## Methods
### encrypt

Encrypts credit card data with your client encryption key.  

```js
const encrypted = await this.encrypter.encrypt({
    creditCardNumber: "1234123412341234",
    cvvNumber: "123"
});
```
Returns a Promise wich resolves to:

```json
{
    "ccLast4Digits": "1234",
    "encryptedCreditCard": "ENCYPTED",
    "encryptedCvv": "ENCYPTED"
}
```

## Missing Something? Something is not working?
* Open a GitHub issue, or
* Send a pull request 🤩