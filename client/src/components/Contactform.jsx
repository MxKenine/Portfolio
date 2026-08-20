import React from 'react'

export default function Contactform() {
  return (
      <div className="h-screen justify-center items-center flex">
    <form
    className="w-150 p-5 flex flex-col gap-5 bg-emerald-800">
    <h1 className='flex justify-center'>Contact</h1>
      <input
      type='email'
      placeholder='Email'
      className="input input-accent w-full">
      </input>
      <input
      type='text'
      placeholder='Objet'
      className="input input-accent w-full">
      </input>
      <input
      type='text'
      placeholder='Entrez votre message ici...'
      className="input input-accent w-full">
      </input>
      <button
      className="bg-emerald-950 flex justify-center p-2 hover:cursor-pointer"
      >Pièce-jointe</button>
      <button
      className="bg-emerald-950 flex justify-center p-2 hover:cursor-pointer"
      >Envoyer</button>
    </form>
      </div>
  )
}
