import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Admin() {
    const [users, setUsers] = useState([])
    const navigate = useNavigate()
    async function getAdminData() {
        try {
            const response = await fetch('${BACK_URL}/admin', {
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
            {users.map(user =>
            <div key={user._id}>
            <p>Prénom : {user.firstname || "Non renseigné"}</p>
            <p>Nom : {user.lastname || "Non renseigné"}</p>
            <p>Email : {user.email}</p>
            <p>Téléphone : {user.phone || "Non renseigné"}</p>
            <p>Lieux : {user.where || "Non renseigné"}</p>
            <p>Avatar : {user.avatar || "Non renseigné"}</p>
            </div>
            )}
        </>
    )
}