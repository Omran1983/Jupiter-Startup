export interface HSCode {
    code: string;
    description: string;
    category: string;
    duty_us: string;
    duty_eu: string;
    risk_level: "Low" | "Medium" | "High";
}

export const hsCodes: HSCode[] = [
    // --- RADIO & GPS & TRACKING (User Requested) ---
    { code: "8526.91", description: "GPS Apparatus (Global Positioning System Receivers)", category: "Electronics", duty_us: "0%", duty_eu: "3.7%", risk_level: "Low" },
    { code: "8526.92", description: "Radio Remote Control Apparatus", category: "Electronics", duty_us: "4.9%", duty_eu: "0%", risk_level: "Medium" },
    { code: "8526.10", description: "Radar Apparatus", category: "Electronics", duty_us: "0%", duty_eu: "3.7%", risk_level: "High" },
    { code: "8517.62", description: "Bluetooth Trackers / AirTags / IoT Devices", category: "Electronics", duty_us: "0%", duty_eu: "0%", risk_level: "Low" },
    { code: "8525.60", description: "Walkie-Talkies / Transceivers (Radio)", category: "Electronics", duty_us: "0%", duty_eu: "9.3%", risk_level: "Medium" },
    { code: "8527.19", description: "Portable Radio Receivers (AM/FM)", category: "Electronics", duty_us: "0%", duty_eu: "14%", risk_level: "Low" },
    { code: "8529.10", description: "Antennas (Radio/GPS)", category: "Electronics", duty_us: "3%", duty_eu: "3.6%", risk_level: "Low" },
    { code: "8517.12", description: "GSM Modems / 4G Trackers", category: "Electronics", duty_us: "0%", duty_eu: "0%", risk_level: "Medium" },

    // --- FASHION & APPAREL ---
    { code: "6109.10", description: "T-Shirts (Cotton)", category: "Fashion", duty_us: "16.5%", duty_eu: "12%", risk_level: "Low" },
    { code: "6109.90", description: "T-Shirts (Polyester/Synthetic)", category: "Fashion", duty_us: "32%", duty_eu: "12%", risk_level: "Low" },
    { code: "6203.42", description: "Men's Trousers/Jeans (Cotton)", category: "Fashion", duty_us: "16.6%", duty_eu: "12%", risk_level: "Low" },
    { code: "6204.62", description: "Women's Trousers/Jeans (Cotton)", category: "Fashion", duty_us: "16.6%", duty_eu: "12%", risk_level: "Low" },
    { code: "6403.99", description: "Footwear (Leather Upper / Sneakers)", category: "Fashion", duty_us: "8.5%", duty_eu: "8%", risk_level: "Medium" },
    { code: "6402.99", description: "Footwear (Rubber/Plastic)", category: "Fashion", duty_us: "37.5%", duty_eu: "16.9%", risk_level: "Medium" },
    { code: "6201.93", description: "Jackets/Coats (Synthetic)", category: "Fashion", duty_us: "27.7%", duty_eu: "12%", risk_level: "Low" },

    // --- CONSUMER ELECTRONICS ---
    { code: "8517.13", description: "Smartphones (iPhone/Android)", category: "Electronics", duty_us: "0%", duty_eu: "0%", risk_level: "High" },
    { code: "8517.62.00", description: "Smart Watches (Apple Watch/Fitbit)", category: "Electronics", duty_us: "0%", duty_eu: "0%", risk_level: "Medium" },
    { code: "8544.42", description: "USB Cables / Lightning Cables", category: "Electronics", duty_us: "0%", duty_eu: "0%", risk_level: "Low" },
    { code: "8504.40", description: "Power Adapters / Chargers", category: "Electronics", duty_us: "0%", duty_eu: "0%", risk_level: "Medium" },
    { code: "8471.30", description: "Laptops / Portable Computers", category: "Electronics", duty_us: "0%", duty_eu: "0%", risk_level: "High" },
    { code: "8518.22", description: "Bluetooth Speakers", category: "Electronics", duty_us: "0%", duty_eu: "0%", risk_level: "Low" },
    { code: "8518.30", description: "Headphones / Earbuds (Wireless)", category: "Electronics", duty_us: "0%", duty_eu: "0%", risk_level: "Low" },
    { code: "8471.60", description: "Keyboards & Mice", category: "Electronics", duty_us: "0%", duty_eu: "0%", risk_level: "Low" },
    { code: "9006.59", description: "Dash Cams / Action Cameras", category: "Electronics", duty_us: "0%", duty_eu: "0%", risk_level: "High" },
    { code: "8507.60", description: "Power Banks (Lithium Ion)", category: "Electronics", duty_us: "0%", duty_eu: "0%", risk_level: "High" },

    // --- HOME & LIFESTYLE ---
    { code: "3924.10", description: "Plastic Kitchenware (Tupperware/Bottles)", category: "Home", duty_us: "3.4%", duty_eu: "6.5%", risk_level: "Low" },
    { code: "6302.21", description: "Bed Linen (Printed Cotton)", category: "Home", duty_us: "6.7%", duty_eu: "12%", risk_level: "Low" },
    { code: "9405.40", description: "LED Strips / Lamps", category: "Home", duty_us: "3.9%", duty_eu: "3.7%", risk_level: "Low" },
    { code: "9403.20", description: "Metal Furniture (Gaming Chairs)", category: "Home", duty_us: "0%", duty_eu: "0%", risk_level: "Low" },
    { code: "8516.40", description: "Electric Irons / Steamers", category: "Home", duty_us: "0%", duty_eu: "2.7%", risk_level: "Low" },
    { code: "8509.80", description: "Air Fryers / Blenders", category: "Home", duty_us: "4.2%", duty_eu: "2.2%", risk_level: "Medium" },

    // --- TOYS & HOBBIES ---
    { code: "9503.00", description: "Toys (Plastic/Dolls/Figures)", category: "Toys", duty_us: "0%", duty_eu: "0%", risk_level: "Low" },
    { code: "9504.50", description: "Video Game Consoles", category: "Toys", duty_us: "0%", duty_eu: "0%", risk_level: "Medium" },
    { code: "9506.31", description: "Golf Clubs", category: "Toys", duty_us: "4.4%", duty_eu: "2.7%", risk_level: "Low" },
    { code: "8802.20", description: "Drones (Camera Drones)", category: "Electronics", duty_us: "0%", duty_eu: "0%", risk_level: "High" },

    // --- COSMETICS (High Risk) ---
    { code: "3304.99", description: "Skincare / Face Creams", category: "Beauty", duty_us: "0%", duty_eu: "0%", risk_level: "High" },
    { code: "3303.00", description: "Perfumes / Fragrances", category: "Beauty", duty_us: "0%", duty_eu: "0%", risk_level: "High" },
    { code: "3304.30", description: "Manicure / Pedicure Sets", category: "Beauty", duty_us: "0%", duty_eu: "0%", risk_level: "Medium" },

    // --- AUTOMOTIVE ---
    { code: "8708.99", description: "Car Parts (General)", category: "Auto", duty_us: "2.5%", duty_eu: "4.5%", risk_level: "Medium" },
    { code: "8512.20", description: "Car Lights / LEDs", category: "Auto", duty_us: "0%", duty_eu: "2.7%", risk_level: "Low" },
    { code: "4011.10", description: "Car Tires (New)", category: "Auto", duty_us: "4%", duty_eu: "4.5%", risk_level: "High" }
];
