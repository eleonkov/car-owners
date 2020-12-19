const fetch = require('node-fetch');
var ProxyAgent = require('http-proxy-agent');

const agent = new ProxyAgent('http://89.187.177.103:80');

const buildProxy = (url) => {
    return {
        agent
    }
}

const getResource = async (url) => {
    const proxyData = buildProxy(url);

    try {
        const res = await fetch(url, {
            agent: agent,
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!res.ok) {
            console.log(res)
        }

        return await res.json();
    } catch (e) {
        console.log(e.message)
    }
};

const app = async () => {
    const data = await getResource('https://api.ipify.org/?format=json');

    console.log(data);
}

app();