const Twitter = require("twitter");
const args = require("minimist")(process.argv.slice(2));
const linereader = require("line-reader");

const fileName = args.file || "handles.txt";

if (
  !args.consumerKey ||
  !args.consumerSecret ||
  !args.accessTokenKey ||
  !args.accessTokenSecret
) {
  throw "User-based authentication requires the following: consumerKey, consumerSecret, accessTokenKey, accessTokenSecret";
}

if (!args.listName) {
  throw "Provide a name for the list to be created";
}

var client = new Twitter({
  consumer_key: args.consumerKey,
  consumer_secret: args.consumerSecret,
  access_token_key: args.accessTokenKey,
  access_token_secret: args.accessTokenSecret
});

client.get("lists/list", function(e, t, s) {
  if (!t.some(el => el.name.toLowerCase() == args.listName.toLowerCase())) {
    console.log(`Creating list ${args.listName}...`);
    client.post(
      "lists/create",
      { name: args.listName, mode: "public" },
      (e, t, s) => {
        if (e) {
          console.error(`Error: ${e.toString()}`);
          return;
        }

        loadList(t);
      }
    );
  } else {
    throw `List ${args.listName} already exists`;
  }
});

function loadList(list) {
  let handles = [];

  linereader.eachLine(`./${fileName}`, (line, last) => {
    handles.push(
      line
        .split("https://twitter.com/")
        .pop()
        .trim()
    );

    if (last) {
      console.log(handles.join(","));

      client.post(
        "lists/members/create_all",
        { list_id: list.id, screen_name: handles.join(",") },
        (e, d, r) => {
          if (e) console.error(JSON.stringify(e));
          console.log(r);
        }
      );
    }
  });
}
