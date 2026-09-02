import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [role, setRole] = useState("user")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()
        setError("")
        setLoading(true)
        try {
            const response = await fetch('${BACK_URL}/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password, role}),
                credentials: 'include'
            })
            if (!response.ok) {
                throw new Error("Erreur lors de l'inscription")
            }
            const data = await response.json()
            console.log(data)
            navigate('/login')
        } catch (err) {
            console.log(err)
            setError(err.message || "Une erreur es survenue")
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
                    placeholder='Email...'
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="input input-accent w-full"/>

                <input
                    type="password"
                    placeholder='Password...'
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="input input-accent w-full"/>

                <button
                className="bg-emerald-950 flex justify-center p-2 hover:cursor-pointer">
                S'inscrire
                </button>

            </form>
            </div>
        </main>
    )
}