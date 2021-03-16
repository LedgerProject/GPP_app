<!-- PROJECT LOGO -->
<br />
<p>
  <h3>Global Passport Project App</h3>
  <img src="logo.png" />
</p>

<!-- GETTING STARTED -->
## Table of contents

* [Global Passport Project](#global-passport-project)
* [Build with](#built-with)
* [Software Used](#software-used)
* [Side technologies](#side-technologies)
* [Directory structure](#directory-structure)
* [Starting a development environment](#starting-a-development-environment)
* [Available scripts](#available-scripts)
* [How the app works](#how-the-app-works)

## Global Passport Project

Global Passport Project is a breakthrough initiative that leverages on decentralized technology to support mixed migrants along their journey, protect their privacy while reporting human rights violations, and engage them as citizens integrating in their new communities. GPP will also enormously improve the capacity of NGOs and social enterprises to reach out to migrants and design their actions, thus streamlining their resources and improving their performance and records when applying for funds and calls.

GPP is a blockchain-based platform with a website and mobile App through which mixed migrants can safely store important documents, access info on the countries crossed and the solidarity network in the area they are in, as well as report on abuses they might face along the journey. All data is personal and inviolable, and it will be kept on Blockchain with a double-level encryption component.

* GPP’s key tool is the first ever DocWallet, a unique and innovative "safe space" where migrants can scan and upload their ID, educational or medical records that might get lost during their journey or might not be convenient to keep them physically with them. The lack of documentation is often a key issue in the migratory process.

* GPP App will provide the user with a detailed and comprehensive mapping of solidarity structures in transit/destination countries: upon voluntary geolocalization, an interactive map will provide information on the structures (i.e. associations, collectives, unions, NGOs, lawyers, humanitarian protection) and also up-to-date information on the legislation in force in every country and territory crossed.

* GPP is also a multimedia tool for mixed migrant to report and document abuses faced along the journey after being provided with a brief tutorial on citizen journalism.

The platform is designed WITH migrants rather than FOR migrants: they are the main and ultimate beneficiaries of this project, whose aim is to enable them to embark in safer journeys and experience an easier settling, but also to engage them as active subjects of participatory democracy practices and a narrative process that will start from their first hand experiences as narrating subjects rather than narrated ones.

It is meant to serve as an innovative tool also for the third sector (NGOs, aid agencies) to access information and first-hand data that go beyond government control and a useful tool to improve and strengthen their interventions. GPP may also contribute to an in-depth reconsideration of the operational modalities which are very often blamed for adopting a top-down approach. The possibility to receive detailed information and to be able to directly get in contact with their targets and potential beneficiaries will allow to improve the effectiveness and efficiency of their actions, and ensure a streamlined use of the resources.

## Built with

* [React Native](https://reactnative.dev/)
* [Typescript](https://www.typescriptlang.org)
* [UI Kitten](https://akveo.github.io/react-native-ui-kitten/)

## Software used

* [npm](https://www.npmjs.com)
* [Visual Studio Code](https://code.visualstudio.com)
* [Android Studio](https://developer.android.com/studio)
* [Xcode](https://developer.apple.com/xcode/)
* [Postman](https://www.postman.com)
* [GitHub](https://github.com)

## Side technologies

### Production dependencies

* react: a JavaScript library for creating user interfaces.
* react-dom: React package for working with the DOM.
* react-native: a framework for building native apps using React.
* react-native-app-intro-slider: simple and configurable app introduction slider for react native.
* react-native-appearance: access operating system appearance information on iOS, Android, and web.
* react-native-auto-height-image: load a remote image and automatically set image height to the image dimension which fits the provided width.
* react-native-device-info: get device information using react-native.
* react-native-flatlist-slider: React Native flatlist slider component.
* react-native-geocoding: transform a description of a location (i.e. street address, town name, etc.) into geographic coordinates (i.e. latitude and longitude) and vice versa.
* react-native-gesture-handler: declarative API for gesture handling in React Native.
* react-native-get-location: React Native library to get device location for Android and iOS.
* react-native-image-picker: React Native module that allows to use native UI to select media from the device library or directly from the camera.
* react-native-image-zoom-viewer: React Native image zoom viewer.
* react-native-keyboard-aware-scroll-view: React Native scrollview component that resizes when the keyboard appears.
* react-native-loading-spinner-overlay: React Native iOS and Android loading spinner (progress bar indicator) overlay.
* react-native-localize: toolbox for React Native app localization.
* react-native-maps: React Native mapview component for iOS + Android.
* react-native-map-clustering: React Native mapview for markers clustering.
* react-native-open-maps: React Native library to perform cross-platform map actions (Google or Apple Maps).
* react-native-reanimated: alternative to animated library for React Native.
* react-native-restart: reload the app bundle during app runtime.
* react-native-safari-view: React Native wrapper for Safari view controller.
* react-native-safe-area-context: a flexible way to handle safe area, also works on Android and web.
* react-native-screens: native navigation primitives for React Native app.
* react-native-svg: SVG library for React Native.
* react-native-tab-view: tab view component for React Native.
* react-native-async-storage/async-storage: asynchronous, persistent, key-value storage system for React Native.
* react-native-community/masked-view: React Native masked view for iOS and Android.
* axios: promise based HTTP client for the browser and node.js. Make http requests from node.js
* date-fns: JavaScript date utility library.
* form-data: library to create readable "multipart/form-data" streams.
* i18n-js: library to provide the I18n translations.
* moment: library to parse, validate, manipulate, and display dates.
* ui-kitten/components: React Native components based on Eva Design System.
* ui-kitten/date-fns: date-fns services for UI Kitten.
* ui-kitten/moment: moment.js services for UI Kitten.
* react-navigation/bottom-tabs: bottom tab navigator following iOS design guidelines.
* react-navigation/drawer: drawer navigator component for React Navigation.
* react-navigation/material-top-tabs: integration for the animated tab view component from react-native-tab-view.
* react-navigation/native: React Native integration for React Navigation.
* react-navigation/stack: stack navigator component for React Navigation.

### Development dependencies

* types/react-native: TypeScript definitions for React Native.
* typescript-eslint/eslint-plugin: TypeScript plugin for ESLint.
* typescript-eslint/parser: an ESLint custom parser which leverages TypeScript ESTree.
* eslint: an AST-based pattern checker for JavaScript.
* eslint-config-standard: JavaScript standard style - ESLint shareable config.
* eslint-plugin-import: support linting of ES2015+ (ES6+) import/export syntax, and prevent issues with misspelling of file paths and import names.
* eslint-plugin-node: additional ESLint's rules for Node.js.
* eslint-plugin-promise: enforce best practices for JavaScript promises.
* eslint-plugin-react: React specific linting rules for ESLint.
* jetifier: jetifier from Android Studio, in npm package format.
* typescript: TypeScript is a language for application scale JavaScript development.

## Directory structure

* android: contains all the specific native code for Android. 
* env: contains the development and productions files with the UI environment variables.
* ios: contains all the specific native code for iOS. 
* patches: directory containing node modules patches
* src: TypeScript source code, having the following structure:
  * app: application core
  * assets: assets directory containing images and fonts.
  * components: contains the custom application components.
  * i18n: localization files in JSON format.
  * model: oggetti dell'applicazione
  * navigation: definizione delle routes
  * scenes: menu laterale
  * services: various services functions and environment variables.
  * views: application views. Each view is contained in a file which defines the operating logic and the UX.

## Starting a development environment

### Prerequisites

* npm and node.js: first of all install npm and node.js (https://nodejs.org/it/download/)

* React Native Community CLI: install the React Native Community CLI (https://github.com/react-native-community/cli)

```sh
npm install -g @react-native-community/cli
```

* GPP_backend: configure the GPP_backend environment, available at: (https://github.com/LedgerProject/GPP_backend)

### Configure the environment

Open a terminal and make a clone of this repository on your machine:

```sh
git clone https://github.com/LedgerProject/GPP_app
```

Install the npm packages. Go to the project directory and run:

```sh
npm install
```

After the modules installation, configure the environment. Make a copy of the /src/services/app-env-example.ts named /src/services/app-env.ts and edit the new file:

```sh
<backend url> change with the backend URL (please configure the GPP_backend environment, available at: (https://github.com/LedgerProject/GPP_backend)
<google maps api key> change with your Google Maps API key (remember Maps SDK for Android and Maps SDK for iOS)
```

### Available scripts

To test the application with Android, start an emulator with Android Studio and then run this script:

```sh
npx react-native run-android
```

To test the application with iOS, start an emulator with Xcode and then run this script:

```sh
npx react-native run-ios
```

## How the app works

TODO