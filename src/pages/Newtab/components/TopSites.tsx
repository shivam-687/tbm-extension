import React, { useEffect, useState } from 'react'
import { getFaviconUrl } from '../../../helpers';

export type TopSiteData = {
    title: string,
    url: string,
    favicon: string;
}
function TopSites() {
    const [topSites, setTopSites] = useState<TopSiteData[]>([]);


    useEffect(() => {
        chrome.topSites.get(data => {
            if (data.length > 0) {
                const tp = data.map(tps => {
                    const curTs: TopSiteData = {
                        title: tps.title,
                        url: tps.url,
                        favicon: getFaviconUrl(tps.url)
                    }
                    return curTs;
                });
                setTopSites([...tp]);
            } else {
                setTopSites([])
            }
        })
    }, [])




    return (
        <div className="container mx-auto">
            <div className='flex items-center justify-center'>
                <div className="flex items-center justify-center flex-grow  gap-3 p-4">
                    {
                        topSites.length > 0 ?
                            topSites.map((ts, index) => {
                                return <a href={ts.url} className='inline-block w-12 h-12 rounded p-2 shadow shadow-primary/20 tooltip hover:scale-110 hover:shadow-lg hover:shadow-primary/20 transition duration-200' data-tip={ts.title} key={index}>
                                    <div>
                                        <img className='max-w-full' src={ts.favicon} alt={ts.title} />
                                    </div>
                                </a>
                            })
                            :
                            null
                    }
                </div>
            </div>
        </div>
    )
}

export default TopSites