import { CiSearch } from "react-icons/ci";
import {Link} from "react-router-dom";
import { useState } from "react";

const Header = () => {
  const [account, setAccount] = useState("");

  const handleConnect = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]); 
        console.log("Connected account:", accounts[0]);
      } catch (error) {
        console.error("User rejected connection:", error);
      }
    } else {
      alert("MetaMask not detected! Please install MetaMask.");
    }
  };


    return (
        <div className="flex justify-between  mx-3 border-b-2 border-gray-200">
            <div className="flex gap-4">
                <img className="h-16 w-16 rounded-full m-2" 
                src="https://i.pinimg.com/1200x/06/ec/e2/06ece2082b0e225c443a13dbf3121c76.jpg" alt="logo" />
                <Link className="flex justify-center" to="/"><button className="cursor-pointer">Trade</button></Link>
                <Link className="flex justify-center" to="/body"><button className="cursor-pointer">Make a Bid</button></Link>
                <Link className="flex justify-center" to="/escrow"><button className="cursor-pointer">Escrow Page</button></Link>
            </div>
            <div>
                <input type="text" 
                className="border-2 border-gray-300 rounded-full p-2 m-2 mt-4 text-center" placeholder="Search" />
            </div>
            <div>
                <button onClick={handleConnect}className="m-2 p-2 mt-4 bg-blue-300 rounded-2xl text-gray-800 cursor-pointer">{account ? `Connected` : "Connect"}</button>
            </div>
        </div>
    );
};

export default Header;
