"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PERKS = exports.PRODUCT_CATEGORIES = void 0;
var lucide_react_1 = require("lucide-react");
exports.PRODUCT_CATEGORIES = [
    {
        label: "UI kits",
        value: "ui_kits",
        featured: [
            {
                name: "Editor picks",
                href: "#",
                imageSrc: "/nav/ui-kits/mixed.jpg",
            },
            {
                name: "New Arrivals",
                href: "#",
                imageSrc: "/nav/ui-kits/blue.jpg",
            },
            {
                name: "Best Sellers",
                href: "#",
                imageSrc: "/nav/ui-kits/purple.jpg",
            },
        ],
    },
    {
        label: "Icons",
        value: "icons",
        featured: [
            {
                name: "Favorite Icon Picks",
                href: "#",
                imageSrc: "/nav/icons/picks.jpg",
            },
            {
                name: "New Arrivals",
                href: "#",
                imageSrc: "/nav/icons/new.jpg",
            },
            {
                name: "Bestselling Icons",
                href: "#",
                imageSrc: "/nav/icons/bestsellers.jpg",
            },
        ],
    },
];
exports.PERKS = [
    {
        name: "Instant Delivery",
        Icon: lucide_react_1.ArrowDownToLine,
        description: "Get your assets delivered to your email in seconds and download them right away.",
    },
    {
        name: "Guarantee Quality",
        Icon: lucide_react_1.CheckCircle,
        description: "Every asset on our platform is verified by our team to ensure our highest quality standards. Not happy ? We offer a 30 day refunded guarantee",
    },
    {
        name: "For the planet ",
        Icon: lucide_react_1.Leaf,
        description: "We've pledged 1% of sales to the preservation and restoration of the natural environment.",
    },
];
