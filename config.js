
/**
  *   Fetch and return current env variable
**/
export function getEnv(cb) {
  fetchEnv((env) => cb(env));
}

function fetchEnv(cb) {
  fetch('https://www.getpayper.io/getEnv', { method: "POST" })
  .then((response) => response.json())
  .then((res) => {
    let env = (res.env) ? res.env : "test";
    cb(env);
  })
  .catch((err) => {
    console.log("Err fetching env variable", err);
    cb("test");
  });
};

/**
  *   Fetch and return current base url for Lambda functions
**/
function fetchBaseURL(cb) {
  fetchEnv((env) => cb("https://mey71fma7i.execute-api.us-east-1.amazonaws.com/" + env + "/"));
};

export function getBaseURL(cb) {
  fetchBaseURL((baseURL) => cb(baseURL));
}

export var details = {
  "env": "dev",
  "dev": {
    "lambdaBaseURL": "https://mey71fma7i.execute-api.us-east-1.amazonaws.com/dev/",
    "firebaseCredentials": {
      "apiKey": "AIzaSyAwRj_BiJNEvKJC7GQSm9rv9dF_mjIhuzM",
      "authDomain": "coincast.firebaseapp.com",
      "databaseURL": "https://coincast.firebaseio.com",
      "storageBucket": "firebase-coincast.appspot.com"
    },
    "codePushKey": "ZDStxBd3TrIdUmZard0_CS0jZsuSN1-bdfOMf"
  },
  "test": {
    "lambdaBaseURL": "https://mey71fma7i.execute-api.us-east-1.amazonaws.com/test/",
    "firebaseCredentials": {
      "apiKey": "AIzaSyBf1KgcEUMpxoMyrfOWtcED0vtNydGtiU4",
      "authDomain": "payper-test.firebaseapp.com",
      "databaseURL": "https://payper-test.firebaseio.com",
      "storageBucket": "payper-test.appspot.com"
    },
    "codePushKey": "PhfwCJMZe1YxTjQq6ALKcf0XXO96VkksGQK3-"
  },
  "prod": {
    "lambdaBaseURL": "https://mey71fma7i.execute-api.us-east-1.amazonaws.com/prod/",
    "firebaseCredentials": {
      "apiKey": "AIzaSyDXhfkB6gaKnhhRQafbKdn619JWzyepDkw",
      "authDomain": "payper-prod.firebaseapp.com",
      "databaseURL": "https://payper-prod.firebaseio.com",
      "storageBucket": "payper-prod.appspot.com"
    },
    "codePushKey": "K_ZdLkFh_YZfn4maYSWLojqlsjD3N1-bdfOMf"
  }
};
