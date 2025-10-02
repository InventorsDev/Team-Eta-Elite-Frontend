import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

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

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    setCorsHeadersOnRes(res, req.headers.origin || "*");
    return res.status(200).send("ok");
  }

  if (req.method !== "POST") {
    setCorsHeadersOnRes(res, req.headers.origin || "*");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { order_id, inputCode } = req.body;
    if (!order_id || !inputCode) {
      setCorsHeadersOnRes(res, req.headers.origin || "*");
      return res.status(400).json({ error: "Missing fields" });
    }

    const { data: order, error: fetchErr } = await supabase
      .from("orders")
      .select("*")
      .eq("id", order_id)
      .single();

    if (fetchErr || !order) throw new Error("Order not found");

    const isMatch = await bcrypt.compare(inputCode, order.delivery_code_hash);
    if (!isMatch) {
      setCorsHeadersOnRes(res, req.headers.origin || "*");
      return res.status(401).json({ error: "Invalid code" });
    }

    // Mark delivered/released
    const { data: updated, error: updateErr } = await supabase
      .from("orders")
      .update({
        delivery_status: "delivered",
        escrow_status: "held",
        released_at: new Date().toISOString()
      })
      .eq("id", order_id)
      .select()
      .single();

    if (updateErr) throw updateErr;

    setCorsHeadersOnRes(res, req.headers.origin || "*");
    return res.status(200).json({ ok: true, order: updated });
  } catch (err) {
    setCorsHeadersOnRes(res, req.headers.origin || "*");
    return res.status(500).json({ error: err.message });
  }
}
