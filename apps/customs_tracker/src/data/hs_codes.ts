export interface HSCode {
    code: string;
    description: string;
    category: string;
    duty_us: string;
    duty_eu: string;
    risk_level: "Low" | "Medium" | "High";
}

export const hsCodes: HSCode[] = [
    // FASHION
    { code: "6109.10", description: "T-Shirts (Cotton)", category: "Fashion", duty_us: "16.5%", duty_eu: "12%", risk_level: "Low" },
    { code: "6109.90", description: "T-Shirts (Synthetic/Polyester)", category: "Fashion", duty_us: "32%", duty_eu: "12%", risk_level: "Low" },
    { code: "6203.42", description: "Men's Trousers/Jeans (Cotton)", category: "Fashion", duty_us: "16.6%", duty_eu: "12%", risk_level: "Low" },
    { code: "6204.62", description: "Women's Trousers/Jeans (Cotton)", category: "Fashion", duty_us: "16.6%", duty_eu: "12%", risk_level: "Low" },
    { code: "6403.99", description: "Footwear (Leather Upper)", category: "Fashion", duty_us: "8.5%", duty_eu: "8%", risk_level: "Medium" },

    // ELECTRONICS
    { code: "8517.13", description: "Smartphones (iPhone/Android)", category: "Electronics", duty_us: "0%", duty_eu: "0%", risk_level: "High" },
    { code: "8517.62", description: "Smart Watches / Bluetooth Devices", category: "Electronics", duty_us: "0%", duty_eu: "0%", risk_level: "Medium" },
    { code: "8544.42", description: "USB Cables / Charging Cables", category: "Electronics", duty_us: "0%", duty_eu: "0%", risk_level: "Low" },
    { code: "8504.40", description: "Power Adapters / Chargers", category: "Electronics", duty_us: "0%", duty_eu: "0%", risk_level: "Medium" },
    { code: "8471.30", description: "Laptops / Portable Computers", category: "Electronics", duty_us: "0%", duty_eu: "0%", risk_level: "High" },

    // HOME GOODS
    { code: "3924.10", description: "Plastic Kitchenware (Tableware)", category: "Home", duty_us: "3.4%", duty_eu: "6.5%", risk_level: "Low" },
    { code: "6302.21", description: "Bed Linen (Printed Cotton)", category: "Home", duty_us: "6.7%", duty_eu: "12%", risk_level: "Low" },
    { code: "9405.40", description: "LED Lamps / Lighting Fixtures", category: "Home", duty_us: "3.9%", duty_eu: "3.7%", risk_level: "Low" },

    // TOYS & HOBBIES
    { code: "9503.00", description: "Toys (General - Plastic/Dolls/Puzzles)", category: "Toys", duty_us: "0%", duty_eu: "0%", risk_level: "Low" },
    { code: "9504.50", description: "Video Game Consoles", category: "Toys", duty_us: "0%", duty_eu: "0%", risk_level: "Medium" },

    // COSMETICS (High Risk)
    { code: "3304.99", description: "Skincare Products / Creams", category: "Beauty", duty_us: "0%", duty_eu: "0%", risk_level: "High" },
    { code: "3303.00", description: "Perfumes / Fragrances", category: "Beauty", duty_us: "0%", duty_eu: "0%", risk_level: "High" }
];
