"use client";

import React, { useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  DocumentData,
} from "firebase/firestore";
import { db } from "@/firebase";
 
type Service = {
  id?: string;
  name: string;
  rating: number;
  category: string;
  location: string;
  services: string[];
};

const serviceData: Service = {
  name: "Auto Masters Lahore",
  rating: 5.0,
  category: "Vehicle Maintenance & Performance Tuning",
  location: "DHA Phase 5, Lahore",
  services: ["Tuning", "Diagnostics", "Repairs"],
};

export default function Page() {
  const [loading, setLoading] = useState<boolean>(false);
  const [services, setServices] = useState<Service[]>([]);

  // ✅ SAVE SERVICE
  const saveService = async () => {
    try {
      setLoading(true);

      const docRef = await addDoc(
        collection(db, "services"),
        serviceData
      );

      console.log("Saved ID:", docRef.id);
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ GET SERVICES
  const fetchServices = async () => {
    try {
      setLoading(true);

      const snapshot = await getDocs(collection(db, "services"));

      const data: Service[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Service, "id">),
      }));

      setServices(data);

      console.log("Fetched:", data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <button onClick={saveService} disabled={loading}>
        Save Service
      </button>

      <button onClick={fetchServices} disabled={loading} style={{ marginLeft: 10 }}>
        Get Services
      </button>

      {/* LIST */}
      <div style={{ marginTop: 20 }}>
        {services.map((item) => (
          <div key={item.id} style={{ border: "1px solid #ddd", padding: 10, marginBottom: 10 }}>
            <h3>{item.name}</h3>
            <p>{item.category}</p>
            <p>{item.location}</p>
            <p>Rating: {item.rating}</p>

            <ul>
              {item.services.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}