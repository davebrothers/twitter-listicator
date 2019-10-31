import Twitter, { Callback } from "twitter";
import minimist from "minimist";
import * as lineReader from "line-reader";

const args: minimist.ParsedArgs = minimist(process.argv.slice(2));
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

const client: Twitter = new Twitter({
  consumer_key: args.consumerKey,
  consumer_secret: args.consumerSecret,
  access_token_key: args.accessTokenKey,
  access_token_secret: args.accessTokenSecret
});

const onGetListsCompleted: Callback = function(error, data, response) {
  if (
    !data.some(
      (el: any) => el.name.toLowerCase() == args.listName.toLowerCase()
    )
  ) {
    console.log(`>>>>> Creating list ${args.listName}...`);
    client.post(
      "lists/create",
      { name: args.listName, mode: "public" },
      onCreateListCompleted
    );
  } else {
    throw `List ${args.listName} already exists`;
  }
};

const onCreateListCompleted: Callback = function(error, data, response) {
  console.log(">>>>> List creation completed...");
  if (error) {
    console.error(`Error: ${error.toString()}`);
    return;
  }

  loadList(data);
};

const loadList = function(list: any) {
  console.log(list);
  console.log(">>>>> Preparing handles...");

  let handles: Array<any> = [];

  lineReader.eachLine(`./${fileName}`, (line: string, isLast: boolean | undefined) => {
    handles.push(
      line
        .trim()
        .split("https://twitter.com/")
        .pop()
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

client.get("lists/list", onGetListsCompleted);