db.friendsData.aggregate([
  {$addFields:{
    numberOfFriends:{$size:"$friends"}
  }},
  {$match:{
    numberOfFriends:{$gte:3}
  }}
])