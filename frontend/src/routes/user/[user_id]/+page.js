/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
    return {
        user_id: params.user_id
    };
};