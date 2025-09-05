import { useParams } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useEffect, useState } from "react";

const VendorListing = () => {
    const { slug } = useParams();
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!slug) return;

        const fetchUserBySlug = async () => {
            setLoading(true);
            setError(null);

            try {
                // Query public.profiles for the slug -> user_id mapping
                const { data, error } = await supabase
                    .from('profiles')
                    .select('user_id')
                    .eq('slug', slug)
                    .single();

                if (error) {
                    console.error('Supabase error fetching profile by slug:', error);
                    setError(error.message || String(error));
                    setLoading(false);
                    return;
                }

                // note: profile row holds user_id
                setUserId(data?.user_id ?? null);
            } catch (err) {
                console.error('Unexpected error:', err);
                setError(String(err));
            } finally {
                setLoading(false);
            }
        };

        fetchUserBySlug();
    }, [slug]);

    return (
        <div>
            {loading && <div>Loading...</div>}
            {error && <div>Error: {error}</div>}
            {!loading && !error && userId && <div>Auth user id: {userId}</div>}
            {!loading && !error && !userId && <div>No user found for slug: {slug}</div>}
        </div>
    );
}

export default VendorListing;
