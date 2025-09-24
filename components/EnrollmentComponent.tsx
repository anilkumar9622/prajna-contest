"use client"; // If you're using the app router

import axios from "axios";
import React, { useState } from "react";

interface InputWithSubmitProps {
  setClicked: (value: boolean) => void;
}

const InputWithSubmit: React.FC<InputWithSubmitProps> = ({ setClicked }) => {
  const [inputValue, setInputValue] = useState("")

  const handleSubmit = async () => {
    try {
      if (inputValue == '') throw new Error
      const response = await axios.post('/api/enrollment/match', { enrollmentID: inputValue })
      if (response.data.expire) return alert("Enrollment ID has already been assigned!")
      localStorage.setItem("enrollmentID", inputValue)
      setClicked(true)
    } catch (error) {
      alert("Invalid Enrollment ID, Please try again!")
    }
  }

  return (
    <div className="items-center space-x-2">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Enter Enrollment Number..."
        className="text-black px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
      />
      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
      >
        Submit
      </button>
    </div>
  )
}

export default InputWithSubmit;
