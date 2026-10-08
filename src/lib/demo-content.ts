import type { GalleryItem, Service, TeamMember } from "@/types";

export const demoServices: Service[] = [
  {
    id: "demo-swedish",
    name: "Swedish Serenity Massage",
    category: "Massage Rituals",
    description:
      "Long, flowing strokes and gentle-to-medium pressure ease everyday tension, support circulation, and invite the nervous system into deep rest.",
    duration: 60,
    price: 85,
    image: "asset:therapistMassage",
    active: true,
  },
  {
    id: "demo-deep-tissue",
    name: "Deep Tissue Recovery",
    category: "Therapeutic Massage",
    description:
      "Focused pressure and slow techniques address areas of persistent tightness, with every session adapted to your comfort and recovery goals.",
    duration: 75,
    price: 110,
    image: "asset:therapistMassage",
    active: true,
  },
  {
    id: "demo-hot-stone",
    name: "Warm Stone Restore",
    category: "Signature Rituals",
    description:
      "Smooth warmed stones and aromatic oils release muscular tension while grounding the senses in a cocoon of restorative warmth.",
    duration: 90,
    price: 135,
    image: "asset:pexelsHotstone",
    active: true,
  },
  {
    id: "demo-aromatherapy",
    name: "Botanical Aromatherapy",
    category: "Holistic Wellness",
    description:
      "A personalized blend of botanical essences accompanies rhythmic massage to calm, uplift, or restore according to your intention.",
    duration: 60,
    price: 95,
    image: "asset:aroma",
    active: true,
  },
  {
    id: "demo-facial",
    name: "Radiance Facial Ritual",
    category: "Facial & Skin",
    description:
      "A cleansing, facial massage, nourishing mask, and hydration ritual designed to leave the complexion rested, balanced, and luminous.",
    duration: 60,
    price: 105,
    image: "asset:facialNeutral",
    active: true,
  },
  {
    id: "demo-ayurvedic",
    name: "Herbal Balance Ceremony",
    category: "Ayurvedic Inspired",
    description:
      "Warm botanical oils and unhurried, grounding movements create a deeply comforting ritual inspired by traditional holistic wellbeing practices.",
    duration: 90,
    price: 145,
    image: "asset:aroma",
    active: true,
  },
  {
    id: "demo-couples",
    name: "Couples Sanctuary Ritual",
    category: "Shared Experiences",
    description:
      "A side-by-side massage experience in a warm, private setting, designed for two guests to slow down and reconnect together.",
    duration: 90,
    price: 250,
    image: "asset:couplesMassage",
    active: true,
  },
];

export const demoTeam: TeamMember[] = [
  {
    id: "demo-therapist-amara",
    name: "Amara Rai",
    position: "Lead Massage Therapist",
    specialization: "Swedish, deep tissue & recovery massage",
    experience: 9,
    bio: "A calm, attentive practitioner whose approach combines thoughtful consultation with intuitive, pressure-responsive bodywork.",
    image: "asset:team1",
    active: true,
  },
  {
    id: "demo-therapist-maya",
    name: "Maya Shrestha",
    position: "Holistic Wellness Therapist",
    specialization: "Aromatherapy, herbal rituals & relaxation",
    experience: 7,
    bio: "Maya creates sensory rituals around botanical oils, breath, and restorative touch to help guests return to a quieter state.",
    image: "asset:team2",
    active: true,
  },
  {
    id: "demo-therapist-elena",
    name: "Elena Hart",
    position: "Facial & Body Ritual Specialist",
    specialization: "Facials, lymphatic techniques & body care",
    experience: 8,
    bio: "Known for a gentle, detail-led approach, Elena blends skin-focused care with soothing facial and scalp massage techniques.",
    image: "asset:facialNeutral",
    active: true,
  },
];

