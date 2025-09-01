import React, { useContext, useState } from "react"
import Lookup from "@/app/data/Lookup"
import { PayPalButtons } from "@paypal/react-paypal-js"
import { UserDetailContext } from "@/context/UserDetailContext"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"

function PricingModel() {
  const { userDetail, setUserDetail } = useContext(UserDetailContext)
  const UpdateToken = useMutation(api.users.UpdateToken)
  const [selectedOption, setSelectedOption] = useState(null)

  const onPaymentSuccess = async () => {
    if (!userDetail || !selectedOption) return

    const newTokenCount =
      (userDetail?.token || 0) + Number(selectedOption?.tokens || 0)

    await UpdateToken({
      token: newTokenCount,
      userId: userDetail?._id,
    })

    setUserDetail((prev) => ({ ...prev, token: newTokenCount }))
  }

  return (
    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-6">
      {Lookup.PRICING_OPTIONS.map((pricing, index) => (
        <div
          key={index}
          className="
            relative border border-gray-200
            rounded-2xl shadow-md overflow-hidden
            bg-white hover:shadow-xl
            hover:scale-[1.02] transition-all duration-300 flex flex-col items-center p-8
          "
        >
          {/* Title */}
          <h2 className="text-xl font-bold text-gray-900">
            {pricing.name}
          </h2>

          {/* Tokens */}
          <h3 className="mt-2 text-lg font-semibold text-blue-600">
            {pricing.tokens} Tokens
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 text-center mt-3">
            {pricing.desc}
          </p>

          {/* Price */}
          <div className="mt-6 mb-6">
            <span className="text-4xl font-extrabold text-gray-900">
              ${pricing.price}
            </span>
          </div>

          {/* PayPal Button */}
          <div className="w-full mt-auto">
            <PayPalButtons
              disabled={!userDetail}
              style={{ layout: "horizontal" }}
              createOrder={(data, actions) => {
                setSelectedOption(pricing)
                return actions.order.create({
                  purchase_units: [
                    {
                      amount: {
                        value: String(pricing.price),
                        currency_code: "USD",
                      },
                    },
                  ],
                })
              }}
              onApprove={() => onPaymentSuccess()}
              onCancel={() => console.log("Payment Canceled")}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export default PricingModel
