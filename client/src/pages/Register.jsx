import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Register() {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [role, setRole] = useState("")
    const [image, setImage] = useState(null)

    async function handleSubmit(e) {
        e.preventDefault()
        try {
            const formData = new FormData()
            formData.append('username', username)
            formData.append('email', email)
            formData.append('password', password)
            formData.append('role', role)
            formData.append('image', image)

            const response = await fetch('http://localhost:3000/register', {
                method: 'POST',
                // headers: {
                //     'Content-Type': 'application/json'
                // },
                body: formData,
                // credentials: 'include'
            })
            if (!response.ok) {
                throw new Error("Erreur lors de l'inscription")
            }
            const data = await response.json()
            console.log(data)
        } catch (err) {
            console.log(err)
        }
    }
    return (
        <main>
            <div className="h-screen justify-center items-center flex">
            <form
            onSubmit={handleSubmit}
            className="w-150 p-5 flex flex-col gap-5 bg-emerald-800">
                <input
                type="text"
                placeholder='Username...'
                onChange={(e) => setUsername(e.target.value)} />
                <input
                type="email"
                placeholder='Email...'
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input input-accent w-full"/>
                <input
                type="Password"
                placeholder='Password...'
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input input-accent w-full"/>
                <select
                name="" id=""
                onChange={(e) => setRole(e.target.value)}>
                    <option defaultValue={""}>Choisir un rôle...</option>
                    <option value="user">Utilisateur</option>
                    <option value="admin">Administrateur</option>
                </select>
                <input
                type="file" accept="image/*"
                onChange={(e) => setImage(e.target.files[0])} />
                <button
                className="bg-emerald-950 flex justify-center p-2 hover:cursor-pointer"
                >S'inscrire</button>
                <Link to='/login'>Se connecter</Link>
            </form>
                </div>
        </main>
    )
}