export const demoGallery: GalleryItem[] = [
  {
    id: "demo-gallery-1",
    image: "asset:spaInterior",
    title: "The treatment sanctuary",
    caption: "A softly lit space prepared for unhurried rest.",
    category: "Interiors",
    visible: true,
  },
  {
    id: "demo-gallery-2",
    image: "asset:therapistMassage",
    title: "Personalized bodywork",
    caption: "Professional care shaped around comfort, pressure, and intention.",
    category: "Treatments",
    visible: true,
  },
  {
    id: "demo-gallery-3",
    image: "asset:pexelsHotstone",
    title: "Warm stone ritual",
    caption: "Grounding warmth meets slow, restorative massage.",
    category: "Rituals",
    visible: true,
  },
  {
    id: "demo-gallery-4",
    image: "asset:aroma",
    title: "Botanical apothecary",
    caption: "Aromatic oils selected to calm, restore, or uplift.",
    category: "Details",
    visible: true,
  },
  {
    id: "demo-gallery-5",
    image: "asset:facialNeutral",
    title: "Radiance facial",
    caption: "Nourishing skin care paired with soothing facial massage.",
    category: "Treatments",
    visible: true,
  },
  {
    id: "demo-gallery-6",
    image: "asset:couplesMassage",
    title: "Shared restoration",
    caption: "A warm, private ritual designed to be experienced together.",
    category: "Experiences",
    visible: true,
  },
];

export const sampleTestimonials = [
  {
    name: "Sophie L.",
    treatment: "Warm Stone Restore",
    quote:
      "From the welcome tea to the final quiet moments, the whole ritual felt thoughtful, unhurried, and deeply restorative.",
  },
  {
    name: "Arjun P.",
    treatment: "Deep Tissue Recovery",
    quote:
      "The consultation was attentive and the pressure was adjusted throughout. I left feeling lighter, looser, and genuinely cared for.",
  },
  {
    name: "Hannah & Tom",
    treatment: "Couples Ritual",
    quote:
      "A beautiful setting and a peaceful shared experience. It felt like stepping away from the city for an entire afternoon.",
  },
] as const;

export const wellnessPillars = [
  {
    title: "Listen",
    text: "Every ritual begins with a brief consultation so pressure, focus areas, scent, and pace feel right for you.",
  },
  {
    title: "Restore",
    text: "Skilled touch, warm botanicals, and quiet surroundings help soften tension and support meaningful rest.",
  },
  {
    title: "Integrate",
    text: "Unhurried closing moments, water or tea, and simple aftercare help the benefits travel home with you.",
  },
] as const;

export const visitJourney = [
  {
    title: "Arrive",
    text: "Settle in, slow your breathing, and share what your body needs from the experience.",
  },
  {
    title: "Personalize",
    text: "Choose your preferred pressure, focus areas, and sensory details with your therapist.",
  },
  {
    title: "Restore",
    text: "Enjoy uninterrupted treatment time shaped around comfort, calm, and meaningful rest.",
  },
  {
    title: "Return gently",
    text: "Take a quiet moment after your ritual and leave with simple, thoughtful aftercare guidance.",
  },
] as const;

export const treatmentGuide = [
  {
    title: "For everyday tension",
    text: "Choose flowing relaxation massage when you want to unwind and reconnect with a calmer pace.",
  },
  {
    title: "For focused recovery",
    text: "Consider targeted bodywork when particular areas feel tired, tight, or in need of attention.",
  },
  {
    title: "For sensory escape",
    text: "Explore warm stones or botanical aromatherapy for an enveloping, deeply comforting ritual.",
  },
] as const;

export const demoSiteCopy = {
  tagline: "Where wellness meets pure relaxation",
  heroTitle: "Escape the ordinary. Return to yourself.",
  heroSubtitle:
    "Step into a calm, contemporary sanctuary for restorative massage, botanical rituals, and unhurried moments created around you.",
  aboutStory:
    "Salus Per Aquam is imagined as a modern wellness sanctuary where skilled therapeutic care meets the quiet beauty of traditional spa ritual. Each visit is shaped around the individual — from pressure and focus areas to scent, pace, and the way you want to feel when you leave.",
  mission:
    "To create restorative experiences that feel personal, grounded, and generous with time.",
  vision:
    "A more thoughtful kind of everyday wellbeing — approachable enough to become a ritual, exceptional enough to feel like an escape.",
  footer:
    "A contemporary massage and wellness sanctuary devoted to skilled touch, botanical care, and the art of slowing down.",
} as const;
