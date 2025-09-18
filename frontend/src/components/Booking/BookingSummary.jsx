import React from 'react';

const PassengerForm = ({ passengers, onChange, errors = {} }) => {
  const handlePassengerChange = (index, field, value) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index][field] = value;
    onChange(updatedPassengers);
  };

  const addPassenger = () => {
    onChange([
      ...passengers,
      {
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        passportNumber: '',
        nationality: ''
      }
    ]);
  };

  const removePassenger = (index) => {
    if (passengers.length > 1) {
      const updatedPassengers = passengers.filter((_, i) => i !== index);
      onChange(updatedPassengers);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Passenger Details</h3>
      
      {passengers.map((passenger, index) => (
        <div key={index} className="mb-6 p-4 border rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium">Passenger {index + 1}</h4>
            {passengers.length > 1 && (
              <button
                type="button"
                onClick={() => removePassenger(index)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Remove
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name *
              </label>
              <input
                type="text"
                value={passenger.firstName}
                onChange={(e) => handlePassengerChange(index, 'firstName', e.target.value)}
                className={`w-full px-3 py-2 border ${
                  errors[`passengers[${index}].firstName`] ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                required
              />
              {errors[`passengers[${index}].firstName`] && (
                <p className="mt-1 text-sm text-red-600">{errors[`passengers[${index}].firstName`]}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name *
              </label>
              <input
                type="text"
                value={passenger.lastName}
                onChange={(e) => handlePassengerChange(index, 'lastName', e.target.value)}
                className={`w-full px-3 py-2 border ${
                  errors[`passengers[${index}].lastName`] ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                required
              />
              {errors[`passengers[${index}].lastName`] && (
                <p className="mt-1 text-sm text-red-600">{errors[`passengers[${index}].lastName`]}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth *
              </label>
              <input
                type="date"
                value={passenger.dateOfBirth}
                onChange={(e) => handlePassengerChange(index, 'dateOfBirth', e.target.value)}
                className={`w-full px-3 py-2 border ${
                  errors[`passengers[${index}].dateOfBirth`] ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                required
              />
              {errors[`passengers[${index}].dateOfBirth`] && (
                <p className="mt-1 text-sm text-red-600">{errors[`passengers[${index}].dateOfBirth`]}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                value={passenger.gender}
                onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Passport Number
              </label>
              <input
                type="text"
                value={passenger.passportNumber}
                onChange={(e) => handlePassengerChange(index, 'passportNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Optional for domestic flights"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nationality
              </label>
              <input
                type="text"
                value={passenger.nationality}
                onChange={(e) => handlePassengerChange(index, 'nationality', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Optional for domestic flights"
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addPassenger}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        + Add Passenger
      </button>
    </div>
  );
};

export default PassengerForm;