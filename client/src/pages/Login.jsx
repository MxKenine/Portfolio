import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const BASE_URL = "http://localhost:3000/login";

export default function Login() {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()
        setError("")
        setLoading(true)
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
                throw new Error('Identifiants incorrects')
            }
            const data = await response.json()
            console.log(data)
            if (data.role === 'admin') {
                navigate('/admin')
            } else {
                navigate('/accueil')
            }
            } catch (err) {
                setError(err.message || "Une erreur est survenue")
            } finally {
                setLoading(false)
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

                {error && (
                <p className="text-red-300 text-sm">{error}</p>
                )}

                <button
                disabled={loading}
                className="bg-emerald-950 flex justify-center p-2 hover:cursor-pointer disabled:opacity-50"
                >
                {loading ? "Connexion..." : "Connexion"}
                </button>

                <Link
                to='/register'
                className="bg-emerald-950 flex justify-center p-2 hover:cursor-pointer"
                >
                Inscription
                </Link>

            </form>

            </div>
            
        </main>
    )
}