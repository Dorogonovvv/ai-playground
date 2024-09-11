'use client';

import { useState, useEffect } from "react";

// Define types for better TypeScript support
interface Company {
  id: number;
  name: string;
  address: {
    countryCode: string;
    city: string;
    address: string;
    zip: string;
  };
}

const companies: Company[] = [
  {
    id: 1,
    name: "Siemens AG",
    address: {
      countryCode: "DE",
      city: "Munich",
      address: "Werner-von-Siemens-Straße 1",
      zip: "80333",
    },
  },
  {
    id: 2,
    name: "Inditex",
    address: {
      countryCode: "ES",
      city: "Arteixo",
      address: "Av. de la Diputación",
      zip: "15143",
    },
  },
  {
    id: 3,
    name: "Galp Energia",
    address: {
      countryCode: "PT",
      city: "Lisbon",
      address: "Rua Tomás da Fonseca",
      zip: "1600-209",
    },
  },
];

export default function Home() {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [deliveryAddress, setDeliveryAddress] = useState({
    countryCode: "",
    city: "",
    address: "",
    zip: "",
  });
  const [distance, setDistance] = useState<number | null>(null); 
  const [loading, setLoading] = useState(false);

  // Ensure all fields are filled for form validation
  const isFormValid =
    selectedCompany !== null &&
    deliveryAddress.countryCode.trim() !== "" &&
    deliveryAddress.city.trim() !== "" &&
    deliveryAddress.address.trim() !== "" &&
    deliveryAddress.zip.trim() !== "";

  const handleCheckDistance = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/check-fraud", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessAddress: selectedCompany!.address,
          deliveryAddress,
        }),
      });
      const data = await response.json();
      const parsedDistance = parseFloat(data.distance); 
      setDistance(parsedDistance);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getDistanceBgColor = () => {
    if (distance !== null) {
      if (distance < 100) return "bg-green-200 text-green-800";
      if (distance >= 100 && distance <= 200) return "bg-orange-200 text-orange-800";
      if (distance > 200) return "bg-red-200 text-red-800";
    }
    return "bg-gray-100 text-black";
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Please select your business company</h1>
      <div className="grid grid-cols-1 gap-4 mb-6">
        {companies.map((company) => (
          <div
            key={company.id}
            className={`p-4 border rounded-lg cursor-pointer transition-colors duration-200 ${
              selectedCompany?.id === company.id
                ? "bg-blue-500 text-white border-blue-600"
                : "bg-gray-100 text-black border-gray-300"
            }`}
            onClick={() => setSelectedCompany(company)}
          >
            <h2 className="text-xl font-semibold">{company.name}</h2>
            <p>{company.address.address}, {company.address.zip}</p>
            <p>{company.address.city}, {company.address.countryCode}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold mb-2">Enter delivery address</h2>
      <div className="mb-4">
        <label className="block mb-1">Country</label>
        <select
          className="w-full p-2 border rounded text-black bg-white"
          value={deliveryAddress.countryCode}
          onChange={(e) =>
            setDeliveryAddress({ ...deliveryAddress, countryCode: e.target.value })
          }
        >
          <option value="">Select Country</option>
          <option value="DE">Germany</option>
          <option value="ES">Spain</option>
          <option value="PT">Portugal</option>
          <option value="FR">France</option>
          <option value="IT">Italy</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-1">City</label>
        <input
          type="text"
          className="w-full p-2 border rounded text-black bg-white"
          value={deliveryAddress.city}
          onChange={(e) => setDeliveryAddress({ ...deliveryAddress, city: e.target.value })}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Address</label>
        <input
          type="text"
          className="w-full p-2 border rounded text-black bg-white"
          value={deliveryAddress.address}
          onChange={(e) => setDeliveryAddress({ ...deliveryAddress, address: e.target.value })}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">ZIP Code</label>
        <input
          type="text"
          className="w-full p-2 border rounded text-black bg-white"
          value={deliveryAddress.zip}
          onChange={(e) => setDeliveryAddress({ ...deliveryAddress, zip: e.target.value })}
        />
      </div>

      <button
        className={`w-full p-2 bg-blue-500 text-white rounded ${
          !isFormValid ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={!isFormValid}
        onClick={handleCheckDistance}
      >
        {loading ? "Checking..." : "Check Distance"}
      </button>

      {/* Informational box for distance interpretation */}
      <div className="mt-6 p-4 border rounded-lg bg-gray-50 text-black">
        <h3 className="font-bold text-lg mb-2">Distance Information:</h3>
        <div className="space-y-2">
          <div className="flex items-center">
            <span className="inline-block w-4 h-4 bg-green-500 rounded-full mr-2"></span>
            <span>Distance &lt; 100km - Green</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-4 h-4 bg-orange-500 rounded-full mr-2"></span>
            <span>Distance 100km - 200km - Orange</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-4 h-4 bg-red-500 rounded-full mr-2"></span>
            <span>Distance &gt; 200km - Red</span>
          </div>
        </div>
      </div>

      {/* Distance Result */}
      {distance !== null && (
        <div className={`mt-4 p-4 border rounded ${getDistanceBgColor()} text-black`}>
          <p className="text-lg font-bold">Distance: {distance} km</p>
        </div>
      )}
    </div>
  );
}