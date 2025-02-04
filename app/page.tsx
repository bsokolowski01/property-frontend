"use client"

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { Property } from "../types/types";

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortOption, setSortOption] = useState("price-asc");

  const api = process.env.NEXT_PUBLIC_API_URL;

  console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);

  useEffect(() => {
    if (!api) return;
    
    fetch(api, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: "{ properties { id address rooms status type rent price } }" }),
    })
      .then((res) => res.json())
      .then((data) => setProperties(data.data.properties));
  }, [api]);

  const filteredProperties = properties.filter((property) =>
    property.address.toLowerCase().includes(search.toLowerCase()) &&
    (filterType === "all" || property.type === filterType)
  );

  const sortedProperties = [...filteredProperties].sort((a, b) => {
    if (sortOption === "price-asc") {
      return (a.price || a.rent || 0) - (b.price || b.rent || 0);
    } else if (sortOption === "price-desc") {
      return (b.price || b.rent || 0) - (a.price || a.rent || 0);
    } else if (sortOption === "rooms-asc") {
      return a.rooms - b.rooms;
    } else if (sortOption === "rooms-desc") {
      return b.rooms - a.rooms;
    }
    return 0;
  });

  return (
    <div className="p-10">
      <div className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Search by address..."
          className="p-2 border rounded-lg w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="p-2 border rounded-lg"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="apartment">Apartment</option>
          <option value="house">House</option>
          <option value="land">Land</option>
        </select>
        <select
          className="p-2 border rounded-lg"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rooms-asc">Rooms: Fewest to Most</option>
          <option value="rooms-desc">Rooms: Most to Fewest</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedProperties.map((property) => (
          <motion.div key={property.id} whileHover={{ scale: 1.05 }}>
            <Card className="p-5 shadow-lg rounded-2xl">
              <CardContent>
                <h2 className="text-xl font-bold">{property.address}</h2>
                <p className="text-sm text-gray-600">{property.rooms} rooms - {property.type}</p>
                <p className="text-lg font-semibold mt-2">{property.status === "for sale" ? property.price : property.rent}</p>
                <Link href={`/property/${property.id}`}>
                  <Button className="mt-4 w-full">View Details</Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
