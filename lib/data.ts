export interface Experience {
  dates: string
  company: string
  title: string
  location: string
  type: string
  skills: string[]
  image: string
  imageAlt: string
}

export const experienceData: Experience[] = [
  {
    dates: "Spring '21",
    company: "Reprise",
    title: "VP of Design",
    location: "Beverly, Massachusetts, United States",
    type: "B2B, Enterprise SaaS",
    skills: ["Design Leadership", "Product Design", "Brand"],
    image: "/images/work-banner-reprise.jpg",
    imageAlt: "Reprise company branding with circular design elements",
  },
  {
    dates: "Fall '17 - Spring '21, 3y+",
    company: "Catalant",
    title: "VP of Design",
    location: "Greater Boston",
    type: "Marketplace, Enterprise SaaS",
    skills: ["Design Leadership", "Product Design", "Brand"],
    image: "/images/work-banner-catalant.jpg",
    imageAlt: "Catalant company branding with flowing blue design elements",
  },
  {
    dates: "Spring '11 - Fall '17, 6y",
    company: "InsightSquared",
    title: "VP of Design",
    location: "Greater Boston",
    type: "SMB SaaS",
    skills: ["Product Design", "Brand", "Design Leadership"],
    image: "/images/work-banner-insightsquared.jpg",
    imageAlt: "InsightSquared company branding with geometric logo design",
  },
  {
    dates: "Spring '09 - Spring '11, 2y",
    company: "LevelUp",
    title: "Co-Founder & VP of Design",
    location: "Greater Boston",
    type: "B2C, Mobile",
    skills: ["Product Design", "Brand", "Mobile Design"],
    image: "/images/work-banner-levelup.jpg",
    imageAlt: "LevelUp company branding with orange gradient background",
  },
]
