'use client'

import React, { useEffect, useState } from "react";
import Step from "@/components/Step";
import SendRequest from "@/utils/SendRequest";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

export default function Register() {
    const router = useRouter()
    const [step, setStep] = useState<number>(1);
    const [formData, setFormData] = useState({
        enrollmentID: "",
        personName: "",
        contactNumber: "",
        institutionName: "",
        institutionNameOther: "",
        category: "",
    });

    const handleLogout = () => {
            signOut()
    }

    const [errorMessage, setErrorMessage] = useState<string>("");

    const [isPending, setPending] = useState(false)

    const session: any = useSession()

    async function nextStep() {
        if (step === 5) {
            if (!validateFields()) {
                setErrorMessage("Please fill in all required fields.");
                return;
            }
            try {
                setPending(true)
                await SendRequest("/user/add", "POST", formData)
                setErrorMessage("");
                alert("Thank you so much for participating!")
                window.location.href = ''
            } catch (e: any) {
                alert(`Error: ${e.toString()}`);
            } finally {
                setPending(false)
            }
        } else {
            if(validateField(step)){
                setStep(step + 1)            
            } else {
                setErrorMessage("This field is required!");
            }
        }
    }

    useEffect(() => {
        document.title = "PRAJÑĀ 2026: Register";
        if (session?.data?.isNewUser == false)
            router.push("/dashboard")
    }, [session])

    async function verifyEnrollmentNumber(enrollmentId: string) {
        const res: any = await SendRequest("/enrollment/match", "POST", { enrollmentId }).catch(e => console.log)
        if (!res.data.status) {
            alert("Invalid Enrollment ID")
            setFormData({ ...formData, "enrollmentID": "" })
        }
    }

    async function verifyEnrollmentPattern(enrollmentId: string) {
        if(!enrollmentId.match(/\b25/)) {
            setErrorMessage("Invalid Enrollment ID. Try Again!")
            setFormData({ ...formData, "enrollmentID": "" })
        }
    }

    function back() {
        if (step > 1) {setStep(step - 1); setErrorMessage("");}
    }

    function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = event.target;

        if (event.target.name.includes("enrollmentID") && value.length === 10)
            verifyEnrollmentNumber(value)

        setErrorMessage("")
        setFormData({ ...formData, [name]: value });

        if (event.target.name.includes("enrollmentID") && value.length >= 2)
            verifyEnrollmentPattern(value)

    }

    function validateFields() {
        const { enrollmentID, contactNumber, institutionName, category } = formData;
        const isOtherInstitution = institutionName === "Other";
        const institutionIsValid = !isOtherInstitution || formData.institutionNameOther.trim() !== "";

        return enrollmentID.trim() !== "" &&
            contactNumber.trim() !== "" &&
            institutionName.trim() !== "" &&
            institutionIsValid &&
            category.trim() !== "";
    }

    function validateField(field: number) {
        const { enrollmentID, personName, contactNumber, institutionName, category } = formData;
        const isOtherInstitution = institutionName === "Other";
        const institutionIsValid = !isOtherInstitution || formData.institutionNameOther.trim() !== "";

        switch(field){
            case 1:
                return enrollmentID.trim() !== "" && enrollmentID.length === 10;
                break;
            
            case 2:
                return personName.trim() !== "";
                break;
                
            case 3:
                return contactNumber.trim() !== "" && contactNumber.length === 10;
                break;

            case 4:
                return  institutionName.trim() !== "" && institutionIsValid && category.trim() !== "";
                break;

            default:
                return false;    
        }
    }

    return (
        <div className="flex flex-col m-auto items-center justify-center mt-14 h-fit w-fit md:w-dvw lg:w-dvw background">
            <div className="flex-1 items-center justify-center p-10">

                <div className="flex flex-col bg-white mb-16 p-10 rounded-2xl w-fit shadow-lg">

                <div className="flex items-center justify-center mb-14 noselect">
                    <img className="w-16 md:w-1/4 lg:w-1/5 h-auto" src="https://bace.org.in/assets/image/main-data/bace_logo-min.png" alt="BACE"></img>
                </div>

                    <div className="flex gap-4 lg:gap-8 justify-between mb-6">
                        {Array.from({ length: 5 }, (_, i) => (
                            <Step key={i} step={step} stepOrder={i + 1} setStep={setStep} />
                        ))}
                    </div>

                    <div className="space-y-6">
                        {step === 1 && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Enrollment ID
                                <input
                                    type="tel"
                                    name="enrollmentID"
                                    value={formData.enrollmentID}
                                    placeholder="25XXXXXXXX"
                                    onChange={handleChange}
                                    className="p-3 border mt-2 rounded-lg w-full text-black focus:outline-none focus:ring-2 focus:ring-purple-950"
                                    pattern="[0-9]{10}"
                                    maxLength={10}
                                    required
                                />
                                </label>
                            </div>
                        )}
                        {step === 2 && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name
                                <input
                                    type="text"
                                    name="personName"
                                    value={formData.personName}
                                    placeholder="Enter your full name"
                                    onChange={handleChange}
                                    className="p-3 border mt-2 rounded-lg w-full text-black focus:outline-none focus:ring-2 focus:ring-purple-950"
                                    pattern="[A-Za-z]"
                                    required
                                />
                                </label>
                            </div>
                        )}
                        {step === 3 && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Contact Number
                                <input
                                    type="tel"
                                    name="contactNumber"
                                    value={formData.contactNumber}
                                    placeholder="Enter your mobile number"
                                    onChange={handleChange}
                                    className="p-3 border mt-2 rounded-lg w-full text-black focus:outline-none focus:ring-2 focus:ring-purple-950"
                                    pattern="[0-9]{10}"
                                    maxLength={10}
                                    required
                                />
                                </label>
                            </div>
                        )}
                        {step === 4 && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category
                                <select
                                    name="category"
                                    value={formData.category}
                                    defaultValue={"Select Category"}
                                    onChange={handleChange}
                                    className="p-3 border mt-2 rounded-lg w-full text-black focus:outline-none focus:ring-2 focus:ring-purple-950"
                                    required
                                >
                                    <option value="" disabled hidden>Select Category</option>
                                    <option value="School Student">School Student</option>
                                    <option value="College Student">College Student</option>
                                </select>
                                </label>

                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Name of the Institution
                                <select
                                    name="institutionName"
                                    value={formData.institutionName}
                                    defaultValue={"Select Institution"}
                                    aria-placeholder="In"
                                    onChange={handleChange}
                                    className="p-3 border mt-2 rounded-lg w-full text-black focus:outline-none focus:ring-2 focus:ring-purple-950"
                                    required
                                >
                                    <option value="" disabled hidden>Select Institution</option>
                                    <option value="AIIMS">AIIMS</option>
                                    <option value="Akhilesh Das Gupta College">Akhilesh Das Gupta College</option>
                                    <option value="DU">DU</option>
                                    <option value="GBU">GBU</option>
                                    <option value="GL - Bajaj">GL - Bajaj</option>
                                    <option value="GNIOT">GNIOT</option>
                                    <option value="IIT">IIT</option>
                                    <option value="Innovation Institute">Innovation Institute</option>
                                    <option value="JNU">JNU</option>
                                    <option value="Nalanda">Nalanda</option>
                                    <option value="NIU">NIU</option>
                                    <option value="Sharda University">Sharda University</option>
                                    <option value="VMMC - Safdarjung">VMMC - Safdarjung</option>
                                    <option value="Other">Other</option>
                                </select>
                                {formData.institutionName === "Other" && (
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Please specify:
                                        <input
                                            type="text"
                                            name="institutionNameOther"
                                            value={formData.institutionNameOther}
                                            placeholder="XYZ University or School"
                                            onChange={handleChange}
                                            className="p-3 mt-2 border rounded-lg w-full text-black focus:outline-none focus:ring-2 focus:ring-purple-950"
                                            required
                                        />
                                        </label>
                                    </div>
                                )}
                                </label>
                            </div>
                        )}
                        {step === 5 && (
                            <div className="text-black">
                                <h2 className="text-lg font-bold text-center mb-3">
                                    Review Your Details
                                </h2>
                                <table className="w-full border-collapse border border-gray-400 mb-4">
                                    <thead>
                                        <tr>
                                            <th className="border border-gray-300 px-4 py-2">Field</th>
                                            <th className="border border-gray-300 px-4 py-2">Value</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="border border-gray-300 px-4 py-2">Enrollment ID</td>
                                            <td className="border border-gray-300 px-4 py-2">{formData.enrollmentID}</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 px-4 py-2">Full Name</td>
                                            <td className="border border-gray-300 px-4 py-2">{formData.personName}</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 px-4 py-2">Contact Number</td>
                                            <td className="border border-gray-300 px-4 py-2">{formData.contactNumber}</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 px-4 py-2">Institution Name</td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {formData.institutionName === "Other"
                                                    ? formData.institutionNameOther
                                                    : formData.institutionName}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 px-4 py-2">Category</td>
                                            <td className="border border-gray-300 px-4 py-2">{formData.category}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {
                        errorMessage && (
                            <div className="text-red-500 text-center mt-4">
                                {errorMessage}
                            </div>
                        )
                    }

                    <div className="flex justify-between mt-4">
                        { step > 1 && (
                        <button
                            className="noselect text-gray-700 hover:bg-gray-200 px-8 py-2 rounded-full"
                            onClick={back}
                            disabled={step === 1}
                        >
                            Back
                        </button>)
                        }
                        <button
                            onClick={nextStep}
                            disabled={isPending}
                            type="submit"
                            className="noselect bg-purple-950 text-white py-2 px-8 rounded-full"
                        >
                            {!isPending ? step === 4 ? "Review" : step === 5 ? "Submit" : "Next" : "Submitting..."}
                        </button>
                    </div>
                </div>

            </div>
            

            <button
                className="px-4 py-2 mb-4 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
                onClick={handleLogout}
            >
                Logout
            </button>
        </div>
    );
}
