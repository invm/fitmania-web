# FitMania React Web App

**Find a training partner, open running groups, plan football games and train together with friends!**

[Live Demo](https://fitmania.tk) (requires registration)

## Overview

This repo is the web frontend for my FitMania full-stack project. FitMania is a social platform to interact with people with common sport preferences and hobbies. It consists from 3 different repositories, a Nodejs backend, a React web app and a React Native app. 

This is React web app written in Typescript.

The app allows user authentication, post and comment publication. The user may create sport workout session, where other users may join and participate. Users may create groups based on their preferred sport and join other groups. All of the events surrounding workout session and comments on posts trigger app notifications. Users may create and update their profile and show other users their preferable and undesirable sports.

## Project folder structure

> Entrypoint -> src/index.tsx

- Assets

  - Images and other assets

- Components
  - App - top level component
  - Common - shared components used thourghout the app
  - Pages
    - Page per use case

- i18n
  - Internalization files
 
- Interfaces
  - Entities of the system

- Redux
  - Actions
    - Functions that affect global state
  - Reducers
    - App level state separated into logical blocks
  - Types
    - Unique string declarations per use case
  
- Utils
  - Utilities used thourghout the app 

### How to run

#### Environment setup

> Node version 14+ is mandatory

Replace all in angle brackets to run locally

- BROWSER=none **Prevent the app from opening a new browser tab**
- REACT_APP_ENV=development **Prefill some basic data, allows logging and hides store in production**
- REACT_APP_MEDIA=https://<url>/media/
- REACT_APP_API_URL=https://<url>
- REACT_APP_API_KEY=<API_KEY> **Meant to keep out malicious traffic**
- REACT_APP_GOOGLE_API_KEY= **For addresses auto complete**
 
Run locally

```
npm i
npm start
```

Generate static files
```
npm run build
```