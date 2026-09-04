import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import Navbar from '../components/Navbar'

export default function ProjetDetail() {
    const { projetId } = useParams()
    const [projet, setProjet] = useState(null)
    const [error, setError] = useState(null)

    async function getData() {
        try {
            const response = await fetch(`http://localhost:3000/projets/${projetId}`)
            if (!response.ok) throw new Error('Projet introuvable')
            const data = await response.json()
            setProjet(data.projet)
        } catch (err) {
            setError(err.message)
        }
    }

    useEffect(() => {
        getData()
    }, [projetId])

    if (error) {
        return <p className="text-center text-red-500 py-20">{error}</p>
    }

    if (!projet) {
        return <p className="text-center text-gray-500 py-20">Chargement...</p>
    }

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <div className="max-w-3xl mx-auto px-6 py-16">
                <Link
                    to="/projets"
                    className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 mb-8"
                >
                    <ArrowLeft size={16} /> Retour aux projets
                </Link>

                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-8">
                    <img
                        src={projet.image}
                        alt={projet.title}
                        className="w-full h-full object-cover"
                    />
                </div>

                <h1 className="text-3xl font-bold text-gray-900">{projet.title}</h1>

                {projet.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                        {projet.tags.map((tag, i) => (
                            <span
                                key={i}
                                className="text-xs bg-gray-100 text-gray-700 rounded px-2 py-1"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                <p className="mt-6 text-gray-700 leading-relaxed whitespace-pre-line">
                    {projet.description}
                </p>

                {projet.link && (
                    <a
                        href={projet.link}
                        target="_blank"
                        rel="noreferrer"
                        className="btn bg-emerald-500 hover:bg-emerald-600 text-white border-none mt-8"
                    >
                        Voir le projet <ExternalLink size={16} />
                    </a>
                )}
            </div>
        </div>
    )
}