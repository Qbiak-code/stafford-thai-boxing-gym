const awsExports = {
  Auth: {
    Cognito: {
      userPoolId: "eu-west-2_gHiZRG2su",
      userPoolClientId: "7tgu94do5l4ddg9ktv8ntch9in",
      loginWith: {
        email: true
      }
    }
  },
  API: {
    REST: {
      memberProfile: {
        endpoint: "https://pwmgsvulp3.execute-api.eu-west-2.amazonaws.com/dev/profile",
        region: "eu-west-2"
      }
    }
  }
};

export default awsExports;
