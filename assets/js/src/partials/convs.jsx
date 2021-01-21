import React, { useEffect, useState } from 'react';
import Conv from '../components/conv';
import { convs_url, convTopic, hub_url } from '../urls';

const Convs = () => {
    const [convs, setConvs] = useState([]);
   
    const fetchConvs = async () => {
        const r = await fetch(convs_url);
        const res = await r.json();
        setConvs(res);
    }

    const listenToConvs = () => {
        const url = new URL(hub_url);
        const userId = parseInt(document.querySelector('div.data').dataset.user);
        url.searchParams.append('topic', convTopic(userId));
        const eventSource = new EventSource(url, { withCredentials: true });
        eventSource.onmessage = e => {
            const data = JSON.parse(e.data);
            // If the conv already exsits we updated to be the first.
            // else we order
            if (data.new) {
                setConvs(convs => [data, ...convs]);
            } else {               
                setConvs(convs => {
                    const oldConvs = [...convs];
                    const index = oldConvs.findIndex(e => e.id == data.id);
                    oldConvs.splice(index, 1);
                    oldConvs.splice(0, 0, data);
                    return oldConvs
                });
            }
            
        };
    }

    useEffect(() => {
        fetchConvs();
        listenToConvs();  
    }, [])

    return (
        <div className="convs">
            { convs.map(c => (<Conv key={c.id} conv={c} />))}
        </div>
    );
}

export default Convs;