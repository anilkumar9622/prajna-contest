'use client';
import React from 'react';
import { useWatch } from 'react-hook-form';
import HookFormInputField from '../hooks/hookFormInput';

export default function CourierAddress({ control, errors }: { control: any; errors: any }) {
    // watch courier.contact to show same 10-digit validation UI as main phone field
    const courierContactRaw = useWatch({ control, name: 'courier.contact' }) || '';
    const courierContactDigits = String(courierContactRaw).replace(/\D/g, '');
    const showCourierPhoneFormatError = courierContactRaw && !/^\d{10}$/.test(courierContactDigits);

    // watch pincode and validate 6-digit Indian pincode
    const courierPincodeRaw = useWatch({ control, name: 'courier.pincode' }) || '';
    const courierPincodeDigits = String(courierPincodeRaw).replace(/\D/g, '');
    const showCourierPincodeError = courierPincodeRaw && !/^\d{6}$/.test(courierPincodeDigits);

    return (
        <div className="mt-4 border p-4 rounded-lg space-y-3 bg-blue-50 border-blue-600">
            <div className="flex items-center gap-2">
                <h3 className="font-semibold">Courier Address</h3>
                <p className="text-xs text-gray-500">
                    ( *This service is only available for <span className="font-semibold">Delhi & NCR</span> )
                </p>
            </div>

            <HookFormInputField
                name="courier.houseNo"
                control={control}
                placeholder="House No., Building Name"
                label={
                    <>
                        <span>House No., Building Name</span>
                        <span className="text-pink-500 ml-1">*</span>
                    </>
                }
                required
                error={errors.courier?.houseNo?.message}
            />
            <HookFormInputField name="courier.line1" control={control} placeholder="Address Line 1" />
            <HookFormInputField name="courier.line2" control={control} placeholder="Address Line 2" />

            <div className="grid grid-cols-2 gap-4">
                <HookFormInputField
                    name="courier.city"
                    control={control}
                    placeholder="City"
                    label={
                        <>
                            <span>City</span>
                            <span className="text-pink-500 ml-1">*</span>
                        </>
                    }
                    required
                    error={errors.courier?.city?.message}
                />
                {/* District now shows a label above the input */}
                <HookFormInputField
                    name="courier.district"
                    control={control}
                    placeholder="District"
                    label={
                        <>
                            <span>District</span>
                        </>
                    }
                    error={errors.courier?.district?.message}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <HookFormInputField
                    name="courier.state"
                    control={control}
                    placeholder="State"
                    label={
                        <>
                            <span>State</span>
                            <span className="text-pink-500 ml-1">*</span>
                        </>
                    }
                    required
                    error={errors.courier?.state?.message}
                />
                <div>
                    <HookFormInputField
                        name="courier.pincode"
                        control={control}
                        placeholder="Pincode"
                        label={
                            <>
                                <span>Pincode</span>
                                <span className="text-pink-500 ml-1">*</span>
                            </>
                        }
                        required
                        error={errors.courier?.pincode?.message}
                    />
                    {showCourierPincodeError && <span className="text-red-500 text-sm mt-1">Pincode must be 6 digits</span>}
                </div>
            </div>

            <div>
                <HookFormInputField
                    name="courier.contact"
                    control={control}
                    placeholder="Contact Number"
                    label={
                        <>
                            <span>Contact Number</span>
                            <span className="text-pink-500 ml-1">*</span>
                        </>
                    }
                    required
                    error={errors.courier?.contact?.message}
                />
                {showCourierPhoneFormatError && <span className="text-red-500 text-sm mt-1">Phone must be 10 digits (numbers only)</span>}
            </div>
        </div>
    );
}
