"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";

export interface OtpInputProps {
  length?: number;
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  inputClassName?: string;
  containerClassName?: string;
  autoFocus?: boolean;
  isInputNum?: boolean;
  placeholder?: string;
}

export function OtpInput({
  length = 6,
  value = "",
  onChange,
  disabled = false,
  inputClassName = "",
  containerClassName = "",
  autoFocus = false,
  isInputNum = true,
  placeholder = "○",
}: OtpInputProps) {
  // Split the input value into an array or create an empty array of specified length
  const [otp, setOtp] = useState<string[]>(() => {
    const initialValue = value.split("").slice(0, length);
    return [...initialValue, ...Array(length - initialValue.length).fill("")];
  });

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Update internal state when value prop changes
  useEffect(() => {
    const newOtp = value.split("").slice(0, length);
    setOtp([...newOtp, ...Array(length - newOtp.length).fill("")]);
  }, [value, length]);

  // Handle input change
  const handleChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const val = e.target.value;

    // Validate input if numeric only
    if (isInputNum && !/^\d*$/.test(val)) return;

    const newOtp = [...otp];
    // Take only the last character if multiple are entered
    newOtp[index] = val.slice(-1);
    setOtp(newOtp);

    // Emit the complete value to parent
    const newValue = newOtp.join("");
    onChange(newValue);

    // Auto-focus next input if current input is filled
    if (val && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle key press for backspace and arrow navigation
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        // Clear current input if it has a value
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
        onChange(newOtp.join(""));
      } else if (index > 0) {
        // Focus previous input when backspace is pressed on an empty input
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle paste event for the entire OTP
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();

    // Validate pasted content
    if (isInputNum && !/^\d+$/.test(pastedData)) return;

    const digits = pastedData.slice(0, length).split("");
    const newOtp = [...Array(length).fill("")];

    digits.forEach((digit, index) => {
      if (index < length) newOtp[index] = digit;
    });

    setOtp(newOtp);
    onChange(newOtp.join(""));

    // Focus the next empty input or the last input
    const nextEmptyIndex = newOtp.findIndex((val) => !val);
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus();
    } else {
      inputRefs.current[length - 1]?.focus();
    }
  };

  return (
    <div className={`flex justify-between gap-2 ${containerClassName}`}>
      {Array.from({ length }, (_, index) => (
        <Input
          key={index}
          ref={(el) => {
            if (el) {
              inputRefs.current[index] = el;
            }
          }}
          type={isInputNum ? "tel" : "text"}
          inputMode={isInputNum ? "numeric" : "text"}
          maxLength={1}
          value={otp[index]}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={index === 0 ? handlePaste : undefined}
          disabled={disabled}
          placeholder={placeholder}
          autoFocus={autoFocus && index === 0}
          className={`h-12 w-12 text-center text-lg font-semibold sm:h-14 sm:w-14 ${inputClassName}`}
          aria-label={`OTP digit ${index + 1}`}
        />
      ))}
    </div>
  );
}
