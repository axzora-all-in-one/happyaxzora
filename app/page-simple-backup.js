export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          HappyAxzora - AI Tools Discovery Platform
        </h1>
        <p className="text-center text-gray-600 mb-8">
          The platform is loading. Please wait while we set up the complete interface.
        </p>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    </div>
  )
}