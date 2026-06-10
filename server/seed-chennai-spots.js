const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  const ownerId = "cmq8drtec0001vsng426s5j6s";
  
  const spots = [
    {
      title: "T Nagar Premium Secure Parking",
      description: "Covered parking space located just 5 minutes away from Pondy Bazaar. Perfect for shoppers and local workers. 24/7 security with CCTV.",
      address: "14, GN Chetty Road, T Nagar",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600017",
      latitude: 13.0418,
      longitude: 80.2341,
      pricePerHour: 40,
      pricePerDay: 250,
      pricePerMonth: 4000,
      totalSlots: 15,
      availableSlots: 12,
      status: "ACTIVE",
      averageRating: 4.8,
      totalReviews: 24,
      amenities: ["CCTV", "COVERED_PARKING", "WATCHMAN"]
    },
    {
      title: "Anna Nagar Tower Park Garage",
      description: "Spacious independent garage space near Anna Nagar Tower. Ideal for daily commuters. Safe neighborhood with easy entry/exit.",
      address: "2nd Avenue, Block E, Anna Nagar",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600040",
      latitude: 13.0846,
      longitude: 80.2118,
      pricePerHour: 30,
      pricePerDay: 180,
      pricePerMonth: 3500,
      totalSlots: 5,
      availableSlots: 2,
      status: "ACTIVE",
      averageRating: 4.5,
      totalReviews: 12,
      amenities: ["GATED", "SHED_COVER"]
    },
    {
      title: "OMR IT Tech Park Slots",
      description: "Dedicated parking spots right on the IT corridor in Sholinganallur. Avoid traffic and secure your spot ahead of time. EV charging available.",
      address: "Rajiv Gandhi Salai, Sholinganallur",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600119",
      latitude: 12.9009,
      longitude: 80.2279,
      pricePerHour: 50,
      pricePerDay: 300,
      pricePerMonth: 5000,
      totalSlots: 40,
      availableSlots: 35,
      status: "ACTIVE",
      averageRating: 4.9,
      totalReviews: 56,
      amenities: ["CCTV", "WATCHMAN", "EV_CHARGING", "LIGHTING"]
    },
    {
      title: "Mylapore Kapaleeshwarar Easy Park",
      description: "Extremely rare parking space right in the heart of Mylapore, 10 minutes walking from the temple. Open parking with watchman.",
      address: "North Mada Street, Mylapore",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600004",
      latitude: 13.0335,
      longitude: 80.2699,
      pricePerHour: 60,
      pricePerDay: 400,
      pricePerMonth: 6000,
      totalSlots: 8,
      availableSlots: 3,
      status: "ACTIVE",
      averageRating: 4.2,
      totalReviews: 89,
      amenities: ["WATCHMAN", "LIGHTING"]
    },
    {
      title: "Guindy Industrial Hub Parking",
      description: "Heavy duty parking suitable for cars and small commercial vehicles. Right next to Guindy railway station and tech parks.",
      address: "GST Road, Guindy",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600032",
      latitude: 13.0067,
      longitude: 80.2206,
      pricePerHour: 35,
      pricePerDay: 200,
      pricePerMonth: 3800,
      totalSlots: 20,
      availableSlots: 15,
      status: "ACTIVE",
      averageRating: 4.0,
      totalReviews: 15,
      amenities: ["CCTV", "GATED", "FULL_DAY_ACCESS"]
    },
    {
      title: "Velachery Phoenix Mall Alternate Park",
      description: "Avoid the mall parking queues! Just opposite Phoenix MarketCity. Very accessible and affordable hourly rates.",
      address: "Velachery Main Road",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600042",
      latitude: 12.9818,
      longitude: 80.2217,
      pricePerHour: 30,
      pricePerDay: 250,
      pricePerMonth: 4500,
      totalSlots: 12,
      availableSlots: 10,
      status: "ACTIVE",
      averageRating: 4.7,
      totalReviews: 34,
      amenities: ["CCTV", "COVERED_PARKING", "LIGHTING"]
    }
  ];

  for (const s of spots) {
    const amenities = s.amenities;
    delete s.amenities;
    
    const spot = await prisma.parkingSpot.create({
      data: {
        ...s,
        ownerId: ownerId,
        amenities: {
          create: amenities.map(a => ({ amenity: a }))
        },
        vehicleTypes: {
          create: [
            { vehicleType: "CAR" },
            { vehicleType: "BIKE" }
          ]
        },
        images: {
          create: [
            {
              url: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
              publicId: "sample_id",
              isPrimary: true
            }
          ]
        }
      }
    });
    console.log("Created spot:", spot.title);
  }
}

seed()
  .then(() => console.log("Done!"))
  .catch(console.error)
  .finally(() => prisma.$disconnect());
