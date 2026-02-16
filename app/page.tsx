"use client";

import getFirebaseToken from "@/ulity/getFirebaseToken";

function home() {
  async function handleSubmit() {
    const url = "https://onboard-fr7tieqywq-uc.a.run.app";

    const data = {
      onBoardType: "marketplace",
      storeTitle: "Tedfsdfsst Store",
      email: "teststore@example.com",
      contactNumber: "+123456789",
      address: "123 Test Street",
      selectCategory: ["electronics", "gadgets"],
      overview: "A dummy store for testing the onboarding API.",
      location: {
        province: "Test Province",
        city: "Test City",
        area: "Test Area",
      },
      completed: false,
      whatsappNumber: "+123456789",
      contactMethod: "email",
      websiteLink: "https://example.com",
      facebook: "https://facebook.com/teststore",
      instagram: "https://instagram.com/teststore",
      tiktok: "https://tiktok.com/@teststore",
    };

    try {
      // Get Firebase authentication token
      const { token } = await getFirebaseToken();

      if (!token) {
        alert("Please sign in first!");
        return;
      }

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      console.log("Response:", result);
      alert("Submitted! Check console for response.");
    } catch (err) {
      console.error("Error submitting:", err);
      alert("Error submitting. Check console.");
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Test Onboarding API</h1>
        <p className="mb-6">
          Click the button below to test the onboarding API with dummy data.
        </p>
        <button
          onClick={handleSubmit}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Submit Test Data
        </button>
      </div>
    </div>
  );
}

export default home;
