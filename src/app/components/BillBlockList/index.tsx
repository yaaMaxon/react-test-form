import { IBillForm } from "@/app/types/BillFormSettings";
import { IoIosClose } from "react-icons/io";
import dayjs from "dayjs";

interface BillBlockListProps {
  formData: IBillForm[];
  onRemoveBlock: (id: string) => void;
}

const formatDate = (date: string) => dayjs(date).format("MMMM D, YYYY");

const BillBlockList = ({ formData, onRemoveBlock }: BillBlockListProps) => {
  return (
    <ul className="flex flex-col gap-[10px] mt-[30px]">
      {formData.map(({ id, amount, fromAccount, date, note }) => (
        <li key={id} className="relative p-[20px] bg-[#E4E4E4] rounded-[14px]">
          <button
            onClick={() => onRemoveBlock(id)}
            className="absolute top-[15px] right-[15px] text-red-600 text-lg cursor-pointer"
          >
            <IoIosClose className="w-[24px] h-[24px]" />
          </button>

          <div className="flex flex-col gap-[5px]">
            <span>Amount: ${amount}</span>
            <span>From: {fromAccount}</span>
            <span>Date: {formatDate(date)}</span>
            <span>Note: {note}</span>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default BillBlockList;
