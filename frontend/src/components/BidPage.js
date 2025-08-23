import { useEffect, useState } from "react";
import BidCard from "./BidCard";

const BidPage = () => {
    const [items, setItems] = useState([]);
    const fetchData = async () => {
        const data = await fetch("http://localhost:3000/getBidItems");
        const jsonData = await data.json();
        console.log(jsonData);
        setItems(jsonData);
    }

    useEffect(() => {
        fetchData();
    }, []);


    return  items.length === 0 ? (
        <p>No items found</p>
    ) : (
        <div className="flex flex-wrap justify-evenly gap-x-2 gap-y-4 mt-3"> 
            {items.map((vendor) => vendor.bid_open && <BidCard key={vendor.vendor_id} vendor={vendor} />)}
        </div>
    );
};

export default BidPage;
