import cors from "cors";

const allowedDomains: string[] = [
  'http://localhost:3000',
];

export const corsOptions = cors({
  origin: allowedDomains,
  methods: ['GET', 'POST', 'DELETE', 'PATCH'],
  credentials: true,
  optionsSuccessStatus: 200,
});