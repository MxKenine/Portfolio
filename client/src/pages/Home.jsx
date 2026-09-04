import React from 'react'

export default function HomeHero() {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <main className="flex-1 px-6 md:px-12 py-20">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">

                    {/* Colonne texte */}
                    <div>
                        <span className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-4 py-1.5 text-sm text-gray-700">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            Disponible pour de nouvelles opportunités
                        </span>

                        <h1 className="mt-6 text-4xl font-bold text-gray-900">
                            Quentin DUPREY
                        </h1>

                        <p className="mt-4 text-2xl text-gray-800 leading-snug">
                            Développeur Full Stack |<br />Web et Web Mobile
                        </p>

                        <p className="mt-6 text-gray-600 leading-relaxed max-w-md">
                            En formation de Développeur Web/Web Mobile, avec pour objectif
                            d'évoluer vers la Conception d'Applications. Passionné par
                            l'innovation et la créativité, je souhaite concevoir des outils
                            ergonomiques et intelligents, accessibles aux entreprises comme
                            aux particuliers, pour s'adapter à un monde en constante évolution.
                        </p>

                        <div className="mt-8 flex gap-4">
                            <a href="/projets" className="btn bg-emerald-500 hover:bg-emerald-600 text-white border-none">
                                Voir mes projets
                            </a>
                            <a href="/contact" className="btn bg-emerald-500 hover:bg-emerald-600 text-white border-none">
                                Contactez-moi
                            </a>
                        </div>
                    </div>

                    {/* Colonne avatar */}
                    <div className="flex justify-center md:justify-end">
                        <img
                            src="/avatar.jpg"
                            alt="Quentin Duprey"
                            className="w-72 h-72 rounded-full object-cover"
                        />
                    </div>
                </div>
                
            </main>
        </div>
    )
}