"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, MenuItem } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { nanoid } from "nanoid";
import BillBlockList from "../BillBlockList";
import { IBillForm } from "@/app/types/BillFormSettings";

const BillForm = () => {
  const [formData, setFormData] = useState<IBillForm[]>([]);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<Omit<IBillForm, "id">>({
    mode: "onBlur",
    defaultValues: {
      amount: 0,
      fromAccount: "",
      date: undefined,
      note: "",
    },
  });

  const onSubmit = (data: Omit<IBillForm, "id">) => {
    if (formData.length < 5) {
      setFormData([...formData, { ...data, id: nanoid() }]);
      reset();
    }
  };

  const handleRemoveBlock = (id: string) => {
    setFormData((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="bg-[#F3F3F3] p-[50px]">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2.5">
            <label htmlFor="amount" className="text-sm">
              Amount
            </label>
            <TextField
              id="amount"
              type="number"
              placeholder="$0.00"
              {...register("amount", {
                required: "Amount is required",
                pattern: {
                  value: /^\d+(\.\d{0,2})?$/,
                  message: "Enter a valid amount",
                },
              })}
              error={!!errors.amount}
              helperText={errors.amount?.message}
            />
          </div>

          <div className="flex flex-col gap-2.5">
            <label htmlFor="fromAccount" className="text-sm">
              From Account
            </label>
            <TextField
              select
              id="fromAccount"
              {...register("fromAccount", {
                required: "Account selection is required",
              })}
              error={!!errors.fromAccount}
              helperText={errors.fromAccount?.message}
            >
              <MenuItem value="">Select Account</MenuItem>
              <MenuItem value="Checking Account">Checking Account</MenuItem>
              <MenuItem value="Own Account">Own Account</MenuItem>
            </TextField>
          </div>

          <div className="flex flex-col gap-2.5">
            <label htmlFor="date" className="text-sm">
              Date
            </label>
            <Controller
              name="date"
              control={control}
              rules={{ required: "Date is required" }}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(newValue) =>
                    field.onChange(newValue?.toISOString())
                  }
                  slotProps={{
                    textField: {
                      error: !!errors.date,
                      helperText: errors.date?.message,
                    },
                  }}
                />
              )}
            />
          </div>

          <div className="flex flex-col gap-2.5">
            <label htmlFor="note" className="text-sm">
              Note
            </label>
            <TextField
              id="note"
              multiline
              maxRows={4}
              inputProps={{ maxLength: 31 }}
              placeholder="Enter a note"
              {...register("note", { required: "Note is required" })}
              error={!!errors.note}
              helperText={errors.note?.message}
            />
          </div>

          <button
            type="submit"
            className={`cursor-pointer mt-[30px] bg-[#191A23] text-[#fff] text-xl rounded-[14px] px-[25px] py-[10px] ${
              !isValid || formData.length >= 5
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            disabled={!isValid || formData.length >= 5}
          >
            Add Bill
          </button>
        </form>

        {formData.length >= 5 && (
          <div className="mt-[15px] text-[#AE0C0C] text-sm">
            You can only add 5 bills
          </div>
        )}
        {formData.length === 0 && (
          <p className="text-center mt-[15px]">There are not bills yet!</p>
        )}

        <BillBlockList formData={formData} onRemoveBlock={handleRemoveBlock} />
      </LocalizationProvider>
    </div>
  );
};

export default BillForm;
