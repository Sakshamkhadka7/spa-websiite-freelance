import type { Booking, GalleryItem, Service, SiteContent, TeamMember, User } from "@/types";

export type StoredUser = User & { password: string };

export interface MockDB {
  users: StoredUser[];
  services: Service[];
  team: TeamMember[];
  gallery: GalleryItem[];
  bookings: Booking[];
  content: SiteContent;
}

export function seed(): MockDB {
  const now = new Date().toISOString();
  return {
    users: [
      { id: "u-admin", name: "Spa Admin", email: "admin@salus.com", phone: "+1 555 0100", role: "admin", createdAt: now, password: "admin123" },
      { id: "u-demo", name: "Maya Collins", email: "customer@salus.com", phone: "+1 555 0142", role: "customer", createdAt: now, password: "customer123" },
    ],
    services: [
      { id: "s1", name: "Swedish Massage", category: "Relaxation", description: "Long, flowing strokes that melt tension, improve circulation and quiet the mind.", duration: 60, price: 85, image: "asset:room", active: true },
      { id: "s2", name: "Deep Tissue Massage", category: "Therapeutic", description: "Slow, firm pressure targeting deep muscle layers to release chronic knots.", duration: 75, price: 110, image: "asset:hero", active: true },
      { id: "s3", name: "Aromatherapy Massage", category: "Relaxation", description: "Custom-blended essential oils paired with gentle massage for body and senses.", duration: 60, price: 95, image: "asset:aroma", active: true },
      { id: "s4", name: "Hot Stone Massage", category: "Signature", description: "Heated basalt stones warm and soften muscles for a profoundly deep release.", duration: 90, price: 130, image: "asset:hotstone", active: true },
      { id: "s5", name: "Thai Massage", category: "Therapeutic", description: "Assisted stretching and rhythmic pressure on a floor mat to restore flow.", duration: 90, price: 120, image: "asset:room", active: true },
      { id: "s6", name: "Couples Massage", category: "Signature", description: "Side-by-side treatments in our private suite — share the stillness together.", duration: 60, price: 180, image: "asset:hero", active: true },
      { id: "s7", name: "Head & Shoulder Massage", category: "Express", description: "Focused relief for neck, scalp and shoulders — perfect after long workdays.", duration: 30, price: 45, image: "asset:aroma", active: true },
      { id: "s8", name: "Foot Massage", category: "Express", description: "Reflexology-inspired foot ritual with warm soak and nourishing balm.", duration: 45, price: 55, image: "asset:hotstone", active: true },
    ],
    team: [
      { id: "t1", name: "Elena Marsh", position: "Lead Therapist", specialization: "Hot Stone & Aromatherapy", experience: 12, bio: "Elena blends classical training with a gentle, intuitive touch, creating rituals tailored to each guest.", image: "asset:team1" },
      { id: "t2", name: "Daniel Reyes", position: "Senior Therapist", specialization: "Deep Tissue & Thai", experience: 9, bio: "A former sports therapist, Daniel specializes in releasing deep tension and restoring mobility.", image: "asset:team2" },
    ],
    gallery: [
      { id: "g1", image: "asset:hero", caption: "Our signature treatment suite", category: "Interior", visible: true },
      { id: "g2", image: "asset:hotstone", caption: "Warm basalt stones", category: "Treatments", visible: true },
      { id: "g3", image: "asset:aroma", caption: "House-blended aromatherapy oils", category: "Products", visible: true },
      { id: "g4", image: "asset:room", caption: "The sage room", category: "Interior", visible: true },
      { id: "g5", image: "asset:team1", caption: "Elena, Lead Therapist", category: "Team", visible: true },
      { id: "g6", image: "asset:team2", caption: "Daniel, Senior Therapist", category: "Team", visible: true },
    ],
    bookings: [],
    content: {
      spaName: "Salus Per Aquam",
      logoText: "Salus",
      tagline: "Health through water",
      hero: {
        title: "Return to stillness",
        subtitle: "A sanctuary of warm stone, gentle hands and quiet water — massage rituals crafted to restore body and mind.",
        image: "asset:hero",
      },
      about: {
        story: "Salus Per Aquam began with a simple belief: true rest is a ritual, not a luxury. Inspired by the ancient Roman bathhouses, we created a calm refuge where skilled therapists, natural ingredients and unhurried time come together.",
        mission: "To offer every guest a moment of genuine restoration through mindful, personalised massage therapy.",
        values: ["Unhurried care", "Natural ingredients", "Skilled, certified therapists", "Quiet, private spaces"],
        facilities: ["Private treatment suites", "Couples suite", "Steam & relaxation lounge", "Herbal tea bar", "Changing rooms with showers"],
      },
      contact: { phone: "+1 555 0123", email: "hello@salusperaquam.com", address: "14 Willow Lane, Old Town" },
      openingHours: [
        { day: "Monday – Friday", hours: "9:00 – 21:00" },
        { day: "Saturday", hours: "9:00 – 20:00" },
        { day: "Sunday", hours: "10:00 – 18:00" },
      ],
      social: { facebook: "https://facebook.com", instagram: "https://instagram.com", twitter: "https://x.com" },
      footerText: "A sanctuary for rest and renewal.",
      currency: "$",
      timeSlots: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"],
    },
  };
}
