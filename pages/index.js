import Link from 'next/link'
import dbConnect from '../utils/dbConnect'
import Pet from '../models/Pet'
import { useState } from 'react'
import { PayPalButtons } from "@paypal/react-paypal-js";

const Index = ({ pets }) => {
  const [succeeded, setSucceeded] = useState(false);
  const [paypalErrorMessage, setPaypalErrorMessage] = useState("");
  const [orderID, setOrderID] = useState(false);
  const [billingDetails, setBillingDetails] = useState("");

// creates a paypal order
const createOrder = (data, actions) => {
  return actions.order
    .create({
      purchase_units: [
        {
          amount: {
            // charge users $499 per order
            value: 499,
          },
        },
      ],
      // remove the applicaiton_context object if you need your users to add a shipping address
      application_context: {
        shipping_preference: "NO_SHIPPING",
      },
    })
    .then((orderID) => {
      setOrderID(orderID);
      return orderID;
    });
};

// handles when a payment is confirmed for paypal
const onApprove = (data, actions) => {
  return actions.order.capture().then(function (details) {
    const {payer} = details;
    setBillingDetails(payer);
    setSucceeded(true);
  }).catch(err=> setPaypalErrorMessage("Something went wrong."));
};

// handles when a payment is declined
const onError = (data, actions) => {
  setPaypalErrorMessage("Something went wrong with your payment")
};

return (
  <>
    {/* Create a card for each pet */}
    {pets.map((pet) => (
      <div key={pet._id}>
        <div className="card">
          <img src={pet.image_url} />
          <h5 className="pet-name">{pet.name}</h5>
          <div className="main-content">
            <p className="pet-name">{pet.name}</p>
            <p className="owner">Owner: {pet.owner_name}</p>
            <div className="diet info">
              <p className="label">Diet</p>
              <ul>
                {pet.diet.map((data, index) => (
                  <li key={index}>{data} </li>
                ))}
              </ul>
            </div>
            {/* Extra Pet Info: Likes and Dislikes */}
            <div className="likes info">
              <p className="label">Likes</p>
              <ul>
                {pet.likes.map((data, index) => (
                  <li key={index}>{data} </li>
                ))}
              </ul>
            </div>
            {pet.dislikes.length ? 
            <div className="dislikes info">
              <p className="label">Dislikes</p>
              <ul>
                {pet.dislikes.map((data, index) => (
                  <li key={index}>{data} </li>
                ))}
              </ul>
            </div> : <></>}

            <div className="btn-container">
              <Link href="/[id]/edit" as={`/${pet._id}/edit`}>
                <button className="btn edit">Edit</button>
              </Link>
              <Link href="/[id]" as={`/${pet._id}`}>
                <button className="btn view">View</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    ))}
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center flex-1 px-20 text-center border rounded-xl border-black">
        <h1 className="text-6xl font-bold">
          Payments with{" "}
          <a className="text-blue-600" href="https://paypal.com">
            Paypal!
          </a>
        </h1>
        <h1 className="text-gray-500 mt-5 font-medium mb-5">
          Pay by card with Paypal
        </h1>
        <div className="mt-1 max-w-md">
          <PayPalButtons
            style={{
              color: "blue",
              shape: "pill",
              label: "pay",
              tagline: false,
              layout: "horizontal",
            }}
            createOrder={createOrder}
            onApprove={onApprove}
            onError={onError}
          />

          {/* Show an error message on the screen if payment fails */}
          {paypalErrorMessage && (
            <p className="text-red-600">{paypalErrorMessage}</p>
          )}

          <p className="mt-1 text-gray-900 font-semibold">
            Payer details will show up below once payment is completed:
          </p>

          {succeeded && (
            <section>
              
              {billingDetails && (
                <div>
                  <pre>{JSON.stringify(billingDetails, undefined, 2)}</pre>
                </div>
              )}
            </section>
          )}
        </div>
        
      </main>
    </div>
    </>
  )
}

/* Retrieves pet(s) data from mongodb database */
export async function getServerSideProps() {
  await dbConnect()

  /* find all the data in our database */
  const result = await Pet.find({})
  const pets = result.map((doc) => {
    const pet = doc.toObject()
    pet._id = pet._id.toString()
    return pet
  })

  return { props: { pets: pets } }
}

export default Index
