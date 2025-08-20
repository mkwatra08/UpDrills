const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Drill = require('../models/Drill');

// Load environment variables
dotenv.config();

// Sample drills data
const sampleDrills = [
  {
    title: "JavaScript Fundamentals",
    difficulty: "easy",
    tags: ["javascript", "fundamentals", "variables", "functions"],
    questions: [
      {
        id: "js-1",
        prompt: "Explain the difference between var, let, and const in JavaScript.",
        keywords: ["var", "let", "const", "hoisting", "scope", "block", "function"]
      },
      {
        id: "js-2",
        prompt: "What is closure in JavaScript and how does it work?",
        keywords: ["closure", "function", "scope", "lexical", "environment", "variables"]
      },
      {
        id: "js-3",
        prompt: "Describe the event loop in JavaScript.",
        keywords: ["event loop", "call stack", "callback queue", "microtask", "macrotask", "asynchronous"]
      }
    ]
  },
  {
    title: "React Hooks Deep Dive",
    difficulty: "medium",
    tags: ["react", "hooks", "functional", "components"],
    questions: [
      {
        id: "react-1",
        prompt: "Explain the difference between useState and useReducer hooks.",
        keywords: ["useState", "useReducer", "state", "reducer", "complex", "simple"]
      },
      {
        id: "react-2",
        prompt: "How does useEffect work and what are its dependencies?",
        keywords: ["useEffect", "side effects", "dependencies", "cleanup", "componentDidMount", "componentDidUpdate"]
      },
      {
        id: "react-3",
        prompt: "What is the purpose of useCallback and useMemo hooks?",
        keywords: ["useCallback", "useMemo", "memoization", "performance", "optimization", "re-renders"]
      }
    ]
  },
  {
    title: "System Design Principles",
    difficulty: "hard",
    tags: ["system design", "architecture", "scalability", "distributed"],
    questions: [
      {
        id: "sd-1",
        prompt: "Design a URL shortening service like bit.ly. What are the key components?",
        keywords: ["url shortening", "hash function", "database", "cache", "load balancer", "scalability"]
      },
      {
        id: "sd-2",
        prompt: "Explain the CAP theorem and its implications for distributed systems.",
        keywords: ["CAP theorem", "consistency", "availability", "partition tolerance", "trade-offs"]
      },
      {
        id: "sd-3",
        prompt: "How would you design a real-time chat application?",
        keywords: ["websockets", "real-time", "message queue", "database", "scalability", "load balancing"]
      }
    ]
  },
  {
    title: "Data Structures & Algorithms",
    difficulty: "medium",
    tags: ["algorithms", "data structures", "complexity", "optimization"],
    questions: [
      {
        id: "dsa-1",
        prompt: "Implement a function to find the longest palindromic substring in a string.",
        keywords: ["palindrome", "dynamic programming", "two pointers", "center expansion", "manacher"]
      },
      {
        id: "dsa-2",
        prompt: "Explain the time complexity of different sorting algorithms.",
        keywords: ["quicksort", "mergesort", "heapsort", "bubble sort", "time complexity", "space complexity"]
      },
      {
        id: "dsa-3",
        prompt: "How would you implement a LRU (Least Recently Used) cache?",
        keywords: ["LRU cache", "hash map", "doubly linked list", "O(1)", "get", "put"]
      }
    ]
  },
  {
    title: "Database Design & Optimization",
    difficulty: "medium",
    tags: ["database", "sql", "optimization", "indexing", "normalization"],
    questions: [
      {
        id: "db-1",
        prompt: "Explain the different types of database indexes and when to use them.",
        keywords: ["B-tree", "hash index", "composite index", "covering index", "query optimization"]
      },
      {
        id: "db-2",
        prompt: "What is database normalization and what are its benefits?",
        keywords: ["normalization", "1NF", "2NF", "3NF", "BCNF", "redundancy", "anomalies"]
      },
      {
        id: "db-3",
        prompt: "How would you optimize a slow SQL query?",
        keywords: ["query optimization", "execution plan", "indexes", "joins", "subqueries", "EXPLAIN"]
      }
    ]
  },
  {
    title: "API Design Best Practices",
    difficulty: "easy",
    tags: ["api", "rest", "design", "best practices", "http"],
    questions: [
      {
        id: "api-1",
        prompt: "What are the main principles of RESTful API design?",
        keywords: ["REST", "stateless", "resources", "HTTP methods", "status codes", "uniform interface"]
      },
      {
        id: "api-2",
        prompt: "How would you handle authentication and authorization in an API?",
        keywords: ["JWT", "OAuth", "API keys", "session", "middleware", "security"]
      },
      {
        id: "api-3",
        prompt: "What are the best practices for API versioning?",
        keywords: ["versioning", "URL versioning", "header versioning", "backward compatibility", "deprecation"]
      }
    ]
  }
];

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/upivot', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Seed the database
async function seedDatabase() {
  try {
    // Clear existing drills
    await Drill.deleteMany({});
    console.log('Cleared existing drills');

    // Insert sample drills
    const drills = await Drill.insertMany(sampleDrills);
    console.log(`Successfully seeded ${drills.length} drills`);

    // Display created drills
    drills.forEach(drill => {
      console.log(`- ${drill.title} (${drill.difficulty})`);
    });

    console.log('\nDatabase seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  }
}

// Run the seed script
async function main() {
  await connectDB();
  await seedDatabase();
}

// Handle errors
process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection:', error);
  process.exit(1);
});

// Run the script
if (require.main === module) {
  main();
}

module.exports = { seedDatabase, sampleDrills }; 