import React from 'react'

const HomeBanner = () => {
  return (
    <div className="relative bg-cover bg-center h-72" style={{backgroundImage: "url('https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"}}>
    <div className="absolute inset-0 bg-black opacity-50"></div>
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold mb-4">Welcome to Our Website</h1>
        <p className="text-lg mb-8">Discover amazing things here!</p>
        <form className="w-full max-w-lg mx-auto">
          <div className="flex items-center  border-b-2 border-white py-2">
            <input
              className="appearance-none bg-transparent border-none w-full text-white mr-3 py-1 px-2 leading-tight focus:outline-none"
              type="text"
              placeholder="Search..."
              aria-label="Search"
            />
            <button
              className="flex-shrink-0 bg-white text-black text-sm py-1 px-2 rounded"
              type="button"
            >
              Search
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  )
}

export default HomeBanner