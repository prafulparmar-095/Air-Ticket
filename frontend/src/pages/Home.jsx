// frontend/src/pages/Home.jsx
import FlightSearch from '../components/FlightSearch';

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Book Your Flight</h1>
        <p className="text-xl text-gray-600">Find the best deals on flights to your favorite destinations</p>
      </div>
      
      <FlightSearch />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔍</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">Search</h3>
          <p className="text-gray-600">Find flights that match your travel plans</p>
        </div>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🎫</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">Book</h3>
          <p className="text-gray-600">Reserve your seats with easy booking process</p>
        </div>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">✈️</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">Fly</h3>
          <p className="text-gray-600">Enjoy your journey with comfortable flights</p>
        </div>
      </div>
    </div>
  );
};

export default Home;