export const getJSON = async function(url){
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Request failed with status ${res.status}`);

    const data = await res.json();

    if (!data || !data.data) throw new Error('No data returned from API');

    return data;
}
