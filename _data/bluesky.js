// Reference

// Get record call. Need OP's DID/handle, Post ID, and CID
// https://bsky.social/xrpc/com.atproto.repo.getRecord
//      ?repo=<did>&collection=app.bsky.feed.post
//      &rkey=<post id, found at end of link>&cid=<cid>

// Get Profile. Need profile DID/handle
// Does NOT include bio, avatar, etc. Need to do a getRecord call for that
// https://bsky.social/xrpc/com.atproto.repo.describeRepo
//      ?repo=<did>

// Get profile details. Need profile DID/handle
// https://bsky.social/xrpc/com.atproto.repo.getRecord
//      ?repo=<did>&collection=app.bsky.actor.profile
//      &rkey=self

// Get blob [image]. Need DID/handle and CID
// https://bsky.social/xrpc/com.atproto.sync.getBlob
//      ?did=<did>
//      &cid=<cid>

const BS_APIROOT = "https://bsky.social/xrpc/";
const listRecords = "com.atproto.repo.listRecords";
const getRecord = "com.atproto.repo.getRecord";
const describeRepo = "com.atproto.repo.describeRepo";
const getBlob = "com.atproto.sync.getBlob";

module.exports = async function(){
    const postUrl = `${BS_APIROOT}${listRecords}?repo=cascading.space&collection=app.bsky.feed.post`;
    const likesUrl = `${BS_APIROOT}${listRecords}?repo=cascading.space&collection=app.bsky.feed.like`;
    
    try {
        const postsResponse = await fetch(postUrl);
        const likesResponse = await fetch(likesUrl);
        if (postsResponse.ok && likesResponse.ok) {
            const postsFeed = await postsResponse.json();
            const likesFeed = await likesResponse.json();

            let likesByID = [];
            likesFeed.records.forEach(unit => {
                var uriFragments = unit.value.subject.uri.split("/");
                likesByID.push({
                    cid: unit.cid,
                    did: uriFragments[2],
                    rkey: uriFragments[4],
                    timeLiked: unit.value.createdAt
                });
            });

            // console.log("Likes:");
            // console.log(likesByID);



            return {
                likes: likesByID
            };
        }
    } catch (err) {
        console.error(err);
        return null;
    }
}