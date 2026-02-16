import { useContext } from "react";
import { StoreContext } from "../StoreContext";
import TableRow from "./TableRow";

const Summary = ({ cart }) => {
  const { items } = useContext(StoreContext);
  const total = items.reduce((price, item) => price + item.qty * item.price, 0);

  return (
    <div className="overflow-x-auto">
      <table className="table">
        {/* head */}
        <thead className="md:text-sm dark:bg-gray-700">
          <tr>
            <th className="dark:text-white">Item</th>
            <th className={`${cart ? "hidden" : "hidden md:block"} dark:text-white`}>Harga</th>
            <th className={`${cart ? "hidden" : ""} text-center dark:text-white`}>Jumlah</th>
            <th className="text-right dark:text-white">Total</th>
          </tr>
        </thead>
        <tbody className="font-light text-xs md:text-sm">
          {items.map((item) => (
            <TableRow key={item.id} item={item} cart={cart} />
          ))}
        </tbody>
      </table>
      <hr className="dark:border-gray-600" />
      <div className="flex flex-row justify-between w-full font-medium text-sm md:text-lg p-4 dark:text-white">
        <div>Total Harga</div>
        <div>Rp {Number(total).toLocaleString()}</div>
      </div>
    </div>
  );
};

export default Summary;
