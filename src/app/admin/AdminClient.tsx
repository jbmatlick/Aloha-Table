'use client';

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "../../components/Navbar";
import { useUser } from "@auth0/nextjs-auth0/client";

interface ContactRecord {
  id: string;
  fields: {
    "Full Name": string;
    Email: string;
    Phone: string;
    "Preferred Date": string;
    "Contact Method": string;
    "Additional Details": string;
    Status: string;
    "Created At": string;
  };
}

interface ReferrerRecord {
  id: string;
  fields: {
    "Full Name": string;
    Email: string;
    "Referrals Count": number;
  };
}

interface Auth0User {
  user_id: string;
  email: string;
  name?: string;
  email_verified?: boolean;
}

function Admin() {
  // ...full Admin function body from previous commit...
}

export default Admin; 