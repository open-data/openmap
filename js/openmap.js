// Validate UUIDs passed in the URL
const UUID_REGEX = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;

function getKeys(keys) {
    return keys
        .split(',')
        .map(uuid => uuid.trim())
        .filter(uuid => UUID_REGEX.test(uuid))
        .join(',');
}

const keys = getKeys(window.location.hash.substring(1)); // Remove # symbol

const langcode = (document.documentElement.lang || '')
                    .toLowerCase()
                    .startsWith('fr')
                    ? 'fr'
                    : 'en';

// Update the language link
function syncLanguageSwitcherHash() {
    const targetLang = langcode === 'en' ? 'fr' : 'en';
    const targetFile = `${targetLang}.html`;
    const langLink = document.querySelector(`#wb-lng a[hreflang='${targetLang}']`);
    
    if (langLink) {
        langLink.href = targetFile + window.location.hash;
    }
}

// Retrieve title for dataset-list using CKAN API
function renderDatasetLink(uuid) {
    const apiUrl = new URL('https://open.canada.ca/data/api/action/package_show');
    apiUrl.searchParams.set('id', uuid);

    return fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (!data.success) {
                console.error('API Error: ', data.error?.message);
                return;
            }

            const title = data.result.title_translated;
            const ul = document.getElementById('dataset-list');
            if (!ul) return;
            const li = document.createElement("li");
            const link = document.createElement("a");
            link.href = `/data/${langcode}/dataset/${uuid}`;
            link.textContent = title?.[langcode] || uuid;
            link.target = "_blank";
            link.rel = "noopener noreferrer"; 
            li.appendChild(link);
            ul.appendChild(li);
        })
        .catch(error => {
            console.error('Failed to load data. Fetch error:', error);
    });
}

async function getTitles(uuidList) {
    if (!uuidList) return;

    const uuids = uuidList.split(',').map(uuid => uuid.trim());

    for (const uuid of uuids) {
        await renderDatasetLink(uuid);
    }
}
// Add the Web analytics URL
function getAnalyticsUrl(uuidList) {
    if (!uuidList) return;

    const filters = uuidList
        .split(',')
        .map(id => `id:${id.trim()}`)
        .join('|');
    const ul = document.getElementById('web-analytics');
    if (!ul) return;
    const li = document.createElement("li");
    const link = document.createElement("a");
    link.href = `/data/${langcode}/dataset/`
        + '2916fad5-ebcc-4c86-b0f3-4f619b29f412/resource/15eeafa2-c331-44e7-b37f-d0d54a51d2eb?filters='
        + encodeURIComponent(filters);
    link.textContent =
        langcode === 'fr'
            ? "Les données de mesure d'audience"
            : "Web analytics data";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    li.appendChild(link);
    ul.appendChild(li);
}

window.addEventListener('DOMContentLoaded', syncLanguageSwitcherHash);
getTitles(keys);
getAnalyticsUrl(keys);
