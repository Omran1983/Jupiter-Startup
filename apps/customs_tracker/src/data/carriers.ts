export const carriers = {
    usps: {
        name: "USPS",
        fullName: "United States Postal Service",
        email: "international.inquiry@usps.gov",
        phone: "+1-800-222-1811",
        telegram: null,
        template: `Subject: Inquiry on Package #{TRACKING}\n\nTo Whom It May Concern,\n\nI am the recipient of package #{TRACKING} which appears to be stuck in transit. The last update was more than 5 days ago.\n\nPlease initiate a missing mail search.\n\nThank you,`
    },
    ups: {
        name: "UPS",
        fullName: "United Parcel Service",
        email: "customer.service@ups.com",
        phone: "+1-800-742-5877",
        telegram: null,
        template: `Subject: Stuck Shipment #{TRACKING}\n\nUrgent: My package #{TRACKING} has not moved. Please provide proof of location.`
    },
    dhl: {
        name: "DHL",
        fullName: "DHL Express",
        email: "support@dhl.com",
        phone: "+1-800-225-5345",
        telegram: "https://t.me/dhlbot", // Example
        template: `Subject: Trace Request #{TRACKING}\n\nPlease trace shipment #{TRACKING}. It is delayed beyond the estimated delivery date.`
    },
    fedex: {
        name: "FedEx",
        fullName: "Federal Express",
        email: "support@fedex.com",
        phone: "+1-800-463-3339",
        telegram: null,
        template: `Subject: Delayed Package #{TRACKING}\n\nI am requesting a status update for tracking number #{TRACKING}.`
    },
    china_post: {
        name: "China Post",
        fullName: "China Post Group",
        email: "feedback@chinapost.com.cn",
        phone: "+86 11183",
        telegram: null,
        template: `Subject: Package #{TRACKING} stuck in export\n\nPackage #{TRACKING} has been at 'Handed over to carrier' for 10 days. Please confirm flight status.`
    },
    royal_mail: {
        name: "Royal Mail",
        fullName: "Royal Mail Group",
        email: "international.support@royalmail.com",
        phone: "03457 740 740",
        telegram: null,
        template: `Subject: Missing Item #{TRACKING}\n\nMy item #{TRACKING} has not arrived. Please advise.`
    }
};
