import React from 'react'
import { useParams } from 'react-router-dom'


export default function UserProfile() {
const { userId } = useParams()
return (
<div className="p-6">
<h1 className="text-2xl font-bold">User Profile</h1>
<p>
Showing profile for user ID: <strong>{userId}</strong>
</p>
</div>
)
}