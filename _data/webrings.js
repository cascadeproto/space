// Webring schema:
// "webrings": Array [
//   Object: {
//     "name": "String: Name of webring",
//     "mainpath": "String: URL of main webring page",
//     "prevpath": "String: URL to previous site in webring",
//     "nextpath": "String: URL to next site in webring",
//     "note": "String: HTML to include alongside the webring when rendered"
//   }
// ]

module.exports = async function(){
  // Start with static ones
  let webrings = [
    {
      name: "IndieWeb Webring",
      mainpath: "https://xn--sr8hvo.ws",
      prevpath: "https://xn--sr8hvo.ws/previous",
      nextpath: "https://xn--sr8hvo.ws/next",
      note: ""
    },
    {
      name: "Fediring",
      mainpath: "https://fediring.net",
      prevpath: "https://fediring.net/previous?host=cascading.space",
      nextpath: "https://fediring.net/next?host=cascading.space",
      note: ""
    },
    {
      name: "no ai webring",
      mainpath: "https://baccyflap.com/noai",
      prevpath: "https://baccyflap.com/noai/?prv&s=cas",
      nextpath: "https://baccyflap.com/noai/?nxt&s=cas",
      note: "<a href=\"/ai\">(?)</a>"
    },
    {
      name: "bucket webring!",
      mainpath: "https://webring.bucketfish.me",
      prevpath: "https://webring.bucketfish.me/redirect.html?to=prev&name=cascading.space",
      nextpath: "https://webring.bucketfish.me/redirect.html?to=next&name=cascading.space",
      note: ""
    },
    {
      name: "Furryring",
      mainpath: "https://keithhacks.cyou/furryring.php",
      prevpath: "https://keithhacks.cyou/furryring.php?prev=cascading.space",
      nextpath: "https://keithhacks.cyou/furryring.php?next=cascading.space",
      note: ""
    }
  ];

  // Then build dynamic ones
  const crittersURL = 'https://critterweb.net/api/rings/critters.json';

  try {

    // Internet Critters Webring (different if-statements for each new ring)
    const crittersResponse = await fetch(crittersURL);
    if (crittersResponse.ok) {
      const critters = await crittersResponse.json();
      const myCritterIndex = critters.members.findIndex(o => o.name === "Cascade");
      const prevCritterIndex = myCritterIndex ? myCritterIndex - 1 : critters.members.length - 1;
      const nextCritterIndex = critters.members[myCritterIndex + 1] ? myCritterIndex + 1 : 0;

      let critterRing = {
        name: "Internet Critters Webring",
        mainpath: "https://critterweb.net/rings/critters",
        prevpath: critters.members[prevCritterIndex].link,
        nextpath: critters.members[nextCritterIndex].link,
        note: ""
      };

      webrings.push(critterRing);
    }

    // After all webrings are built
    return webrings;

  } catch (err) {
    console.error(err);
    return webrings;
  }
}