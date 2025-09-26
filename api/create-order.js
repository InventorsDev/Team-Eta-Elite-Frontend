import dotenv from "dotenv";
dotenv.config();

import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

// helper to set CORS headers on Next/Vercel style res objects
const corsHeaders = (reqOrigin = "*") => ({
  "Access-Control-Allow-Origin": process.env.FRONTEND_URL || reqOrigin,
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
});

function setCorsHeadersOnRes(res, reqOrigin = "*") {
  const headers = corsHeaders(reqOrigin);
  Object.entries(headers).forEach(([key, val]) => {
    res.setHeader(key, val);
  });
}

const SUPABASE_URL = process.env.SUPABASE_URL;
console.log("Supabase URL is: " + SUPABASE_URL);
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const addRawDeliveryCodeToNewTable = async (orderId, buyer_id, rawCode) => {
  try {
    const { data, error } = await supabase 
      .from("order_codes")
      .insert([{
        order_id: orderId,
        buyer_id: buyer_id,
        raw_code: rawCode
      }]);

    if (error) throw error;
    
    if (data) console.log("Successful");
  } catch (err) {
    console.error("addRawDeliveryCodeToNewTable error:", err);
    // bubble up to outer try/catch so the handler can respond
    throw err;
  }
};

export default async function handler(req, res) {
  // Preflight
  if (req.method === "OPTIONS") {
    setCorsHeadersOnRes(res, req.headers.origin || "*");
    return res.status(200).end("ok");
  }

  if (req.method !== "POST") {
    setCorsHeadersOnRes(res, req.headers.origin || "*");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { 
        transaction_reference, 
        product_name, 
        vendor_name, 
        buyer_id, 
        vendor_id, 
        buyer_email, 
        product_id, 
        amount
    } = req.body;
    
    if (!buyer_email || !product_id || !amount) {
      setCorsHeadersOnRes(res, req.headers.origin || "*");
      return res.status(400).json({ error: "Missing fields" });
    }

    // Generate Random 4-digit code
    const rawCode = String(Math.floor(1000 + Math.random() * 9000));
    const hash = await bcrypt.hash(rawCode, 10);

    const { data, error } = await supabase
      .from("orders")
      .insert([{
        transaction_reference,
        product_name,
        vendor_name,
        buyer_id,
        vendor_id,
        disputed: false,
        buyer_email,
        product_id,
        delivery_status: "pending",
        escrow_status: "held",
        delivery_code_hash: hash,
        amount_paid: amount,
      }])
      .select()
      .single();

    if (error) throw error;

    await addRawDeliveryCodeToNewTable(data.id, buyer_id, rawCode);

    setCorsHeadersOnRes(res, req.headers.origin || "*");
    
    // return rawCode only to buyer (client should show it and not persist it anywhere public)
    return res.status(200).json({ order: data, code: rawCode });
  } catch (err) {
    console.error("handler error:", err);
    setCorsHeadersOnRes(res, req.headers.origin || "*");
    return res.status(500).json({ error: err.message });
  }
}
