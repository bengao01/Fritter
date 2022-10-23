/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

 function getFollowers(fields) {
    fetch(`/api/follow/followers?followee=${fields.followee}`)
      .then(showResponse)
      .catch(showResponse);
  }

  function getFollowing(fields) {
    fetch(`/api/follow/following?user=${fields.user}`)
      .then(showResponse)
      .catch(showResponse);
  }
  
  function addFollow(fields) {
    fetch(`/api/follow`, {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
      .then(showResponse)
      .catch(showResponse);
  }

  function getFeed(fields) {
    fetch(`/api/follow/feed?user=${fields.user}`)
      .then(showResponse)
      .catch(showResponse);
  }
  
  function deleteFollow(fields) {
    fetch(`/api/follow?follower=${fields.follower}&followee=${fields.followee}`, {method: 'DELETE'})
      .then(showResponse)
      .catch(showResponse);
  }
  