import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function EditProfil({ user, onCancel, onUpdated }) {
    const [formData, setFormData] = useState({
        firstname: user.firstname || '',
        lastname: user.lastname || '',
        email: user.email || '',
        phone: user.phone || '',
        where: user.where || '',
        age: user.age || '',
    })
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setError(null)
        try {
            const response = await fetch(
                `http://localhost:3000/admin/edit-profil/${user._id}`,
                {
                    method: 'PATCH',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                }
            )
            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    navigate('/login')
                    return
                }
                throw new Error('Échec de la mise à jour')
            }
            const data = await response.json()
            onUpdated(data.user)
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <form onSubmit={handleSubmit} style={{ border: '1px solid #ccc', padding: '10px' }}>
            <label>
                Prénom
                <input name="firstname" value={formData.firstname} onChange={handleChange} className='border'/>
            </label>
            <label>
                Nom
                <input name="lastname" value={formData.lastname} onChange={handleChange} className='border'/>
            </label>
            <label>
                Email
                <input name="email" type="email" value={formData.email} onChange={handleChange} className='border'/>
            </label>
            <label>
                Téléphone
                <input name="phone" value={formData.phone} onChange={handleChange} className='border'/>
            </label>
            <label>
                Lieu
                <input name="where" value={formData.where} onChange={handleChange} className='border'/>
            </label>
            <label>
                Âge
                <input name="age" type="number" value={formData.age} onChange={handleChange} className='border'/>
            </label>
            

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <button type="submit" className='border'>Enregistrer</button>
            <button type="button" onClick={onCancel} className='border ml-2'>Annuler</button>
        </form>
    )
}