/** @type {import('./$types').PageLoad} */
export async function load({ params, route }) {
    return {
        wave: {
            route,
            params
		}
    };
};