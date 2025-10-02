import fetch from "node-fetch";
import { createClient } from "@supabase/supabase-js";

/*
  - run daily (cron) and find orders older than 14 days
  - transfer order.amount_paid back to buyer using bank details stored in user metadata
  - delete the order record after successful transfer
*/

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function transferToBank({ account_name, account_number, bank_sort_code, amount, reference }) {
    const PAYSTACK_URL = process.env.PAYSTACK_URL || "https://api.paystack.co";
    const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;
    if (!PAYSTACK_SECRET) return { success: false, error: "Paystack not configured" };

    // Paystack requires registered business licensce for transfers - so its in test mode.
    const IS_DEVELOPMENT = process.env.NODE_ENV === 'development' || true;

    const amountKobo = Math.round(Number(amount) * 100);

    try {
        const recipientBody = {
            type: "nuban",
            name: account_name,
            account_number,
            bank_code: bank_sort_code,
            currency: "NGN",
        };

        const rResp = await fetch(`${PAYSTACK_URL}/transferrecipient`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${PAYSTACK_SECRET}`,
            },
            body: JSON.stringify(recipientBody),
        });

        const rData = await rResp.json();
        if (!rResp.ok || rData.status === false) {
            return { success: false, error: rData || "Failed to create recipient" };
        }
        const recipient_code = rData.data.recipient_code;

        const tResp = await fetch(`${PAYSTACK_URL}/transfer`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${PAYSTACK_SECRET}`,
            },
            body: JSON.stringify({
                source: "balance",
                amount: amountKobo,
                recipient: recipient_code,
                reason: reference,
            }),
        });

        if (IS_DEVELOPMENT) {
            return res.status(200).json({
                success: true,
                data: {
                reference: 'mock_' + Date.now(),
                recipient: recipient_code,
                amount: amount * 100,
                status: 'success'
                }
            });
        }

        const tData = await tResp.json();
        if (!tResp.ok || tData.status === false) {
            return { success: false, error: tData || "Transfer failed" };
        }

        // success
        return { success: true, providerResponse: tData };

    } catch (err) {
        return { success: false, error: err.message || String(err) };
    }
}

export default async function handler(req, res) {
  try {
    const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();

    const { data: oldOrders, error: ordersError } = await supabase
      .from("orders")
      .select("*")
      .lte("created_at", fourteenDaysAgo)

    if (ordersError) {
      console.error("Error fetching old orders:", ordersError);
      return res.status(500).json({ error: "Failed to fetch orders", details: ordersError });
    }

    if (!oldOrders || oldOrders.length === 0) {
      return res.status(200).json({ message: "No orders older than 14 days to process." });
    }

    const results = [];

    for (const order of oldOrders) {
      const orderId = order.id;
      const buyerId = order.buyer_id;
      const amount = order.amount_paid;

      //  fetch buyer metadata
      let buyerMetadata = null;
      try {
        if (typeof supabase.auth?.admin?.getUserById === "function") {
          const { data: userData, error: userErr } = await supabase.auth.admin.getUserById(buyerId);
          if (userErr) throw userErr;
          buyerMetadata = userData?.user_metadata ?? null;
        } else {
          // fallback: try profiles table in public schema
          const { data: profile, error: profileErr } = await supabase
            .from("profiles")
            .select("user_metadata")
            .eq("id", buyerId)
            .single();
          if (profileErr) throw profileErr;
          buyerMetadata = profile?.user_metadata ?? null;
        }
      } catch (metaErr) {
        console.error(`Failed to fetch metadata for buyer ${buyerId} (order ${orderId}):`, metaErr);
        results.push({ orderId, buyerId, success: false, error: "Failed to fetch buyer metadata", details: String(metaErr) });
        continue; // skip to next order
      }

      if (!buyerMetadata) {
        results.push({ orderId, buyerId, success: false, error: "Buyer metadata missing" });
        continue;
      }

      // validate required bank fields
      const { account_name, account_number, bank_name, bank_sort_code, role } = buyerMetadata;
      if (role !== "buyer") {
        results.push({ orderId, buyerId, success: false, error: "User is not a buyer" });
        continue;
      }

      if (!account_number || !bank_sort_code || !account_name) {
        results.push({ orderId, buyerId, success: false, error: "Missing bank details in metadata" });
        continue;
      }

      // perform transfer
      const reference = `refund-order-${orderId}`;
      const transferResult = await transferToBank({
        account_name,
        account_number,
        bank_sort_code,
        bank_name,
        amount,
        reference,
      });

      if (!transferResult.success) {
        console.error(`Transfer failed for order ${orderId}:`, transferResult.error);
        results.push({ orderId, buyerId, success: false, error: "Transfer failed", details: transferResult.error });
        continue;
      }

      // delete the order record after successful transfer
      const { error: deleteError } = await supabase
        .from("orders")
        .delete()
        .eq("id", orderId);

      if (deleteError) {
        console.error(`Failed to delete order ${orderId} after transfer:`, deleteError);
        results.push({ orderId, buyerId, success: false, error: "Transfer succeeded but failed to delete order", details: String(deleteError) });
        
        continue;
      }
      
      // TODO: record the refund in a separate table.
      
      results.push({ orderId, buyerId, success: true, providerResponse: transferResult.providerResponse || null });
    }

    return res.status(200).json({ processed: results.length, results });
  } catch (err) {
    console.error("Cron function error:", err);
    return res.status(500).json({ error: "Unexpected error", details: String(err) });
  }
}