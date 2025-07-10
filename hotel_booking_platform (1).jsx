/* (Les autres imports restent inchangés) */
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const hotels = [
  { id: 1, name: "Hôtel Borama Palace" },
  { id: 2, name: "Ethiopian Grand Hotel" },
];

const roomTypes = [
  { id: "standard", label: "Standard", pricePerNight: 50 },
  { id: "deluxe", label: "Deluxe", pricePerNight: 80 },
  { id: "suite", label: "Suite", pricePerNight: 120 },
];

const hotelMenus = [
  { hotelId: 1, items: ["Poisson grillé", "Riz parfumé", "Jus naturel"] },
  { hotelId: 2, items: ["Injera", "Poulet épicé", "Café éthiopien"] },
];

const BookingPlatform = ({ language = "fr" }) => {
  const [tourReservations, setTourReservations] = useState([]);
  const [hotelId, setHotelId] = useState("");
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [roomTypeId, setRoomTypeId] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [confirmation, setConfirmation] = useState(null);

  // Ajout dynamique de menus
  const [menus, setMenus] = useState(hotelMenus);
  const [newMenuItem, setNewMenuItem] = useState("");
  const [selectedHotelForMenu, setSelectedHotelForMenu] = useState(hotels[0]?.id || 1);

  const addMenuItem = () => {
    if (!newMenuItem) return;
    setMenus((prev) =>
      prev.map((menu) =>
        menu.hotelId === selectedHotelForMenu
          ? { ...menu, items: [...menu.items, newMenuItem] }
          : menu
      )
    );
    setNewMenuItem("");
  };

  useEffect(() => {
    setTourReservations([
      {
        location: "Cascade de Borrama",
        coordinates: { lat: 9.933, lng: 43.183 },
        guide: "Ali Hassan",
        date: "2025-08-15",
      },
      {
        location: "Montagne de Borrama",
        coordinates: { lat: 9.955, lng: 43.2 },
        guide: "Mariam Ahmed",
        date: "2025-08-20",
      },
    ]);
  }, []);

  useEffect(() => {
    if (!checkIn || !checkOut || !roomTypeId) {
      setTotalPrice(0);
      return;
    }
    const diffTime = checkOut - checkIn;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) {
      setTotalPrice(0);
      return;
    }
    const room = roomTypes.find((r) => r.id === roomTypeId);
    setTotalPrice(diffDays * room.pricePerNight);
  }, [checkIn, checkOut, roomTypeId]);

  const handleReserve = () => {
    if (!hotelId || !checkIn || !checkOut || !roomTypeId) {
      alert("Veuillez remplir tous les champs.");
      return;
    }
    setConfirmation({
      hotel: hotels.find((h) => h.id === parseInt(hotelId)).name,
      checkIn: checkIn.toDateString(),
      checkOut: checkOut.toDateString(),
      room: roomTypes.find((r) => r.id === roomTypeId).label,
      totalPrice,
    });
  };

  return (
    <div>
      {/* Barre de navigation + sections précédentes... */}

      {/* Ajout d'un menu personnalisé */}
      <div className="bg-white p-4 shadow rounded" id="ajout-menu">
        <h3 className="text-lg font-semibold mb-2">Ajouter un nouveau menu</h3>
        <div className="flex flex-col md:flex-row gap-2 items-center">
          <select
            className="border rounded p-2"
            value={selectedHotelForMenu}
            onChange={(e) => setSelectedHotelForMenu(parseInt(e.target.value))}
          >
            {hotels.map((hotel) => (
              <option key={hotel.id} value={hotel.id}>
                {hotel.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Nouveau plat"
            value={newMenuItem}
            onChange={(e) => setNewMenuItem(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <Button onClick={addMenuItem} className="flex items-center gap-1">
            <Plus size={16} /> Ajouter
          </Button>
        </div>
      </div>

      {/* Menus mis à jour */}
      <div id="menus" className="bg-white p-6 rounded shadow mt-6">
        <h3 className="text-xl font-bold mb-4">Menus de l'hôtel</h3>
        {menus.map((menu, idx) => (
          <div key={idx} className="mb-4">
            <h4 className="font-semibold">
              {hotels.find((h) => h.id === menu.hotelId)?.name}
            </h4>
            <ul className="list-disc list-inside">
              {menu.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingPlatform;
