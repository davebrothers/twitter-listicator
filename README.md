# twitter-listicator
Creates a new Twitter list from a list of handle URLs

# Setup

## Handles
Fill src/handles.txt with a list of profile URLs for list members, one per line., e.g.:

```
https://twitter.com/davebrothers
https://twitter.com/another_screen_name
https://twitter.com/some_other_screen_name
```

You can use a different file and pass it via the `--file` param.

## Twitter App
Listicator is configured to use user-based authentication. You will need to go to [developer.twitter.com](https://developer.twitter.com/), set up a Twitter app, and use the credentials for it to authenticate.

Pass the values in the following named parameters:

* `consumerKey`
* `consumerSecret`
* `accessTokenKey`
* `accessTokenSecret`

# Execution

`npm run start -- --consumerKey={{yourConsumerKey}} --consumerSecret={{yourConsumerSecret}} --accessTokenKey={{yourAccessToken}} --accessTokenSecret={{yourAccessTokenSecret}}`
