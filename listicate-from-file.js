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

client.get("lists/list", onGetListsCompleted);

function onGetListsCompleted(error, data, response) {
  if (!data.some(el => el.name.toLowerCase() == args.listName.toLowerCase())) {
    console.log(`>>>>> Creating list ${args.listName}...`);
    client.post(
      "lists/create",
      { name: args.listName, mode: "public" },
      onCreateListCompleted
    );
  } else {
    throw `List ${args.listName} already exists`;
  }
}

function onCreateListCompleted(error, data, response) {
  console.log(">>>>> List creation completed...");
  if (error) {
    console.error(`Error: ${error.toString()}`);
    return;
  }

  loadList(data);
}

function loadList(list) {
  console.log(list);
  console.log(">>>>> Preparing handles...");

  let handles = [];

  linereader.eachLine(`./${fileName}`, (line, isLast) => {
    handles.push(
      line
        .split("https://twitter.com/")
        .pop()
        .trim()
    );

    if (isLast) {
      console.log(handles.join(", "));

      console.log(">>>>> Loading list...");

      client.post(
        "lists/members/create_all",
        { list_id: list.id_str, screen_name: handles.join(",") },
        (e, d, r) => {
          if (e) console.error(JSON.stringify(e));
          else console.log("ok!");
        }
      );
    }
  });
}
