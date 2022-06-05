# Vote Safe

Secure voting directly from a mobile phone

# Tech Stack

TypeScript <br>
React Native <br>
Expo <br>
Node <br>

## Requirements

Have <a href = "https://nodejs.org/en/download/"> node js </a> installed then run the following commands to install yarn, expo and typescript globally.

```bash
npm install expo-cli --global # install expo globally
npm install yarn --global # install yarn globally
npm install typescript --global # install ts globally
```

Download Redis, for windows download or installer go <a href = "https://github.com/microsoftarchive/redis/releases/tag/win-3.0.504"> HERE </a> or for a manual download for other platforms click <a href = "https://redis.io/download"> HERE </a>

## Setting up virtual device (Windows)

Download <a href="https://developer.android.com/studio"> Android Studio </a> to utilize virtual device, after installed watch this <a href="https://www.youtube.com/watch?v=v4f94Jba8UA"> video </a> for help

## Setting up virtual device (Mac)

Use xcode for ur virtual device which will be ios, if you need help getting a virtual ios device running you can probably find something online to help

## Using Expo instead

you do not need to even use a virtual device, download the expo go app on your phone. When starting the mobile app run yarn start and scan qr code and the app will open on your phone

## Starting the mobile app

Make sure your device is running at this point in time, it just has to be on and open. <br> <br> Next go to the directory in which you want to run / install this project and run the following commands

```bash
git clone https://github.com/adushaj2022/VoteSafe.git
cd mobile
yarn install # install dependencies using yarn
yarn start # for expo option
expo start --android # starting the app
# or for ios
expo start --ios
```

There is one more thing you need to do, go into ./mobile/api/config.ts

```typescript
export const _http = axios.create({
  baseURL: "",
});
```

Change the baseURL to http://{yourIpAddress}:{nodeServerPort}/
If you do not know your ip run ipconfig :)

## Starting the backend

```bash
cd server
npm install # if there are dependencies missing
npm run build # compile typescript
npm start # run app
```

## Database setup

Download postgresql on your computer, make sure you know your password, keep port on 5432 this is default just do
not change it. After setting up your .env file (see below), please create a database called 'votesafe', when starting
the server the databases will be created automatically

## Environment Variables

Go to root file directory and enter the commands

```bash
cd server
touch .env # bash
ni .env # powershell
```

.env file contents can be found in discord

## Development help

Instead of stopping the server, compiling typescript, then restarting the server. We can do the following.
Open up a new terminal and run the following

```bash
npm run watch
```

Next leave that terminal open and open a new one, and run the following

```bash
npm run dev
```

Now it will watch for changes and recompile for you :)

## Further Resources

<a href="https://docs.nativebase.io/"> Native Base </a>
<br>
<a href="https://reactnavigation.org/docs/getting-started"> Navigation </a>
<br>
<a href="https://docs.expo.io/"> Expo </a>
<br>
<a href="https://redux.js.org/usage/configuring-your-store"> Redux </a>

## Contributing

Create a branch of your own and submit pull requests that will then be reviewed
