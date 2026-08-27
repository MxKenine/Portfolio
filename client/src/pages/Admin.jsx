import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminSideNav from '../components/Sidenav'

export default function Admin() {
    const [users, setUsers] = useState([])
    const navigate = useNavigate()
    async function getAdminData() {
        try {
            const response = await fetch('http://localhost:3000/admin', {
                method: 'GET',
                credentials: "include"
            })
            if (!response.ok) {
                throw new Error('Accès refusé')
            }
            const data = await response.json()
            console.log(data) 
            setUsers(data.users)

        } catch (err) {
            console.log(err)
            navigate('/login')
        }
    }
    useEffect(() => {
        getAdminData()
    }, [])
    
    return (
        <>
            <div>Vous êtes administrateur</div>
            {users.map(user => <h2 key={user._id}>{user.email}</h2>)}
        </>
    )
}