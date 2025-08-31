import { clsx, type ClassValue } from "clsx"
import next from "next";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const getDeviconsClassName = (techName:string)=>{
    if(!techName) return ""; // Prevents .replace on undefined
   const normalizedTechName = techName.replace(/[ .]/g,"").toLowerCase();

   const techMap:{[Key:string]:string}={
      javascript :"devicon-javascript-plain",
      js:"devicon-javascript-plain",
      typescript:"devicon-typescript-plain",
      ts:"devicon-typescript-plain",
      python:"devicon-python-plain",
      java:"devicon-java-plain",
      
      
      nextjs:"devicon-nextjs-plain",
      next:"devicon-nextjs-plain",

      html:"devicon-html5-plain",
      css:"devicon-css3-plain",
       
      react:"devicon-react-original",
   }

   return `${techMap[normalizedTechName]} colored`||
   "devicon-devicon-plain";
}


// 🌐 Map of popular technologies with descriptions
export const techDescriptionMap: { [key: string]: string } = {
  // Programming Languages
  javascript: "JavaScript is a powerful scripting language for building dynamic, interactive web applications.",
  typescript: "TypeScript is a superset of JavaScript that adds static typing for large-scale applications.",
  python: "Python is a versatile high-level language known for simplicity, readability, and use in AI, data science, and web development.",
  java: "Java is a robust, object-oriented programming language widely used for enterprise applications and Android development.",
  csharp: "C# is a modern language developed by Microsoft, primarily used for .NET applications, game development, and enterprise software.",
  cpp: "C++ is a high-performance language used for system software, game engines, and real-time applications.",
  ruby: "Ruby is a dynamic programming language known for simplicity and productivity, commonly used with the Rails framework.",
  php: "PHP is a server-side scripting language widely used for dynamic websites and backend systems.",

  // Frontend Frameworks & Libraries
  react: "React is a popular JavaScript library for building fast and reusable user interfaces.",
  nextjs: "Next.js is a React framework offering server-side rendering, static site generation, and powerful full-stack features.",
  vue: "Vue.js is a progressive JavaScript framework for building modern web interfaces.",
  angular: "Angular is a TypeScript-based framework for building scalable single-page applications.",
  svelte: "Svelte is a compiler that turns declarative UI components into efficient JavaScript at build time.",

  // Backend & APIs
  nodejs: "Node.js enables server-side JavaScript execution, ideal for scalable web applications.",
  express: "Express is a fast, minimalist web framework for Node.js used to build RESTful APIs.",
  spring: "Spring Boot is a Java-based framework for building robust, production-ready applications quickly.",
  django: "Django is a high-level Python framework that enables rapid development of secure web applications.",
  flask: "Flask is a lightweight Python web framework often used for APIs and smaller applications.",
  fastapi: "FastAPI is a modern Python web framework for building fast APIs with automatic validation and docs.",

  // Databases
  mongodb: "MongoDB is a NoSQL database that stores data in JSON-like documents, offering flexibility and scalability.",
  mysql: "MySQL is a widely used open-source relational database management system.",
  postgresql: "PostgreSQL is a powerful open-source relational database known for reliability and advanced features.",
  sqlite: "SQLite is a lightweight, file-based relational database commonly used in mobile and embedded apps.",
  redis: "Redis is an in-memory key-value store often used for caching and real-time applications.",

  // DevOps & Cloud
  git: "Git is a distributed version control system that tracks changes in source code during development.",
  github: "GitHub is a cloud-based platform for hosting Git repositories and enabling collaborative development.",
  docker: "Docker is a platform for building, shipping, and running applications inside containers.",
  kubernetes: "Kubernetes is an orchestration tool for managing containerized applications at scale.",
  aws: "AWS is a cloud platform offering computing, storage, and AI services for scalable applications.",
  azure: "Microsoft Azure is a cloud platform with infrastructure, AI, and developer tools.",
  gcp: "Google Cloud Platform offers cloud computing, databases, AI, and developer services.",

  // Others
  graphql: "GraphQL is a query language for APIs that enables efficient data fetching.",
  restapi: "REST API is an architectural style for building scalable web services.",
  tailwind: "Tailwind CSS is a utility-first CSS framework for rapidly building modern UIs.",
  bootstrap: "Bootstrap is a popular front-end framework for building responsive websites.",
  sass: "Sass is a CSS preprocessor that adds features like variables and mixins for styling.",
  webpack: "Webpack is a module bundler for JavaScript applications.",
  vite: "Vite is a fast build tool and development server optimized for modern web projects.",
};

// ⚡ Function to normalize and get description
export const getTechDescription = (techName: string) => {
  const normalizedTechName = techName.replace(/\s+/g, "").toLowerCase();

  return techDescriptionMap[normalizedTechName]
    ? techDescriptionMap[normalizedTechName]
    : `${techName} is a technology or tool widely used in web development, providing valuable features and capabilities.`;
};


export const getTimeStamp = (createdAt: Date): string => {
  const date = new Date(createdAt);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days !== 1 ? "s" : ""} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months !== 1 ? "s" : ""} ago`;
  const years = Math.floor(months / 12);
  return `${years} year${years !== 1 ? "s" : ""} ago`;
}