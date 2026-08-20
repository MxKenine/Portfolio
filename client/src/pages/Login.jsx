import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const BASE_URL = "http://localhost:3000/login-cookie";
export default function Login() {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    async function handleSubmit(e) {
        e.preventDefault()
        navigate('/dashboard')
        try {
            const response = await fetch(BASE_URL, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password }),
                credentials: "include"
            })
            if (!response.ok) {
                throw new Error('Forbiden')
            }
            const data = await response.json()
            localStorage.setItem('role', data.role)
            localStorage.setItem('image', data.image)
            localStorage.setItem('token', data.token)
            if (data.role === 'admin') {
                navigate('/admin')
            }
            if (data.role === 'user') {
                navigate('/accueil')
            }
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
                type="email"
                placeholder="Email..."
                onChange={(e) => setEmail(e.target.value)}
                className="input input-accent w-full"/>

                <input
                type="password"
                placeholder="Mot de passe..."
                onChange={(e) => setPassword(e.target.value)}
                className="input input-accent w-full"/>

                <button
                className="bg-emerald-950 flex justify-center p-2 hover:cursor-pointer">
                Connexion
                </button>

                <Link
                to='/register'
                className="bg-emerald-950 flex justify-center p-2 hover:cursor-pointer">
                Inscription
                </Link>

            </form>

            </div>
            
        </main>
    )
}