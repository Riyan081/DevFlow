import React from 'react'

const Profile = ({params}:{params:{id:number}}) => {
  return (
    <div>
      <h1>Profile</h1>
      <p>User ID: {params.id}</p>
    </div>
  )
}

export default Profile