/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
    return {
        wave: {
            uuid: params.wave
        }
    };
};