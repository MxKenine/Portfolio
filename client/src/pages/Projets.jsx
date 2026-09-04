import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function Projets() {
    const [projets, setProjets] = useState([])
    const [error, setError] = useState(null)

    async function getData() {
        try {
            const response = await fetch(`http://localhost:3000/projets`)
            if (!response.ok) throw new Error('Erreur de chargement des projets')
            const data = await response.json()
            setProjets(data.projets)
        } catch (err) {
            setError(err.message)
        }
    }

    useEffect(() => {
        getData()
    }, [])

    if (error) {
        return <p className="text-center text-red-500 py-20">{error}</p>
    }

    return (
        <div className="min-h-screen bg-white">

            <div className="max-w-5xl mx-auto px-6 py-16">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Projets</h1>
                <p className="text-gray-600 mb-10">Quelques réalisations récentes.</p>

                <div className="grid md:grid-cols-3 gap-6">
                    {projets.map(project => (
                        <Link
                            key={project._id}
                            to={`/projets/${project._id}`}
                            className="group border border-gray-200 rounded-lg overflow-hidden hover:border-emerald-400 transition-colors"
                        >
                            <div className="aspect-video bg-gray-100 overflow-hidden">
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>

                            <div className="p-5">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    {project.title}
                                </h2>

                                {project.tags?.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {project.tags.map((tag, i) => (
                                            <span
                                                key={i}
                                                className="text-xs bg-gray-100 text-gray-700 rounded px-2 py-1"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}