import React, { useState } from "react";
import BidPrice from "../components/BidPrice";
import TableData from "../components/TableData";

const options = {
  bitPrice: "Bit Price",
  tableData: "Table Data",
};
const Home = () => {
  const [isSelected, setIsSelected] = useState(options.tableData);

  const handleSelect = (e) => {
    setIsSelected(e.target.name);
  };

  return (
    <div className="container">
      {/* - ACTIONS BUTTONS */}
      <div className="btn-parent">
        <button className="btn" name={options.bitPrice} onClick={handleSelect}>
          Bit Price
        </button>
        <button className="btn" name={options.tableData} onClick={handleSelect}>
          Table Data
        </button>
      </div>
      {isSelected === options.tableData ? <TableData /> : <BidPrice />}
    </div>
  );
};

export default Home;
