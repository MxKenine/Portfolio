import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import EditProfil from './Editprofil'
import EditCv from './EditCV'

export default function Admin() {
    const [users, setUsers] = useState([])
    const [editingId, setEditingId] = useState(null)
    const [editingCvUserId, setEditingCvUserId] = useState(null)
    const [cvData, setCvData] = useState(null)
    const [cvLoading, setCvLoading] = useState(false)
    const navigate = useNavigate()

    async function getAdminData() {
        try {
            const response = await fetch(`http://localhost:3000/admin`, {
                method: 'GET',
                credentials: "include"
            })
            if (!response.ok) {
                throw new Error('Accès refusé')
            }
            const data = await response.json()
            setUsers(data.users)
        } catch (err) {
            console.log(err)
            navigate('/login')
        }
    }

    useEffect(() => {
        getAdminData()
    }, [])

    function startEdit(user) {
        setEditingId(user._id)
    }

    function cancelEdit() {
        setEditingId(null)
    }

    async function deleteUser(userId) {
        if (!window.confirm("Confirmer la suppression de cet utilisateur ?")) return
        try {
            const response = await fetch(`http://localhost:3000/admin/users/${userId}`, {
                method: 'DELETE',
                credentials: "include"
            })
            if (!response.ok) throw new Error('Échec de la suppression')

            setUsers(users.filter(u => u._id !== userId))
        } catch (err) {
            console.log(err)
        }
    }

    async function startEditCv(userId) {
        setEditingCvUserId(userId)
        setCvLoading(true)
        setCvData(null)
        try {
            const response = await fetch(`http://localhost:3000/cv/${userId}`, {
                method: 'GET',
                credentials: "include"
            })
            if (response.status === 404) {
                // Pas encore de CV pour cet utilisateur : on ouvre un formulaire vide
                setCvData(null)
            } else if (!response.ok) {
                throw new Error('Échec de récupération du CV')
            } else {
                const data = await response.json()
                setCvData(data.cv)
            }
        } catch (err) {
            console.log(err)
            setEditingCvUserId(null)
        } finally {
            setCvLoading(false)
        }
    }

    function cancelEditCv() {
        setEditingCvUserId(null)
        setCvData(null)
    }


    return (
        <>
            <div>Vous êtes administrateur</div>

            {users.map(user => (
                <div key={user._id} style={{ border: '1px solid #ddd', padding: '10px', margin: '8px 0' }}>
                    {editingId === user._id ? (
                        <EditProfil
                            user={user}
                            onCancel={cancelEdit}
                            onUpdated={(updatedUser) => {
                                setUsers(users.map(u => u._id === updatedUser._id ? updatedUser : u))
                                setEditingId(null)
                            }}
                        />
                    ) : (
                        <>
                            <p>Prénom : {user.firstname || "Non renseigné"}</p>
                            <p>Nom : {user.lastname || "Non renseigné"}</p>
                            <p>Email : {user.email}</p>
                            <p>Téléphone : {user.phone || "Non renseigné"}</p>
                            <p>Lieux : {user.where || "Non renseigné"}</p>
                            <p>Avatar : {user.avatar || "Non renseigné"}</p>
                            <div className='space-x-4'>
                            <button onClick={() => startEdit(user)} className='border'>Modifier</button>
                            <button onClick={() => deleteUser(user._id)} className='border'>Supprimer</button>
                            <button onClick={() => startEditCv(user._id)} className='border'>Modifier le CV</button>
                            </div>
                        </>
                    )}
                    {editingCvUserId === user._id && (
                        cvLoading ? (
                            <p>Chargement du CV...</p>
                        ) : (
                            <EditCv
                                cv={cvData}
                                userId={user._id}
                                onCancel={cancelEditCv}
                                onUpdated={(updatedCv) => {
                                    setCvData(updatedCv)
                                    setEditingCvUserId(null)
                                }}
                            />
                        )
                    )}
                </div>
            ))}
        </>
    )
}